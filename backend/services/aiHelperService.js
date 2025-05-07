/**
 * AI Helper Service
 * Provides common utilities for AI processing and LLM interaction
 */
const OpenAI = require('openai');
const config = require('../config/mcp');
const toolsWrapper = require('../openai-tools/tools-wrapper');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || config.openaiApiKey
});

/**
 * Process a user question and generate a response using tools and LLM
 * @param {string} question - The user's question
 * @param {Object} options - Optional configuration
 * @param {Array} options.tools - OpenAI tools to use (defaults to system tools)
 * @param {string} options.model - LLM model to use (defaults to gpt-4o)
 * @param {boolean} options.useDirectToolCalls - Whether to use the direct tool calls implementation
 * @returns {Promise<Object>} - The generated response
 */
async function processQuestion(question, options = {}) {
  try {
    // If direct tool calls are requested, use the tools wrapper
    if (options.useDirectToolCalls || process.env.USE_DIRECT_TOOL_CALLS === 'true') {
      return await toolsWrapper.processQuery(question);
    }
    
    // Default options
    const toolsToUse = options.tools || [];
    const modelToUse = options.model || 'gpt-4o';
    
    // System prompt that helps guide the LLM
    const systemPrompt = `
      You are a specialized resource scheduling assistant for operations management.
      Your primary role is to:
      1. Answer user queries accurately based on the provided context about resources and operations
      2. Intelligently select and invoke appropriate tools to gather required information
      3. Present responses in a concise, relevant format that directly addresses the user's intent
      
      When analyzing user queries:
      - Extract key entities like resourceId, operationId, date ranges, and equipment needs
      - Use the appropriate tools to fetch only the necessary data
      - Structure your answers to match the question's context and goal
      
      Remember to:
      - Minimize unnecessary API calls by using filters and select parameters effectively
      - Format dates appropriately when querying date ranges
      - Only include relevant information in your responses
      - When dates are mentioned without specifics (like "next week"), calculate the appropriate date range
      
      Today is ${new Date().toISOString().split('T')[0]}
    `;
    
    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: modelToUse,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question }
      ],
      tools: toolsToUse,
      tool_choice: toolsToUse.length > 0 ? 'auto' : 'none'
    });
    
    // If there are tool calls to be made, process them
    if (response.choices[0].message.tool_calls && response.choices[0].message.tool_calls.length > 0) {
      // This would be implemented to handle the tool calls and continue the conversation
      // For simplicity, we're returning a placeholder response indicating tools would be used
      return {
        success: true,
        answer: "I would need to use specialized tools to answer this question accurately. Please use the OpenAI tools integration for a complete response.",
        toolCalls: response.choices[0].message.tool_calls
      };
    }
    
    // Return the generated response
    return {
      success: true,
      answer: response.choices[0].message.content,
      toolCalls: null
    };
  } catch (error) {
    console.error('Error in AI helper service:', error);
    return {
      success: false,
      answer: "I'm sorry, I encountered an error processing your question.",
      error: error.message
    };
  }
}

/**
 * Process a complete conversation with tool usage
 * This is for more complex interactions that require multiple tool calls
 * @param {Array} messages - The conversation messages
 * @param {Object} options - Optional configuration
 * @returns {Promise<Object>} - The generated response
 */
async function processConversation(messages, options = {}) {
  try {
    // If direct tool calls are requested and there's only one user message, use the tools wrapper
    if ((options.useDirectToolCalls || process.env.USE_DIRECT_TOOL_CALLS === 'true') && 
        messages.length === 1 && messages[0].role === 'user') {
      return await toolsWrapper.processQuery(messages[0].content);
    }
    
    // This would implement a full conversation loop with tool handling
    // For now, we'll return a simple response
    return {
      success: true,
      answer: "This function would process a complete conversation with tool usage.",
      implementationStatus: "Placeholder"
    };
  } catch (error) {
    console.error('Error in AI conversation processing:', error);
    return {
      success: false,
      answer: "I'm sorry, I encountered an error processing the conversation.",
      error: error.message
    };
  }
}

module.exports = {
  processQuestion,
  processConversation
}; 