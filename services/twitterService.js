const axios = require('axios');
const crypto = require('crypto');
const keywords = require('../config/keywords');
const Alert = require('../models/Alert');

const TWITTER_API_BASE = 'https://api.twitter.com/2';

function generateFingerprint(tweetId) {
  return crypto.createHash('md5').update(`twitter_${tweetId}`).digest('hex');
}

// Search Twitter/X for relevant hashtags and keywords
async function searchTwitter() {
  const bearerToken = process.env.TWITTER_BEARER_TOKEN;
  if (!bearerToken) {
    console.log('[TWITTER] ⚠️ Twitter API not configured - skipping');
    return [];
  }

  const results = [];

  // Build search query
  const searchTerms = [
    ...keywords.primary.slice(0, 5),
    ...keywords.virudhunagar.slice(0, 4)
  ];
  const query = `(${searchTerms.join(' OR ')}) (Virudhunagar OR Tamil Nadu OR TN) -is:retweet lang:en OR lang:ta`;

  try {
    const response = await axios.get(`${TWITTER_API_BASE}/tweets/search/recent`, {
      params: {
        query: query.substring(0, 512), // Twitter API query limit
        max_results: 20,
        'tweet.fields': 'created_at,text,author_id,public_metrics',
        expansions: 'author_id',
        'user.fields': 'username,name'
      },
      headers: {
        'Authorization': `Bearer ${bearerToken}`,
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });

    const tweets = response.data?.data || [];
    const users = {};
    (response.data?.includes?.users || []).forEach(u => {
      users[u.id] = u;
    });

    for (const tweet of tweets) {
      const fingerprint = generateFingerprint(tweet.id);
      const exists = await Alert.findOne({ fingerprint });
      if (exists) continue;

      const user = users[tweet.author_id] || {};
      const text = tweet.text || '';

      // Match keywords
      const lowerText = text.toLowerCase();
      const allKw = [...keywords.primary, ...keywords.tamil, ...keywords.extended];
      const matched = allKw.filter(kw => lowerText.includes(kw.toLowerCase()));

      if (matched.length === 0) continue;

      const categories = new Set();
      matched.forEach(kw => {
        const cat = keywords.categoryMap[kw.toLowerCase()];
        if (cat) categories.add(cat);
      });

      const isVirudhunagar = keywords.virudhunagar.some(kw =>
        lowerText.includes(kw.toLowerCase())
      );

      results.push({
        title: `@%${user.username || 'unknown'}: ${text.substring(0, 120)}...`,
        description: text,
        source: 'Twitter/X',
        sourceUrl: `https://twitter.com/${user.username}/status/${tweet.id}`,
        rawContent: text,
        keywords: matched,
        categories: [...categories].length > 0 ? [...categories] : ['Crime'],
        district: isVirudhunagar ? 'Virudhunagar' : 'Tamil Nadu',
        fingerprint
      });
    }

    console.log(`[TWITTER] ✅ ${tweets.length} tweets scanned, ${results.length} relevant`);
  } catch (err) {
    console.error(`[TWITTER] ❌ Search failed: ${err.message}`);
  }

  return results;
}

module.exports = { searchTwitter };
