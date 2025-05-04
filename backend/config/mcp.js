/**
 * Mock Chat Provider (MCP) configuration
 * This module provides configuration for the MCP integration
 */

const mcpConfig = {
  // Base URL for the MCP API
  baseUrl: process.env.MCP_BASE_URL || 'https://api.mcp-provider.com/v1',
  
  // API key for authentication (would be stored in environment variables in production)
  apiKey: process.env.MCP_API_KEY || 'mock-api-key',
  
  // Default timeout for MCP API requests in milliseconds
  timeout: 10000,
  
  // Maximum tokens to generate in the response
  maxTokens: 200,
  
  // Whether to use mock responses for local development
  useMockResponses: process.env.USE_MOCK_RESPONSES === 'true' || true,
  
  // Default model to use for chat completions
  model: process.env.MCP_MODEL || 'mcp-20.x-scheduler',
  
  // Function to generate system prompt with context
  generateSystemPrompt: (resourceData, operationsData) => {
    return `You are a Smart Scheduler assistant that helps with resource scheduling.
You have information about the following resource:
${JSON.stringify(resourceData, null, 2)}

And their operations:
${JSON.stringify(operationsData, null, 2)}

Answer questions about this resource, their availability, operations, and suggest scheduling options.
Be concise and helpful. If you don't know something, say so.`;
  }
};

module.exports = mcpConfig; 