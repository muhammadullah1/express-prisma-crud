const database = require('../utils/database');

class PostService {
  constructor() {
    this.prisma = database.getClient();
  }

  // Get all posts
  getPosts = async () => {
    return await this.prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
          },
        },
        comments: {
          select: {
            id: true,
            name: true,
            email: true,
            body: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  };

  // Get post by ID
  getPostById = async (id) => {
    const post = await this.prisma.post.findUnique({
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
        comments: {
          select: {
            id: true,
            name: true,
            email: true,
            body: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    return post;
  };

  // Get posts by user ID
  getPostsByUserId = async (userId) => {
    return await this.prisma.post.findMany({
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
        comments: {
          select: {
            id: true,
            name: true,
            email: true,
            body: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  };

  // Get comments for a specific post
  getPostComments = async (postId) => {
    const post = await this.prisma.post.findUnique({
      where: { id: parseInt(postId) },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    return await this.prisma.comment.findMany({
      where: { postId: parseInt(postId) },
      orderBy: {
        createdAt: 'desc',
      },
    });
  };

  // Create new post
  addPost = async (postData, userId) => {
    return await this.prisma.post.create({
      data: {
        ...postData,
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

  // Update post
  updatePost = async (id, postData, userId, userRole) => {
    const existingPost = await this.prisma.post.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingPost) {
      throw new Error('Post not found');
    }

    // Check if user owns the post or is admin
    if (existingPost.userId !== parseInt(userId) && userRole !== 'ADMIN') {
      throw new Error('Unauthorized to update this post');
    }

    return await this.prisma.post.update({
      where: { id: parseInt(id) },
      data: postData,
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

  // Delete post
  deletePost = async (id, userId, userRole) => {
    const existingPost = await this.prisma.post.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingPost) {
      throw new Error('Post not found');
    }

    // Check if user owns the post or is admin
    if (existingPost.userId !== parseInt(userId) && userRole !== 'ADMIN') {
      throw new Error('Unauthorized to delete this post');
    }

    await this.prisma.post.delete({
      where: { id: parseInt(id) },
    });

    return { message: 'Post deleted successfully' };
  };
}

module.exports = PostService;