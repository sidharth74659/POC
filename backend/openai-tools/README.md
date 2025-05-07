# OpenAI Tools for Resource Scheduling

This folder contains the OpenAI tools implementation for the Smart Scheduler project. It provides a set of specialized tools for resource scheduling and operations management, allowing the LLM to answer questions about resources, operations, scheduling conflicts, and more.

## Structure

- `openai-main.js`: Main entry point for using the tools directly
- `tools/`: Contains the tool definitions
  - `index.js`: Exports all tools and configurations
  - `resourceTools.js`: Tools for querying resources
  - `operationTools.js`: Tools for querying operations
- `utils/`: Utility functions
  - `ai.js`: OpenAI API wrapper and tool execution helpers

## Usage

### Directly from CLI

You can use these tools directly from the command line:

```bash
# Using the npm script
npm run tools "Which operations are assigned to resource res-002 next week?"

# Or directly with Node
node openai-tools/openai-main.js "What equipment is required for operation op-001?"
```

### In the API

The tools are also integrated with the REST API:

```bash
# Using the direct endpoint
curl -X POST http://localhost:3000/ai/chat/direct \
  -H "Content-Type: application/json" \
  -d '{"question": "Which operations are assigned to resource res-002 next week?"}'
```

### For Development

Use the test script to check if the tools are working correctly:

```bash
node test-tools.js "Your question here"
```

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `USE_DIRECT_TOOL_CALLS`: Set to 'true' to use the direct tool calls implementation (optional)
- `USE_NEW_AI_HELPER`: Set to 'true' to use the new AI Helper Service in the chat controller (optional)

## Examples

Here are some example questions that can be answered:

1. "Which operations are assigned to resource res-002 next week?"
2. "What equipment is required for operation op-001?"
3. "List all resources with welding skills"
4. "What operations are scheduled for next month?"
5. "Find all operations that require forklift equipment"
6. "Which resources are available this Friday?"
7. "What are the details of operation op-003?"
8. "List all resources with their skills" 