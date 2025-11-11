const tenantService = require('../../services/tenant.service');
const logger = require('../../util/logger');

class TenantsController {
  async createTenant(req, res) {
    try {
      const tenant = await tenantService.createTenant(req.body);
      res.status(201).json({
        success: true,
        data: tenant
      });
    } catch (error) {
      logger.error('Create tenant error', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getTenant(req, res) {
    try {
      const { tenantId } = req.params;
      const tenant = await tenantService.getTenantById(tenantId);

      if (!tenant) {
        return res.status(404).json({
          success: false,
          error: 'Tenant not found'
        });
      }

      res.json({
        success: true,
        data: tenant
      });
    } catch (error) {
      logger.error('Get tenant error', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getAllTenants(req, res) {
    try {
      const tenants = await tenantService.getAllTenants();
      res.json({
        success: true,
        data: tenants
      });
    } catch (error) {
      logger.error('Get all tenants error', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new TenantsController();

