const CommentService = require('../services/CommentService');
const ErrorHandler = require('../middleware/errorHandler');

class CommentController {
  constructor() {
    this.commentService = new CommentService();
  }

  // Get all comments
  getComments = ErrorHandler.asyncHandler(async (req, res) => {
    const { postId } = req.query;
    let comments;
    
    if (postId) {
      comments = await this.commentService.getCommentsByPostId(postId);
    } else {
      comments = await this.commentService.getComments();
    }
    
    res.json({
      success: true,
      data: comments,
    });
  });

  // Get comment by ID
  getCommentById = ErrorHandler.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const comment = await this.commentService.getCommentById(id);
    
    res.json({
      success: true,
      data: comment,
    });
  });

  // Create new comment
  createComment = ErrorHandler.asyncHandler(async (req, res) => {
    const comment = await this.commentService.addComment(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Comment created successfully',
      data: comment,
    });
  });

  // Update comment
  updateComment = ErrorHandler.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedComment = await this.commentService.updateComment(id, req.body);
    
    res.json({
      success: true,
      message: 'Comment updated successfully',
      data: updatedComment,
    });
  });

  // Delete comment
  deleteComment = ErrorHandler.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await this.commentService.deleteComment(id);
    
    res.json({
      success: true,
      message: result.message,
    });
  });
}

module.exports = CommentController;