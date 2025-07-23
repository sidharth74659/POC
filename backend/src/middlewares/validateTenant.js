module.exports = (req, res, next) => {
  if (req.user.tenantId !== req.tenantId) {
    return res.status(403).json({ message: 'Tenant mismatch' });
  }
  next();
};

/* 
module.exports = function validateTenant(req, res, next) {
  if (req.tenantId && req.user && req.tenantId !== req.user.tenantId) {
    return res.status(403).json({ message: 'Tenant mismatch' });
  }
  next();
};
 */
