import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Initialize the MCP server
const server = new McpServer({
  name: "Todo MCP Server",
  version: "1.0.0",
});

// In-memory todo list
let todos: string[] = [];

// Define a resource to get the list of todos
server.resource(
  "todoList",
  "resource://todo/list",
  async (uri) => ({
    contents: [
      {
        uri: uri.href,
        text: JSON.stringify(todos, null, 2),
      },
    ],
  })
);

// Define a tool to add a new todo
server.tool(
  "addTodo",
  {
    item: z.string().describe("The todo item to add"),
  },
  async (args: { item: string }) => {
    todos.push(args.item);
    return {
      content: [{
        type: "text",
        text: `Added todo: ${args.item}`
      }]
    };
  }
);

// Start the server using stdio transport
const transport = new StdioServerTransport();
server.connect(transport).then(() => {
  console.log("Server connected using stdio transport");
}).catch((error) => {
  console.error("Failed to connect server:", error);
});
