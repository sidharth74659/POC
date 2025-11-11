const Tenant = require('../models/tenant.model');
const logger = require('../util/logger');

const tenantMiddleware = async (req, res, next) => {
  try {
    // Priority: subdomain tenant > JWT tenant
    const subdomainTenantId = req.subdomainTenantId; // Set by subdomain middleware
    const jwtTenantId = req.jwtTenantId; // Set by auth middleware (from JWT)
    
    // If subdomain tenant is set, use it (enforces subdomain-based routing)
    const effectiveTenantId = subdomainTenantId || jwtTenantId;
    
    if (!effectiveTenantId) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Tenant ID is required. Please access via tenant subdomain or provide tenantId in token.'
      });
    }

    // If JWT tenant exists and doesn't match subdomain tenant, reject
    if (subdomainTenantId && jwtTenantId && subdomainTenantId !== jwtTenantId) {
      logger.warn('Tenant mismatch: JWT tenant does not match subdomain tenant', {
        subdomainTenantId,
        jwtTenantId,
        path: req.path
      });
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied: Token tenant does not match subdomain tenant'
      });
    }

    // Load tenant from MongoDB
    const tenant = await Tenant.findOne({ tenantId: effectiveTenantId });

    if (!tenant) {
      logger.warn('Tenant not found', {
        tenantId: effectiveTenantId,
        path: req.path
      });
      return res.status(404).json({
        error: 'Not Found',
        message: 'Tenant not found'
      });
    }

    if (tenant.status !== 'active') {
      logger.warn('Tenant is not active', {
        tenantId: effectiveTenantId,
        status: tenant.status,
        path: req.path
      });
      return res.status(403).json({
        error: 'Forbidden',
        message: `Tenant is ${tenant.status}`
      });
    }

    // Attach tenant info to request (use effective tenant)
    req.tenant = tenant;
    req.tenantId = effectiveTenantId; // Ensure consistent tenantId

    logger.info('Tenant validation successful', {
      tenantId: effectiveTenantId,
      tenantName: tenant.name,
      subdomainTenantId,
      jwtTenantId,
      path: req.path
    });

    next();
  } catch (error) {
    logger.error('Tenant validation failed', error, {
      tenantId: req.tenantId,
      path: req.path
    });
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Tenant validation error'
    });
  }
};

module.exports = tenantMiddleware;

