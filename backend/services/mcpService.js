/**
 * Mock Chat Provider (MCP) Service
 * This service handles communication with the MCP API
 */
const axios = require('axios');
const mcpConfig = require('../config/mcp');

class MCPService {
  constructor() {
    this.client = axios.create({
      baseURL: mcpConfig.baseUrl,
      timeout: mcpConfig.timeout,
      headers: {
        'Authorization': `Bearer ${mcpConfig.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Generate an answer using the MCP API
   * @param {Object} resourceData - Data about the resource
   * @param {Array} operationsData - Data about the resource's operations
   * @param {String} question - The user's question
   * @returns {Promise<Object>} - The generated answer and follow-up questions
   */
  async generateAnswer(resourceData, operationsData, question) {
    // If using mock responses, return predefined answers based on the question content
    if (mcpConfig.useMockResponses) {
      return this._generateMockAnswer(resourceData, operationsData, question);
    }

    try {
      const systemPrompt = mcpConfig.generateSystemPrompt(resourceData, operationsData);
      
      const response = await this.client.post('/chat/completions', {
        model: mcpConfig.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
        max_tokens: mcpConfig.maxTokens
      });

      // Process the API response
      const answer = response.data.choices[0].message.content;
      
      // Extract potential follow-up questions
      const followUps = this._generateFollowUpQuestions(question, answer, resourceData, operationsData);
      
      return {
        answer,
        followUps
      };
    } catch (error) {
      console.error('Error calling MCP API:', error.message);
      throw new Error('Failed to generate answer from MCP service');
    }
  }

  /**
   * Generate a mock answer for development and testing
   * @private
   */
  _generateMockAnswer(resourceData, operationsData, question) {
    const lowerQuestion = question.toLowerCase();
    let answer = '';
    let followUps = [];

    // Basic pattern matching to simulate intelligent responses
    if (lowerQuestion.includes('available') || lowerQuestion.includes('availability')) {
      const status = resourceData.availability.status;
      const nextAvailable = resourceData.availability.nextAvailable 
        ? new Date(resourceData.availability.nextAvailable).toLocaleString() 
        : 'unknown';
      
      answer = `${resourceData.name} is currently ${status}. `;
      if (status !== 'available') {
        answer += `They will be next available at ${nextAvailable}.`;
      }
      
      followUps = [
        `What operations is ${resourceData.name} scheduled for?`,
        `What equipment does ${resourceData.name} typically use?`,
        `Can you tell me more about ${resourceData.name}'s skills?`
      ];
    } 
    else if (lowerQuestion.includes('operation') || lowerQuestion.includes('schedule')) {
      const opCount = operationsData.length;
      answer = `${resourceData.name} has ${opCount} operation${opCount !== 1 ? 's' : ''} scheduled. `;
      
      if (opCount > 0) {
        const nextOp = operationsData.sort((a, b) => new Date(a.startTime) - new Date(b.startTime))[0];
        answer += `The next operation is "${nextOp.title}" on ${new Date(nextOp.startTime).toLocaleString()}.`;
      }
      
      followUps = [
        `What equipment is needed for the next operation?`,
        `Is ${resourceData.name} qualified for this operation?`,
        `When will ${resourceData.name} be free after this operation?`
      ];
    }
    else if (lowerQuestion.includes('equipment') || lowerQuestion.includes('tool')) {
      const allEquipment = new Set();
      operationsData.forEach(op => {
        if (op.equipment && Array.isArray(op.equipment)) {
          op.equipment.forEach(e => allEquipment.add(e));
        }
      });
      
      const equipmentList = Array.from(allEquipment);
      
      if (equipmentList.length > 0) {
        answer = `${resourceData.name} uses the following equipment: ${equipmentList.join(', ')}.`;
      } else {
        answer = `No specific equipment information is available for ${resourceData.name}.`;
      }
      
      followUps = [
        `What operations require this equipment?`,
        `When is the next operation using this equipment?`,
        `Are there any scheduling conflicts with this equipment?`
      ];
    }
    else if (lowerQuestion.includes('skill') || lowerQuestion.includes('qualified')) {
      answer = `${resourceData.name} has the following skills: ${resourceData.skillSet.join(', ')}.`;
      
      followUps = [
        `What operations match these skills?`,
        `Are there any operations scheduled that don't match ${resourceData.name}'s skills?`,
        `How many other resources have similar skills?`
      ];
    }
    else {
      answer = `I can help you with information about ${resourceData.name}, their schedule, availability, skills, and equipment. Please ask a specific question.`;
      
      followUps = [
        `What is ${resourceData.name}'s availability?`,
        `What operations is ${resourceData.name} scheduled for?`,
        `What skills does ${resourceData.name} have?`,
        `What equipment does ${resourceData.name} use?`
      ];
    }

    return {
      answer,
      followUps: followUps.slice(0, 3) // Limit to 3 follow-up questions
    };
  }

  /**
   * Generate follow-up questions based on the context and previous answer
   * @private
   */
  _generateFollowUpQuestions(question, answer, resourceData, operationsData) {
    // In a real implementation, this would use the MCP API to generate contextual follow-ups
    // For now, we return some generic follow-ups based on the context
    const defaultFollowUps = [
      `What is ${resourceData.name}'s availability?`,
      `What operations is ${resourceData.name} scheduled for?`,
      `What skills does ${resourceData.name} have?`
    ];

    return defaultFollowUps;
  }
}

module.exports = new MCPService();