class ErrorHandler {
  static handle(err, req, res, next) {
    console.error('Error:', err);

    // Prisma errors
    if (err.code === 'P2002') {
      return res.status(409).json({
        error: 'Conflict',
        message: 'A record with this data already exists',
        details: err.meta,
      });
    }

    if (err.code === 'P2025') {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Record not found',
      });
    }

    if (err.code && err.code.startsWith('P')) {
      return res.status(400).json({
        error: 'Database Error',
        message: 'An error occurred while processing your request',
      });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid Token',
        message: 'The provided token is invalid',
      });
    }

    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token Expired',
        message: 'The provided token has expired',
      });
    }

    // Validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation Error',
        message: err.message,
      });
    }

    // Custom application errors
    if (err.message === 'User not found' || 
        err.message === 'Post not found' || 
        err.message === 'Comment not found' ||
        err.message === 'Album not found' ||
        err.message === 'Photo not found' ||
        err.message === 'Todo not found') {
      return res.status(404).json({
        error: 'Not Found',
        message: err.message,
      });
    }

    if (err.message === 'Invalid credentials') {
      return res.status(401).json({
        error: 'Authentication Failed',
        message: 'Invalid email or password',
      });
    }

    if (err.message.includes('Unauthorized')) {
      return res.status(403).json({
        error: 'Forbidden',
        message: err.message,
      });
    }

    if (err.message.includes('already exists')) {
      return res.status(409).json({
        error: 'Conflict',
        message: err.message,
      });
    }

    // Default server error
    res.status(500).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    });
  }

  static notFound(req, res) {
    res.status(404).json({
      error: 'Not Found',
      message: `Route ${req.method} ${req.path} not found`,
    });
  }

  static asyncHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
}

module.exports = ErrorHandler;