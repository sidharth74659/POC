const express = require('express');
const router = express.Router();
const workOrdersController = require('../../controllers/workOrders.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const tenantMiddleware = require('../../middleware/tenant.middleware');

// All routes require authentication and tenant validation
router.use(authMiddleware);
router.use(tenantMiddleware);

router.post('/', workOrdersController.createWorkOrder.bind(workOrdersController));
router.get('/', workOrdersController.getWorkOrders.bind(workOrdersController));
router.get('/:workOrderId', workOrdersController.getWorkOrder.bind(workOrdersController));
router.put('/:workOrderId', workOrdersController.updateWorkOrder.bind(workOrdersController));
router.delete('/:workOrderId', workOrdersController.deleteWorkOrder.bind(workOrdersController));

module.exports = router;

