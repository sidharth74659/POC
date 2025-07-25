import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { authorizeRoles } from '../middlewares/roles';
import auth from '../middlewares/auth';

const router = express.Router();

interface AuthRequest extends Request {
  user?: {
    id: string;
    tenantId: string;
    roles: string[];
  };
  tenantId?: string;
}

// Create user in this tenant
router.post('/users', auth, authorizeRoles('admin'), async (req: AuthRequest, res: Response) => {
  // Create user in this tenant
  res.status(501).json({ message: 'Not implemented' });
});

// Login endpoint
router.post('/login', async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    const tenantId = req.tenantId;
    
    if (!tenantId) {
      return res.status(400).json({ message: 'Tenant not detected' });
    }
    
    const user = await User.findOne({ email, tenantId });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user._id, tenantId: user.tenantId, roles: user.roles },
      process.env.JWT_SECRET || '',
      { expiresIn: '1d' },
    );
    
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          email: user.email,
          roles: user.roles,
          tenantId: user.tenantId,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Logout endpoint
router.post('/logout', (req: Request, res: Response) => {
  // Stateless JWT: just return success, frontend should clear token
  res.json({ success: true, message: 'Logged out' });
});

// Get current user
router.get('/me', auth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const user = await User.findOne({
      _id: req.user.id,
      tenantId: req.tenantId,
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          roles: user.roles,
          tenantId: user.tenantId,
        },
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router; 