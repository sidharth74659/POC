import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";

// Initialize the MCP client
const transport = new StdioClientTransport({
    command: "node",
    args: ["--loader", "ts-node/esm", "src/index.ts"],
});
const client = new Client({
    name: "Todo MCP Client",
    version: "1.0.0",
});

// Connect to the MCP server
await client.connect(transport);

// List resources
const resources = await client.listResources();
console.log("Resources:", resources);

const resource = await client.readResource({
    uri: "resource://todo/list",
});
console.log("Resource:", resource);

// Call a tool
const result = await client.callTool({
    name: "addTodo",
    arguments: {
        item: "Buy milk"
    }
});
console.log("Result:", result);

/* 
// List prompts
const prompts = await client.listPrompts();
console.log("Prompts:", prompts);

// Get a prompt
const prompt = await client.getPrompt({
    name: "example-prompt",
    arguments: {
      arg1: "value"
    }
});
console.log("Example Prompt:", prompt);
 */

/* 

// Fetch the list of todos
const todoResource = await client.getResource("resource://todo/list");
console.log("Current Todos:", todoResource.contents[0].text);

// Add a new todo
await client.callTool("addTodo", { item: "Buy milk" });
console.log("Added new todo: Buy milk");

// Fetch the updated list of todos
const updatedTodoResource = await client.getResource("resource://todo/list");
console.log("Updated Todos:", updatedTodoResource.contents[0].text);

// Disconnect from the server
await client.disconnect();
 */
