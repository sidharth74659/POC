const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/core/users.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const tenantMiddleware = require('../../middleware/tenant.middleware');

// User management routes (protected)
router.use(authMiddleware);
router.use(tenantMiddleware);

router.get('/', usersController.getUsers.bind(usersController));
router.get('/:userId', usersController.getUser.bind(usersController));
router.post('/:userId/assign-role', usersController.assignRole.bind(usersController));

module.exports = router;

