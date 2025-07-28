import { Request, Response, NextFunction } from 'express';
import Tenant from '../models/Tenant';

// Extend Request interface for this middleware
interface TenantRequest extends Request {
  tenantId?: string;
  tenant?: {
    id: string;
    name: string;
    subdomain: string;
    isActive: boolean;
  };
  tenantNotFound?: boolean;
}

async function extractTenantId(
  req: TenantRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  // Try to get tenant from X-Tenant-Host header first, then fall back to Host header
  const tenantHost =
    (req.headers['x-tenant-host'] as string) || req.headers.host;

  if (!tenantHost) {
    res
      .status(400)
      .json({ success: false, message: 'Tenant host header is required' });
    return;
  }

  const subdomain = tenantHost.split('.')[0];
  if (!subdomain) {
    res.status(400).json({ success: false, message: 'Invalid tenant' });
    return;
  }

  req.tenantId = subdomain;

  try {
    const tenant = await Tenant.findOne({ subdomain });
    if (!tenant) {
      req.tenantNotFound = true;
    } else {
      const tenantData: TenantRequest['tenant'] = {
        id: tenant._id.toString(),
        name: tenant.name,
        subdomain: tenant.subdomain,
        isActive: tenant.isActive,
      };

      // console.log('tenantData', tenantData);
      req.tenant = tenantData;
    }
  } catch (err) {
    const error = err as Error;
    res.status(500).json({
      success: false,
      message: error.message || 'Error checking tenant',
    });
    return;
  }
  next();
}

export { extractTenantId };
