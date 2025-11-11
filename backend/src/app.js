require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const logger = require('./util/logger');
const { initRedis, getRedisClient } = require('./util/redis.client');
const rateLimitMiddleware = require('./middleware/rateLimit.middleware');
const subdomainMiddleware = require('./middleware/subdomain.middleware');

// Import routes
const authRoutes = require('./routes/auth.routes');
const coreTenantsRoutes = require('./routes/core/tenants.routes');
const coreUsersRoutes = require('./routes/core/users.routes');
const formsRoutes = require('./routes/forms/forms.routes');
const workOrdersRoutes = require('./routes/maintenance/workOrders.routes');
const usersRoutes = require('./routes/users/users.routes');

// Import models
const Tenant = require('./models/tenant.model');
const User = require('./models/user.model');
const Form = require('./models/form.model');
const WorkOrder = require('./models/workOrder.model');
const Role = require('./models/role.model');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from frontend directory
// __dirname is /app/src, so ../frontend is /app/frontend
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// Subdomain middleware - extract tenant from subdomain
app.use(subdomainMiddleware);

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.request(req, res, duration);
  });
  next();
});

// Global rate limiting
app.use(rateLimitMiddleware(60000, 1000));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Data visualization route
app.get('/api/v1/data/visualize', async (req, res) => {
  try {
    const mongoData = {};
    const redisData = {};

    // Fetch all MongoDB collections
    try {
      mongoData.tenants = await Tenant.find({}).lean();
      mongoData.users = await User.find({}).lean();
      mongoData.forms = await Form.find({}).lean();
      mongoData.workOrders = await WorkOrder.find({}).lean();
      mongoData.roles = await Role.find({}).lean();
    } catch (error) {
      logger.error('Error fetching MongoDB data', error);
      mongoData.error = error.message;
    }

    // Fetch Redis keys and values
    try {
      const redis = getRedisClient();
      const keys = await redis.keys('tenant:*');
      const redisEntries = {};

      for (const key of keys) {
        const type = await redis.type(key);
        let value;

        if (type === 'string') {
          value = await redis.get(key);
        } else if (type === 'hash') {
          value = await redis.hGetAll(key);
        } else if (type === 'list') {
          value = await redis.lRange(key, 0, -1);
        } else if (type === 'set') {
          value = await redis.sMembers(key);
        } else if (type === 'zset') {
          value = await redis.zRange(key, 0, -1, { WITHSCORES: true });
        } else {
          value = `Type: ${type}`;
        }

        redisEntries[key] = {
          type,
          value,
          ttl: await redis.ttl(key)
        };
      }

      redisData.keys = redisEntries;
      redisData.totalKeys = keys.length;
    } catch (error) {
      logger.error('Error fetching Redis data', error);
      redisData.error = error.message;
    }

    res.json({
      success: true,
      data: {
        mongodb: mongoData,
        redis: redisData,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Error in data visualization', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/core/tenants', coreTenantsRoutes);
app.use('/api/v1/core/users', coreUsersRoutes);
app.use('/api/v1/forms', formsRoutes);
app.use('/api/v1/maintenance/work_orders', workOrdersRoutes);
app.use('/api/v1/users', usersRoutes);

// Serve index.html for root and all non-API routes
app.get('*', (req, res, next) => {
  // Skip API routes
  if (req.path.startsWith('/api/')) {
    return next();
  }
  const indexPath = path.join(frontendPath, 'index.html');
  res.sendFile(indexPath);
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error', err, {
    path: req.path,
    method: req.method
  });

  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// 404 handler for API routes only
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      error: 'Route not found'
    });
  }
  const indexPath = path.join(frontendPath, 'index.html');
  res.sendFile(indexPath);
});

// Initialize MongoDB connection
const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('MongoDB connected', {
      uri: process.env.MONGODB_URI.replace(/\/\/.*@/, '//***@')
    });
  } catch (error) {
    logger.error('MongoDB connection error', error);
    process.exit(1);
  }
};

// Initialize Redis connection
const initializeServices = async () => {
  try {
    await connectMongo();
    await initRedis();
    logger.info('All services initialized');
  } catch (error) {
    logger.error('Failed to initialize services', error);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  await initializeServices();

  app.listen(PORT, () => {
    logger.info('Server started', {
      port: PORT,
      environment: process.env.NODE_ENV
    });
  });
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await mongoose.connection.close();
  process.exit(0);
});

startServer();

module.exports = app;

