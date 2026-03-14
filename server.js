require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cron = require('node-cron');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');

const apiRoutes = require('./routes/api');
const Alert = require('./models/Alert');
const { fetchAllFeeds } = require('./services/rssService');
const { classifyBatch } = require('./services/classifierService');
const { sendHighRiskAlert, handleMediumRiskAlert, handleLowRiskAlert } = require('./services/whatsappService');
const { searchTwitter } = require('./services/twitterService');
const { fetchYouTubeVideos } = require('./services/youtubeService');

// ============================
// APP INITIALIZATION
// ============================
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
  pingTimeout: 60000,
  pingInterval: 25000
});

// ============================
// MIDDLEWARE
// ============================
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(morgan('[:date[iso]] :method :url :status :res[content-length] - :response-time ms'));
app.use(express.static(path.join(__dirname, 'public')));

// ============================
// ROUTES
// ============================
app.use('/api', apiRoutes);

// Serve dashboard
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ============================
// SOCKET.IO REALTIME
// ============================
let connectedClients = 0;

io.on('connection', (socket) => {
  connectedClients++;
  console.log(`[SOCKET]  Client connected (${connectedClients} total)`);

  // Send initial data on connect
  sendInitialData(socket);

  socket.on('acknowledge', async (data) => {
    try {
      const alert = await Alert.findByIdAndUpdate(
        data.alertId,
        {
          acknowledged: true,
          acknowledgedBy: data.officer || 'Dashboard',
          acknowledgedAt: new Date()
        },
        { new: true }
      );
      if (alert) {
        io.emit('alertAcknowledged', alert);
      }
    } catch (err) {
      console.error('[SOCKET] Acknowledge error:', err.message);
    }
  });

  socket.on('requestRefresh', () => {
    sendInitialData(socket);
  });

  socket.on('disconnect', () => {
    connectedClients--;
    console.log(`[SOCKET]  Client disconnected (${connectedClients} total)`);
  });
});

async function sendInitialData(socket) {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [alerts, stats] = await Promise.all([
      Alert.find().sort({ createdAt: -1 }).limit(100).lean(),
      getStats()
    ]);

    socket.emit('initialData', { alerts, stats });
  } catch (err) {
    console.error('[SOCKET] Initial data error:', err.message);
  }
}

async function getStats() {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [high, medium, low] = await Promise.all([
    Alert.countDocuments({ riskLevel: 'HIGH', createdAt: { $gte: todayStart } }),
    Alert.countDocuments({ riskLevel: 'MEDIUM', createdAt: { $gte: todayStart } }),
    Alert.countDocuments({ riskLevel: 'LOW', createdAt: { $gte: todayStart } })
  ]);

  return { high, medium, low, total: high + medium + low };
}

// ============================
// INTELLIGENCE PIPELINE
// ============================
async function runIntelligencePipeline() {
  console.log('\n[PIPELINE] ================================================');
  console.log('[PIPELINE]  Starting intelligence scan...');
  console.log('[PIPELINE] ===============================================');

  try {
    // Step 1: Fetch from all sources in parallel
    const [rssItems, twitterItems, youtubeItems] = await Promise.allSettled([
      fetchAllFeeds(),
      searchTwitter(),
      fetchYouTubeVideos()
    ]);

    const allItems = [
      ...(rssItems.status === 'fulfilled' ? rssItems.value : []),
      ...(twitterItems.status === 'fulfilled' ? twitterItems.value : []),
      ...(youtubeItems.status === 'fulfilled' ? youtubeItems.value : [])
    ];

    if (allItems.length === 0) {
      console.log('[PIPELINE] [i] No new items found');
      return;
    }

    console.log(`[PIPELINE] [*] ${allItems.length} new items to classify`);

    // Step 2: Classify with GPT-4
    const classified = await classifyBatch(allItems);

    // Step 3: Save to MongoDB and emit via Socket.io
    let highCount = 0;
    for (const item of classified) {
      try {
        const alert = new Alert({
          title: item.title,
          description: item.description,
          source: item.source,
          sourceUrl: item.sourceUrl,
          riskLevel: item.riskLevel,
          categories: item.categories,
          district: item.district,
          taluk: item.taluk || null,
          keywords: item.keywords,
          rawContent: item.rawContent,
          classificationReason: item.classificationReason,
          fingerprint: item.fingerprint
        });

        await alert.save();

        // Emit to all connected clients
        io.emit('newAlert', alert.toObject());

        // - Alert routing per risk level ---------------------
        if (item.riskLevel === 'HIGH') {
          // HIGH   Sound alert + WhatsApp to DSP immediately
          highCount++;
          io.emit('highRiskAlert', alert.toObject());
          const sent = await sendHighRiskAlert(alert.toObject());
          if (sent) {
            alert.whatsappAlertSent = true;
            await alert.save();
          }
        } else if (item.riskLevel === 'MEDIUM') {
          // MEDIUM   Dashboard notification only (no WhatsApp)
          await handleMediumRiskAlert(alert.toObject(), io);
        } else {
          // LOW   Log only
          await handleLowRiskAlert(alert.toObject());
        }
      } catch (err) {
        if (err.code !== 11000) { // Ignore duplicate key errors
          console.error(`[PIPELINE]  Save error: ${err.message}`);
        }
      }
    }

    // Step 4: Update stats
    const stats = await getStats();
    io.emit('statsUpdate', stats);

    console.log(`[PIPELINE]  Pipeline complete: ${classified.length} processed, ${highCount} HIGH RISK`);
    console.log('[PIPELINE] ===============================================\n');

  } catch (err) {
    console.error(`[PIPELINE]  Pipeline error: ${err.message}`);
  }
}

// ============================
// CRON SCHEDULER
// ============================
function startScheduler() {
  const interval = process.env.RSS_POLL_INTERVAL || 5;
  console.log(`[CRON]  Scheduling intelligence scan every ${interval} minutes`);

  cron.schedule(`*/${interval} * * * *`, () => {
    runIntelligencePipeline();
  });

  // Run immediately on startup
  setTimeout(() => runIntelligencePipeline(), 5000);
}

// ============================
// DATABASE & SERVER START
// ============================
async function start() {
  const MONGODB_URI = process.env.MONGODB_URI  || 'mongodb://localhost:27017/vintel';
  const PORT = process.env.PORT || 3000;

  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('[DB]  MongoDB connected');

    // Start server
    server.listen(PORT, () => {
      console.log(`
------------------------------------------------                                            
      VINTEL - Intelligence Dashboard               
   Virudhunagar District, Tamil Nadu Police       
                                               
   Server: http://localhost:${PORT}               
   Status: OPERATIONAL                            
   Mode:   ${process.env.NODE_ENV || 'development'}                         
                                               
------------------------------------------------
      `);

      // Start the intelligence pipeline
      startScheduler();
    });

  } catch (err) {
    console.error('[STARTUP]  Failed to start:', err.message);
    console.warn('[STARTUP] Continuing without MongoDB - alerts will not be stored');
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('[SHUTDOWN] Graceful shutdown initiated...');
  await mongoose.disconnect();
  server.close(() => process.exit(0));
});

process.on('SIGINT', async () => {
  console.log('[SHUTDOWN] Graceful shutdown initiated...');
  await mongoose.disconnect();
  server.close(() => process.exit(0));
});

start();
