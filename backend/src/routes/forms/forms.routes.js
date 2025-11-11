const express = require('express');
const router = express.Router();
const formsController = require('../../controllers/forms.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const tenantMiddleware = require('../../middleware/tenant.middleware');

// All routes require authentication and tenant validation
router.use(authMiddleware);
router.use(tenantMiddleware);

router.post('/', formsController.createForm.bind(formsController));
router.get('/', formsController.getForms.bind(formsController));
router.get('/:formId', formsController.getForm.bind(formsController));
router.put('/:formId', formsController.updateForm.bind(formsController));
router.delete('/:formId', formsController.deleteForm.bind(formsController));

module.exports = router;

