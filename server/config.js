// Server Configuration
const config = {
  // Vertex AI Configuration
  vertexAI: {
    projectId: process.env.GOOGLE_CLOUD_PROJECT || 'gen-lang-client-0695988883',
    location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
    model: process.env.VERTEX_AI_MODEL || 'gemini-2.0-flash-001'
  },
  
  // Server Configuration
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // CORS Configuration
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  
  // Rate Limiting
  rateLimitWindowMs: 900000, // 15 minutes
  rateLimitMaxRequests: 100,
  
  // Available Instructions Schema
  instructions: [
    {
      name: 'navigate_home',
      description: 'Navigate to the home page',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    },
    {
      name: 'navigate_about',
      description: 'Navigate to the about page',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    },
    {
      name: 'navigate_contact',
      description: 'Navigate to the contact page',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    },
    {
      name: 'toggle_voice_input',
      description: 'Switch to voice input mode',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    },
    {
      name: 'toggle_text_input',
      description: 'Switch to text input mode',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    },
    {
      name: 'clear_input',
      description: 'Clear current input and reset state',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    },
    {
      name: 'show_help',
      description: 'Show available commands and features',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    },
    {
      name: 'enter_quantity',
      description: 'Enter a specific quantity value',
      parameters: {
        type: 'object',
        properties: {
          quantity: {
            type: 'number',
            description: 'The quantity value to enter'
          }
        },
        required: ['quantity']
      }
    },
    {
      name: 'open_inventory',
      description: 'Open the inventory or product list',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    },
    {
      name: 'go_back',
      description: 'Navigate back to the previous page',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    },
    {
      name: 'open_settings',
      description: 'Open settings or configuration page',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    },
    {
      name: 'open_cart',
      description: 'Open shopping cart or basket',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  ]
};

module.exports = config; 