// src/tools/newsTool.js
import { createTool } from '@mastra/core';
import { z } from 'zod';
import newsService from '../services/newsService.js';

export const newsTool = createTool({
  id: 'get-news',
  description: 'Get top news headlines from various sources',
  inputSchema: z.object({}),
  outputSchema: z.array(z.object({
    title: z.string(),
    source: z.string(),
    url: z.string(),
    rank: z.number(),
  })),
  execute: async () => {
    const news = await newsService.getNews();
    return news;
  },
});