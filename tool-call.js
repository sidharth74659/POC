import OpenAI from "openai";
import axios from "axios";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Tool implementation
async function getPostById(postId) {
  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/posts/${postId}`
  );
  return response.data;
}

// Tool definition
const tools = [
  {
    type: "function",
    function: {
      name: "getPostById",
      description: "Fetch a blog post by its ID",
      parameters: {
        type: "object",
        properties: {
          postId: { type: "number", description: "Post ID (1-100)" }
        },
        required: ["postId"]
      }
    }
  }
];

async function runStep1(query) {
  const messages = [
    {
      role: "system",
      content: "You are a data assistant. Use getPostById to fetch posts."
    },
    { role: "user", content: query }
  ];

  // Initial API call
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    messages,
    tools
  });

  const toolCall = response.choices[0].message.tool_calls[0];
  if (toolCall.function.name === "getPostById") {
    const { postId } = JSON.parse(toolCall.function.arguments);
    const postData = await getPostById(postId);
    
    // Final answer assembly
    return `Post ${postId}: "${postData.title}"\nBody: ${postData.body}`;
  }
  return "No relevant post found";
}

// Run example
// runStep1("Get post with ID 42").then(console.log);

export { runStep1 };