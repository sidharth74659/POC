const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const auth = require('../middlewares/auth');
const authorizeRoles = require('../middlewares/roles');
const {
  validateBody,
  validateParams,
  validateResponse,
} = require('../middlewares/validation');
const {
  UserCreateRequestSchema,
  UserUpdateRequestSchema,
  UserIdParamSchema,
  UserResponseSchema,
  UsersResponseSchema,
  UserDeleteResponseSchema,
} = require('../schemas');

router.get(
  '/',
  auth,
  authorizeRoles('admin'),
  validateResponse(UsersResponseSchema),
  async (req, res) => {
    const users = await User.find({ tenantId: req.tenantId });
    res.json(users.map((u) => ({ id: u._id, email: u.email, roles: u.roles })));
  },
);

router.post(
  '/',
  auth,
  authorizeRoles('admin'),
  validateBody(UserCreateRequestSchema),
  validateResponse(UserResponseSchema),
  async (req, res) => {
    const { email, password, roles } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      tenantId: req.tenantId,
      email,
      passwordHash,
      roles,
    });
    res
      .status(201)
      .json({ id: user._id, email: user.email, roles: user.roles });
  },
);

router.put(
  '/:id',
  auth,
  authorizeRoles('admin'),
  validateParams(UserIdParamSchema),
  validateBody(UserUpdateRequestSchema),
  validateResponse(UserResponseSchema),
  async (req, res) => {
    const { email, password, roles } = req.body;
    const update = { email, roles };
    if (password) update.passwordHash = await bcrypt.hash(password, 10);
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.tenantId },
      update,
      { new: true },
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ id: user._id, email: user.email, roles: user.roles });
  },
);

router.delete(
  '/:id',
  auth,
  authorizeRoles('admin'),
  validateParams(UserIdParamSchema),
  validateResponse(UserDeleteResponseSchema),
  async (req, res) => {
    const user = await User.findOneAndDelete({
      _id: req.params.id,
      tenantId: req.tenantId,
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  },
);

module.exports = router;
