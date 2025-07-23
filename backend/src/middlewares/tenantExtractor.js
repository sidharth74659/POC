// middlewares/tenantExtractor.js
module.exports = function tenantExtractor(req, res, next) {
  const host = req.headers.host; // e.g., tenant1.example.com:3000
  const subdomain = host.split('.')[0]; // crude, assumes 1-level subdomain
  if (!subdomain) return res.status(400).json({ message: 'Invalid tenant' });

  req.tenantId = subdomain; // attach to request
  next();
};
