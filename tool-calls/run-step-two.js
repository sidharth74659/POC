import OpenAI from "openai";
import axios from "axios";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Additional tools
const toolsStep2 = [
    {
        type: "function",
        function: {
            name: "getUserByUsername",
            description: "Fetch user details by username",
            parameters: {
                type: "object",
                properties: {
                    username: { type: "string" }
                },
                required: ["username"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "getPostsByUserId",
            description: "Fetch posts by user ID",
            parameters: {
                type: "object",
                properties: {
                    userId: { type: "number" }
                },
                required: ["userId"]
            }
        }
    }
];

// Tool implementations
async function getUserByUsername(username) {
    const response = await axios.get(
        `https://jsonplaceholder.typicode.com/users?username=${username}`
    );
    return response.data[0];
}

async function getPostsByUserId(userId) {
    const response = await axios.get(
        `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
    );
    return response.data;
}
// Example toolsStep2 assumed to be present with functions:
//   - getUserByUsername(username)
//   - getPostsByUserId(userId)

// Map OpenAI tool name to your function
const LOCAL_TOOL_HANDLERS = {
  getUserByUsername,
  getPostsByUserId,
};

// Given tool calls, resolve them and produce tool messages.
async function handleToolCalls(toolCalls) {
  const toolMessages = [];
  for (const toolCall of toolCalls) {
    const { name } = toolCall.function;
    const args = JSON.parse(toolCall.function.arguments);
    if (!LOCAL_TOOL_HANDLERS[name]) continue;
    let result;
    try {
      result = await LOCAL_TOOL_HANDLERS[name](...Object.values(args));
    } catch (e) {
      result = null;
    }
    toolMessages.push({
      role: "tool",
      tool_call_id: toolCall.id,
      content: result ? JSON.stringify(result) : "null"
    });
  }
  return toolMessages;
}

async function runStep2Dynamic(query) {
  // SYSTEM PROMPT
  const messages = [
    {
      role: "system",
      content: `
        You are a data assistant for a posts system.
        Resolve each query in steps: 
        - If the query is about posts for a username, first call getUserByUsername.
        - Then use the found user's ID to fetch their posts (getPostsByUserId).
        - Only use each tool for its intended function.
        - If a user or posts are not found, respond with a clear, concise message.
      `.trim()
    },
    { role: "user", content: query }
  ];

  let loopCount = 0; // Prevent infinite loops.
  const maxLoops = 3; // Shouldn't need more for this flow.

  let currentMessages = [...messages];
  let user, posts;
  let lastResponse;

  while (++loopCount <= maxLoops) {
    // Model call with current messages
    lastResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: currentMessages,
      tools: toolsStep2
    });

    const choice = lastResponse.choices[0].message;
    const toolCalls = choice.tool_calls || [];

    // If no tool calls, we reached a final answer.
    if (!toolCalls.length) {
      // Final answer text
      return choice.content?.trim() || "Could not complete request.";
    }

    // Respond to each tool call
    const toolMessages = await handleToolCalls(toolCalls);

    // For record/data extraction (helpful if needed for reporting back)
    for (const call of toolCalls) {
      if (call.function.name === "getUserByUsername") {
        user = JSON.parse(toolMessages.find(m => m.tool_call_id === call.id).content);
        if (!user || !user.id) return "User not found.";
      }
      if (call.function.name === "getPostsByUserId") {
        posts = JSON.parse(toolMessages.find(m => m.tool_call_id === call.id).content);
        if (!posts || !Array.isArray(posts) || posts.length === 0) return "No posts found for this user.";
      }
    }

    // Append tool responses to messages, for next round/context
    currentMessages.push({
      role: "assistant",
      content: null,
      tool_calls: toolCalls
    });
    currentMessages.push(...toolMessages);
  }

  return "Could not complete request.";
}

async function runStep2(query) {
    // { "query": "Get posts by user 'Bret'"}
    const messages = [
        {
            role: "system",
            // content: "Resolve queries in steps: 1. Find user → 2. Get posts"
            // content: `You are a data assistant for a posts system. For each user query, resolve it stepwise:
            //     1. If the query requests posts by a username, first retrieve the user by their username.
            //     2. Then, use the found user's ID to fetch their posts.
            //     - Only call getUserByUsername if the query asks for posts or information about a user by their username.
            //     - Only call getPostsByUserId if the user is found and their ID is available.
            //     If the user doesn't exist, reply: "User not found."
            //     If the user has no posts, reply: "No posts found for this user.`
            content: `You must ONLY answer user queries by calling the defined functions (tools) and returning their data.  
                    If the user query does not pertain to fetching data using these tools, respond:  
                    "Sorry, I can only answer queries related to user posts."`
        },
        { role: "user", content: query }
    ];

    // First model call
    const response1 = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-1106",
        messages,
        tools: toolsStep2
    });

    const firstToolCall = response1.choices[0].message.tool_calls?.[0];

    if (!firstToolCall) {
        // { "query": "Get posts by user 'Hi'" }
        if (response1.choices[0].message.content) {
            return response1.choices[0].message.content;
        }

        // No tool call found, return the message content if available
        return "Invalid request. Please provide a valid username in the query.";
    }

    let userData;

    if (firstToolCall.function.name === "getUserByUsername") {
        const { username } = JSON.parse(firstToolCall.function.arguments);
        userData = await getUserByUsername(username);
        messages.push({
            role: "tool",
            content: JSON.stringify(userData),
            tool_call_id: firstToolCall.id
        });
    }

    // Second model call
    const response2 = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-1106",
        messages,
        tools: toolsStep2
    });

    const secondToolCall = response2.choices[0].message.tool_calls?.[0];

    if (!secondToolCall) {
        // { "query": "Get posts by user 'Hi'" }
        if (response1.choices[0].message.content) {
            return response1.choices[0].message.content;
        }

        // No tool call found, return the message content if available
        return "Invalid request. Please provide a valid username in the query.";
    }

    if (secondToolCall.function.name === "getPostsByUserId") {
        const posts = await getPostsByUserId(userData.id);
        return `User ${userData.username} (${posts.length} posts):\n` +
            posts.map(p => `- ${p.title}`).join("\n");
    }

    return "Could not complete request";
}

// Run example
// runStep2("Get posts by user 'Bret'").then(console.log);

export { runStep2, runStep2Dynamic, getUserByUsername, getPostsByUserId };