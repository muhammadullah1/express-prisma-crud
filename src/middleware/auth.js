const AuthUtils = require('../utils/auth');
const database = require('../utils/database');

class AuthMiddleware {
  // Verify JWT token and attach user to request
  static async authenticate(req, res, next) {
    try {
      const token = AuthUtils.extractTokenFromHeader(req.headers.authorization);
      
      if (!token) {
        return res.status(401).json({
          error: 'Access denied. No token provided.',
        });
      }

      const decoded = AuthUtils.verifyToken(token);
      
      // Get user from database to ensure they still exist
      const prisma = database.getClient();
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          role: true,
          name: true,
          username: true,
        },
      });

      if (!user) {
        return res.status(401).json({
          error: 'Invalid token. User not found.',
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        error: 'Invalid token.',
      });
    }
  }

  // Check if user is admin
  static requireAdmin(req, res, next) {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        error: 'Access denied. Admin privileges required.',
      });
    }
    next();
  }

  // Optional authentication - doesn't fail if no token
  static async optionalAuth(req, res, next) {
    try {
      const token = AuthUtils.extractTokenFromHeader(req.headers.authorization);
      
      if (token) {
        const decoded = AuthUtils.verifyToken(token);
        const prisma = database.getClient();
        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
          select: {
            id: true,
            email: true,
            role: true,
            name: true,
            username: true,
          },
        });

        if (user) {
          req.user = user;
        }
      }
      
      next();
    } catch (error) {
      // Continue without authentication
      next();
    }
  }
}

module.exports = AuthMiddleware;