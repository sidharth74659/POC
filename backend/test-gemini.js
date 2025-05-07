const {
    VertexAI,
    FunctionDeclarationSchemaType,
} = require('@google-cloud/vertexai');
const tools = require('./openai-tools/tools/index.js');

// Date utility functions
function getNextWeekDates() {
    const now = new Date();
    const nextWeekStart = new Date(now);
    nextWeekStart.setDate(now.getDate() + (7 - now.getDay())); // Start of next week (Sunday)
    nextWeekStart.setHours(0, 0, 0, 0);

    const nextWeekEnd = new Date(nextWeekStart);
    nextWeekEnd.setDate(nextWeekStart.getDate() + 6); // End of next week (Saturday)
    nextWeekEnd.setHours(23, 59, 59, 999);

    return {
        startDate: nextWeekStart.toISOString(),
        endDate: nextWeekEnd.toISOString()
    };
}

// Define function declarations for Vertex AI based on our tools
const functionDeclarations = [
    {
        function_declarations: [
            {
                name: 'getOperations',
                description: 'Fetch a list of operations with optional filters (resourceId, equipment, startDate, endDate) and select fields. Always include operationName and equipment in the response.',
                parameters: {
                    type: FunctionDeclarationSchemaType.OBJECT,
                    properties: {
                        resourceId: { type: FunctionDeclarationSchemaType.STRING, description: 'Filter by resource ID' },
                        equipment: { type: FunctionDeclarationSchemaType.STRING, description: 'Filter by equipment' },
                        startDate: { type: FunctionDeclarationSchemaType.STRING, description: 'Filter by start date (ISO 8601)' },
                        endDate: { type: FunctionDeclarationSchemaType.STRING, description: 'Filter by end date (ISO 8601)' },
                        select: { type: FunctionDeclarationSchemaType.STRING, description: 'Comma-separated list of fields to include (always include operationName and equipment)' },
                    },
                },
            },
            {
                name: 'getOperationById',
                description: 'Fetch a single operation by operationId, with optional select fields. Always include operationName and equipment in the response.',
                parameters: {
                    type: FunctionDeclarationSchemaType.OBJECT,
                    properties: {
                        operationId: { type: FunctionDeclarationSchemaType.STRING, description: 'The operation ID' },
                        select: { type: FunctionDeclarationSchemaType.STRING, description: 'Comma-separated list of fields to include (always include operationName and equipment)' },
                    },
                    required: ['operationId'],
                },
            },
            {
                name: 'getResources',
                description: 'Fetch a list of resources with optional filters (skillSet, role, name) and select fields. Always include name and role in the response.',
                parameters: {
                    type: FunctionDeclarationSchemaType.OBJECT,
                    properties: {
                        skillSet: { type: FunctionDeclarationSchemaType.STRING, description: 'Filter by skill set' },
                        role: { type: FunctionDeclarationSchemaType.STRING, description: 'Filter by role' },
                        name: { type: FunctionDeclarationSchemaType.STRING, description: 'Filter by name' },
                        select: { type: FunctionDeclarationSchemaType.STRING, description: 'Comma-separated list of fields to include (always include name and role)' },
                    },
                },
            },
            {
                name: 'getResourceById',
                description: 'Fetch a single resource by resourceId, with optional select fields. Always include name and role in the response.',
                parameters: {
                    type: FunctionDeclarationSchemaType.OBJECT,
                    properties: {
                        resourceId: { type: FunctionDeclarationSchemaType.STRING, description: 'The resource ID' },
                        select: { type: FunctionDeclarationSchemaType.STRING, description: 'Comma-separated list of fields to include (always include name and role)' },
                    },
                    required: ['resourceId'],
                },
            },
        ],
    },
];

const prompt = `
You are an intelligent assistant for resource scheduling and operation management.
Your primary role is to:
- Answer user queries based on the provided context and available data.
- Intelligently select and invoke the appropriate tools (such as operations and resources APIs) to fetch the necessary data that would be descriptive and summarise to the user's query (using filters and select parameters as needed).
- Summarize or present responses in a format that matches the user's intent (e.g., concise lists, direct answers, or summaries).

When a user asks a question, you:
1. Analyze the query to determine what information is needed.
2. Use the available tools to fetch the necessary data that would be descriptive and summarise to the user's query (using filters and select parameters as needed).
3. Present the answer in a clear, minimal, and relevant format.
4. If a follow-up or secondary API call is needed (e.g., fetching equipment for an operation), do so automatically.

For date-based queries:
- When asked about "next week", use the date range from Sunday to Saturday of the upcoming week
- When asked about "this week", use the date range from the previous Sunday to the current day
- Always include both start and end dates in ISO 8601 format when filtering by date

For table formatting:
- Always include descriptive names (not just IDs) in tables
- Use markdown table format with clear headers
- Include relevant details like operation names, resource names, equipment, etc.
- Avoid duplicate entries
- Sort data logically (e.g., by date, name, or ID)

Keep your responses short, direct, and aligned with real-world scheduling and operation-management scenarios.
Today's date is ${new Date().toISOString().split('T')[0]}.
`;

