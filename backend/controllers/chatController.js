/**
 * Chat Controller
 * Handles requests related to AI chat functionality
 */
const mcpService = require('../services/mcpService');
const resourceModel = require('../models/resourceModel');
const operationModel = require('../models/operationModel');

/**
 * Process a chat request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const processChat = async (req, res, next) => {
  try {
    const { userId, resourceId, question } = req.body;

    // Validate request
    if (!userId || !resourceId || !question) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, resourceId, and question are required'
      });
    }

    // Get resource data
    const resource = await resourceModel.getResourceById(resourceId);
    if (!resource) {
      return res.status(400).json({
        success: false,
        message: `Resource with ID ${resourceId} not found`
      });
    }

    // Get operations data for the resource
    const operations = await operationModel.getOperations({ resourceId });

    // Generate answer using MCP service
    const result = await mcpService.generateAnswer(resource, operations, question);

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error processing chat:', error);
    
    // Determine if error is related to the MCP service
    if (error.message.includes('MCP service')) {
      return res.status(502).json({
        success: false,
        message: 'AI service temporarily unavailable'
      });
    }
    
    // Pass other errors to the global error handler
    next(error);
  }
};

module.exports = {
  processChat
}; 