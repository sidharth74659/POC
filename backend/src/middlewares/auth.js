const jwt = require('jsonwebtoken');

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
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Missing token' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.user = {
      id: decoded.userId,
      tenantId: decoded.tenantId,
      roles: decoded.roles,
    };
    next();
  });
}

module.exports = auth;
