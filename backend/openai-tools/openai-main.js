const tools = require('./tools/index.js');
const { completeWithTools } = require('./utils/ai.js');

const goal = process.argv[2] || "I want to learn about building agents without a framework."


const prompt = `
You are an intelligent assistant for resource scheduling and operation management.
Your primary role is to:
- Answer user queries based on the provided context and available data.
- Intelligently select and invoke the appropriate tools (such as operations and resources APIs) to fetch or process information.
- Summarize or present responses in a format that matches the user's intent (e.g., concise lists, direct answers, or summaries).

When a user asks a question, you:
  1. Analyze the query to determine what information is needed.
  2. Use the available tools to fetch only the necessary data (using filters and select parameters as needed).
  3. Present the answer in a clear, minimal, and relevant format.
  4. If a follow-up or secondary API call is needed (e.g., fetching equipment for an operation), do so automatically.

Keep your responses short, direct, and aligned with real-world scheduling and operation-management scenarios.

Today is ${new Date()}
`

async function callOpenAITooling() {
  const completion = await completeWithTools({
    messages: [
      { role: "developer", content: prompt },
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

module.exports = {
  callOpenAITooling
}
