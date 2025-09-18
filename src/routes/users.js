const express = require('express');
const UserController = require('../controllers/UserController');
const AuthMiddleware = require('../middleware/auth');
const { ValidationMiddleware, ValidationSchemas } = require('../middleware/validation');

const router = express.Router();
const userController = new UserController();

// Get all users (public for JSONPlaceholder compatibility)
router.get('/', userController.getUsers);

// Get user by ID (public for JSONPlaceholder compatibility)
router.get('/:id', 
  ValidationMiddleware.validateParams(ValidationSchemas.idParam),
  userController.getUserById
);

// Create user (admin only)
router.post('/', 
  AuthMiddleware.authenticate,
  AuthMiddleware.requireAdmin,
  ValidationMiddleware.validate(ValidationSchemas.userRegistration),
  userController.createUser
);

// Update user (admin or own profile)
router.put('/:id', 
  AuthMiddleware.authenticate,
  ValidationMiddleware.validateParams(ValidationSchemas.idParam),
  ValidationMiddleware.validate(ValidationSchemas.userUpdate),
  userController.updateUser
);

// Delete user (admin only)
router.delete('/:id', 
  AuthMiddleware.authenticate,
  AuthMiddleware.requireAdmin,
  ValidationMiddleware.validateParams(ValidationSchemas.idParam),
  userController.deleteUser
);

module.exports = router;