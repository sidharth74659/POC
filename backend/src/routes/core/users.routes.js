const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/core/users.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const tenantMiddleware = require('../../middleware/tenant.middleware');

// Core user routes
// POST /api/v1/core/users - Allow creating users without auth for onboarding
router.post('/', usersController.createUser.bind(usersController));
// All other routes require authentication
router.get('/', authMiddleware, tenantMiddleware, usersController.getUsers.bind(usersController));
router.get('/:userId', authMiddleware, tenantMiddleware, usersController.getUser.bind(usersController));
router.post('/:userId/assign-role', authMiddleware, tenantMiddleware, usersController.assignRole.bind(usersController));

module.exports = router;

