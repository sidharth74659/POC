Check:
- node_modules/@modelcontextprotocol/sdk/README.md

- [x] Step 1: Set Up Your Development Environment
- [x] Step 2: Implementing the MCP Server
- [x] Step 3: Building the MCP Client
- [x] Step 4: Integrating with an LLM
- [ ] Step 5: Building a Frontend Chat Interface

Sample Chat Interface:

```
Connected to MCP server
Todo Assistant is ready. Type your command:
> Show me my todos.
Current Todos: []

Type another command:
Add 'Buy groceries' to my list
Added new todo: Buy groceries

Type another command:
> include 'Buy groceries' to my list
Added new todo: Buy groceries

Type another command:
> join 'Buy groceries join' to my list
Added new todo: Buy groceries join

Type another command:
> put 'Buy groceries put' to my list
Added new todo: Buy groceries put

Type another command:
What do I need to do?
Current Todos: [
  "Buy groceries",
  "Buy groceries",
  "Buy groceries join",
  "Buy groceries put"
]

Type another command:
Show me my todos
Current Todos: [
  "Buy groceries",
  "Buy groceries",
  "Buy groceries join",
  "Buy groceries put"
]

Type another command:
delete the first todo
Sorry, I didn't understand that command.

Type another command:
> delete first todo
Sorry, I didn't understand that command.

Type another command:
> remove first todo
Sorry, I didn't understand that command.

Type another command:
> remove 'first todo'
Sorry, I didn't understand that command.
```

<!-- 
- [ ] Step 4: Connect the server to a client

- [ ] Step 5: Implement a tool

- [ ] Step 6: Implement a resource

- [ ] Step 7: Test the server

- [ ] Step 8: Deploy the server
 -->