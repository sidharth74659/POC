// middlewares/tenantExtractor.js
const Tenant = require('../models/Tenant');

async function extractTenantId(req, res, next) {
  const host = req.headers.host;
  const subdomain = host.split('.')[0];
  if (!subdomain) return res.status(400).json({ message: 'Invalid tenant' });

  req.tenantId = subdomain;
  try {
    const tenant = await Tenant.findOne({ subdomain });
    if (!tenant) {
      req.tenantNotFound = true;
    } else {
      req.tenant = tenant;
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Error checking tenant', error: err.message });
  }
  next();
}

module.exports = {
  extractTenantId,
};
