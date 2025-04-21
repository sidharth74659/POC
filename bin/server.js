import express from 'express';
import fs from 'fs';
import path from 'path';
import { McpServer } from '@modelcontextprotocol/sdk';

const app = express();
const PORT = 3000;

// In-memory todo list
let todos = [];
let idCounter = 1;

// Load todos from file if exists
const todosFilePath = path.join(__dirname, 'todos.json');
if (fs.existsSync(todosFilePath)) {
  const data = fs.readFileSync(todosFilePath);
  todos = JSON.parse(data);
  idCounter = todos.length ? Math.max(...todos.map(t => t.id)) + 1 : 1;
}

// Save todos to file
const saveTodos = () => {
  fs.writeFileSync(todosFilePath, JSON.stringify(todos, null, 2));
};

// Initialize MCP server
const mcpServer = new McpServer();

// Define MCP resource: todo list
mcpServer.addResource({
  id: 'resource://todo/list',
  get: async () => ({
    contents: [
      {
        type: 'text',
        text: todos.map(todo => `${todo.id}: ${todo.item}`).join('\n') || 'No todos available.',
      },
    ],
  }),
});

// Define MCP tools
mcpServer.addTool({
  id: 'addTodo',
  description: 'Add a new todo item',
  parameters: {
    type: 'object',
    properties: {
      item: { type: 'string' },
    },
    required: ['item'],
  },
  handler: async ({ item }) => {
    const newTodo = { id: idCounter++, item };
    todos.push(newTodo);
    saveTodos();
    return { result: `Added todo: ${item}` };
  },
});

mcpServer.addTool({
  id: 'updateTodo',
  description: 'Update an existing todo item',
  parameters: {
    type: 'object',
    properties: {
      id: { type: 'number' },
      item: { type: 'string' },
    },
    required: ['id', 'item'],
  },
  handler: async ({ id, item }) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) {
      throw new Error(`Todo with ID ${id} not found.`);
    }
    todo.item = item;
    saveTodos();
    return { result: `Updated todo ${id} to: ${item}` };
  },
});

mcpServer.addTool({
  id: 'deleteTodo',
  description: 'Delete a todo item',
  parameters: {
    type: 'object',
    properties: {
      id: { type: 'number' },
    },
    required: ['id'],
  },
  handler: async ({ id }) => {
    const index = todos.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error(`Todo with ID ${id} not found.`);
    }
    const [deleted] = todos.splice(index, 1);
    saveTodos();
    return { result: `Deleted todo: ${deleted.item}` };
  },
});

// Start MCP server
mcpServer.listen();

// Start Express server (optional, for additional endpoints)
app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
});
