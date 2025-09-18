const database = require('../utils/database');

class CommentService {
  constructor() {
    this.prisma = database.getClient();
  }

  // Get all comments
  getComments = async () => {
    return await this.prisma.comment.findMany({
      include: {
        post: {
          select: {
            id: true,
            title: true,
            user: {
              select: {
                id: true,
                name: true,
                username: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  };

  // Get comment by ID
  getCommentById = async (id) => {
    const comment = await this.prisma.comment.findUnique({
      where: { id: parseInt(id) },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            user: {
              select: {
                id: true,
                name: true,
                username: true,
              },
            },
          },
        },
      },
    });

    if (!comment) {
      throw new Error('Comment not found');
    }

    return comment;
  };

  // Get comments by post ID
  getCommentsByPostId = async (postId) => {
    // Verify post exists
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

  // Create new comment
  addComment = async (commentData) => {
    const { postId, ...data } = commentData;

    // Verify post exists
    const post = await this.prisma.post.findUnique({
      where: { id: parseInt(postId) },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    return await this.prisma.comment.create({
      data: {
        ...data,
        postId: parseInt(postId),
      },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            user: {
              select: {
                id: true,
                name: true,
                username: true,
              },
            },
          },
        },
      },
    });
  };

  // Update comment
  updateComment = async (id, commentData) => {
    const existingComment = await this.prisma.comment.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingComment) {
      throw new Error('Comment not found');
    }

    return await this.prisma.comment.update({
      where: { id: parseInt(id) },
      data: commentData,
      include: {
        post: {
          select: {
            id: true,
            title: true,
            user: {
              select: {
                id: true,
                name: true,
                username: true,
              },
            },
          },
        },
      },
    });
  };

  // Delete comment
  deleteComment = async (id) => {
    const existingComment = await this.prisma.comment.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingComment) {
      throw new Error('Comment not found');
    }

    await this.prisma.comment.delete({
      where: { id: parseInt(id) },
    });

    return { message: 'Comment deleted successfully' };
  };
}

module.exports = CommentService;