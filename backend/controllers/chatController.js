/**
 * Chat Controller
 * Handles requests related to AI chat functionality
 */
const mcpService = require('../services/mcpService');
const aiHelperService = require('../services/aiHelperService');
const resourceModel = require('../models/resourceModel');
const operationModel = require('../models/operationModel');
const { getResourcesDataToolConfig, getResourceByIdToolConfig } = require('../openai-tools/tools/resourceTools');
const { getOperationsDataToolConfig, getOperationByIdToolConfig } = require('../openai-tools/tools/operationTools');

/**
 * Process a chat request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const processChat = async (req, res, next) => {
  try {
    const { question, resourceId } = req.body;

    // Validate request
    if (!question) {
      return res.status(400).json({
        success: false,
        message: 'Missing required field: question is required'
      });
    }

    // If new AI helper is enabled, use it instead of legacy MCP service
    if (process.env.USE_NEW_AI_HELPER === 'true') {
      // Configure available tools
      const availableTools = [
        getResourcesDataToolConfig,
        getResourceByIdToolConfig,
        getOperationsDataToolConfig,
        getOperationByIdToolConfig
      ];
      
      // Process the question using the AI Helper Service
      const result = await aiHelperService.processQuestion(question, {
        tools: availableTools,
        model: 'gpt-4o'
      });
      
      return res.status(200).json({
        success: true,
        data: {
          answer: result.answer,
          followUps: [] // Can be enhanced to generate follow-up questions
        }
      });
    } 
    // Fallback to legacy MCP service if resourceId is provided
    else if (resourceId) {
      // Get resource data
      const resourceResult = await resourceModel.getResourceById(resourceId);
      if (!resourceResult.Success) {
        return res.status(400).json({
          success: false,
          message: `Resource with ID ${resourceId} not found`
        });
      }
      
      // Get operations data for the resource
      const operationsResult = await operationModel.getOperations({ filter: { resourceId } });
      
      // Generate answer using MCP service
      const result = await mcpService.generateAnswer(
        resourceResult.Response, 
        operationsResult.Response.items, 
        question
      );
      
      return res.status(200).json({
        success: true,
        data: result
      });
    }
    else {
      return res.status(400).json({
        success: false,
        message: 'When not using the new AI helper, resourceId is required'
      });
    }
  } catch (error) {
    console.error('Error processing chat:', error);
    
    // Determine if error is related to the AI services
    if (error.message.includes('MCP service') || error.message.includes('AI helper')) {
      return res.status(502).json({
        success: false,
        message: 'AI service temporarily unavailable'
      });
    }
    
    // Pass other errors to the global error handler
    next(error);
  }
};

/**
 * Process a direct question using OpenAI tools
 * This endpoint doesn't require a resourceId and uses the tools directly
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const processDirectQuestion = async (req, res, next) => {
  try {
    const { question } = req.body;

    // Validate request
    if (!question) {
      return res.status(400).json({
        success: false,
        message: 'Missing required field: question is required'
      });
    }
    
    // Configure available tools
    const availableTools = [
      getResourcesDataToolConfig,
      getResourceByIdToolConfig,
      getOperationsDataToolConfig,
      getOperationByIdToolConfig
    ];
    
    // Process the question using the AI Helper Service
    const result = await aiHelperService.processQuestion(question, {
      tools: availableTools,
      model: 'gpt-4o'
    });
    
    return res.status(200).json({
      success: true,
      data: {
        answer: result.answer,
        followUps: [] // Can be enhanced to generate follow-up questions
      }
    });
  } catch (error) {
    console.error('Error processing direct question:', error);
    next(error);
  }
};

module.exports = {
  processChat,
  processDirectQuestion
}; 