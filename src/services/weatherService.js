// src/services/weatherService.js
import axios from 'axios';

class WeatherService {
  constructor() {
    this.cache = new Map();
    this.cacheDuration = 60 * 60 * 1000; // 1 hour
  }

  async getWeather(location = 'Lagos') {
    const cacheKey = location.toLowerCase();
    const cached = this.cache.get(cacheKey);
    const now = Date.now();

    // Return cached data if valid
    if (cached && (now - cached.timestamp) < this.cacheDuration) {
      console.log(`✅ Using cached weather for ${location}`);
      return cached.data;
    }

    try {
      console.log(`🌤️  Fetching weather for ${location}...`);
      
      // Step 1: Geocode location
      const geoResponse = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
        params: { name: location, count: 1 },
        timeout: 5000
      });

      if (!geoResponse.data.results?.[0]) {
        throw new Error(`Location "${location}" not found`);
      }

      const { latitude, longitude, name } = geoResponse.data.results[0];

      // Step 2: Get weather
      const weatherResponse = await axios.get('https://api.open-meteo.com/v1/forecast', {
        params: {
          latitude,
          longitude,
          current: 'temperature_2m,relative_humidity_2m,weather_code',
          daily: 'temperature_2m_max,temperature_2m_min',
          timezone: 'auto'
        },
        timeout: 5000
      });

      const data = weatherResponse.data;
      const weatherData = {
        location: name,
        temperature: Math.round(data.current.temperature_2m),
        humidity: data.current.relative_humidity_2m,
        high: Math.round(data.daily.temperature_2m_max[0]),
        low: Math.round(data.daily.temperature_2m_min[0]),
        condition: this.getWeatherCondition(data.current.weather_code)
      };

      // Cache the result
      this.cache.set(cacheKey, { data: weatherData, timestamp: now });
      console.log(`✅ Weather fetched for ${name}: ${weatherData.temperature}°C`);
      
      return weatherData;

    } catch (error) {
      console.error(`❌ Weather fetch error for ${location}:`, error.message);
      return {
        location: location,
        temperature: 0,
        humidity: 0,
        high: 0,
        low: 0,
        condition: 'Data unavailable'
      };
    }
  }

  getWeatherCondition(code) {
    const conditions = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Foggy',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      61: 'Light rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      80: 'Rain showers',
      81: 'Heavy rain showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with hail'
    };
    return conditions[code] || 'Partly cloudy';
  }

  getActivitySuggestion(weather) {
    const temp = weather.temperature;
    const condition = weather.condition.toLowerCase();

    if (condition.includes('rain') || condition.includes('thunderstorm')) {
      return '☔ Great day for indoor activities! Perfect for coding, reading, or catching up on work.';
    } else if (condition.includes('clear') && temp > 20 && temp < 30) {
      return '☀️ Beautiful weather! Consider a walk outside or working from a cafe.';
    } else if (temp > 30) {
      return '🌡️ It\'s hot! Stay hydrated and find air-conditioned spaces.';
    } else if (temp < 15) {
      return '🧥 Bundle up! It\'s chilly out there.';
    }
    return '🌤️ Pleasant conditions for outdoor activities!';
  }
}

export default new WeatherService();