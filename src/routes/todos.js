const express = require('express');
const TodoController = require('../controllers/TodoController');
const AuthMiddleware = require('../middleware/auth');
const { ValidationMiddleware, ValidationSchemas } = require('../middleware/validation');

const router = express.Router();
const todoController = new TodoController();

// Get all todos (public for JSONPlaceholder compatibility)
router.get('/', todoController.getTodos);

// Get todo by ID (public for JSONPlaceholder compatibility)
router.get('/:id', 
  ValidationMiddleware.validateParams(ValidationSchemas.idParam),
  todoController.getTodoById
);

// Create todo (authenticated users)
router.post('/', 
  AuthMiddleware.authenticate,
  ValidationMiddleware.validate(ValidationSchemas.todoCreate),
  todoController.createTodo
);

// Update todo (authenticated users, owner or admin)
router.put('/:id', 
  AuthMiddleware.authenticate,
  ValidationMiddleware.validateParams(ValidationSchemas.idParam),
  ValidationMiddleware.validate(ValidationSchemas.todoUpdate),
  todoController.updateTodo
);

// Toggle todo completion (authenticated users, owner or admin)
router.patch('/:id/toggle', 
  AuthMiddleware.authenticate,
  ValidationMiddleware.validateParams(ValidationSchemas.idParam),
  todoController.toggleTodo
);

// Delete todo (authenticated users, owner or admin)
router.delete('/:id', 
  AuthMiddleware.authenticate,
  ValidationMiddleware.validateParams(ValidationSchemas.idParam),
  todoController.deleteTodo
);

module.exports = router;