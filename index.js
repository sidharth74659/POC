import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { OpenAI } from 'openai';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Initialize MCP Client
const transport = new StdioClientTransport({
    command: "node",
    args: ["--loader", "ts-node/esm", "src/index.ts"]
});
const client = new Client({
    name: "Todo MCP Client",
    version: "1.0.0",
});

(async () => {
    try {
        await client.connect(transport);
    } catch (error) {
        console.error('Failed to connect to MCP server:', error);
    }
})();

// API endpoint to handle chat messages
app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;

    try {
        // Use OpenAI to interpret the user's message
        const prompt = `You are a todo list assistant. Interpret the user's command and determine the action to take.

User: "${userMessage}"

Respond with a JSON object in the following format:
{
  "action": "get_todos" | "add_todo" | "delete_todo" | "update_todo",
  "item": "todo item to add", // only for add_todo
  "oldItem": "existing todo item to update", // only for update_todo
  "newItem": "new todo item" // only for update_todo
}`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0,
        });

        const content = completion.choices[0].message.content;
        const command = JSON.parse(content);

        let reply = '';

        if (command.action === 'get_todos') {
            const todoResource = await client.readResource({
                uri: "resource://todo/list",
            });
            reply = `Current Todos:\n${todoResource.contents[0].text}`;
        } else if (command.action === 'add_todo' && command.item) {
            await client.callTool({
                name: "addTodo",
                arguments: { item: command.item },
            });
            reply = `Added new todo: ${command.item}`;
        } else if (command.action === 'delete_todo' && command.item) {
            await client.callTool({
                name: "deleteTodo",
                arguments: { item: command.item },
            });
            reply = `Deleted todo: ${command.item}`;
        } else if (command.action === 'update_todo' && command.oldItem && command.newItem) {
            await client.callTool({
                name: "updateTodo",
                arguments: { oldItem: command.oldItem, newItem: command.newItem },
            });
            reply = `Updated todo: ${command.oldItem} -> ${command.newItem}`;
        } else {
            reply = "Sorry, I didn't understand that command. Did you mean to add, delete, or update a todo?";
        }

        res.json({ reply });
    } catch (error) {
        console.error('Error processing message:', error);
        res.status(500).json({ reply: 'An error occurred while processing your message.' });
    }
});

app.listen(port, () => {
    console.log(`Backend server is running at http://localhost:${port}`);
});
