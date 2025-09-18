const TodoService = require('../services/TodoService');
const ErrorHandler = require('../middleware/errorHandler');

class TodoController {
  constructor() {
    this.todoService = new TodoService();
  }

  // Get all todos
  getTodos = ErrorHandler.asyncHandler(async (req, res) => {
    const { userId } = req.query;
    let todos;
    
    if (userId) {
      todos = await this.todoService.getTodosByUserId(userId);
    } else {
      todos = await this.todoService.getTodos();
    }
    
    res.json({
      success: true,
      data: todos,
    });
  });

  // Get todo by ID
  getTodoById = ErrorHandler.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const todo = await this.todoService.getTodoById(id);
    
    res.json({
      success: true,
      data: todo,
    });
  });

  // Create new todo
  createTodo = ErrorHandler.asyncHandler(async (req, res) => {
    const todoData = {
      ...req.body,
      userId: req.user.id,
    };
    
    const todo = await this.todoService.addTodo(todoData);
    
    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: todo,
    });
  });

  // Update todo
  updateTodo = ErrorHandler.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedTodo = await this.todoService.updateTodo(id, req.body, req.user.id);
    
    res.json({
      success: true,
      message: 'Todo updated successfully',
      data: updatedTodo,
    });
  });

  // Toggle todo completion
  toggleTodo = ErrorHandler.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedTodo = await this.todoService.toggleTodoCompletion(id, req.user.id);
    
    res.json({
      success: true,
      message: 'Todo status updated successfully',
      data: updatedTodo,
    });
  });

  // Delete todo
  deleteTodo = ErrorHandler.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await this.todoService.deleteTodo(id, req.user.id);
    
    res.json({
      success: true,
      message: result.message,
    });
  });
}

module.exports = TodoController;