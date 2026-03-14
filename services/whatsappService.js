const axios = require('axios');

// ============================================================
// VINTEL WhatsApp Alert Service
// Routing:
//   HIGH RISK   \u2192 Immediate WhatsApp alert to DSP (DSP_RECIPIENTS)
//   MEDIUM RISK \u2192 Dashboard notification only (no WhatsApp)
//   LOW RISK    \u2192 Log only (no WhatsApp, no dashboard alert)
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

// HIGH RISK \u2192 WhatsApp to DSP recipients
async function sendHighRiskAlert(alert) {
  const apiUrl = process.env.WHATSAPP_API_URL;
  const token = process.env.WHATSAPP_ACCESS_TOKEN || process.env.WHATSAPP_TOKEN;

  // If WhatsApp not configured, skip silently
  if (!apiUrl || !token) {
    console.log('[WHATSAPP] \u26A0\uFE0F Not configured \u2014 skipping HIGH RISK WhatsApp alert');
    return false;
  }

  // DSP recipients take priority; fall back to general ALERT_RECIPIENTS
  const dspRecipients = (process.env.DSP_RECIPIENTS || process.env.ALERT_RECIPIENTS || '')
    .split(',')
    .map(p => p.trim())
    .filter(Boolean);

  if (dspRecipients.length === 0) {
    console.log('[WHATSAPP] \u26A0\uFE0F No recipients configured \u2014 skipping');
    return false;
  }

  const talukLine = alert.taluk ? `\n\uD83C\uDFD8\uFE0F Taluk: ${alert.taluk}` : '';

  const message =
`\uD83D\uDD34 *VINTEL HIGH RISK ALERT*
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
\uD83D\uDCF0 *${alert.title}*

\uD83D\uDCC2 Source: ${alert.source}
\uD83C\uDFF7\uFE0F Category: ${(alert.categories || []).join(', ')}
\uD83D\uDCCD District: ${alert.district || 'Virudhunagar'}${talukLine}

\u26A0\uFE0F *${alert.classificationReason || 'Immediate action required'}*

\uD83D\uDD17 ${alert.sourceUrl || 'No link available'}

\u23F0 ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501
_VINTEL \u2014 Virudhunagar District_
_Tamil Nadu Police Intelligence_`;

  let sentCount = 0;
  for (const phone of dspRecipients) {
    try {
      await sendWhatsAppMessage(phone, message, apiUrl, token);
      sentCount++;
      console.log(`[WHATSAPP] \u2705 HIGH RISK alert \u2192 DSP ${phone}`);
    } catch (err) {
      console.error(`[WHATSAPP] \u274C Failed \u2192 ${phone}: ${err.message}`);
    }
  }

  return sentCount > 0;
}

// MEDIUM RISK \u2192 Dashboard notification only (no WhatsApp)
async function handleMediumRiskAlert(alert, io) {
  console.log(`[ALERT] \uD83D\uDFE1 MEDIUM RISK \u2014 dashboard notification: ${alert.title?.substring(0, 60)}`);
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

// LOW RISK \u2192 Log only
async function handleLowRiskAlert(alert) {
  console.log(`[ALERT] \uD83D\uDFE2 LOW RISK \u2014 logged: ${alert.title?.substring(0, 60)}`);
  return true;
}

module.exports = {
  sendHighRiskAlert,
  handleMediumRiskAlert,
  handleLowRiskAlert
};
