import { Request, Response, NextFunction } from 'express';

interface ValidateTenantRequest extends Request {
  user?: {
    id: string;
    tenantId: string;
    roles: string[];
  };
  tenantId?: string;
}

const validateTenant = (req: ValidateTenantRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ message: 'User not authenticated' });
    return;
  }

  if (!req.tenantId) {
    res.status(400).json({ message: 'Tenant ID not found' });
    return;
  }

  if (req.user.tenantId !== req.tenantId) {
    res.status(403).json({ message: 'Tenant mismatch' });
    return;
  }
  
  next();
};

export default validateTenant; 