import { AuthMiddleware } from '../middleware/auth';
import { ValidationMiddleware } from '../middleware/validation';
import { MockDatabase } from '../data/mockDatabase';
import { ApiResponse, User } from '../../types';
import bcrypt from 'bcryptjs';

export class AuthController {
  static async login(email: string, password: string, tenantId?: string): Promise<ApiResponse<{ token: string; user: Omit<User, 'password'> }>> {
    try {
      // Validate input
      const emailErrors = ValidationMiddleware.validateEmail(email);
      if (emailErrors.length > 0) {
        return { success: false, error: emailErrors[0].message };
      }
      
      if (!password) {
        return { success: false, error: 'Password is required' };
      }
      
      // Find user by email and tenant
      let user: User | null = null;
      
      if (tenantId) {
        user = await MockDatabase.getUserByEmail(email, tenantId);
      } else {
        // For admin login, check all tenants
        const allUsers = Array.from((MockDatabase as any).users.values());
        user = allUsers.find((u: User) => u.email === email && u.isActive) || null;
      }
      
      if (!user) {
        return { success: false, error: 'Invalid credentials' };
      }
      
      // Verify password
      if (!user.password || !await bcrypt.compare(password, user.password)) {
        return { success: false, error: 'Invalid credentials' };
      }
      
      // Generate token
      const token = AuthMiddleware.generateToken(user);
      
      return {
        success: true,
        data: {
          token,
          user: { ...user, password: undefined }
        }
      };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  }
  
  static async logout(token: string): Promise<ApiResponse> {
    try {
      AuthMiddleware.invalidateToken(token);
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      return { success: false, error: 'Logout failed' };
    }
  }
  
  static async validateSession(token: string): Promise<ApiResponse<Omit<User, 'password'>>> {
    try {
      const user = AuthMiddleware.validateToken(token);
      if (!user) {
        return { success: false, error: 'Invalid session' };
      }
      
      return { success: true, data: user };
    } catch (error) {
      return { success: false, error: 'Session validation failed' };
    }
  }
}