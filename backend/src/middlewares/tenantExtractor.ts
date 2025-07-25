import { Request, Response, NextFunction } from 'express';
import Tenant from '../models/Tenant';

// Extend Request interface for this middleware
interface TenantRequest extends Request {
  tenantId?: string;
  tenant?: any;
  tenantNotFound?: boolean;
}

async function extractTenantId(req: TenantRequest, res: Response, next: NextFunction): Promise<void> {
  const host = req.headers.host;
  if (!host) {
    res.status(400).json({ message: 'Host header is required' });
    return;
  }

  const subdomain = host.split('.')[0];
  if (!subdomain) {
    res.status(400).json({ message: 'Invalid tenant' });
    return;
  }

  req.tenantId = subdomain;
  
  try {
    const tenant = await Tenant.findOne({ subdomain });
    if (!tenant) {
      req.tenantNotFound = true;
    } else {
      req.tenant = tenant.toObject();
    }
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ message: 'Error checking tenant', error: error.message });
    return;
  }
  next();
}

export { extractTenantId }; 