const express = require('express');

// Import route modules
const authRoutes = require('./auth');
const userRoutes = require('./users');
const postRoutes = require('./posts');
const commentRoutes = require('./comments');
const albumRoutes = require('./albums');
const photoRoutes = require('./photos');
const todoRoutes = require('./todos');

const router = express.Router();

// API health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// API documentation endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'JSONPlaceholder-like CRUD API',
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /auth/register': 'Register a new user',
        'POST /auth/login': 'Login user',
        'GET /auth/profile': 'Get user profile (authenticated)',
        'PUT /auth/profile': 'Update user profile (authenticated)',
      },
      users: {
        'GET /users': 'Get all users',
        'GET /users/:id': 'Get user by ID',
        'POST /users': 'Create user (admin only)',
        'PUT /users/:id': 'Update user (admin or owner)',
        'DELETE /users/:id': 'Delete user (admin only)',
      },
      posts: {
        'GET /posts': 'Get all posts',
        'GET /posts/:id': 'Get post by ID',
        'GET /posts/:id/comments': 'Get comments for a post',
        'POST /posts': 'Create post (authenticated)',
        'PUT /posts/:id': 'Update post (owner or admin)',
        'DELETE /posts/:id': 'Delete post (owner or admin)',
      },
      comments: {
        'GET /comments': 'Get all comments',
        'GET /comments/:id': 'Get comment by ID',
        'POST /comments': 'Create comment',
        'PUT /comments/:id': 'Update comment (admin only)',
        'DELETE /comments/:id': 'Delete comment (admin only)',
      },
      albums: {
        'GET /albums': 'Get all albums',
        'GET /albums/:id': 'Get album by ID',
        'GET /albums/:id/photos': 'Get photos for an album',
        'POST /albums': 'Create album (authenticated)',
        'PUT /albums/:id': 'Update album (owner or admin)',
        'DELETE /albums/:id': 'Delete album (owner or admin)',
      },
      photos: {
        'GET /photos': 'Get all photos',
        'GET /photos/:id': 'Get photo by ID',
        'POST /photos': 'Create photo (authenticated)',
        'PUT /photos/:id': 'Update photo (owner or admin)',
        'DELETE /photos/:id': 'Delete photo (owner or admin)',
      },
      todos: {
        'GET /todos': 'Get all todos',
        'GET /todos/:id': 'Get todo by ID',
        'POST /todos': 'Create todo (authenticated)',
        'PUT /todos/:id': 'Update todo (owner or admin)',
        'PATCH /todos/:id/toggle': 'Toggle todo completion (owner or admin)',
        'DELETE /todos/:id': 'Delete todo (owner or admin)',
      },
    },
    authentication: {
      type: 'Bearer Token (JWT)',
      header: 'Authorization: Bearer <token>',
      note: 'Include JWT token in Authorization header for protected routes',
    },
  });
});

// Mount route modules
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);
router.use('/albums', albumRoutes);
router.use('/photos', photoRoutes);
router.use('/todos', todoRoutes);

module.exports = router;