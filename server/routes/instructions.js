const express = require('express');
const router = express.Router();
const GoogleApiService = require('../services/googleApiService');
const { validateInstructionRequest, validateApiKey, sanitizeInput } = require('../middleware/validation');
const config = require('../config');

// Initialize Google API service
const googleApiService = new GoogleApiService();

/**
 * @swagger
 * /api/process-instruction:
 *   post:
 *     summary: Process user input and return mapped instruction
 *     description: |
 *       Processes natural language input (voice or text) and returns a structured instruction
 *       with action, route, and parameters using Google Cloud Vertex AI function-calling.
 *       
 *       The API supports multiple languages and can handle various types of instructions:
 *       - Navigation commands (go to home, about, contact)
 *       - Input mode toggles (switch to voice/text mode)
 *       - System commands (clear input, show help)
 *       - Data entry (set quantity, open inventory)
 *       
 *       The response includes the processed instruction with action details and parameters.
 *     tags:
 *       - Instructions
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InstructionRequest'
 *           examples:
 *             navigation:
 *               summary: Navigation instruction
 *               value:
 *                 text: "go to home page"
 *                 language: "en"
 *             voice_toggle:
 *               summary: Voice input toggle
 *               value:
 *                 text: "switch to voice mode"
 *                 language: "en"
 *             quantity_entry:
 *               summary: Quantity entry
 *               value:
 *                 text: "set quantity to twenty five"
 *                 language: "en"
 *             spanish_navigation:
 *               summary: Spanish navigation
 *               value:
 *                 text: "ir a la página de contacto"
 *                 language: "es"
 *     responses:
 *       200:
 *         description: Instruction processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InstructionResponse'
 *             examples:
 *               navigation_success:
 *                 summary: Navigation instruction response
 *                 value:
 *                   success: true
 *                   data:
 *                     instruction: "Navigate to home page"
 *                     action: "navigate"
 *                     route: "/home"
 *                     parameters: {}
 *                     success: true
 *                   message: "Instruction processed successfully"
 *               quantity_success:
 *                 summary: Quantity entry response
 *                 value:
 *                   success: true
 *                   data:
 *                     instruction: "Enter quantity value"
 *                     action: "enter_quantity"
 *                     route: "/home"
 *                     parameters:
 *                       quantity: 25
 *                     success: true
 *                   message: "Instruction processed successfully"
 *       400:
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Invalid request"
 *               message: "Text field is required and must be a string"
 *       401:
 *         description: Unauthorized - API key required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Unauthorized"
 *               message: "API key is required"
 *       429:
 *         description: Too many requests - Rate limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Too many requests"
 *               message: "Rate limit exceeded. Please try again later."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Internal server error"
 *               message: "Failed to process instruction"
 *               data:
 *                 instruction: "Error occurred while processing request"
 *                 action: "show_error"
 *                 route: "/home"
 *                 parameters:
 *                   error: "An error occurred while processing your request. Please try again."
 *                 success: false
 */
router.post('/process-instruction', 
  validateApiKey,
  sanitizeInput,
  validateInstructionRequest,
  async (req, res) => {
    try {
      const { text, language } = req.body;
      
      console.log(`Processing instruction: "${text}" in language: ${language}`);
      
      // Process the instruction using Google Cloud API
      const instruction = await googleApiService.processInstruction(text, language);
      
      console.log('Instruction processed:', instruction);
      
      res.json({
        success: true,
        data: instruction,
        message: 'Instruction processed successfully'
      });
      
    } catch (error) {
      console.error('Error processing instruction:', error);
      
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to process instruction',
        data: {
          instruction: 'Error occurred while processing request',
          action: 'show_error',
          route: '/home',
          parameters: {
            error: 'An error occurred while processing your request. Please try again.'
          },
          success: false
        }
      });
    }
  }
);

/**
 * @swagger
 * /api/instructions:
 *   get:
 *     summary: Get list of available instructions
 *     description: |
 *       Returns a comprehensive list of all available instructions that the system can process.
 *       Each instruction includes its name, description, and parameter schema.
 *       
 *       This endpoint is useful for:
 *       - Understanding what instructions are supported
 *       - Building client-side validation
 *       - Generating help documentation
 *       - Testing instruction capabilities
 *     tags:
 *       - Instructions
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Available instructions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AvailableInstruction'
 *                 message:
 *                   type: string
 *                   example: "Available instructions retrieved successfully"
 *             examples:
 *               instructions_list:
 *                 summary: List of available instructions
 *                 value:
 *                   success: true
 *                   data: [
 *                     {
 *                       name: "navigate_home",
 *                       description: "Navigate to the home page",
 *                       parameters: {
 *                         type: "object",
 *                         properties: {},
 *                         required: []
 *                       }
 *                     },
 *                     {
 *                       name: "enter_quantity",
 *                       description: "Enter a specific quantity value",
 *                       parameters: {
 *                         type: "object",
 *                         properties: {
 *                           quantity: {
 *                             type: "number",
 *                             description: "The quantity value to enter"
 *                           }
 *                         },
 *                         required: ["quantity"]
 *                       }
 *                     }
 *                   ]
 *                   message: "Available instructions retrieved successfully"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Internal server error"
 *               message: "Failed to retrieve instructions"
 */
router.get('/instructions', (req, res) => {
  try {
    const instructions = config.instructions.map(instruction => ({
      name: instruction.name,
      description: instruction.description,
      parameters: instruction.parameters
    }));
    
    res.json({
      success: true,
      data: instructions,
      message: 'Available instructions retrieved successfully'
    });
    
  } catch (error) {
    console.error('Error retrieving instructions:', error);
    
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to retrieve instructions'
    });
  }
});

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     description: |
 *       Returns the current health status of the server and basic system information.
 *       This endpoint is useful for:
 *       - Monitoring system health
 *       - Load balancer health checks
 *       - Deployment verification
 *       - System status monitoring
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *             example:
 *               success: true
 *               message: "Server is running"
 *               timestamp: "2024-01-15T10:30:00.000Z"
 *               version: "1.0.0"
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

module.exports = router; 