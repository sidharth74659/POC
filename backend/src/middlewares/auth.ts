import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types/global';

interface AuthRequest extends Request {
  user?: {
    id: string;
    tenantId: string;
    roles: string[];
  };
}

/**
@example Sample JWT Payload:
```json
{
  "userId": "abc123",
  "tenantId": "tenant1",
  "roles": ["admin"]
}
```
 */
function auth(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: 'Missing token' });
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Invalid token format' });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET || '', (err, decoded) => {
    if (err) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }

    const payload = decoded as JWTPayload;
    req.user = {
      id: payload.userId,
      tenantId: payload.tenantId,
      roles: payload.roles,
    };
    next();
  });
}

export default auth;
