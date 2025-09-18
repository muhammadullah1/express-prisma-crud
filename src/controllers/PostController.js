const PostService = require('../services/PostService');
const ErrorHandler = require('../middleware/errorHandler');

class PostController {
  constructor() {
    this.postService = new PostService();
  }

  // Get all posts
  getPosts = ErrorHandler.asyncHandler(async (req, res) => {
    const { userId } = req.query;
    let posts;
    
    if (userId) {
      posts = await this.postService.getPostsByUserId(userId);
    } else {
      posts = await this.postService.getPosts();
    }
    
    res.json({
      success: true,
      data: posts,
    });
  });

  // Get post by ID
  getPostById = ErrorHandler.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const post = await this.postService.getPostById(id);
    
    res.json({
      success: true,
      data: post,
    });
  });

  // Get comments for a post
  getPostComments = ErrorHandler.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const comments = await this.postService.getPostComments(id);
    
    res.json({
      success: true,
      data: comments,
    });
  });

  // Create new post
  createPost = ErrorHandler.asyncHandler(async (req, res) => {
    const postData = req.body;
    
    const post = await this.postService.addPost(postData, req.user.id);
    
    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post,
    });
  });

  // Update post
  updatePost = ErrorHandler.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedPost = await this.postService.updatePost(id, req.body, req.user.id);
    
    res.json({
      success: true,
      message: 'Post updated successfully',
      data: updatedPost,
    });
  });

  // Delete post
  deletePost = ErrorHandler.asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await this.postService.deletePost(id, req.user.id);
    
    res.json({
      success: true,
      message: result.message,
    });
  });
}

module.exports = PostController;