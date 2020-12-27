const todoService = require('./todo.service')
const logger = require('../../services/logger.service')

module.exports = {
    getTodos,
    getTodoById,
    addTodo,
    removeTodo,
    updateTodo,
  };

async function getTodos(req, res) {
    const todos = await todoService.getTodos()
    res.json(todos)
}

async function getTodoById(req, res) {
    const id = req.params.id;
    const todo = await todoService.getTodoById(id)
    res.json(todo)
}

async function addTodo(req, res) {
    const todo = req.body;
    const addedTodo = await todoService.addTodo(todo);
    res.json(addedTodo);
  }

async function removeTodo(req, res) {
    let todo = req.body
    console.log(todo)
    todo = await todoService.removeTodo(todo);
    res.end();
  }

async function updateTodo(req, res) {
    const updatedTodo = await todoService.updateTodo(req.body)
    res.send(updatedTodo)
}

