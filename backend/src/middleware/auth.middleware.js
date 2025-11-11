const jwt = require('jsonwebtoken');
const logger = require('../util/logger');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or invalid authorization header'
      });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Extract tenant_id, user_id, roles from JWT payload
    req.jwtTenantId = decoded.tenant_id || decoded.tenantId; // Store separately
    req.userId = decoded.user_id || decoded.userId;
    req.roles = decoded.roles || [];

    if (!req.jwtTenantId || !req.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token: missing tenant_id or user_id'
      });
    }
    
    // Set tenantId for backward compatibility (will be overridden by tenant middleware if subdomain exists)
    req.tenantId = req.jwtTenantId;

    logger.info('Authentication successful', {
      tenantId: req.tenantId,
      userId: req.userId,
      path: req.path
    });

    next();
  } catch (error) {
    logger.error('Authentication failed', error, {
      path: req.path
    });

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Token expired'
      });
    }

    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication error'
    });
  }
};

module.exports = authMiddleware;

