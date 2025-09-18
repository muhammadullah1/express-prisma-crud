const UserService = require('../services/UserService');
const ErrorHandler = require('../middleware/errorHandler');

class UserController {
  constructor() {
    this.userService = new UserService();
  }

  // Get all users
  getUsers = ErrorHandler.asyncHandler(async (req, res) => {
    const users = await this.userService.getUsers();
    
    res.json({
      success: true,
      data: users,
    });
  });

  // Get user by ID
  getUserById = ErrorHandler.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await this.userService.getUserById(id);
    
    res.json({
      success: true,
      data: user,
    });
  });

  // Create new user (Admin only)
  createUser = ErrorHandler.asyncHandler(async (req, res) => {
    const user = await this.userService.addUser(req.body);
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user,
    });
  });

  // Update user (Admin only or own profile)
  updateUser = ErrorHandler.asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Check if user is updating their own profile or is admin
    if (parseInt(id) !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'You can only update your own profile',
      });
    }

    const updatedUser = await this.userService.updateUser(id, req.body);
    
    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    });
  });

  // Delete user (Admin only)
  deleteUser = ErrorHandler.asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Prevent admin from deleting themselves
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'You cannot delete your own account',
      });
    }

    const result = await this.userService.deleteUser(id);
    
    res.json({
      success: true,
      message: result.message,
    });
  });
}

module.exports = UserController;