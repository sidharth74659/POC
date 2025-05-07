/**
 * Mock Chat Provider (MCP) configuration
 * This module provides configuration for the MCP integration
 */

const mcpConfig = {
  // Base URL for the MCP API
  baseUrl: process.env.MCP_BASE_URL || 'https://api.mcp-provider.com/v1',
  
  // API key for authentication (would be stored in environment variables in production)
  apiKey: process.env.MCP_API_KEY || 'mock-api-key',
  
  // API key for OpenAI
  // openaiApiKey: process.env.OPENAI_API_KEY || 'sk-openai-mock-key-for-development',
  openaiApiKey: process.env.OPENAI_API_KEY || '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',
  
  // Default timeout for MCP API requests in milliseconds
  timeout: process.env.MCP_TIMEOUT || 30000,
  
  // Maximum tokens to generate in the response
  maxTokens: process.env.MCP_MAX_TOKENS || 500,
  
  // Whether to use mock responses for local development
  useMockResponses: process.env.USE_MOCK_RESPONSES === 'true' || true,
  
  // Default model to use for chat completions
  model: process.env.MCP_MODEL || 'gpt-4',
  
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