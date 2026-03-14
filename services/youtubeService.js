const axios = require('axios');
const crypto = require('crypto');
const Alert = require('../models/Alert');
const keywords = require('../config/keywords');

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

// Intelligence filter keywords for YouTube video relevance check
const RELEVANCE_KEYWORDS = [
  // Tamil
  '\u0B95\u0BCA\u0BB2\u0BC8', '\u0B95\u0BCA\u0BB3\u0BCD\u0BB3\u0BC8', '\u0B95\u0BB1\u0BCD\u0BAA\u0BB4\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1', '\u0B86\u0BAF\u0BC1\u0BA4\u0BAE\u0BCD', '\u0B9C\u0BBE\u0BA4\u0BBF \u0B95\u0BB2\u0BB5\u0BB0\u0BAE\u0BCD',
  '\u0BAE\u0BA4 \u0B95\u0BB2\u0BB5\u0BB0\u0BAE\u0BCD', '\u0BAA\u0BCB\u0BB0\u0BBE\u0B9F\u0BCD\u0B9F\u0BAE\u0BCD', '\u0B95\u0BC1\u0BAE\u0BCD\u0BAA\u0BB2\u0BCD', '\u0BA4\u0BC1\u0BAA\u0BCD\u0BAA\u0BBE\u0B95\u0BCD\u0B95\u0BBF', '\u0B85\u0BB0\u0BBF\u0BB5\u0BBE\u0BB3\u0BCD',
  '\u0BAA\u0BCB\u0BA4\u0BC8\u0BAA\u0BCA\u0BB0\u0BC1\u0BB3\u0BCD', '\u0B95\u0BB2\u0BB5\u0BB0\u0BAE\u0BCD', '\u0B95\u0BC8\u0BA4\u0BC1', '\u0B95\u0BC1\u0BB1\u0BCD\u0BB1\u0BAE\u0BCD',
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
    console.log('[YOUTUBE] \u26A0\uFE0F YOUTUBE_API_KEY not configured \u2014 skipping');
    return [];
  }

  // Search queries per spec
  const searchQueries = [
    '\u0BB5\u0BBF\u0BB0\u0BC1\u0BA4\u0BC1\u0BA8\u0B95\u0BB0\u0BCD',
    'Virudhunagar',
    '\u0BB5\u0BBF\u0BB0\u0BC1\u0BA4\u0BC1\u0BA8\u0B95\u0BB0\u0BCD \u0B9A\u0BC6\u0BAF\u0BCD\u0BA4\u0BBF'
  ];

  const results = [];
  const publishedAfter = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  for (const q of searchQueries) {
    try {
      console.log(`[YOUTUBE] \uD83D\uDD0D Searching: "${q}"`);

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
        console.error('[YOUTUBE] \u274C API quota exceeded or invalid key');
        break; // Stop all queries if quota hit
      }
      console.error(`[YOUTUBE] \u274C Search failed for "${q}": ${err.message}`);
    }
  }

  // Deduplicate by fingerprint (same video may appear in multiple queries)
  const seen = new Set();
  const unique = results.filter(r => {
    if (seen.has(r.fingerprint)) return false;
    seen.add(r.fingerprint);
    return true;
  });

  console.log(`[YOUTUBE] \u2705 ${unique.length} new relevant videos found`);
  return unique;
}

module.exports = { fetchYouTubeVideos };
