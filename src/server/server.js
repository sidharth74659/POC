const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock MCP service - In a real app, this would connect to OpenAI or another LLM provider
class MCPService {
  constructor() {
    this.contextCache = new Map();
  }

  // Get context for a resource
  async getResourceContext(resourceId) {
    try {
      // Read operations data from the JSON file
      const operationsData = JSON.parse(
        await fs.readFile(path.join(__dirname, 'data/operations.json'), 'utf8')
      );
      
      // Filter operations for the specific resource
      const resourceOperations = operationsData.filter(
        op => op.resourceId === resourceId
      );
      
      return {
        operations: resourceOperations,
        count: resourceOperations.length
      };
    } catch (error) {
      console.error('Error getting resource context:', error);
      return { operations: [], count: 0 };
    }
  }

  // Process a question with context
  async processQuestion(userId, resourceContext, question) {
    try {
      // In a real implementation, this would call the OpenAI API
      // For this POC, we'll use mock responses
      
      // Parse resourceContext if it's a string
      let parsedContext = resourceContext;
      if (typeof resourceContext === 'string') {
        try {
          parsedContext = JSON.parse(resourceContext);
        } catch (e) {
          console.error('Error parsing resource context:', e);
        }
      }
      
      // Get additional context from the operations data
      const resourceId = parsedContext.id;
      const context = await this.getResourceContext(resourceId);
      
      // Create a mock response based on the context and question
      const answer = this.generateMockAnswer(parsedContext, context, question);
      const followUpQuestions = this.generateMockFollowUps(parsedContext, context);
      
      return {
        answer,
        followUpQuestions
      };
    } catch (error) {
      console.error('Error processing question:', error);
      return {
        answer: 'Sorry, I encountered an error processing your request.',
        followUpQuestions: []
      };
    }
  }
  
  // Generate a mock answer based on context
  generateMockAnswer(resource, context, question) {
    const questionLower = question.toLowerCase();
    
    if (questionLower.includes('available') || questionLower.includes('free')) {
      if (resource.availability === 'available') {
        return `${resource.name} is currently available. They have ${context.count} scheduled operations.`;
      } else if (resource.availability === 'busy') {
        return `${resource.name} is currently busy with an operation. They have ${context.count} total scheduled operations.`;
      } else {
        return `${resource.name} is currently unavailable. They have ${context.count} scheduled operations when they return.`;
      }
    }
    
    if (questionLower.includes('skill') || questionLower.includes('expertise')) {
      return `${resource.name} has expertise in ${resource.skillSet.join(', ')}.`;
    }
    
    if (questionLower.includes('operation') || questionLower.includes('schedule')) {
      if (context.count === 0) {
        return `${resource.name} doesn't have any scheduled operations at the moment.`;
      } else {
        const nextOp = context.operations[0];
        return `${resource.name} has ${context.count} operations scheduled. The next one is "${nextOp.title}" on ${new Date(nextOp.startDate).toLocaleDateString()}.`;
      }
    }
    
    // Default response
    return `${resource.name} is a ${resource.role} located in ${resource.location}. They have ${context.count} operations scheduled.`;
  }
  
  // Generate mock follow-up questions
  generateMockFollowUps(resource, context) {
    const followUps = [
      `What skills does ${resource.name} have?`,
      `When is ${resource.name} available next?`
    ];
    
    if (context.count > 0) {
      followUps.push(`What operations is ${resource.name} scheduled for?`);
    }
    
    return followUps;
  }
}

// Initialize MCP Service
const mcpService = new MCPService();

// API Routes
// GET /resources - List human resources with filters
app.get('/resources', async (req, res) => {
  try {
    // Read resources data from the JSON file
    const resources = JSON.parse(
      await fs.readFile(path.join(__dirname, 'data/resources.json'), 'utf8')
    );
    
    // Apply filters (if any)
    const { skillSet, role, name } = req.query;
    
    let filteredResources = [...resources];
    
    if (name) {
      filteredResources = filteredResources.filter(item => 
        item.name.toLowerCase().includes(name.toLowerCase())
      );
    }
    
    if (skillSet) {
      const skills = skillSet.split(',');
      filteredResources = filteredResources.filter(item => 
        skills.some(skill => item.skillSet.includes(skill))
      );
    }
    
    if (role) {
      filteredResources = filteredResources.filter(item => 
        item.role.toLowerCase().includes(role.toLowerCase())
      );
    }
    
    return res.json(filteredResources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    return res.status(500).json([]);
  }
});

// GET /operations - Fetch scheduled operations
app.get('/operations', async (req, res) => {
  try {
    // Read operations data from the JSON file
    const operations = JSON.parse(
      await fs.readFile(path.join(__dirname, 'data/operations.json'), 'utf8')
    );
    
    // Apply filters
    const { resourceId, equipment, startDate, endDate, status } = req.query;
    
    let filteredOperations = [...operations];
    
    if (resourceId) {
      filteredOperations = filteredOperations.filter(item => 
        item.resourceId === resourceId
      );
    }
    
    if (equipment) {
      filteredOperations = filteredOperations.filter(item => 
        item.equipment.toLowerCase().includes(equipment.toLowerCase())
      );
    }
    
    if (startDate) {
      const start = new Date(startDate);
      filteredOperations = filteredOperations.filter(item => 
        new Date(item.startDate) >= start
      );
    }
    
    if (endDate) {
      const end = new Date(endDate);
      filteredOperations = filteredOperations.filter(item => 
        new Date(item.endDate) <= end
      );
    }
    
    if (status) {
      filteredOperations = filteredOperations.filter(item => 
        item.status === status
      );
    }
    
    return res.json(filteredOperations);
  } catch (error) {
    console.error('Error fetching operations:', error);
    return res.status(500).json([]);
  }
});

// POST /ai/chat - Chat with AI using MCP context
app.post('/ai/chat', async (req, res) => {
  try {
    const { userId, resourceContext, question } = req.body;
    
    if (!resourceContext || !question) {
      return res.status(400).json({
        answer: 'Missing required information to process your question.',
        followUpQuestions: []
      });
    }
    
    // Process the question using MCP
    const result = await mcpService.processQuestion(userId, resourceContext, question);
    
    // Add a slight delay to simulate network latency
    setTimeout(() => {
      res.json(result);
    }, 800);
  } catch (error) {
    console.error('Error with AI chat:', error);
    return res.status(502).json({
      answer: 'AI service unavailable. Please try again later.',
      followUpQuestions: []
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app; 