// src/tools/weatherTool.js
import { createTool } from '@mastra/core';
import { z } from 'zod';
import weatherService from '../services/weatherService.js';

export const weatherTool = createTool({
  id: 'get-weather',
  description: 'Get current weather information for a specific location',
  inputSchema: z.object({
    location: z.string().describe('City name or location to get weather for'),
  }),
  outputSchema: z.object({
    location: z.string(),
    temperature: z.number(),
    humidity: z.number(),
    high: z.number(),
    low: z.number(),
    condition: z.string(),
  }),
  execute: async ({ context }) => {
    const weather = await weatherService.getWeather(context.location);
    return weather;
  },
});