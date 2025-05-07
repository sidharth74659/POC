const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger');

// Import routes
const resourceRoutes = require('./routes/resourceRoutes');
const operationRoutes = require('./routes/operationRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Register routes
app.use('/resources', resourceRoutes);
app.use('/operations', operationRoutes);
app.use('/ai/chat', chatRoutes);

// Root route for health check
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Smart Scheduler API is running',
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error handler:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
  console.log(`Health check available at http://localhost:${PORT}/`);
  console.log(`Chat endpoint available at http://localhost:${PORT}/ai/chat`);
  console.log(`Direct chat endpoint available at http://localhost:${PORT}/ai/chat/direct`);
});

module.exports = app; 