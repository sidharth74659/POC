// middlewares/roles.js
module.exports = function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const userRoles = req.user.roles || [];
    const hasRole = userRoles.some((r) => allowedRoles.includes(r));
    if (!hasRole) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
};
