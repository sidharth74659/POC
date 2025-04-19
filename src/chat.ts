import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import OpenAI from "openai";
import readline from "readline";
import { OPENAI_API_KEY } from "../env.constants";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// Initialize MCP client
const transport = new StdioClientTransport({
  command: "node",
  args: ["--loader", "ts-node/esm", "src/index.ts"],
});
const client = new Client({
  name: "Todo MCP Client",
  version: "1.0.0",
});

// Function to interpret user input using LLM
async function interpretCommand(input: string): Promise<{ action: string; item?: string }> {
  const prompt = `You are an assistant managing a todo list. Interpret the user's command and determine the action to take.

User: "${input}"

Respond with a JSON object in the following format:
{
  "action": "get_todos" | "add_todo",
  "item": "todo item to add" // only for add_todo
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
  });

  const content = response.choices[0].message.content;
  try {
    return JSON.parse(content ?? "");
  } catch (error) {
    console.error("Failed to parse LLM response:", content);
    return { action: "get_todos" };
  }
}

// Function to start the chat interface
async function startChat() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("Todo Assistant is ready. Type your command:");

  rl.on("line", async (input) => {
    const command = await interpretCommand(input);

    if (command.action === "get_todos") {
      const todoResource = await client.readResource({
        uri: "resource://todo/list",
      });
      console.log("Current Todos:", todoResource.contents[0].text);
    } else if (command.action === "add_todo" && command.item) {
      await client.callTool({
        name: "addTodo",
        arguments: { item: command.item },
      });
      console.log(`Added new todo: ${command.item}`);
    } else {
      console.log("Sorry, I didn't understand that command.");
    }

    console.log("\nType another command:");
  });
}

// Connect to the MCP server and start the chat
client.connect(transport).then(() => {
  console.log("Connected to MCP server");
  startChat();
}).catch((error) => {
  console.error("Failed to connect to MCP server:", error);
});
