require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const tenantExtractor = require('./middlewares/tenantExtractor');
const auth = require('./middlewares/auth');
const validateTenant = require('./middlewares/validateTenant');
const path = require('path');

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(tenantExtractor);

// app.get('/', (req, res) => {
//   res.send('Welcome to the Multi-Tenant SaaS API. Tenant ID: ' + req.tenantId);
// });

// Serve static frontend files
const publicPath = path.join(__dirname, '../public/browser');
console.info('Serving static files from:', publicPath);
app.use(express.static(publicPath));

// Catch-all: serve index.html for non-API routes (for Angular client-side routing)
app.get(/^\/(?!api\/).*/, (req, res) => {
  console.info('Serving index.html');
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Public routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/tenants', require('./routes/tenant.routes'));

// Authenticated routes
app.use(auth);
app.use(validateTenant);
app.use('/api/orders', require('./routes/order.routes'));

/* 
const authorizeRoles = require('./middlewares/roles');
app.get('/api/orders', authorizeRoles('agent', 'admin'), async (req, res) => {
    const orders = await Order.find({ tenantId: req.tenantId });
    res.json(orders);
});
 */

// Common error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'An error occurred', error: err.message });
});

// DB connect & start
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.info('MongoDB connected');
  app.listen(process.env.PORT || 3000, () => {
    console.info(
      `Server running on http://localhost:${process.env.PORT || 3000}`,
    );
  });
});
