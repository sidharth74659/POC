const express = require('express');
const router = express.Router();
const Tenant = require('../models/Tenant');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { createSubdomain } = require('../../guides/cloudflare/dns-automation');

router.post('/', async (req, res) => {
  const { companyName, requestedSubdomain, adminEmail, adminPassword } =
    req.body;

  const exists = await Tenant.findOne({ subdomain: requestedSubdomain });
  if (exists) return res.status(409).json({ message: 'Subdomain taken' });

  const tenant = await Tenant.create({
    name: companyName,
    companyName,
    subdomain: requestedSubdomain,
    dbUri: `mongodb://localhost/${requestedSubdomain}`,
  });
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await User.create({
    tenantId: requestedSubdomain,
    email: adminEmail,
    passwordHash,
    roles: ['admin'],
  });

  // Create DNS record for subdomain
  try {
    await createSubdomain(requestedSubdomain);
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Tenant created, but DNS failed', error: err.message });
  }

  res.json({
    message: `Tenant created at https://${requestedSubdomain}.yourcompany.com`,
  });
});

module.exports = router;
/* 
const express = require('express');
const router = express.Router();
const Tenant = require('../models/Tenant');
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.post('/', async (req, res) => {
  const { companyName, requestedSubdomain, adminEmail, adminPassword } = req.body;

  const exists = await Tenant.findOne({ subdomain: requestedSubdomain });
  if (exists) return res.status(409).json({ message: 'Subdomain taken' });

  const tenant = await Tenant.create({ companyName, subdomain: requestedSubdomain });
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await User.create({
    tenantId: requestedSubdomain,
    email: adminEmail,
    passwordHash,
    roles: ['admin']
  });

  res.json({ message: `Tenant created at https://${requestedSubdomain}.yourcompany.com` });
});

module.exports = router;

*/
