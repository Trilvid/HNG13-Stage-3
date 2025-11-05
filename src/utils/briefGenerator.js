// src/utils/briefGenerator.js
import newsService from '../services/newsService.js';
import weatherService from '../services/weatherService.js';
import quoteService from '../services/quoteService.js';

class BriefGenerator {
  async generateBrief(timeOfDay = 'morning', location = 'Lagos') {
    console.log(`📝 Generating ${timeOfDay} brief for ${location}...`);

    const [news, weather, quote] = await Promise.all([
      newsService.getNews(),
      weatherService.getWeather(location),
      quoteService.getQuote()
    ]);

    const greeting = timeOfDay === 'morning' ? '☀️ Good Morning!' : '🌙 Good Evening!';
    const date = new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });

    let brief = `${greeting} - ${date}\n\n`;
    
    // Weather section
    brief += `🌤️ WEATHER - ${weather.location}\n`;
    brief += `Temperature: ${weather.temperature}°C\n`;
    brief += `Conditions: ${weather.condition}\n`;
    brief += `High: ${weather.high}°C | Low: ${weather.low}°C\n`;
    brief += `Humidity: ${weather.humidity}%\n\n`;
    
    // Activity suggestion
    brief += `${weatherService.getActivitySuggestion(weather)}\n\n`;
    
    // News section
    brief += `📰 TOP NEWS HEADLINES\n`;
    news.forEach(item => {
      brief += `${item.rank}. ${item.title}\n`;
    });
    brief += `\n`;
    
    // Quote section
    if (timeOfDay === 'morning') {
      brief += `💡 Quote of the Day:\n`;
      brief += `"${quote.text}"\n`;
      brief += `— ${quote.author}\n\n`;
      brief += `Have a productive day! 🚀`;
    } else {
      brief += `💡 Evening Reflection:\n`;
      brief += `"${quote.text}"\n`;
      brief += `— ${quote.author}\n\n`;
      brief += `Rest well! 😴`;
    }

    console.log('✅ Brief generated successfully');
    return brief;
  }

  async generateNewsOnly() {
    const news = await newsService.getNews();
    
    let text = '📰 TOP NEWS HEADLINES\n\n';
    news.forEach(item => {
      text += `${item.rank}. ${item.title}\n`;
      if (item.source !== 'System') {
        text += `   Source: ${item.source}\n`;
      }
      text += `\n`;
    });
    
    return { text, data: news };
  }

  async generateWeatherOnly(location = 'Lagos') {
    const weather = await weatherService.getWeather(location);
    
    let text = `🌤️ WEATHER - ${weather.location}\n\n`;
    text += `Temperature: ${weather.temperature}°C\n`;
    text += `Conditions: ${weather.condition}\n`;
    text += `High: ${weather.high}°C | Low: ${weather.low}°C\n`;
    text += `Humidity: ${weather.humidity}%\n\n`;
    text += weatherService.getActivitySuggestion(weather);
    
    return { text, data: weather };
  }

  generateHelp() {
    return `📋 DailyPulse Commands:\n\n` +
           `• "brief" or "morning brief" - Full morning briefing\n` +
           `• "evening brief" - Evening briefing\n` +
           `• "news" - Latest headlines only\n` +
           `• "weather" or "weather [city]" - Weather forecast\n` +
           `• "help" - Show this message\n\n` +
           `I also send automatic briefings:\n` +
           `• Morning: 7:00 AM daily\n` +
           `• Evening: 6:00 PM daily`;
  }
}

export default new BriefGenerator();