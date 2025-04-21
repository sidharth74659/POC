import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

// In-memory todo list
let todos = [];

// Create a server
const server = new McpServer({
  name: 'Claude Todo MCP',
  version: '1.0.0',
});

// Add a simple tool to add a todo
server.tool(
  'addTodo',
  {
    item: { type: 'string', description: 'Todo item to add' }
  },
  async ({ item }) => {
    todos.push(item);
    console.log(`Added todo: ${item}`);
    return {
      content: [{ type: 'text', text: `Added todo: ${item}` }]
    };
  }
);

// Add a tool to list todos
server.tool(
  'listTodos',
  {},
  async () => {
    const todoList = todos.length === 0 
      ? 'No todos found'
      : todos.map((todo, index) => `${index + 1}. ${todo}`).join('\n');
    
    return {
      content: [{ type: 'text', text: todoList }]
    };
  }
);

// Add a tool to delete a todo
server.tool(
  'deleteTodo',
  {
    item: { type: 'string', description: 'Todo item to delete' }
  },
  async ({ item }) => {
    const initialLength = todos.length;
    todos = todos.filter(todo => todo !== item);
    
    if (todos.length === initialLength) {
      return {
        content: [{ type: 'text', text: `Could not find todo: ${item}` }]
      };
    }
    
    return {
      content: [{ type: 'text', text: `Deleted todo: ${item}` }]
    };
  }
);

// Start the server
const transport = new StdioServerTransport();

(async () => {
  try {
    await server.connect(transport);
    console.log('MCP server started successfully');
  } catch (error) {
    console.error('Failed to start MCP server:', error);
  }
})();

// Keep the process alive
process.on('SIGINT', () => {
  console.log('Shutting down MCP server');
  process.exit(0);
}); 