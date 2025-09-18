const express = require('express');
const PostController = require('../controllers/PostController');
const AuthMiddleware = require('../middleware/auth');
const { ValidationMiddleware, ValidationSchemas } = require('../middleware/validation');

const router = express.Router();
const postController = new PostController();

// Get all posts (public for JSONPlaceholder compatibility)
router.get('/', postController.getPosts);

// Get post by ID (public for JSONPlaceholder compatibility)
router.get('/:id', 
  ValidationMiddleware.validateParams(ValidationSchemas.idParam),
  postController.getPostById
);

// Get comments for a post (public for JSONPlaceholder compatibility)
router.get('/:id/comments', 
  ValidationMiddleware.validateParams(ValidationSchemas.idParam),
  postController.getPostComments
);

// Create post (authenticated users)
router.post('/', 
  AuthMiddleware.authenticate,
  ValidationMiddleware.validate(ValidationSchemas.postCreate),
  postController.createPost
);

// Update post (authenticated users, owner or admin)
router.put('/:id', 
  AuthMiddleware.authenticate,
  ValidationMiddleware.validateParams(ValidationSchemas.idParam),
  ValidationMiddleware.validate(ValidationSchemas.postUpdate),
  postController.updatePost
);

// Delete post (authenticated users, owner or admin)
router.delete('/:id', 
  AuthMiddleware.authenticate,
  ValidationMiddleware.validateParams(ValidationSchemas.idParam),
  postController.deletePost
);

module.exports = router;