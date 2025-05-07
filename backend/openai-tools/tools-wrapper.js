/**
 * CommonJS wrapper for the OpenAI tools
 * This allows using the ESM tools in a CommonJS environment
 */
const { execSync } = require('child_process');
const path = require('path');

/**
 * Process a query using the OpenAI tools framework directly
 * @param {string} query - The user's question
 * @returns {Promise<Object>} - The processed result
 */
function processQuery(query) {
  try {
    // Sanitize the query for shell execution
    const sanitizedQuery = query.replace(/"/g, '\\"').replace(/\$/g, '\\$');
    
    // Run the OpenAI tools main script with the query
    const result = execSync(`node ${path.join(__dirname, 'openai-main.js')} "${sanitizedQuery}"`, {
      encoding: 'utf8'
    });
    
    // Parse the answer from the result
    const answerMatch = result.match(/Answer: ([\s\S]+)/);
    const answer = answerMatch ? answerMatch[1].trim() : 'Unable to process query';
    
    return {
      success: true,
      answer
    };
  } catch (error) {
    console.error('Error processing query with OpenAI tools:', error);
    return {
      success: false,
      answer: 'Error processing your query. Please try again later.',
      error: error.message
    };
  }
}

module.exports = {
  processQuery
}; 