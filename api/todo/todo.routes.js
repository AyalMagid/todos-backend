const express = require('express')
// const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
const {getTodos,getTodoById,addTodo,updateTodo,removeTodo} = require('./todo.controller')
const router = express.Router()

router.get('/', getTodos);
router.get('/:id', getTodoById);
router.post('/', addTodo);
router.put('/', updateTodo);
router.delete('/', removeTodo);

module.exports = router

