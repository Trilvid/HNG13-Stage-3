// src/services/newsService.js
import axios from 'axios';

class NewsService {
  constructor() {
    this.cache = { data: null, timestamp: 0 };
    this.cacheDuration = 60 * 60 * 1000; // 1 hour
    this.apiKey = process.env.NEWS_API_KEY;
  }

  async getNews() {
    const now = Date.now();
    
    // Return cached data if valid
    if (this.cache.data && (now - this.cache.timestamp) < this.cacheDuration) {
      console.log('✅ Using cached news');
      return this.cache.data;
    }

    if (!this.apiKey) {
      console.warn('⚠️  NEWS_API_KEY not configured');
      return this.getFallbackNews();
    }

    try {
      console.log('📰 Fetching fresh news...');
      const response = await axios.get('https://newsapi.org/v2/top-headlines', {
        params: {
          country: 'us',
          pageSize: 5,
          apiKey: this.apiKey
        },
        timeout: 10000
      });

      const headlines = response.data.articles.slice(0, 5).map((article, index) => ({
        title: article.title,
        source: article.source.name,
        url: article.url,
        rank: index + 1
      }));

      this.cache = { data: headlines, timestamp: now };
      console.log(`✅ Fetched ${headlines.length} news articles`);
      return headlines;

    } catch (error) {
      console.error('❌ News fetch error:', error.message);
      return this.getFallbackNews();
    }
  }

  getFallbackNews() {
    return [
      { title: 'Unable to fetch news at this time', source: 'System', url: '', rank: 1 },
      { title: 'Please check your NEWS_API_KEY configuration', source: 'System', url: '', rank: 2 }
    ];
  }
}

export default new NewsService();