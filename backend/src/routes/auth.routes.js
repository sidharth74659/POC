const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authorizeRoles = require('../middlewares/roles');

// Only admin can create users
router.post('/users', authorizeRoles('admin'), async (req, res) => {
  // Create user in this tenant
});

router.get('/me', async (req, res) => {
  // For user-specific queries:
  const user = await User.findOne({ _id: req.user.id, tenantId: req.tenantId });
  if (!user) return res.status(404).json({ message: 'Not found' });
  res.json(user);
});

module.exports = router;
