// src/mastra.js
import { Mastra } from '@mastra/core';
import { OpenAI } from 'openai';
import { dailyPulseAgent } from './agents/dailyPulseAgent.js';

// const key = 

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  // apiKey: key,
});

export const mastra = new Mastra({
  agents: {
    dailyPulseAgent,
  },
  llms: {
    openai,
  },
});