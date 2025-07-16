const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5050;

const TODOS_PATH = path.join(__dirname, 'todos.json');
console.log(TODOS_PATH);

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/todos', (req, res) => {
  fs.readFile(TODOS_PATH, 'utf8', (err, data) => {
    // console.log(data);
    if (err) return res.status(500).json({ error: err.message });
    res.json(JSON.parse(data));
  });
});

app.post('/todos', (req, res) => {
  const newTodo = req.body;
  fs.readFile(TODOS_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    let todos = JSON.parse(data);
    newTodo.id = Math.max(0, ...todos.map(t => t.id)) + 1;
    todos.push(newTodo);
    fs.writeFile(TODOS_PATH, JSON.stringify(todos, null, 2), err => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json(newTodo);
    });
  });
});

app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const updatedTodo = req.body;
  fs.readFile(TODOS_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    let todos = JSON.parse(data);
    const idx = todos.findIndex(t => t.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Todo not found' });
    todos[idx] = { ...todos[idx], ...updatedTodo, id };
    fs.writeFile(TODOS_PATH, JSON.stringify(todos, null, 2), err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(todos[idx]);
    });
  });
});

app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  fs.readFile(TODOS_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    let todos = JSON.parse(data);
    const idx = todos.findIndex(t => t.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Todo not found' });
    const deleted = todos.splice(idx, 1)[0];
    fs.writeFile(TODOS_PATH, JSON.stringify(todos, null, 2), err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(deleted);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Express mock backend running at http://localhost:${PORT}`);
}); 