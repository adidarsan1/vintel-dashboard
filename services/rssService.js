const Parser = require('rss-parser');
const crypto = require('crypto');
const rssSources = require('../config/rssSources');
const keywords = require('../config/keywords');
const Alert = require('../models/Alert');

const parser = new Parser({
  timeout: 15000,
  headers: {
    'User-Agent': 'VINTEL-Intelligence-Monitor/1.0'
  }
});

// Generate unique fingerprint for deduplication
function generateFingerprint(title, source) {
  const normalized = `${title.toLowerCase().trim()}|${source}`;
  return crypto.createHash('md5').update(normalized).digest('hex');
}

// Check if content matches monitoring keywords
function matchesKeywords(text) {
  if (!text) return { matches: false, matched: [], categories: [] };

  const lowerText = text.toLowerCase();
  const allKeywords = [...keywords.primary, ...keywords.tamil, ...keywords.extended];
  const matched = allKeywords.filter(kw => lowerText.includes(kw.toLowerCase()));

  // Determine categories from matched keywords
  const categories = new Set();
  matched.forEach(kw => {
    const cat = keywords.categoryMap[kw] || keywords.categoryMap[kw.toLowerCase()];
    if (cat) categories.add(cat);
  });

  // Check district relevance
  const isVirudhunagar = keywords.virudhunagar.some(kw =>
    lowerText.includes(kw.toLowerCase())
  );

  // Detect taluk
  let detectedTaluk = null;
  if (keywords.talukMap) {
    for (const [kw, taluk] of Object.entries(keywords.talukMap)) {
      if (lowerText.includes(kw.toLowerCase())) {
        detectedTaluk = taluk;
        break;
      }
    }
  }

  return {
    matches: matched.length > 0,
    matched,
    categories: [...categories],
    isVirudhunagar,
    taluk: detectedTaluk
  };
}

// Fetch and process RSS feeds
async function fetchAllFeeds() {
  const results = [];

  const feedPromises = rssSources.map(async (source) => {
    try {
      const feed = await parser.parseURL(source.url);
      const items = (feed.items || []).slice(0, 20); // Latest 20 items per source

      for (const item of items) {
        const title = item.title || '';
        const description = item.contentSnippet || item.content || item.description || '';
        const fullText = `${title} ${description}`;

        const keywordResult = matchesKeywords(fullText);

        // For Google News sources, always consider as Virudhunagar-district news
        const isGoogleNews = source.category === 'google-news';
        const isDistrictItem = isGoogleNews || keywordResult.isVirudhunagar;

        // For Google News: include all items (they are already district-filtered by query)
        // For media sources: only include keyword-matched items
        if (keywordResult.matches || isGoogleNews) {
          const fingerprint = generateFingerprint(title, source.url || source.name);

          // Check if already exists
          const exists = await Alert.findOne({ fingerprint });
          if (!exists) {
            // Taluk: prefer source metadata, then text detection
            const taluk = source.taluk || keywordResult.taluk || null;

            results.push({
              title: title.trim(),
              description: description.substring(0, 500).trim(),
              source: source.name,
              sourceUrl: item.link || '',
              rawContent: fullText.substring(0, 1000),
              keywords: keywordResult.matched,
              categories: keywordResult.categories.length > 0
                ? keywordResult.categories
                : (isGoogleNews ? ['Crime'] : ['Other']),
              district: isDistrictItem ? 'Virudhunagar' : 'Tamil Nadu',
              taluk,
              fingerprint,
              publishedAt: item.pubDate ? new Date(item.pubDate) : new Date()
            });
          }
        }
      }

      console.log(`[RSS] \u2705 ${source.name}: ${items.length} items scanned`);
    } catch (err) {
      console.error(`[RSS] \u274C ${source.name} failed: ${err.message}`);
    }
  });

  await Promise.allSettled(feedPromises);
  console.log(`[RSS] \uD83D\uDCCA ${results.length} new relevant items found`);
  return results;
}

module.exports = { fetchAllFeeds, matchesKeywords, generateFingerprint };
