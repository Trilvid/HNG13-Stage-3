// index.js
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import dotenv from 'dotenv';
import a2aRoutes from './src/routes/a2aRoute.js'

dotenv.config();

const app = new Hono();

// Middleware
app.use('/*', cors());

// Routes
app.route('/', a2aRoutes);

// Health check
app.get('/health', (c) => {
  return c.json({ 
    status: 'healthy', 
    agent: 'DailyPulse',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Error:', err);
  return c.json({
    error: 'Internal Server Error',
    message: err.message
  }, 500);
});

const port = parseInt(process.env.PORT || '3000');

console.log(`🚀 DailyPulse Agent starting on port ${port}...`);

serve({
  fetch: app.fetch,
  port
}, (info) => {
  console.log(`✅ Server running at http://localhost:${info.port}`);
  console.log(`📍 A2A Endpoint: http://localhost:${info.port}/a2a/agent`);
  console.log(`❤️  Health Check: http://localhost:${info.port}/health`);
});