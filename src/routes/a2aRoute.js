// src/routes/a2aRoutes.js
import { Hono } from 'hono';
import { handleA2ARequest } from '../controllers/agentController.js';

const router = new Hono();

// A2A Protocol endpoint
router.post('/a2a/agent', handleA2ARequest);

// Root endpoint
router.get('/', (c) => {
  return c.json({
    name: 'DailyPulse Agent',
    description: 'Smart daily briefing agent with news, weather, and contextual insights',
    version: '1.0.0',
    protocol: 'A2A (Agent-to-Agent)',
    endpoints: {
      a2a: 'POST /a2a/agent',
      health: 'GET /health'
    },
    status: 'operational'
  });
});

export default router;