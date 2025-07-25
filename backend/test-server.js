require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const tenantExtractor = require('./src/middlewares/tenantExtractor');
const auth = require('./src/middlewares/auth');
const validateTenant = require('./src/middlewares/validateTenant');
const User = require('./src/models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(tenantExtractor);

// Public routes
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const tenantId = req.tenantId;
  if (!tenantId) return res.status(400).json({ message: 'Tenant not detected' });
  const user = await User.findOne({ email, tenantId });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign(
    { userId: user._id, tenantId: user.tenantId, roles: user.roles },
    process.env.JWT_SECRET,
    { expiresIn: '1d' },
  );
  res.json({
    token,
    user: {
      id: user._id,
      email: user.email,
      roles: user.roles,
      tenantId: user.tenantId,
    },
  });
});
app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Logged out' });
});
app.use('/api/tenants', require('./src/routes/tenant.routes'));
app.use('/api/users', require('./src/routes/users.routes'));

// Authenticated routes
app.use(auth);
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use(validateTenant);
app.use('/api/orders', require('./src/routes/order.routes'));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'An error occurred', error: err.message });
});

// DB connect & start
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.info('MongoDB connected');
  app.listen(process.env.PORT || 3000, () => {
    console.info(`Server running on port ${process.env.PORT || 3000}`);
  });
});
