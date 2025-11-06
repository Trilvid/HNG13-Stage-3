// src/routes/a2aRoutes.js
import { Hono } from 'hono';
import { handleA2ARequest } from '../controllers/agentController.js';
import { handleMastraA2ARequest } from '../controllers/mastraA2AController.js';

const router = new Hono();

// Mastra A2A Protocol endpoint (NEW!)
router.post('/a2a/mastra', handleMastraA2ARequest);

// Original A2A Protocol endpoint (KEEP for backward compatibility)
router.post('/a2a/agent', handleA2ARequest);

// Root endpoint
router.get('/', (c) => {
  return c.json({
    name: 'DailyPulse Agent',
    description: 'Smart daily briefing agent with news, weather, and contextual insights',
    version: '2.0.0',
    protocol: 'A2A (Agent-to-Agent)',
    implementations: {
      mastra: 'POST /a2a/mastra (Mastra-powered with AI)',
      custom: 'POST /a2a/agent (Custom implementation)'
    },
    endpoints: {
      mastra_a2a: 'POST /a2a/mastra',
      custom_a2a: 'POST /a2a/agent',
      health: 'GET /health'
    },
    status: 'operational'
  });
});

export default router;