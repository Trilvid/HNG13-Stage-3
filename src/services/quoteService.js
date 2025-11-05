// src/services/quoteService.js
import axios from 'axios';

class QuoteService {
  async getQuote() {
    try {
      const response = await axios.get('https://api.quotable.io/random', { 
        timeout: 5000 
      });
      
      return {
        text: response.data.content,
        author: response.data.author
      };
    } catch (error) {
      console.error('❌ Quote fetch error:', error.message);
      return this.getFallbackQuote();
    }
  }

  getFallbackQuote() {
    const quotes = [
      {
        text: 'Success is not final, failure is not fatal: it is the courage to continue that counts.',
        author: 'Winston Churchill'
      },
      {
        text: 'The only way to do great work is to love what you do.',
        author: 'Steve Jobs'
      },
      {
        text: 'Believe you can and you\'re halfway there.',
        author: 'Theodore Roosevelt'
      }
    ];
    
    return quotes[Math.floor(Math.random() * quotes.length)];
  }
}

export default new QuoteService();