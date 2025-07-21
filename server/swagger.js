const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Voice AI Instruction Mapping API',
      version: '1.0.0',
      description: 'A comprehensive API for processing voice and text instructions using Google Cloud Vertex AI function-calling capabilities. This API allows clients to send natural language instructions and receive structured responses with actions and parameters.',
      contact: {
        name: 'API Support',
        email: 'support@voice-ai-app.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server'
      },
      {
        url: 'https://api.voice-ai-app.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
          description: 'API key for authentication'
        }
      },
      schemas: {
        InstructionRequest: {
          type: 'object',
          required: ['text'],
          properties: {
            text: {
              type: 'string',
              description: 'The user input text or voice transcription',
              example: 'go to home page',
              minLength: 1,
              maxLength: 1000
            },
            language: {
              type: 'string',
              description: 'Language code for processing (default: en)',
              example: 'en',
              default: 'en',
              enum: ['en', 'es', 'fr', 'de', 'it', 'pt', 'ja', 'ko', 'zh']
            }
          }
        },
        InstructionResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Whether the instruction was processed successfully',
              example: true
            },
            data: {
              $ref: '#/components/schemas/Instruction'
            },
            message: {
              type: 'string',
              description: 'Human-readable message about the processing result',
              example: 'Instruction processed successfully'
            }
          }
        },
        Instruction: {
          type: 'object',
          properties: {
            instruction: {
              type: 'string',
              description: 'The processed instruction text',
              example: 'Navigate to home page'
            },
            action: {
              type: 'string',
              description: 'The action to be performed',
              example: 'navigate',
              enum: ['navigate', 'toggle_input', 'clear_input', 'show_help', 'show_error', 'enter_quantity', 'open_inventory', 'go_back', 'open_settings', 'open_cart']
            },
            route: {
              type: 'string',
              description: 'The route to navigate to (for navigation actions)',
              example: '/home',
              enum: ['/home', '/about', '/contact']
            },
            parameters: {
              type: 'object',
              description: 'Additional parameters for the action',
              example: {
                quantity: 25,
                mode: 'voice'
              }
            },
            success: {
              type: 'boolean',
              description: 'Whether the instruction was successfully processed',
              example: true
            }
          }
        },
        AvailableInstruction: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'The instruction name',
              example: 'navigate_home'
            },
            description: {
              type: 'string',
              description: 'Description of what the instruction does',
              example: 'Navigate to the home page'
            },
            parameters: {
              type: 'object',
              description: 'JSON schema for the instruction parameters',
              properties: {
                type: {
                  type: 'string',
                  example: 'object'
                },
                properties: {
                  type: 'object',
                  description: 'Parameter properties'
                },
                required: {
                  type: 'array',
                  items: {
                    type: 'string'
                  },
                  description: 'Required parameter names'
                }
              }
            }
          }
        },
        HealthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Whether the server is healthy',
              example: true
            },
            message: {
              type: 'string',
              description: 'Health status message',
              example: 'Server is running'
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Current server timestamp',
              example: '2024-01-15T10:30:00.000Z'
            },
            version: {
              type: 'string',
              description: 'API version',
              example: '1.0.0'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              description: 'Error type',
              example: 'Invalid request'
            },
            message: {
              type: 'string',
              description: 'Human-readable error message',
              example: 'Text field is required and must be a string'
            },
            data: {
              $ref: '#/components/schemas/Instruction'
            }
          }
        }
      }
    },
    security: [
      {
        ApiKeyAuth: []
      }
    ]
  },
  apis: ['./routes/*.js', './server.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs; 