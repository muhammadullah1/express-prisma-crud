const database = require('../utils/database');

class TodoService {
  constructor() {
    this.prisma = database.getClient();
  }

  // Get all todos
  getTodos = async () => {
    return await this.prisma.todo.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  };

  // Get todo by ID
  getTodoById = async (id) => {
    const todo = await this.prisma.todo.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
          },
        },
      },
    });

    if (!todo) {
      throw new Error('Todo not found');
    }

    return todo;
  };

  // Get todos by user ID
  getTodosByUserId = async (userId) => {
    return await this.prisma.todo.findMany({
      where: { userId: parseInt(userId) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  };

  // Create new todo
  addTodo = async (todoData, userId) => {
    return await this.prisma.todo.create({
      data: {
        ...todoData,
        userId: parseInt(userId),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
          },
        },
      },
    });
  };

  // Update todo
  updateTodo = async (id, todoData, userId, userRole) => {
    const existingTodo = await this.prisma.todo.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingTodo) {
      throw new Error('Todo not found');
    }

    // Check if user owns the todo or is admin
    if (existingTodo.userId !== parseInt(userId) && userRole !== 'ADMIN') {
      throw new Error('Unauthorized to update this todo');
    }

    return await this.prisma.todo.update({
      where: { id: parseInt(id) },
      data: todoData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
          },
        },
      },
    });
  };

  // Delete todo
  deleteTodo = async (id, userId, userRole) => {
    const existingTodo = await this.prisma.todo.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingTodo) {
      throw new Error('Todo not found');
    }

    // Check if user owns the todo or is admin
    if (existingTodo.userId !== parseInt(userId) && userRole !== 'ADMIN') {
      throw new Error('Unauthorized to delete this todo');
    }

    await this.prisma.todo.delete({
      where: { id: parseInt(id) },
    });

    return { message: 'Todo deleted successfully' };
  };

  // Toggle todo completion status
  toggleTodo = async (id, userId, userRole) => {
    const existingTodo = await this.prisma.todo.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingTodo) {
      throw new Error('Todo not found');
    }

    // Check if user owns the todo or is admin
    if (existingTodo.userId !== parseInt(userId) && userRole !== 'ADMIN') {
      throw new Error('Unauthorized to update this todo');
    }

    return await this.prisma.todo.update({
      where: { id: parseInt(id) },
      data: {
        completed: !existingTodo.completed,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
          },
        },
      },
    });
  };
}

module.exports = TodoService;