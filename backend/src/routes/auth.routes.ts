import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { authorizeRoles } from '../middlewares/roles';
import auth from '../middlewares/auth';
import { z } from 'zod';

const router = express.Router();

// Local schema definitions for now
const LoginRequestSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const LoginApiResponseSchema = z.object({
  success: z.boolean(),
  data: z
    .object({
      token: z.string(),
      user: z.object({
        id: z.string(),
        email: z.string(),
        roles: z.array(z.string()),
        tenantId: z.string(),
      }),
    })
    .optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

const MeApiResponseSchema = z.object({
  success: z.boolean(),
  data: z
    .object({
      user: z.object({
        id: z.string(),
        email: z.string(),
        roles: z.array(z.string()),
        tenantId: z.string(),
      }),
    })
    .optional(),
  error: z.string().optional(),
  message: z.string().optional(),
});

type TLoginRequest = z.infer<typeof LoginRequestSchema>;
type TLoginApiResponse = z.infer<typeof LoginApiResponseSchema>;
type TMeApiResponse = z.infer<typeof MeApiResponseSchema>;

interface AuthRequest extends Request {
  user?: {
    id: string;
    tenantId: string;
    roles: string[];
  };
  tenantId?: string;
}

// Create user in this tenant
router.post(
  '/users',
  auth,
  authorizeRoles('admin'),
  async (req: AuthRequest, res: Response) => {
    // Create user in this tenant
    res.status(501).json({ message: 'Not implemented' });
  },
);

// Login endpoint
router.post('/login', async (req: AuthRequest, res: Response) => {
  try {
    // Validate request using schema
    const validationResult = LoginRequestSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        message:
          validationResult.error.issues[0]?.message || 'Validation failed',
      });
    }

    const { email, password }: TLoginRequest = validationResult.data;
    const tenantId = req.tenantId;

    if (!tenantId) {
      return res.status(400).json({
        success: false,
        error: 'Tenant not detected',
        message: 'Tenant not detected',
      });
    }

    const user = await User.findOne({ email, tenantId });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        message: 'Invalid credentials',
      });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        message: 'Invalid credentials',
      });
    }

    const token = jwt.sign(
      { userId: user._id, tenantId: user.tenantId, roles: user.roles },
      process.env.JWT_SECRET || '',
      { expiresIn: '1d' },
    );

    const response: TLoginApiResponse = {
      success: true,
      data: {
        token,
        user: {
          id: String(user._id),
          email: user.email,
          roles: user.roles,
          tenantId: user.tenantId,
        },
      },
    };

    // Validate response using schema
    const responseValidation = LoginApiResponseSchema.safeParse(response);
    if (!responseValidation.success) {
      console.warn('Invalid login response format:', responseValidation.error);
    }

    res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Internal server error',
    });
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
      return res.status(401).json({
        success: false,
        error: 'Not authenticated',
        message: 'Not authenticated',
      });
    }

    const user = await User.findOne({
      _id: req.user.id,
      tenantId: req.tenantId,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'User not found',
      });
    }

    const response: TMeApiResponse = {
      success: true,
      data: {
        user: {
          id: String(user._id),
          email: user.email,
          roles: user.roles,
          tenantId: user.tenantId,
        },
      },
    };

    // Validate response using schema
    const responseValidation = MeApiResponseSchema.safeParse(response);
    if (!responseValidation.success) {
      console.warn('Invalid me response format:', responseValidation.error);
    }

    res.json(response);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Internal server error',
    });
  }
});

export default router;
