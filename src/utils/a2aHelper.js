// src/utils/a2aHelper.js

export function createA2AResponse(requestId, responseText, artifacts = [], history = []) {
  const taskId = `task-${Date.now()}`;
  const contextId = `ctx-${Date.now()}`;
  const messageId = `msg-${Date.now()}`;

  return {
    jsonrpc: '2.0',
    id: requestId,
    result: {
      id: taskId,
      contextId: contextId,
      status: {
        state: 'completed',
        timestamp: new Date().toISOString(),
        message: {
          messageId: messageId,
          role: 'agent',
          parts: [{ kind: 'text', text: responseText }],
          kind: 'message'
        }
      },
      artifacts: artifacts,
      history: history,
      kind: 'task'
    }
  };
}

export function createA2AError(requestId, code, message, details = null) {
  return {
    jsonrpc: '2.0',
    id: requestId || null,
    error: {
      code: code,
      message: message,
      data: details ? { details } : undefined
    }
  };
}

export function extractUserMessage(params) {
  const message = params?.message;
  if (!message) {
    return null;
  }

  const textPart = message.parts?.find(p => p.kind === 'text');
  return {
    text: textPart?.text?.trim() || '',
    messageId: message.messageId,
    taskId: message.taskId,
    fullMessage: message
  };
}

export function parseCommand(text) {
  const lowerText = text.toLowerCase();

  if (lowerText.includes('help')) {
    return { type: 'help' };
  }

  if (lowerText.includes('news')) {
    return { type: 'news' };
  }

  if (lowerText.includes('weather')) {
    // Extract location if specified
    const locationMatch = text.match(/weather\s+(?:in|for)?\s*(.+)/i);
    const location = locationMatch ? locationMatch[1].trim() : null;
    return { type: 'weather', location };
  }

  if (lowerText.includes('evening')) {
    return { type: 'brief', timeOfDay: 'evening' };
  }

  if (lowerText.includes('brief') || lowerText.includes('morning')) {
    return { type: 'brief', timeOfDay: 'morning' };
  }

  // Default to brief
  return { type: 'brief', timeOfDay: 'morning' };
}