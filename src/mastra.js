// src/mastra.js
import { Mastra } from '@mastra/core';
import { OpenAI } from 'openai';
import { dailyPulseAgent } from './agents/dailyPulseAgent.js';



// Initialize OpenAI client
const openai = new OpenAI({
  apiKey:'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',
});

export const mastra = new Mastra({
  agents: {
    dailyPulseAgent,
  },
  llms: {
    openai,
  },
});