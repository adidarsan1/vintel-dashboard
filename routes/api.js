const express = require('express');
const Alert = require('../models/Alert');
const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'VINTEL Intelligence Dashboard',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Get alerts with filters
router.get('/alerts', async (req, res) => {
  try {
    const {
      riskLevel,
      source,
      category,
      district,
      page = 1,
      limit = 50,
      since
    } = req.query;

    const filter = {};
    if (riskLevel) filter.riskLevel = riskLevel;
    if (source) filter.source = source;
    if (category) filter.categories = { $in: [category] };
    if (district) filter.district = district;
    if (since) filter.createdAt = { $gte: new Date(since) };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [alerts, total] = await Promise.all([
      Alert.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Alert.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: alerts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get today's statistics
router.get('/stats', async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [highCount, mediumCount, lowCount, totalToday, byCategoryRaw, bySourceRaw] = await Promise.all([
      Alert.countDocuments({ riskLevel: 'HIGH', createdAt: { $gte: todayStart } }),
      Alert.countDocuments({ riskLevel: 'MEDIUM', createdAt: { $gte: todayStart } }),
      Alert.countDocuments({ riskLevel: 'LOW', createdAt: { $gte: todayStart } }),
      Alert.countDocuments({ createdAt: { $gte: todayStart } }),
      Alert.aggregate([
        { $match: { createdAt: { $gte: todayStart } } },
        { $unwind: '$categories' },
        { $group: { _id: '$categories', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Alert.aggregate([
        { $match: { createdAt: { $gte: todayStart } } },
        { $group: { _id: '$source', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    const byCategory = {};
    byCategoryRaw.forEach(c => { byCategory[c._id] = c.count; });
    const bySource = {};
    bySourceRaw.forEach(s => { bySource[s._id] = s.count; });

    res.json({
      success: true,
      data: {
        today: {
          high: highCount,
          medium: mediumCount,
          low: lowCount,
          total: totalToday
        },
        byCategory,
        bySource,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Acknowledge an alert
router.patch('/alerts/:id/acknowledge', async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      {
        acknowledged: true,
        acknowledgedBy: req.body.officer || 'Dashboard User',
        acknowledgedAt: new Date()
      },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ success: false, error: 'Alert not found' });
    }

    res.json({ success: true, data: alert });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get latest alerts for ticker
router.get('/ticker', async (req, res) => {
  try {
    const alerts = await Alert.find({ riskLevel: { $in: ['HIGH', 'MEDIUM'] } })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('title riskLevel source categories createdAt')
      .lean();

    res.json({ success: true, data: alerts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
