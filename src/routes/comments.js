const express = require('express');
const CommentController = require('../controllers/CommentController');
const AuthMiddleware = require('../middleware/auth');
const { ValidationMiddleware, ValidationSchemas } = require('../middleware/validation');

const router = express.Router();
const commentController = new CommentController();

// Get all comments (public for JSONPlaceholder compatibility)
router.get('/', commentController.getComments);

// Get comment by ID (public for JSONPlaceholder compatibility)
router.get('/:id', 
  ValidationMiddleware.validateParams(ValidationSchemas.idParam),
  commentController.getCommentById
);

// Create comment (public for JSONPlaceholder compatibility)
router.post('/', 
  ValidationMiddleware.validate(ValidationSchemas.commentCreate),
  commentController.createComment
);

// Update comment (admin only)
router.put('/:id', 
  AuthMiddleware.authenticate,
  AuthMiddleware.requireAdmin,
  ValidationMiddleware.validateParams(ValidationSchemas.idParam),
  ValidationMiddleware.validate(ValidationSchemas.commentUpdate),
  commentController.updateComment
);

// Delete comment (admin only)
router.delete('/:id', 
  AuthMiddleware.authenticate,
  AuthMiddleware.requireAdmin,
  ValidationMiddleware.validateParams(ValidationSchemas.idParam),
  commentController.deleteComment
);

module.exports = router;