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
Tamil: கொலை, கொள்ளை, கற்பழிப்பு, ஆயுதம், ஜாதி கலவரம், மத கலவரம், போராட்டம், கும்பல், துப்பாக்கி, அரிவாள், போதைபொருள்
English: murder, robbery, POCSO, weapon, caste violence, religious riot, protest, gang, firearms, aruval, drugs, rowdy

VIRUDHUNAGAR DISTRICT TALUKS: Virudhunagar, Srivilliputhur, Rajapalayam, Sivakasi, Sattur, Aruppukkottai, Tiruchuli, Watrap, Vembakottai, Krishnankoil

Classify the risk level as:
- HIGH 🔴: Immediate threat to life, active violence, POCSO/rape cases, firearms incidents, communal/caste riots, murder, ongoing crime, gang war — requires IMMEDIATE DSP action
- MEDIUM 🟡: Potential threat, protests planned, gang activity, theft/robbery, caste tensions, drug seizure, weapons recovered — monitor closely
- LOW 🟢: General crime reports, past incidents, routine arrests, routine law enforcement news — log only

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
    console.error(`[CLASSIFIER] ❌ GPT-4 error: ${err.message}`);
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

  // HIGH RISK triggers — per spec
  const highTriggers = [
    'pocso', 'murder', 'firearms', 'bomb', 'explosive', 'riot', 'kidnap', 'rape',
    'கொலை', 'கற்பழிப்பு', 'துப்பாக்கி', 'ஜாதி கலவரம்', 'மத கலவரம்',
    'caste violence', 'religious riot', 'gang war', 'encounter', 'firing'
  ];
  if (highTriggers.some(t => kws.includes(t) || text.includes(t)) ||
      cats.includes('POCSO') || cats.includes('Murder') || cats.includes('Firearms')) {
    riskLevel = 'HIGH';
    reason = 'Rule-based: critical crime/safety keywords detected';
  }
  // MEDIUM RISK triggers — per spec
  else if ([
    'gang', 'rowdy', 'protest', 'caste', 'religious', 'weapon', 'robbery', 'theft',
    'drugs', 'aruval', 'drug', 'narcotic', 'ganja', 'கொள்ளை', 'போராட்டம்', 'கும்பல்',
    'ஆயுதம்', 'அரிவாள்', 'போதைபொருள்', 'கஞ்சா', 'ரவுடி'
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
