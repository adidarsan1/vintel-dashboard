const axios = require('axios');

// ============================================================
// VINTEL WhatsApp Alert Service
// Routing:
//   HIGH RISK   → Immediate WhatsApp alert to DSP (DSP_RECIPIENTS)
//   MEDIUM RISK → Dashboard notification only (no WhatsApp)
//   LOW RISK    → Log only (no WhatsApp, no dashboard alert)
// ============================================================

async function sendWhatsAppMessage(phone, message, apiUrl, token) {
  await axios.post(apiUrl, {
    messaging_product: 'whatsapp',
    to: phone.trim().replace(/^\+/, ''),
    type: 'text',
    text: { body: message }
  }, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    timeout: 10000
  });
}

// HIGH RISK → WhatsApp to DSP recipients
async function sendHighRiskAlert(alert) {
  const apiUrl = process.env.WHATSAPP_API_URL;
  const token = process.env.WHATSAPP_ACCESS_TOKEN || process.env.WHATSAPP_TOKEN;

  // If WhatsApp not configured, skip silently
  if (!apiUrl || !token) {
    console.log('[WHATSAPP] ⚠️ Not configured — skipping HIGH RISK WhatsApp alert');
    return false;
  }

  // DSP recipients take priority; fall back to general ALERT_RECIPIENTS
  const dspRecipients = (process.env.DSP_RECIPIENTS || process.env.ALERT_RECIPIENTS || '')
    .split(',')
    .map(p => p.trim())
    .filter(Boolean);

  if (dspRecipients.length === 0) {
    console.log('[WHATSAPP] ⚠️ No recipients configured — skipping');
    return false;
  }

  const talukLine = alert.taluk ? `\n🏘️ Taluk: ${alert.taluk}` : '';

  const message =
`🔴 *VINTEL HIGH RISK ALERT*
━━━━━━━━━━━━━━━━━━━━━━━━
📰 *${alert.title}*

📂 Source: ${alert.source}
🏷️ Category: ${(alert.categories || []).join(', ')}
📍 District: ${alert.district || 'Virudhunagar'}${talukLine}

⚠️ *${alert.classificationReason || 'Immediate action required'}*

🔗 ${alert.sourceUrl || 'No link available'}

⏰ ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
━━━━━━━━━━━━━━━━━━━━━━━━
_VINTEL — Virudhunagar District_
_Tamil Nadu Police Intelligence_`;

  let sentCount = 0;
  for (const phone of dspRecipients) {
    try {
      await sendWhatsAppMessage(phone, message, apiUrl, token);
      sentCount++;
      console.log(`[WHATSAPP] ✅ HIGH RISK alert → DSP ${phone}`);
    } catch (err) {
      console.error(`[WHATSAPP] ❌ Failed → ${phone}: ${err.message}`);
    }
  }

  return sentCount > 0;
}

// MEDIUM RISK → Dashboard notification only (no WhatsApp)
async function handleMediumRiskAlert(alert, io) {
  console.log(`[ALERT] 🟡 MEDIUM RISK — dashboard notification: ${alert.title?.substring(0, 60)}`);
  if (io) {
    io.emit('mediumRiskAlert', {
      _id: alert._id,
      title: alert.title,
      source: alert.source,
      categories: alert.categories,
      district: alert.district,
      taluk: alert.taluk,
      createdAt: alert.createdAt
    });
  }
  return true;
}

// LOW RISK → Log only
async function handleLowRiskAlert(alert) {
  console.log(`[ALERT] 🟢 LOW RISK — logged: ${alert.title?.substring(0, 60)}`);
  return true;
}

module.exports = {
  sendHighRiskAlert,
  handleMediumRiskAlert,
  handleLowRiskAlert
};
