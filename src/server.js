const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import middleware and routes
const routes = require('./routes');
const ErrorHandler = require('./middleware/errorHandler');
const Database = require('./utils/database');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.database = Database;
    
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  initializeMiddleware() {
    // Security middleware
    this.app.use(helmet());
    
    // CORS configuration
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN || '*',
      credentials: true,
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: {
        error: 'Too many requests',
        message: 'Too many requests from this IP, please try again later.',
      },
    });
    this.app.use('/api/', limiter);

    // Logging
    if (process.env.NODE_ENV !== 'test') {
      this.app.use(morgan('combined'));
    }

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request timestamp
    this.app.use((req, res, next) => {
      req.timestamp = new Date().toISOString();
      next();
    });
  }

  initializeRoutes() {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({
        success: true,
        message: 'Server is running',
        timestamp: req.timestamp,
        uptime: process.uptime(),
      });
    });

    // API routes
    this.app.use('/api', routes);

    // Root endpoint
    this.app.get('/', (req, res) => {
      res.json({
        message: 'Welcome to JSONPlaceholder-like CRUD API',
        version: '1.0.0',
        documentation: '/api',
        health: '/health',
        timestamp: req.timestamp,
      });
    });
  }

  initializeErrorHandling() {
    // 404 handler
    this.app.use(ErrorHandler.notFound);

    // Global error handler
    this.app.use(ErrorHandler.handle);
  }

  async start() {
    try {
      // Connect to database
      await this.database.connect();
      // console.log('✅ Database connected successfully');

      // Start server
      this.server = this.app.listen(this.port, () => {
        console.log(`🚀 Server running on port ${this.port}`);
        console.log(`📚 API Documentation: http://localhost:${this.port}/api`);
        console.log(`🏥 Health Check: http://localhost:${this.port}/health`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      });

      // Graceful shutdown
      process.on('SIGTERM', this.gracefulShutdown.bind(this));
      process.on('SIGINT', this.gracefulShutdown.bind(this));

    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  }

  async gracefulShutdown(signal) {
    console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
    
    if (this.server) {
      this.server.close(async () => {
        console.log('📡 HTTP server closed');
        
        try {
          await this.database.disconnect();
          console.log('🔌 Database disconnected');
          console.log('✅ Graceful shutdown completed');
          process.exit(0);
        } catch (error) {
          console.error('❌ Error during shutdown:', error);
          process.exit(1);
        }
      });
    }
  }
}

// Start server if this file is run directly
if (require.main === module) {
  const server = new Server();
  server.start();
}

module.exports = Server;