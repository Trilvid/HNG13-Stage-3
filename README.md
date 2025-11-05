# DailyPulse Agent

Smart daily briefing agent that delivers personalized information packages combining news, weather, and context-aware recommendations through the A2A protocol.

## Features

### Reactive (On-Demand)
- **Full Brief**: `brief`, `morning brief`, `evening brief`
- **News Only**: `news`
- **Weather**: `weather` or `weather [city]`
- **Help**: `help`

### Proactive (Interval-Based)
- **Morning Brief**: Automatically sent at 7:00 AM daily
- **Evening Brief**: Automatically sent at 6:00 PM daily

### Smart Context
- Weather-based activity suggestions
- Time-appropriate content (energizing vs relaxing)
- Motivational quotes
- Actionable insights

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env` file:

```env
PORT=3000
NEWS_API_KEY=your_newsapi_key_here
DEFAULT_LOCATION=Lagos
```

Get your NewsAPI key from: https://newsapi.org/register

### 3. Run the Server

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### A2A Protocol Endpoint

```
POST /a2a/agent
Content-Type: application/json
```

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": "request-001",
  "method": "message/send",
  "params": {
    "message": {
      "kind": "message",
      "role": "user",
      "parts": [
        {
          "kind": "text",
          "text": "Give me my morning brief"
        }
      ],
      "messageId": "msg-001",
      "taskId": "task-001"
    },
    "configuration": {
      "blocking": true
    }
  }
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": "request-001",
  "result": {
    "id": "task-001",
    "contextId": "ctx-uuid",
    "status": {
      "state": "completed",
      "timestamp": "2025-10-29T07:00:00.000Z",
      "message": {
        "messageId": "msg-uuid",
        "role": "agent",
        "parts": [
          {
            "kind": "text",
            "text": "☀️ Good Morning! - Tuesday, Oct 29, 2025\n\n🌤️ WEATHER - Lagos\n..."
          }
        ],
        "kind": "message"
      }
    },
    "artifacts": [],
    "history": [...],
    "kind": "task"
  }
}
```

### Health Check

```
GET /health
```

Returns:
```json
{
  "status": "healthy",
  "agent": "DailyPulse",
  "version": "1.0.0"
}
```

## Testing

### Test with cURL

```bash
# Full brief
curl -X POST http://localhost:3000/a2a/agent \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "test-001",
    "method": "message/send",
    "params": {
      "message": {
        "kind": "message",
        "role": "user",
        "parts": [{"kind": "text", "text": "Give me my morning brief"}],
        "messageId": "msg-001"
      }
    }
  }'

# News only
curl -X POST http://localhost:3000/a2a/agent \
  -H "Content-Type": "application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "test-002",
    "method": "message/send",
    "params": {
      "message": {
        "kind": "message",
        "role": "user",
        "parts": [{"kind": "text", "text": "news"}],
        "messageId": "msg-002"
      }
    }
  }'

# Weather for specific city
curl -X POST http://localhost:3000/a2a/agent \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "test-003",
    "method": "message/send",
    "params": {
      "message": {
        "kind": "message",
        "role": "user",
        "parts": [{"kind": "text", "text": "weather in London"}],
        "messageId": "msg-003"
      }
    }
  }'
```

## Deployment

### Railway

```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main

# Deploy on Railway
# 1. Connect GitHub repo
# 2. Add environment variables
# 3. Deploy
```

### Environment Variables for Production

```env
PORT=3000
NEWS_API_KEY=your_production_key
DEFAULT_LOCATION=Lagos
WEBHOOK_URL=https://telex.im/webhook/your-org-id
```

## Telex Integration

Add to your Telex workflow:

```json
{
  "nodes": [
    {
      "id": "dailypulse_agent",
      "name": "DailyPulse",
      "type": "a2a/generic-a2a-node",
      "url": "https://your-deployed-url.railway.app/a2a/agent"
    }
  ]
}
```

## APIs Used

- **NewsAPI.org** - News headlines (100 requests/day free)
- **Open-Meteo** - Weather data (completely free, no key needed)
- **Quotable** - Motivational quotes (completely free)

## Features Explained

### Caching
- News cached for 1 hour
- Weather cached for 1 hour
- Reduces API calls and improves response time

### Interval System
- Uses node-cron for scheduled tasks
- Morning brief at 7:00 AM
- Evening brief at 6:00 PM
- Requires WEBHOOK_URL to be configured

### Smart Context
- Rainy weather → Indoor activity suggestions
- Hot weather → Hydration reminders
- Nice weather → Outdoor activity suggestions
- Morning → Energizing content
- Evening → Relaxing content

## Troubleshooting

**"News API error"**
- Check your API key is correct
- Verify you haven't exceeded rate limit (100/day)
- Check internet connection

**"Weather not found"**
- Verify location name is in English
- Try major city names
- Check Open-Meteo API status

**"Interval messages not sending"**
- Ensure WEBHOOK_URL is configured
- Check cron schedule syntax
- Verify webhook endpoint is accessible

## License

MIT

## Author

Built for HNG13 Internship - Stage 3

---

**Ready for Telex integration!** 🚀