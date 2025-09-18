const UserService = require('../services/UserService');
const ErrorHandler = require('../middleware/errorHandler');

class AuthController {
  constructor() {
    this.userService = new UserService();
  }

  // User registration
  register = ErrorHandler.asyncHandler(async (req, res) => {
    const result = await this.userService.register(req.body);
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  });

  // User login
  login = ErrorHandler.asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await this.userService.login(email, password);
    
    res.json({
      success: true,
      message: 'Login successful',
      data: result,
    });
  });

  // Get current user profile
  getProfile = ErrorHandler.asyncHandler(async (req, res) => {
    const user = await this.userService.getUserById(req.user.id);
    
    res.json({
      success: true,
      data: user,
    });
  });

  // Update current user profile
  updateProfile = ErrorHandler.asyncHandler(async (req, res) => {
    const updatedUser = await this.userService.updateUser(req.user.id, req.body);
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  });
}

module.exports = AuthController;