const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');
const config = require('./config');
const instructionRoutes = require('./routes/instructions');

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: {
    error: 'Too many requests',
    message: 'Rate limit exceeded. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Voice AI API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    deepLinking: true
  }
}));

// Routes
app.use('/api', instructionRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Voice AI Instruction Mapping Server',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      'POST /api/process-instruction': 'Process user input and return mapped instruction',
      'GET /api/instructions': 'Get list of available instructions',
      'GET /api/health': 'Health check endpoint',
      'GET /api-docs': 'API Documentation (Swagger UI)'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'The requested endpoint does not exist',
    availableEndpoints: [
      'GET / - Server information',
      'GET /api-docs - API Documentation',
      'POST /api/process-instruction - Process instructions',
      'GET /api/instructions - Get available instructions',
      'GET /api/health - Health check'
    ]
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  
  res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected error occurred',
    ...(config.nodeEnv === 'development' && { stack: error.stack })
  });
});

// Start server
const PORT = config.port;

app.listen(PORT, () => {
  console.log(`🚀 Voice AI Server running on port ${PORT}`);
  console.log(`📡 Environment: ${config.nodeEnv}`);
  console.log(`🔗 CORS Origin: ${config.corsOrigin}`);
  console.log(`⏱️  Rate Limit: ${config.rateLimitMaxRequests} requests per ${config.rateLimitWindowMs / 60000} minutes`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`🎯 Available endpoints:`);
  console.log(`   POST /api/process-instruction - Process user input`);
  console.log(`   GET /api/instructions - Get available instructions`);
  console.log(`   GET /api/health - Health check`);
  console.log(`   GET /api-docs - API Documentation`);
  console.log(`   GET / - Server info`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

module.exports = app; 