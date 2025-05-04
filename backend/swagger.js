const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Smart Scheduler API',
      version: '1.0.0',
      description: 'API for managing resources and operations in the Smart Scheduler application',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Resource: {
          type: 'object',
          required: ['id', 'name', 'role', 'skillSet', 'availability'],
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            role: { type: 'string' },
            skillSet: { 
              type: 'array',
              items: { type: 'string' } 
            },
            availability: {
              type: 'object',
              properties: {
                status: { type: 'string', enum: ['available', 'busy', 'unavailable'] },
                nextAvailable: { type: 'string', format: 'date-time', nullable: true }
              }
            },
            location: { type: 'string' },
            contact: { 
              type: 'object',
              properties: {
                email: { type: 'string', format: 'email' },
                phone: { type: 'string' }
              }
            }
          }
        },
        Operation: {
          type: 'object',
          required: ['id', 'resourceId', 'title', 'startTime', 'endTime'],
          properties: {
            id: { type: 'string' },
            resourceId: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            startTime: { type: 'string', format: 'date-time' },
            endTime: { type: 'string', format: 'date-time' },
            equipment: { 
              type: 'array',
              items: { type: 'string' } 
            },
            location: { type: 'string' },
            status: { type: 'string', enum: ['scheduled', 'inProgress', 'completed', 'cancelled'] },
            priority: { type: 'string', enum: ['low', 'medium', 'high'] }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' },
            message: { type: 'string' }
          }
        },
        ChatRequest: {
          type: 'object',
          required: ['userId', 'resourceId', 'question'],
          properties: {
            userId: { type: 'string' },
            resourceId: { type: 'string' },
            question: { type: 'string' }
          }
        },
        ChatResponse: {
          type: 'object',
          properties: {
            answer: { type: 'string' },
            followUps: { 
              type: 'array',
              items: { type: 'string' } 
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'], // Path to the API routes files
};

const specs = swaggerJsdoc(options);
module.exports = specs; 