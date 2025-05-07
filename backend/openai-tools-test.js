/**
 * Simplified OpenAI tools test
 */
const OpenAI = require('openai');
const { execSync } = require('child_process');
const path = require('path');

// Tool definitions
const toolDefinitions = [
  {
    type: "function",
    function: {
      name: "getResourcesData",
      description: "Get resources based on filters and optional field selection",
      parameters: {
        type: "object",
        properties: {
          filters: {
            type: "object",
            description: "Filters to apply to resources",
            properties: {
              skillSet: {
                type: "string",
                description: "Filter by skill set (e.g., 'Welding', 'Electrical')"
              },
              role: {
                type: "string",
                description: "Filter by role (e.g., 'Engineer', 'Technician')"
              },
              name: {
                type: "string",
                description: "Filter by resource name"
              }
            }
          },
          select: {
            type: "array",
            description: "Fields to include in the response",
            items: {
              type: "string",
              description: "Field name (e.g., 'resourceId', 'resourceName', 'skillSet', 'availability')"
            }
          }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getResourceById",
      description: "Get a resource by ID with optional field selection",
      parameters: {
        type: "object",
        properties: {
          resourceId: {
            type: "string",
            description: "The ID of the resource to retrieve (e.g., 'res-001')"
          },
          select: {
            type: "array",
            description: "Fields to include in the response",
            items: {
              type: "string",
              description: "Field name (e.g., 'resourceId', 'resourceName', 'skillSet', 'availability')"
            }
          }
        },
        required: ["resourceId"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getOperationsData",
      description: "Get operations based on filters and optional field selection",
      parameters: {
        type: "object",
        properties: {
          filters: {
            type: "object",
            description: "Filters to apply to operations",
            properties: {
              resourceId: {
                type: "string",
                description: "Filter by resource ID (e.g., 'res-001')"
              },
              equipment: {
                type: "string",
                description: "Filter by equipment (e.g., 'Drill', 'Forklift')"
              },
              startDate: {
                type: "string",
                description: "Filter operations starting on or after this date (ISO format: 'YYYY-MM-DD')"
              },
              endDate: {
                type: "string",
                description: "Filter operations ending on or before this date (ISO format: 'YYYY-MM-DD')"
              }
            }
          },
          select: {
            type: "array",
            description: "Fields to include in the response",
            items: {
              type: "string",
              description: "Field name (e.g., 'operationId', 'operationName', 'resourceId', 'equipment')"
            }
          }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getOperationById",
      description: "Get an operation by ID with optional field selection",
      parameters: {
        type: "object",
        properties: {
          operationId: {
            type: "string",
            description: "The ID of the operation to retrieve (e.g., 'op-001')"
          },
          select: {
            type: "array",
            description: "Fields to include in the response",
            items: {
              type: "string",
              description: "Field name (e.g., 'operationId', 'operationName', 'resourceId', 'equipment')"
            }
          }
        },
        required: ["operationId"]
      }
    }
  }
];

// Mock system prompt
const systemPrompt = `
You are a specialized resource scheduling assistant for operations management.
Your primary role is to:
1. Answer user queries accurately based on the provided context about resources and operations
2. Intelligently select and invoke appropriate tools to gather required information
3. Present responses in a concise, relevant format that directly addresses the user's intent

When analyzing user queries:
- Extract key entities like resourceId, operationId, date ranges, and equipment needs
- Use the appropriate tools to fetch only the necessary data
- Structure your answers to match the question's context and goal

Remember to:
- Minimize unnecessary API calls by using filters and select parameters effectively
- Format dates appropriately when querying date ranges
- Only include relevant information in your responses
- When dates are mentioned without specifics (like "next week"), calculate the appropriate date range

Today is ${new Date().toISOString().split('T')[0]}
`;

// Mock tool function for testing
async function mockToolFunction(name, args) {
  console.log(`Mock tool call: ${name}(${JSON.stringify(args)})`);
  return JSON.stringify({
    success: true,
    data: {
      items: [
        { id: 'mock-1', name: 'Mock Response 1' },
        { id: 'mock-2', name: 'Mock Response 2' }
      ]
    }
  });
}

// OpenAI chat completion with tools
async function runWithOpenAI(question) {
  try {
    // Initialize OpenAI client with API key
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || require('./config/mcp').openaiApiKey
    });
    
    console.log(`Processing question: "${question}"`);
    
    // Initial chat completion request with tools
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question }
      ],
      tools: toolDefinitions,
      tool_choice: 'auto'
    });
    
    // Process the response
    const initialMessage = response.choices[0].message;
    
    // If there are tool calls, process them
    if (initialMessage.tool_calls && initialMessage.tool_calls.length > 0) {
      console.log(`\nAI requested ${initialMessage.tool_calls.length} tool calls`);
      
      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: question },
        initialMessage
      ];
      
      // Process each tool call
      for (const toolCall of initialMessage.tool_calls) {
        const { name, arguments: argsString } = toolCall.function;
        const args = JSON.parse(argsString);
        
        console.log(`\nTool Call: ${name}`);
        console.log(`Arguments: ${argsString}`);
        
        // Mock the tool function result
        const result = await mockToolFunction(name, args);
        
        // Add tool response to messages
        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: result
        });
      }
      
      // Get final response after tool calls
      const finalResponse = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages
      });
      
      console.log('\n' + '='.repeat(50));
      console.log('Final Answer:');
      console.log(finalResponse.choices[0].message.content);
      return finalResponse.choices[0].message.content;
    } else {
      // No tool calls needed
      console.log('\n' + '='.repeat(50));
      console.log('Answer (no tools used):');
      console.log(initialMessage.content);
      return initialMessage.content;
    }
  } catch (error) {
    console.error('Error processing with OpenAI:', error);
    return `Error: ${error.message}`;
  }
}

// Run the test
const testQuestion = process.argv[2] || "Which operations are assigned to resource res-002 next week?";
runWithOpenAI(testQuestion); 