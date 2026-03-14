const OpenAI = require('openai');

let openai = null;

function initOpenAI() {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

// Classify a single alert using GPT-4
async function classifyAlert(alertData) {
  const client = initOpenAI();

  if (!client) {
    // Fallback: rule-based classification
    return fallbackClassify(alertData);
  }

  try {
    const prompt = `You are an intelligence analyst for Tamil Nadu Police, Virudhunagar district.
Analyze the following news item and classify its risk level for law enforcement.

Title: ${alertData.title}
Description: ${alertData.description}
Source: ${alertData.source}
Detected Keywords: ${alertData.keywords?.join(', ') || 'none'}
Detected Categories: ${alertData.categories?.join(', ') || 'none'}

KEY INTELLIGENCE KEYWORDS TO WATCH:
Tamil: \u0B95\u0BCA\u0BB2\u0BC8, \u0B95\u0BCA\u0BB3\u0BCD\u0BB3\u0BC8, \u0B95\u0BB1\u0BCD\u0BAA\u0BB4\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1, \u0B86\u0BAF\u0BC1\u0BA4\u0BAE\u0BCD, \u0B9C\u0BBE\u0BA4\u0BBF \u0B95\u0BB2\u0BB5\u0BB0\u0BAE\u0BCD, \u0BAE\u0BA4 \u0B95\u0BB2\u0BB5\u0BB0\u0BAE\u0BCD, \u0BAA\u0BCB\u0BB0\u0BBE\u0B9F\u0BCD\u0B9F\u0BAE\u0BCD, \u0B95\u0BC1\u0BAE\u0BCD\u0BAA\u0BB2\u0BCD, \u0BA4\u0BC1\u0BAA\u0BCD\u0BAA\u0BBE\u0B95\u0BCD\u0B95\u0BBF, \u0B85\u0BB0\u0BBF\u0BB5\u0BBE\u0BB3\u0BCD, \u0BAA\u0BCB\u0BA4\u0BC8\u0BAA\u0BCA\u0BB0\u0BC1\u0BB3\u0BCD
English: murder, robbery, POCSO, weapon, caste violence, religious riot, protest, gang, firearms, aruval, drugs, rowdy

VIRUDHUNAGAR DISTRICT TALUKS: Virudhunagar, Srivilliputhur, Rajapalayam, Sivakasi, Sattur, Aruppukkottai, Tiruchuli, Watrap, Vembakottai, Krishnankoil

Classify the risk level as:
- HIGH \uD83D\uDD34: Immediate threat to life, active violence, POCSO/rape cases, firearms incidents, communal/caste riots, murder, ongoing crime, gang war \u2014 requires IMMEDIATE DSP action
- MEDIUM \uD83D\uDFE1: Potential threat, protests planned, gang activity, theft/robbery, caste tensions, drug seizure, weapons recovered \u2014 monitor closely
- LOW \uD83D\uDFE2: General crime reports, past incidents, routine arrests, routine law enforcement news \u2014 log only

Respond in JSON format ONLY:
{
  "riskLevel": "HIGH" | "MEDIUM" | "LOW",
  "categories": ["category1", "category2"],
  "reason": "Brief reason for classification (max 100 chars)",
  "district": "Virudhunagar" or "Tamil Nadu",
  "taluk": "taluk name if mentioned, else null"
}

Valid categories: POCSO, Weapons, Caste, Religious, Protest, Firearms, Gang, Murder, Theft, Robbery, Drugs, Crime, Other`;

    const response = await client.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      max_tokens: 200,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(response.choices[0].message.content);

    return {
      riskLevel: result.riskLevel || 'LOW',
      categories: result.categories || alertData.categories || ['Other'],
      classificationReason: result.reason || 'AI classified',
      district: result.district || alertData.district || 'Tamil Nadu',
      taluk: result.taluk || alertData.taluk || null
    };
  } catch (err) {
    console.error(`[CLASSIFIER] \u274C GPT-4 error: ${err.message}`);
    return fallbackClassify(alertData);
  }
}

// Fallback rule-based classification when OpenAI is unavailable
function fallbackClassify(alertData) {
  const cats = alertData.categories || [];
  const kws = (alertData.keywords || []).map(k => k.toLowerCase());
  const text = `${alertData.title} ${alertData.description}`.toLowerCase();

  let riskLevel = 'LOW';
  let reason = 'Rule-based: routine information';

  // HIGH RISK triggers \u2014 per spec
  const highTriggers = [
    'pocso', 'murder', 'firearms', 'bomb', 'explosive', 'riot', 'kidnap', 'rape',
    '\u0B95\u0BCA\u0BB2\u0BC8', '\u0B95\u0BB1\u0BCD\u0BAA\u0BB4\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1', '\u0BA4\u0BC1\u0BAA\u0BCD\u0BAA\u0BBE\u0B95\u0BCD\u0B95\u0BBF', '\u0B9C\u0BBE\u0BA4\u0BBF \u0B95\u0BB2\u0BB5\u0BB0\u0BAE\u0BCD', '\u0BAE\u0BA4 \u0B95\u0BB2\u0BB5\u0BB0\u0BAE\u0BCD',
    'caste violence', 'religious riot', 'gang war', 'encounter', 'firing'
  ];
  if (highTriggers.some(t => kws.includes(t) || text.includes(t)) ||
      cats.includes('POCSO') || cats.includes('Murder') || cats.includes('Firearms')) {
    riskLevel = 'HIGH';
    reason = 'Rule-based: critical crime/safety keywords detected';
  }
  // MEDIUM RISK triggers \u2014 per spec
  else if ([
    'gang', 'rowdy', 'protest', 'caste', 'religious', 'weapon', 'robbery', 'theft',
    'drugs', 'aruval', 'drug', 'narcotic', 'ganja', '\u0B95\u0BCA\u0BB3\u0BCD\u0BB3\u0BC8', '\u0BAA\u0BCB\u0BB0\u0BBE\u0B9F\u0BCD\u0B9F\u0BAE\u0BCD', '\u0B95\u0BC1\u0BAE\u0BCD\u0BAA\u0BB2\u0BCD',
    '\u0B86\u0BAF\u0BC1\u0BA4\u0BAE\u0BCD', '\u0B85\u0BB0\u0BBF\u0BB5\u0BBE\u0BB3\u0BCD', '\u0BAA\u0BCB\u0BA4\u0BC8\u0BAA\u0BCA\u0BB0\u0BC1\u0BB3\u0BCD', '\u0B95\u0B9E\u0BCD\u0B9A\u0BBE', '\u0BB0\u0BB5\u0BC1\u0B9F\u0BBF'
  ].some(t => kws.includes(t) || text.includes(t))) {
    riskLevel = 'MEDIUM';
    reason = 'Rule-based: significant law enforcement keywords detected';
  }

  return {
    riskLevel,
    categories: cats.length > 0 ? cats : ['Other'],
    classificationReason: reason,
    district: alertData.district || 'Tamil Nadu',
    taluk: alertData.taluk || null
  };
}

// Batch classify multiple alerts
async function classifyBatch(alerts) {
  const batchSize = parseInt(process.env.CLASSIFICATION_BATCH_SIZE) || 10;
  const results = [];

  for (let i = 0; i < alerts.length; i += batchSize) {
    const batch = alerts.slice(i, i + batchSize);
    const classified = await Promise.all(
      batch.map(async (alert) => {
        const classification = await classifyAlert(alert);
        return { ...alert, ...classification };
      })
    );
    results.push(...classified);
  }

  return results;
}

module.exports = { classifyAlert, classifyBatch, fallbackClassify };