async function processUserQuery(req, res) {
    const userQuery = req.body.question;
    const resourceContext = req.body.resourceContext;

    const enhancedPrompt = `${prompt}\n\nContext: ${resourceContext}`;

    const vertexAI = new VertexAI({
        project: process.env.GOOGLE_CLOUD_PROJECT || 'methodical-path-416617',
        location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1'
    });

    const generativeModel = vertexAI.getGenerativeModel({
        model: 'gemini-2.0-flash-001',
    });

    // Add date context for next week queries
    // const nextWeekDates = getNextWeekDates();
    // const enhancedPrompt = `${prompt}\n\nContext: Next week's date range is from ${nextWeekDates.startDate} to ${nextWeekDates.endDate}.`;

    const request = {
        contents: [
            { role: 'user', parts: [{ text: enhancedPrompt }] },
            // { role: 'user', parts: [{ text: prompt }] },
            { role: 'user', parts: [{ text: userQuery }] }
        ],
        tools: functionDeclarations,
    };

    try {
        const streamingResp = await generativeModel.generateContentStream(request);
        let finalResponse = '';
        let seenResponses = new Set(); // Track seen responses to prevent duplicates

        for await (const item of streamingResp.stream) {
            const response = item.candidates[0].content;

            // Handle function calls
            if (response.parts[0].functionCall) {
                const functionCall = response.parts[0].functionCall;
                console.log(`\nCalling function: ${functionCall.name}`);
                console.log(`Arguments: ${JSON.stringify(functionCall.args)}`);

                // Execute the function using our tools
                const result = await tools.functions[functionCall.name](functionCall.args);

                // Add the function response to the conversation
                request.contents.push({
                    role: 'ASSISTANT',
                    parts: [{ functionCall }]
                });
                request.contents.push({
                    role: 'USER',
                    parts: [{
                        functionResponse: {
                            name: functionCall.name,
                            response: { content: result }
                        }
                    }]
                });

                // Continue the conversation with the function result
                const followUpResponse = await generativeModel.generateContentStream(request);
                for await (const followUpItem of followUpResponse.stream) {
                    const followUpContent = followUpItem.candidates[0].content.parts[0];

                    // Check if this is another function call
                    if (followUpContent.functionCall) {
                        // Handle nested function call
                        const nestedFunctionCall = followUpContent.functionCall;
                        console.log(`\nCalling nested function: ${nestedFunctionCall.name}`);
                        console.log(`Arguments: ${JSON.stringify(nestedFunctionCall.args)}`);

                        const nestedResult = await tools.functions[nestedFunctionCall.name](nestedFunctionCall.args);

                        // Add nested function response
                        request.contents.push({
                            role: 'ASSISTANT',
                            parts: [{ functionCall: nestedFunctionCall }]
                        });
                        request.contents.push({
                            role: 'USER',
                            parts: [{
                                functionResponse: {
                                    name: nestedFunctionCall.name,
                                    response: { content: nestedResult }
                                }
                            }]
                        });

                        // Get final response after nested call
                        const finalFollowUp = await generativeModel.generateContentStream(request);
                        for await (const finalItem of finalFollowUp.stream) {
                            if (finalItem.candidates[0].content.parts[0].text) {
                                const text = finalItem.candidates[0].content.parts[0].text;
                                if (!seenResponses.has(text)) {
                                    seenResponses.add(text);
                                    finalResponse += text;
                                }
                            }
                        }
                    } else if (followUpContent.text) {
                        const text = followUpContent.text;
                        if (!seenResponses.has(text)) {
                            seenResponses.add(text);
                            finalResponse += text;
                        }
                    }
                }
            } else if (response.parts[0].text) {
                const text = response.parts[0].text;
                if (!seenResponses.has(text)) {
                    seenResponses.add(text);
                    finalResponse += text;
                }
            }
        }

        // Print the final aggregated response
        console.log('\nFinal Response:');
        console.log(finalResponse);

        res.status(200).json({
            answer: finalResponse,
            followUpQuestions: [],
            // Success: true,
            // ErrorMessage: null
        });
    } catch (error) {
        console.error('Error processing query:', error);
        res.status(500).json({
            answer: null,
            followUpQuestions: [],
            // Response: null,
            Success: false,
            ErrorMessage: error.message
        });
    }
}

// Test with different queries
const testQueries = [
    "What equipment is required for operation op-001? And list all the resources with operations assigned to each in a markdown table format.",
    "Show me all operations scheduled for next week with their assigned resources.",
    "Which resources are available for equipment maintenance operations?",
    "List all operations requiring Conveyor System A and their assigned resources."
];

// Run the first query from command line args, or use the first test query
// const userQuery = process.argv[2] || testQueries[0];
// processUserQuery(userQuery);

module.exports = {
    processUserQuery
};

