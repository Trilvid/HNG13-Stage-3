// src/controllers/agentController.js
import briefGenerator from '../utils/briefGenerator.js';
import { 
  createA2AResponse, 
  createA2AError, 
  extractUserMessage, 
  parseCommand 
} from '../utils/a2aHelper.js';

export async function handleA2ARequest(c) {
  let body;
  
  try {
    body = await c.req.json();
    console.log('📨 Received A2A request:', JSON.stringify(body, null, 2));
  } catch (error) {
    console.error('❌ JSON parse error:', error.message);
    return c.json(createA2AError(null, -32700, 'Parse error'), 400);
  }

  // Validate JSON-RPC 2.0
  if (body.jsonrpc !== '2.0') {
    return c.json(
      createA2AError(body.id, -32600, 'Invalid Request: jsonrpc must be "2.0"'), 
      400
    );
  }

  if (!body.id) {
    return c.json(
      createA2AError(null, -32600, 'Invalid Request: id is required'), 
      400
    );
  }

  const requestId = body.id;

  // Extract user message
  const userMsg = extractUserMessage(body.params);
  if (!userMsg) {
    return c.json(
      createA2AError(requestId, -32602, 'Invalid params: message is required'), 
      400
    );
  }

  console.log(`💬 User message: "${userMsg.text}"`);

  try {
    // Parse command
    const command = parseCommand(userMsg.text);
    console.log(`🎯 Command parsed:`, command);

    let responseText = '';
    let artifacts = [];

    // Execute command
    switch (command.type) {
      case 'help':
        responseText = briefGenerator.generateHelp();
        break;

      case 'news':
        const newsResult = await briefGenerator.generateNewsOnly();
        responseText = newsResult.text;
        artifacts.push({
          artifactId: `news-${Date.now()}`,
          name: 'newsData',
          parts: [{ kind: 'data', data: newsResult.data }]
        });
        break;

      case 'weather':
        const location = command.location || process.env.DEFAULT_LOCATION || 'Lagos';
        const weatherResult = await briefGenerator.generateWeatherOnly(location);
        responseText = weatherResult.text;
        artifacts.push({
          artifactId: `weather-${Date.now()}`,
          name: 'weatherData',
          parts: [{ kind: 'data', data: weatherResult.data }]
        });
        break;

      case 'brief':
      default:
        responseText = await briefGenerator.generateBrief(
          command.timeOfDay || 'morning'
        );
        break;
    }

    // Build history
    const history = [
      userMsg.fullMessage,
      {
        messageId: `msg-${Date.now()}`,
        role: 'agent',
        parts: [{ kind: 'text', text: responseText }],
        kind: 'message',
        taskId: userMsg.taskId || `task-${Date.now()}`
      }
    ];

    console.log('✅ Response generated successfully');
    return c.json(createA2AResponse(requestId, responseText, artifacts, history));

  } catch (error) {
    console.error('❌ Agent error:', error);
    return c.json(
      createA2AError(requestId, -32603, 'Internal error', error.message), 
      500
    );
  }
}