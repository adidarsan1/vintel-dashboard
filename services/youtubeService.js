const axios = require('axios');
const crypto = require('crypto');
const Alert = require('../models/Alert');
const keywords = require('../config/keywords');

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

// Intelligence filter keywords for YouTube video relevance check
const RELEVANCE_KEYWORDS = [
  // Tamil
  'கொலை', 'கொள்ளை', 'கற்பழிப்பு', 'ஆயுதம்', 'ஜாதி கலவரம்',
  'மத கலவரம்', 'போராட்டம்', 'கும்பல்', 'துப்பாக்கி', 'அரிவாள்',
  'போதைபொருள்', 'கலவரம்', 'கைது', 'குற்றம்',
  // English
  'murder', 'robbery', 'pocso', 'weapon', 'caste violence', 'religious riot',
  'protest', 'gang', 'firearms', 'aruval', 'drugs', 'rowdy', 'crime',
  'arrested', 'attack', 'violence', 'police', 'raid'
];

function generateFingerprint(videoId) {
  return crypto.createHash('md5').update(`youtube_${videoId}`).digest('hex');
}

// Check if a video title/description is intelligence-relevant
function isRelevant(title = '', description = '') {
  const combined = `${title} ${description}`.toLowerCase();
  return RELEVANCE_KEYWORDS.some(kw => combined.includes(kw.toLowerCase()));
}

// Detect taluk from text
function detectTaluk(text = '') {
  const lower = text.toLowerCase();
  for (const [kw, taluk] of Object.entries(keywords.talukMap)) {
    if (lower.includes(kw.toLowerCase())) return taluk;
  }
  return null;
}

// Detect matched keywords from text
function detectKeywords(text = '') {
  const lower = text.toLowerCase();
  const allKw = [
    ...keywords.primary,
    ...keywords.tamil,
    ...keywords.extended
  ];
  return [...new Set(allKw.filter(kw => lower.includes(kw.toLowerCase())))];
}

// Build category list from matched keywords
function detectCategories(matchedKws = []) {
  const cats = new Set();
  matchedKws.forEach(kw => {
    const cat = keywords.categoryMap[kw] || keywords.categoryMap[kw.toLowerCase()];
    if (cat) cats.add(cat);
  });
  return cats.size > 0 ? [...cats] : ['Crime'];
}

// Fetch latest relevant videos from YouTube (last 24 hours)
async function fetchYouTubeVideos() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.log('[YOUTUBE] ⚠️ YOUTUBE_API_KEY not configured — skipping');
    return [];
  }

  // Search queries per spec
  const searchQueries = [
    'விருதுநகர்',
    'Virudhunagar',
    'விருதுநகர் செய்தி'
  ];

  const results = [];
  const publishedAfter = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  for (const q of searchQueries) {
    try {
      console.log(`[YOUTUBE] 🔍 Searching: "${q}"`);

      const response = await axios.get(`${YOUTUBE_API_BASE}/search`, {
        params: {
          key: apiKey,
          q,
          part: 'snippet',
          type: 'video',
          publishedAfter,
          maxResults: 15,
          relevanceLanguage: 'ta',
          regionCode: 'IN',
          order: 'date'
        },
        timeout: 15000
      });

      const items = response.data?.items || [];
      console.log(`[YOUTUBE] Found ${items.length} videos for "${q}"`);

      for (const item of items) {
        const videoId = item.id?.videoId;
        if (!videoId) continue;

        const snippet = item.snippet || {};
        const title = snippet.title || '';
        const description = snippet.description || '';
        const channelTitle = snippet.channelTitle || 'YouTube';

        // Check if the video is intelligence-relevant
        if (!isRelevant(title, description)) continue;

        const fingerprint = generateFingerprint(videoId);
        const exists = await Alert.findOne({ fingerprint });
        if (exists) continue;

        const matchedKws = detectKeywords(`${title} ${description}`);
        const categories = detectCategories(matchedKws);
        const taluk = detectTaluk(`${title} ${description}`);
        const isDistrictVideo = keywords.virudhunagar.some(kw =>
          `${title} ${description}`.toLowerCase().includes(kw.toLowerCase())
        );

        results.push({
          title: `[YouTube] ${title}`,
          description: description.substring(0, 300) || `Video by ${channelTitle}`,
          source: 'YouTube',
          sourceUrl: `https://www.youtube.com/watch?v=${videoId}`,
          rawContent: `${title} ${description}`,
          keywords: matchedKws,
          categories,
          district: isDistrictVideo ? 'Virudhunagar' : 'Tamil Nadu',
          taluk: taluk || null,
          fingerprint,
          publishedAt: snippet.publishedAt
        });
      }
    } catch (err) {
      if (err.response?.status === 403) {
        console.error('[YOUTUBE] ❌ API quota exceeded or invalid key');
        break; // Stop all queries if quota hit
      }
      console.error(`[YOUTUBE] ❌ Search failed for "${q}": ${err.message}`);
    }
  }

  // Deduplicate by fingerprint (same video may appear in multiple queries)
  const seen = new Set();
  const unique = results.filter(r => {
    if (seen.has(r.fingerprint)) return false;
    seen.add(r.fingerprint);
    return true;
  });

  console.log(`[YOUTUBE] ✅ ${unique.length} new relevant videos found`);
  return unique;
}

module.exports = { fetchYouTubeVideos };
