require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const tenantExtractor = require('./middlewares/tenantExtractor');
const auth = require('./middlewares/auth');
const validateTenant = require('./middlewares/validateTenant');
const path = require('path');

const app = express();

// Log every request: method, url, host
app.use((req, res, next) => {
  console.info(
    `[REQ] ${req.method} ${req.originalUrl} Host: ${req.headers.host}`,
  );
  next();
});

// Serve static frontend files
// Order matters here, static files must come before catch-all
const publicPath = path.join(__dirname, '../public/browser');
console.info('Serving static files from:', publicPath);
app.use(express.static(publicPath));

// Catch-all: serve index.html for non-API routes (for Angular client-side routing)
// This is important for Angular client-side routing and should be before auth middleware,
// as one cannot use JWT for frontend routing. but only for backend routing.
app.get(/^\/(?!api\/).*/, (req, res) => {
  console.info('Serving index.html');
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.get('/', (req, res) => {
  console.info('Serving index.html');
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.use(morgan('dev'));
app.use(express.json());
app.use(tenantExtractor);

// Public API routes (must come BEFORE static/catch-all)
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/tenants', require('./routes/tenant.routes'));

// Authenticated API routes
app.use(auth);
app.use(validateTenant);
app.use('/api/orders', require('./routes/order.routes'));

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
