// src/tools/quoteTool.js
import { createTool } from '@mastra/core';
import { z } from 'zod';
import quoteService from '../services/quoteService.js';

export const quoteTool = createTool({
  id: 'get-quote',
  description: 'Get a motivational or inspirational quote',
  inputSchema: z.object({}),
  outputSchema: z.object({
    text: z.string(),
    author: z.string(),
  }),
  execute: async () => {
    const quote = await quoteService.getQuote();
    return quote;
  },
});