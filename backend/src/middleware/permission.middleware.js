const logger = require('../util/logger');

const checkPermission = (permissionKey) => {
  return (req, res, next) => {
    try {
      if (!req.roles || !Array.isArray(req.roles)) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'No roles assigned'
        });
      }

      // Check if user has the required permission/role
      const hasPermission = req.roles.includes(permissionKey);

      if (!hasPermission) {
        logger.warn('Permission denied', {
          tenantId: req.tenantId,
          userId: req.userId,
          requiredPermission: permissionKey,
          userRoles: req.roles,
          path: req.path
        });
        return res.status(403).json({
          error: 'Forbidden',
          message: `Permission denied: ${permissionKey} required`
        });
      }

      logger.info('Permission granted', {
        tenantId: req.tenantId,
        userId: req.userId,
        permission: permissionKey,
        path: req.path
      });

      next();
    } catch (error) {
      logger.error('Permission check failed', error, {
        tenantId: req.tenantId,
        userId: req.userId,
        path: req.path
      });
      return res.status(500).json({
        error: 'Internal Server Error',
        message: 'Permission check error'
      });
    }
  };
};

module.exports = checkPermission;

