const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Smart Scheduler API',
      version: '1.0.0',
      description: 'API documentation for Smart Scheduler with MCP integration',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      schemas: {
        Resource: {
          type: 'object',
          required: ['resourceId', 'resourceName'],
          properties: {
            resourceId: {
              type: 'string',
              description: 'Unique identifier for the resource'
            },
            resourceName: {
              type: 'string',
              description: 'Name of the resource'
            },
            skillSet: {
              type: 'string',
              description: 'Comma-separated list of skills'
            },
            role: {
              type: 'string',
              description: 'Role of the resource'
            }
          },
          example: {
            resourceId: 'res-001',
            resourceName: 'John Smith',
            skillSet: 'electrical,mechanical,diagnostics',
            role: 'Senior Technician'
          }
        },
        Operation: {
          type: 'object',
          required: ['operationId', 'operationName', 'resourceId'],
          properties: {
            operationId: {
              type: 'string',
              description: 'Unique identifier for the operation'
            },
            operationName: {
              type: 'string',
              description: 'Name of the operation'
            },
            equipment: {
              type: 'string',
              description: 'Equipment used in the operation'
            },
            workOrderNumber: {
              type: 'string',
              description: 'Work order number'
            },
            workOrderId: {
              type: 'string',
              description: 'Work order identifier'
            },
            resourceId: {
              type: 'string',
              description: 'Resource identifier'
            },
            startDate: {
              type: 'string',
              format: 'date-time',
              description: 'Start date and time of the operation'
            },
            endDate: {
              type: 'string',
              format: 'date-time',
              description: 'End date and time of the operation'
            },
            notes: {
              type: 'string',
              description: 'Additional notes about the operation'
            }
          },
          example: {
            operationId: 'op-001',
            operationName: 'Repair Conveyor Belt',
            equipment: 'Conveyor System A',
            workOrderNumber: 'WO-1234',
            workOrderId: 'wo-1234',
            resourceId: 'res-001',
            startDate: '2023-07-15T09:00:00Z',
            endDate: '2023-07-15T11:30:00Z',
            notes: 'Fix mechanical issue with conveyor belt in production line 3'
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            Response: {
              type: 'object',
              properties: {
                items: {
                  type: 'array',
                  description: 'Array of items in the response'
                },
                totalCount: {
                  type: 'integer',
                  description: 'Total count of all matching items'
                }
              }
            },
            Success: {
              type: 'boolean',
              description: 'Whether the request was successful'
            },
            ErrorMessage: {
              type: 'string',
              nullable: true,
              description: 'Error message if the request was not successful'
            }
          }
        },
        ChatRequest: {
          type: 'object',
          required: ['userId', 'resourceContext', 'question'],
          properties: {
            userId: {
              type: 'string',
              description: 'User identifier'
            },
            resourceContext: {
              type: 'object',
              description: 'Context information about the resource'
            },
            question: {
              type: 'string',
              description: 'Question to ask the AI'
            }
          },
          example: {
            userId: 'user-001',
            resourceContext: { 
              operationId: 'op-456', 
              resourceId: '123' 
            },
            question: 'What operations are assigned next week?'
          }
        },
        ChatResponse: {
          type: 'object',
          properties: {
            Response: {
              type: 'object',
              properties: {
                answer: {
                  type: 'string',
                  description: 'Answer from the AI'
                },
                followUps: {
                  type: 'array',
                  items: {
                    type: 'string'
                  },
                  description: 'Follow-up questions suggested by the AI'
                }
              }
            },
            Success: {
              type: 'boolean',
              description: 'Whether the request was successful'
            },
            ErrorMessage: {
              type: 'string',
              nullable: true,
              description: 'Error message if the request was not successful'
            }
          },
          example: {
            Response: {
              answer: 'You have one operation next week: Inspect Pump on May 5 from 8 AM to 12 PM.',
              followUps: [
                'Show me equipment maintenance history',
                'When is my next inspection?'
              ]
            },
            Success: true,
            ErrorMessage: null
          }
        }
      }
    }
  },
  apis: ['./backend/routes/*.js'], // Path to API route files
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi }; 