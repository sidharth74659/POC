const express = require('express');
const router = express.Router();
const tenantsController = require('../../controllers/core/tenants.controller');

// Core tenant routes (no auth required for onboarding, but in production should be protected)
router.post('/', tenantsController.createTenant.bind(tenantsController));
router.get('/', tenantsController.getAllTenants.bind(tenantsController));
router.get('/:tenantId', tenantsController.getTenant.bind(tenantsController));

module.exports = router;

