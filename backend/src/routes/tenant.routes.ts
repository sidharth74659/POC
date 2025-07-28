import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Tenant from '../models/Tenant';
import User from '../models/User';

const router = express.Router();

interface TenantRequest extends Request {
  tenantId?: string;
  tenant?: any;
  tenantNotFound?: boolean;
}

// Create new tenant
router.post('/', async (req: TenantRequest, res: Response) => {
  try {
    const { name, subdomain, adminEmail, adminPassword } = req.body;

    const exists = await Tenant.findOne({ subdomain });
    if (exists) {
      return res
        .status(409)
        .json({ success: false, message: 'Subdomain taken' });
    }

    await Tenant.create({
      name,
      subdomain,
      // ? `dbUri` is not required, as we're doing Shared DB, Shared Collections By tenantId in each document, but not database-per-tenant pattern.
      // it is not used in the current shared-DB approach, but keeping it here for future flexibility.
      dbUri: `mongodb://localhost/${subdomain}`,
    });

    const passwordHash = await bcrypt.hash(adminPassword, 10);

    await User.create({
      tenantId: subdomain,
      email: adminEmail,
      passwordHash,
      roles: ['admin'],
    });

    /* 
    // ? Create DNS record for subdomain
    try {
      // ? currently not being used, as we're using wildcard DNS for subdomains
      // (if needed, we can use this in future
      // await createSubdomain(subdomain);
      console.log('DNS creation would happen here for:', subdomain);
    } catch (err) {
      const error = err as Error;
      return res.status(500).json({
        message: 'Tenant created, but DNS failed',
        error: error.message,
      });
    }
    */

    res.json({
      success: true,
      message: `Tenant created at https://${subdomain}.hubnest.live`,
    });
  } catch (error) {
    console.error('Tenant creation error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get tenant info
router.get('/', (req: TenantRequest, res: Response) => {
  res.json({
    success: true,
    message: 'GET /api/tenants works',
    data: {
      tenantId: req.tenantId,
      tenant: req.tenant,
    },
  });
});

// Check tenant existence
router.get('/check', (req: TenantRequest, res: Response) => {
  if (req.tenantNotFound) {
    return res.status(404).json({ message: 'Tenant not found' });
  }
  res.json({ success: true, data: { tenant: req.tenant } });
});

export default router;
