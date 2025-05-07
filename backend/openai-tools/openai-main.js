import tools from './tools/index.js';
import { completeWithTools } from './utils/ai.js';

const goal = process.argv[2] || "Which operations are assigned to resource res-002 next week?";

const prompt = `
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
`

async function main() {
  const completion = await completeWithTools({
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: goal}
    ],
    model: "gpt-4o",
    tool_choice: "auto",
    tools: tools.configsArray,
    store: false
  });

  const answer = completion.choices[0].message.content
  console.log("\n\n"+"#".repeat(40));
  console.log(`Answer: ${answer}`);
}

main();