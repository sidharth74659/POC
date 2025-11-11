const Form = require('../models/form.model');
const logger = require('../util/logger');

class FormService {
  async createForm(formData, tenantId, createdBy) {
    try {
      const { formId, title, description, fields, status } = formData;

      const form = new Form({
        formId,
        tenantId,
        title,
        description,
        fields: fields || [],
        status: status || 'draft',
        createdBy
      });

      await form.save();

      logger.info('Form created', {
        formId: form.formId,
        tenantId: form.tenantId,
        createdBy
      });

      return form;
    } catch (error) {
      logger.error('Failed to create form', error);
      throw error;
    }
  }

  async getFormsByTenant(tenantId, filters = {}) {
    try {
      const query = { tenantId, ...filters };
      const forms = await Form.find(query).sort({ createdAt: -1 });
      return forms;
    } catch (error) {
      logger.error('Failed to get forms by tenant', error, { tenantId });
      throw error;
    }
  }

  async getFormById(formId, tenantId) {
    try {
      const form = await Form.findOne({ formId, tenantId });
      return form;
    } catch (error) {
      logger.error('Failed to get form', error, { formId, tenantId });
      throw error;
    }
  }

  async updateForm(formId, tenantId, updateData) {
    try {
      const form = await Form.findOneAndUpdate(
        { formId, tenantId },
        { $set: updateData },
        { new: true, runValidators: true }
      );
      return form;
    } catch (error) {
      logger.error('Failed to update form', error, { formId, tenantId });
      throw error;
    }
  }

  async deleteForm(formId, tenantId) {
    try {
      const form = await Form.findOneAndDelete({ formId, tenantId });
      return form;
    } catch (error) {
      logger.error('Failed to delete form', error, { formId, tenantId });
      throw error;
    }
  }
}

module.exports = new FormService();

