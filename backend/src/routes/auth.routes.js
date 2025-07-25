const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authorizeRoles = require('../middlewares/roles');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');
const { validateBody, validateResponse } = require('../middlewares/validation');
const {
  LoginRequestSchema,
  LoginResponseSchema,
  LogoutResponseSchema,
  MeResponseSchema,
} = require('../schemas/index.js');

router.post('/users', auth, authorizeRoles('admin'), async (req, res) => {
  // Create user in this tenant
});

router.post(
  '/login',
  validateBody(LoginRequestSchema),
  validateResponse(LoginResponseSchema),
  async (req, res) => {
    const { email, password } = req.body;
    const tenantId = req.tenantId;
    if (!tenantId)
      return res.status(400).json({ message: 'Tenant not detected' });
    const user = await User.findOne({ email, tenantId });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const valid = await require('bcrypt').compare(password, user.passwordHash);
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
  },
);

router.post('/logout', validateResponse(LogoutResponseSchema), (req, res) => {
  // Stateless JWT: just return success, frontend should clear token
  res.json({ message: 'Logged out' });
});
// Protected routes
router.get(
  '/me',
  auth,
  validateResponse(MeResponseSchema),
  async (req, res) => {
    const user = await User.findOne({
      _id: req.user.id,
      tenantId: req.tenantId,
    });
    if (!user) return res.status(404).json({ message: 'Not found' });
    res.json({
      user: {
        id: user._id,
        email: user.email,
        roles: user.roles,
        tenantId: user.tenantId,
      },
    });
  },
);

module.exports = router;
