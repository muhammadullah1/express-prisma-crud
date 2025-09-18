const express = require('express');
const AuthController = require('../controllers/AuthController');
const AuthMiddleware = require('../middleware/auth');
const { ValidationMiddleware, ValidationSchemas } = require('../middleware/validation');

const router = express.Router();
const authController = new AuthController();

// Public routes
router.post('/register', 
  ValidationMiddleware.validate(ValidationSchemas.userRegistration),
  authController.register
);

router.post('/login', 
  ValidationMiddleware.validate(ValidationSchemas.userLogin),
  authController.login
);

// Protected routes
router.get('/profile', 
  AuthMiddleware.authenticate,
  authController.getProfile
);

router.put('/profile', 
  AuthMiddleware.authenticate,
  ValidationMiddleware.validate(ValidationSchemas.userUpdate),
  authController.updateProfile
);

module.exports = router;