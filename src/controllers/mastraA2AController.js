// src/controllers/mastraA2AController.js
import { mastra } from '../mastra.js';

export async function handleMastraA2ARequest(c) {
  let body;
  
  try {
    body = await c.req.json();
    console.log('📨 Received Mastra A2A request');
  } catch (error) {
    console.error('❌ JSON parse error:', error.message);
    return c.json({
      jsonrpc: '2.0',
      id: null,
      error: {
        code: -32700,
        message: 'Parse error'
      }
    }, 400);
  }

  // Validate JSON-RPC 2.0
  if (body.jsonrpc !== '2.0') {
    return c.json({
      jsonrpc: '2.0',
      id: body.id || null,
      error: {
        code: -32600,
        message: 'Invalid Request: jsonrpc must be "2.0"'
      }
    }, 400);
  }

  if (!body.id) {
    return c.json({
      jsonrpc: '2.0',
      id: null,
      error: {
        code: -32600,
        message: 'Invalid Request: id is required'
      }
    }, 400);
  }

  const requestId = body.id;
  const { params } = body;

  try {
    // Extract message from params
    const message = params?.message;
    if (!message) {
      return c.json({
        jsonrpc: '2.0',
        id: requestId,
        error: {
          code: -32602,
          message: 'Invalid params: message is required'
        }
      }, 400);
    }

    // Extract user message text
    const textPart = message.parts?.find(p => p.kind === 'text');
    const userText = textPart?.text || '';
    
    console.log(`💬 User message: "${userText}"`);

    // Get the agent
    const agent = mastra.getAgent('dailyPulseAgent');
    if (!agent) {
      return c.json({
        jsonrpc: '2.0',
        id: requestId,
        error: {
          code: -32602,
          message: 'Agent not found'
        }
      }, 404);
    }

    // Prepare messages for Mastra
    const mastraMessages = [
      {
        role: 'user',
        content: userText
      }
    ];

    // Execute agent
    console.log('🤖 Executing Mastra agent...');
    const response = await agent.generate(mastraMessages);
    const agentText = response.text || '';
    
    console.log('✅ Agent response generated');

    // Build artifacts
    const artifacts = [
      {
        artifactId: `artifact-${Date.now()}`,
        name: 'dailyPulseResponse',
        parts: [{ kind: 'text', text: agentText }]
      }
    ];

    // Add tool results as artifacts if available
    if (response.toolResults && response.toolResults.length > 0) {
      artifacts.push({
        artifactId: `tools-${Date.now()}`,
        name: 'toolResults',
        parts: response.toolResults.map(result => ({
          kind: 'data',
          data: result
        }))
      });
    }

    // Build history
    const taskId = message.taskId || `task-${Date.now()}`;
    const contextId = params.contextId || `ctx-${Date.now()}`;
    
    const history = [
      message,
      {
        messageId: `msg-${Date.now()}`,
        role: 'agent',
        parts: [{ kind: 'text', text: agentText }],
        kind: 'message',
        taskId: taskId
      }
    ];

    // Return A2A response
    const a2aResponse = {
      jsonrpc: '2.0',
      id: requestId,
      result: {
        id: taskId,
        contextId: contextId,
        status: {
          state: 'completed',
          timestamp: new Date().toISOString(),
          message: {
            messageId: `msg-${Date.now()}`,
            role: 'agent',
            parts: [{ kind: 'text', text: agentText }],
            kind: 'message'
          }
        },
        artifacts: artifacts,
        history: history,
        kind: 'task'
      }
    };

    return c.json(a2aResponse);

  } catch (error) {
    console.error('❌ Mastra agent error:', error);
    return c.json({
      jsonrpc: '2.0',
      id: requestId,
      error: {
        code: -32603,
        message: 'Internal error',
        data: { details: error.message }
      }
    }, 500);
  }
}