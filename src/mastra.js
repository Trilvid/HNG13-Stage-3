// src/mastra.js
import { Mastra } from '@mastra/core';
import { OpenAI } from 'openai';
import { dailyPulseAgent } from './agents/dailyPulseAgent.js';


// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const mastra = new Mastra({
  agents: {
    dailyPulseAgent,
  },
  llms: {
    openai,
  },
});