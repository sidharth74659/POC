import { Request, Response, NextFunction } from 'express';

interface RolesRequest extends Request {
  user?: {
    id: string;
    tenantId: string;
    roles: string[];
  };
}

export function authorizeRoles(...allowedRoles: string[]) {
  return (req: RolesRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const userRoles = req.user.roles || [];
    const hasRole = userRoles.some((r) => allowedRoles.includes(r));

    if (!hasRole) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    next();
  };
}
