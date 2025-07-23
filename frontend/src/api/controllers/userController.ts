import { AuthMiddleware } from '../middleware/auth';
import { ValidationMiddleware } from '../middleware/validation';
import { MockDatabase } from '../data/mockDatabase';
import { ApiResponse, User, PaginatedResponse } from '../../types';

export class UserController {
  static async getUsers(
    token: string,
    tenantId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Omit<User, 'password'>>> {
    try {
      const currentUser = AuthMiddleware.requireAuth(token);
      AuthMiddleware.requireTenant(currentUser, tenantId);
      AuthMiddleware.requireRole(currentUser, ['admin']);
      
      const allUsers = await MockDatabase.getUsersByTenant(tenantId);
      const total = allUsers.length;
      const totalPages = Math.ceil(total / limit);
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      const users = allUsers
        .slice(startIndex, endIndex)
        .map(user => ({ ...user, password: undefined }));
      
      return {
        success: true,
        data: users,
        pagination: {
          page,
          limit,
          total,
          totalPages
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get users',
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }
      };
    }
  }
  
  static async createUser(
    token: string,
    tenantId: string,
    userData: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      role: 'admin' | 'user';
    }
  ): Promise<ApiResponse<Omit<User, 'password'>>> {
    try {
      const currentUser = AuthMiddleware.requireAuth(token);
      AuthMiddleware.requireTenant(currentUser, tenantId);
      AuthMiddleware.requireRole(currentUser, ['admin']);
      
      // Validate input
      const emailErrors = ValidationMiddleware.validateEmail(userData.email);
      const passwordErrors = ValidationMiddleware.validatePassword(userData.password);
      
      const allErrors = [...emailErrors, ...passwordErrors];
      
      if (!userData.firstName) {
        allErrors.push({ field: 'firstName', message: 'First name is required' });
      }
      
      if (!userData.lastName) {
        allErrors.push({ field: 'lastName', message: 'Last name is required' });
      }
      
      if (allErrors.length > 0) {
        return {
          success: false,
          error: allErrors.map(e => e.message).join(', ')
        };
      }
      
      // Create user
      const newUser = await MockDatabase.createUser({
        email: userData.email.toLowerCase(),
        password: userData.password,
        firstName: ValidationMiddleware.sanitizeInput(userData.firstName),
        lastName: ValidationMiddleware.sanitizeInput(userData.lastName),
        role: userData.role,
        tenantId,
        isActive: true
      });
      
      return {
        success: true,
        data: { ...newUser, password: undefined }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create user'
      };
    }
  }
  
  static async updateUser(
    token: string,
    tenantId: string,
    userId: string,
    updates: Partial<User>
  ): Promise<ApiResponse<Omit<User, 'password'>>> {
    try {
      const currentUser = AuthMiddleware.requireAuth(token);
      AuthMiddleware.requireTenant(currentUser, tenantId);
      AuthMiddleware.requireRole(currentUser, ['admin']);
      
      // Sanitize updates
      const sanitizedUpdates: Partial<User> = {};
      
      if (updates.firstName) {
        sanitizedUpdates.firstName = ValidationMiddleware.sanitizeInput(updates.firstName);
      }
      
      if (updates.lastName) {
        sanitizedUpdates.lastName = ValidationMiddleware.sanitizeInput(updates.lastName);
      }
      
      if (updates.email) {
        const emailErrors = ValidationMiddleware.validateEmail(updates.email);
        if (emailErrors.length > 0) {
          return { success: false, error: emailErrors[0].message };
        }
        sanitizedUpdates.email = updates.email.toLowerCase();
      }
      
      if (updates.role) {
        sanitizedUpdates.role = updates.role;
      }
      
      if (updates.isActive !== undefined) {
        sanitizedUpdates.isActive = updates.isActive;
      }
      
      const updatedUser = await MockDatabase.updateUser(userId, sanitizedUpdates);
      
      return {
        success: true,
        data: { ...updatedUser, password: undefined }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update user'
      };
    }
  }
  
  static async deleteUser(
    token: string,
    tenantId: string,
    userId: string
  ): Promise<ApiResponse> {
    try {
      const currentUser = AuthMiddleware.requireAuth(token);
      AuthMiddleware.requireTenant(currentUser, tenantId);
      AuthMiddleware.requireRole(currentUser, ['admin']);
      
      // Don't allow deleting self
      if (currentUser.id === userId) {
        return { success: false, error: 'Cannot delete your own account' };
      }
      
      await MockDatabase.deleteUser(userId);
      
      // Invalidate all tokens for the deleted user
      AuthMiddleware.invalidateAllUserTokens(userId);
      
      return {
        success: true,
        message: 'User deleted successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to delete user'
      };
    }
  }
}