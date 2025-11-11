const formService = require('../services/form.service');
const logger = require('../util/logger');

class FormsController {
  async createForm(req, res) {
    try {
      const { tenantId, userId } = req;
      const form = await formService.createForm(req.body, tenantId, userId);
      res.status(201).json({
        success: true,
        data: form
      });
    } catch (error) {
      logger.error('Create form error', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getForms(req, res) {
    try {
      const { tenantId } = req;
      const { status } = req.query;
      const filters = status ? { status } : {};
      const forms = await formService.getFormsByTenant(tenantId, filters);
      res.json({
        success: true,
        data: forms
      });
    } catch (error) {
      logger.error('Get forms error', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getForm(req, res) {
    try {
      const { formId } = req.params;
      const { tenantId } = req;
      const form = await formService.getFormById(formId, tenantId);

      if (!form) {
        return res.status(404).json({
          success: false,
          error: 'Form not found'
        });
      }

      res.json({
        success: true,
        data: form
      });
    } catch (error) {
      logger.error('Get form error', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async updateForm(req, res) {
    try {
      const { formId } = req.params;
      const { tenantId } = req;
      const form = await formService.updateForm(formId, tenantId, req.body);

      if (!form) {
        return res.status(404).json({
          success: false,
          error: 'Form not found'
        });
      }

      res.json({
        success: true,
        data: form
      });
    } catch (error) {
      logger.error('Update form error', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async deleteForm(req, res) {
    try {
      const { formId } = req.params;
      const { tenantId } = req;
      const form = await formService.deleteForm(formId, tenantId);

      if (!form) {
        return res.status(404).json({
          success: false,
          error: 'Form not found'
        });
      }

      res.json({
        success: true,
        message: 'Form deleted successfully'
      });
    } catch (error) {
      logger.error('Delete form error', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new FormsController();

