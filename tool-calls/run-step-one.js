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
    // ? { "query": "Get post with ID 42" |
    const messages = [
        {
            role: "system",
            content: "You are a data assistant. ONLY use the getPostById function if the user explicitly requests a post by its unique numeric ID. If the query requests anything else (such as fetching posts by userId, searching, or non-ID based queries), reply with 'Sorry, I can only fetch posts by their unique ID.'"
        },
        { role: "user", content: query }
    ];

    // Initial API call
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-1106",
        messages,
        tools
    });

    const toolCall = response.choices[0].message.tool_calls?.[0];

    if (!toolCall) {
        // { "query": "Hi Bro" }
        if (response.choices[0].message.content) {
            return response.choices[0].message.content;
        }

        // No tool call found, return the message content if available
        return "Invalid request. Please provide a valid post ID in the query.";
    }

    if (toolCall.function.name === "getPostById") {
        // { "query": "Get posts of id 42" }
        const { postId } = JSON.parse(toolCall.function.arguments);
        const postData = await getPostById(postId);

        // Final answer assembly
        return `Post ${postId}: "${postData.title}"\nBody: ${postData.body}`;
    }
    // If the tool call is not recognized, return a default message
    return "No relevant post found";
}

export { runStep1 };