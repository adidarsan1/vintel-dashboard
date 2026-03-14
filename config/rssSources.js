// RSS Feed Sources for Tamil Nadu News
module.exports = [
  // ============================================================
  // SECTION 1 — TAMIL MEDIA OUTLETS
  // ============================================================
  {
    name: 'Polimer News',
    url: 'https://www.polimernews.com/feed',
    language: 'ta',
    category: 'media'
  },
  {
    name: 'Thinamani',
    url: 'https://www.dinamani.com/rss/rss-feeds.html',
    language: 'ta',
    category: 'media'
  },
  {
    name: 'Thinamalar',
    url: 'https://www.dinamalar.com/rss_feed.asp',
    language: 'ta',
    category: 'media'
  },
  {
    name: 'Thinakaran',
    url: 'https://www.dinakaran.com/feed',
    language: 'ta',
    category: 'media'
  },
  {
    name: 'News18 Tamil',
    url: 'https://tamil.news18.com/rss/tamil-nadu.xml',
    language: 'ta',
    category: 'media'
  },
  {
    name: 'News7 Tamil',
    url: 'https://www.news7tamil.live/feed',
    language: 'ta',
    category: 'media'
  },
  {
    name: 'Puthiya Thalaimurai',
    url: 'https://www.puthiyathalaimurai.com/feeds/rss',
    language: 'ta',
    category: 'media'
  },
  {
    name: 'The Hindu',
    url: 'https://www.thehindu.com/news/national/tamil-nadu/feeder/default.rss',
    language: 'en',
    category: 'media'
  },
  {
    name: 'Indian Express',
    url: 'https://indianexpress.com/section/cities/chennai/feed/',
    language: 'en',
    category: 'media'
  },

  // ============================================================
  // SECTION 2 — GOOGLE NEWS: VIRUDHUNAGAR DISTRICT SPECIFIC
  // Tamil keyword searches
  // ============================================================
  {
    name: 'Google News',
    url: 'https://news.google.com/rss/search?q=%E0%AE%B5%E0%AE%BF%E0%AE%B0%E0%AF%81%E0%AE%A4%E0%AF%81%E0%AE%A8%E0%AE%95%E0%AE%B0%E0%AF%8D+crime&hl=ta&gl=IN&ceid=IN:ta',
    language: 'ta',
    category: 'google-news',
    district: 'Virudhunagar',
    queryLabel: 'விருதுநகர் crime'
  },
  {
    name: 'Google News',
    url: 'https://news.google.com/rss/search?q=Virudhunagar+crime&hl=ta&gl=IN&ceid=IN:ta',
    language: 'ta',
    category: 'google-news',
    district: 'Virudhunagar',
    queryLabel: 'Virudhunagar crime'
  },
  {
    name: 'Google News',
    url: 'https://news.google.com/rss/search?q=%E0%AE%B5%E0%AE%BF%E0%AE%B0%E0%AF%81%E0%AE%A4%E0%AF%81%E0%AE%A8%E0%AE%95%E0%AE%B0%E0%AF%8D+%E0%AE%95%E0%AF%8A%E0%AE%B2%E0%AF%88&hl=ta&gl=IN&ceid=IN:ta',
    language: 'ta',
    category: 'google-news',
    district: 'Virudhunagar',
    queryLabel: 'விருதுநகர் கொலை'
  },
  {
    name: 'Google News',
    url: 'https://news.google.com/rss/search?q=%E0%AE%B5%E0%AE%BF%E0%AE%B0%E0%AF%81%E0%AE%A4%E0%AF%81%E0%AE%A8%E0%AE%95%E0%AE%B0%E0%AF%8D+%E0%AE%95%E0%AE%B2%E0%AE%B5%E0%AE%B0%E0%AE%AE%E0%AF%8D&hl=ta&gl=IN&ceid=IN:ta',
    language: 'ta',
    category: 'google-news',
    district: 'Virudhunagar',
    queryLabel: 'விருதுநகர் கலவரம்'
  },
  {
    name: 'Google News',
    url: 'https://news.google.com/rss/search?q=Virudhunagar+police&hl=ta&gl=IN&ceid=IN:ta',
    language: 'ta',
    category: 'google-news',
    district: 'Virudhunagar',
    queryLabel: 'Virudhunagar police'
  },
  {
    name: 'Google News',
    url: 'https://news.google.com/rss/search?q=%E0%AE%B5%E0%AE%BF%E0%AE%B0%E0%AF%81%E0%AE%A4%E0%AF%81%E0%AE%A8%E0%AE%95%E0%AE%B0%E0%AF%8D+%E0%AE%AA%E0%AF%8B%E0%AE%B0%E0%AE%BE%E0%AE%9F%E0%AF%8D%E0%AE%9F%E0%AE%AE%E0%AF%8D&hl=ta&gl=IN&ceid=IN:ta',
    language: 'ta',
    category: 'google-news',
    district: 'Virudhunagar',
    queryLabel: 'விருதுநகர் போராட்டம்'
  },
  {
    name: 'Google News',
    url: 'https://news.google.com/rss/search?q=%E0%AE%B5%E0%AE%BF%E0%AE%B0%E0%AF%81%E0%AE%A4%E0%AF%81%E0%AE%A8%E0%AE%95%E0%AE%B0%E0%AF%8D+%E0%AE%86%E0%AE%AF%E0%AF%81%E0%AE%A4%E0%AE%AE%E0%AF%8D&hl=ta&gl=IN&ceid=IN:ta',
    language: 'ta',
    category: 'google-news',
    district: 'Virudhunagar',
    queryLabel: 'விருதுநகர் ஆயுதம்'
  },

  // ============================================================
  // SECTION 3 — GOOGLE NEWS: TALUK-SPECIFIC
  // ============================================================
  {
    name: 'Google News',
    url: 'https://news.google.com/rss/search?q=Srivilliputhur+crime&hl=ta&gl=IN&ceid=IN:ta',
    language: 'en',
    category: 'google-news',
    district: 'Virudhunagar',
    taluk: 'Srivilliputhur',
    queryLabel: 'Srivilliputhur crime'
  },
  {
    name: 'Google News',
    url: 'https://news.google.com/rss/search?q=Rajapalayam+crime&hl=ta&gl=IN&ceid=IN:ta',
    language: 'en',
    category: 'google-news',
    district: 'Virudhunagar',
    taluk: 'Rajapalayam',
    queryLabel: 'Rajapalayam crime'
  },
  {
    name: 'Google News',
    url: 'https://news.google.com/rss/search?q=Sivakasi+crime&hl=ta&gl=IN&ceid=IN:ta',
    language: 'en',
    category: 'google-news',
    district: 'Virudhunagar',
    taluk: 'Sivakasi',
    queryLabel: 'Sivakasi crime'
  },
  {
    name: 'Google News',
    url: 'https://news.google.com/rss/search?q=Sattur+crime&hl=ta&gl=IN&ceid=IN:ta',
    language: 'en',
    category: 'google-news',
    district: 'Virudhunagar',
    taluk: 'Sattur',
    queryLabel: 'Sattur crime'
  },
  {
    name: 'Google News',
    url: 'https://news.google.com/rss/search?q=Aruppukkottai+crime&hl=ta&gl=IN&ceid=IN:ta',
    language: 'en',
    category: 'google-news',
    district: 'Virudhunagar',
    taluk: 'Aruppukkottai',
    queryLabel: 'Aruppukkottai crime'
  },
  {
    name: 'Google News',
    url: 'https://news.google.com/rss/search?q=Tiruchuli+crime&hl=ta&gl=IN&ceid=IN:ta',
    language: 'en',
    category: 'google-news',
    district: 'Virudhunagar',
    taluk: 'Tiruchuli',
    queryLabel: 'Tiruchuli crime'
  },
  {
    name: 'Google News',
    url: 'https://news.google.com/rss/search?q=Watrap+crime&hl=ta&gl=IN&ceid=IN:ta',
    language: 'en',
    category: 'google-news',
    district: 'Virudhunagar',
    taluk: 'Watrap',
    queryLabel: 'Watrap crime'
  }
];
