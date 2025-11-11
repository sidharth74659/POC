const Tenant = require('../models/tenant.model');
const logger = require('../util/logger');

class TenantService {
  async createTenant(tenantData) {
    try {
      const { tenantId, name, subdomain, metadata } = tenantData;

      // Check if tenant already exists
      const existingTenant = await Tenant.findOne({
        $or: [
          { tenantId },
          { subdomain }
        ]
      });

      if (existingTenant) {
        throw new Error('Tenant with this ID or subdomain already exists');
      }

      const tenant = new Tenant({
        tenantId,
        name,
        subdomain,
        status: 'active',
        metadata: metadata || {}
      });

      await tenant.save();

      logger.info('Tenant created', {
        tenantId: tenant.tenantId,
        name: tenant.name
      });

      return tenant;
    } catch (error) {
      logger.error('Failed to create tenant', error);
      throw error;
    }
  }

  async getTenantById(tenantId) {
    try {
      const tenant = await Tenant.findOne({ tenantId });
      return tenant;
    } catch (error) {
      logger.error('Failed to get tenant', error, { tenantId });
      throw error;
    }
  }

  async getAllTenants() {
    try {
      const tenants = await Tenant.find({});
      return tenants;
    } catch (error) {
      logger.error('Failed to get all tenants', error);
      throw error;
    }
  }

  async updateTenant(tenantId, updateData) {
    try {
      const tenant = await Tenant.findOneAndUpdate(
        { tenantId },
        { $set: updateData },
        { new: true, runValidators: true }
      );
      return tenant;
    } catch (error) {
      logger.error('Failed to update tenant', error, { tenantId });
      throw error;
    }
  }
}

module.exports = new TenantService();

