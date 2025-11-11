const Tenant = require('../models/tenant.model');
const logger = require('../util/logger');

/**
 * Extract tenant from subdomain
 * Supports formats like: tenant1.example.com, tenant1.unified-platform-poc.srikanthvudharapu.workers.dev
 */
const extractTenantFromSubdomain = (hostname) => {
  if (!hostname) {
    return null;
  }

  // Remove port if present
  const host = hostname.split(':')[0];
  
  // Split by dots
  const parts = host.split('.');
  
  // For cloudflare tunnels, subdomain is typically the first part
  // e.g., tenant1.unified-platform-poc.srikanthvudharapu.workers.dev
  // or tenant1.example.com
  if (parts.length >= 2) {
    const subdomain = parts[0];
    
    // Check if it looks like a tenant subdomain (tenant1, tenant2, etc.)
    if (subdomain.startsWith('tenant') || subdomain.match(/^[a-z0-9-]+$/)) {
      return subdomain;
    }
  }
  
  return null;
};

/**
 * Middleware to extract tenant from subdomain and set on request
 */
const subdomainMiddleware = async (req, res, next) => {
  try {
    const hostname = req.get('host') || req.hostname;
    const subdomain = extractTenantFromSubdomain(hostname);
    
    if (subdomain) {
      // Try to find tenant by subdomain
      const tenant = await Tenant.findOne({ 
        $or: [
          { subdomain: subdomain },
          { tenantId: subdomain }
        ]
      });
      
      if (tenant) {
        req.subdomain = subdomain;
        req.subdomainTenantId = tenant.tenantId; // Store separately from JWT tenantId
        req.tenant = tenant;
        
        logger.info('Tenant identified from subdomain', {
          hostname,
          subdomain,
          tenantId: tenant.tenantId,
          path: req.path
        });
      } else {
        logger.warn('Tenant not found for subdomain', {
          hostname,
          subdomain,
          path: req.path
        });
      }
    } else {
      logger.info('No subdomain detected', {
        hostname,
        path: req.path
      });
    }
    
    next();
  } catch (error) {
    logger.error('Subdomain middleware error', error, {
      hostname: req.get('host'),
      path: req.path
    });
    next();
  }
};

module.exports = subdomainMiddleware;

