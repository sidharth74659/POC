import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Initialize the MCP server
const server = new McpServer({
  name: "Test MCP Server",
  version: "1.0.0",
});
// Define a simple hello world tool
server.tool(
  "hello",
  {
    name: z.string().describe("Your name")
  },
  async (args: { name: string }) => {
    return {
      content: [{
        type: "text",
        text: `Hello, ${args.name}!`
      }]
    };
  }
);

// Start the server using stdio transport
const transport = new StdioServerTransport();
server.connect(transport).then(() => {
  console.log("Test server connected using stdio transport");
}).catch((error: any) => {
  console.error("Failed to connect test server:", error);
});