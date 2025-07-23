import { User } from '../../types';

// Mock JWT implementation - replace with real JWT in production
export class AuthMiddleware {
  private static mockSessions = new Map<string, { user: User; expiresAt: Date }>();

  static generateToken(user: User): string {
    const token = `mock_token_${Date.now()}_${Math.random()}`;
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    this.mockSessions.set(token, {
      user: { ...user, password: undefined },
      expiresAt
    });
    
    return token;
  }

  static validateToken(token: string): User | null {
    const session = this.mockSessions.get(token);
    
    if (!session) {
      return null;
    }
    
    if (session.expiresAt < new Date()) {
      this.mockSessions.delete(token);
      return null;
    }
    
    return session.user;
  }

  static invalidateToken(token: string): void {
    this.mockSessions.delete(token);
  }

  static invalidateAllUserTokens(userId: string): void {
    for (const [token, session] of this.mockSessions.entries()) {
      if (session.user.id === userId) {
        this.mockSessions.delete(token);
      }
    }
  }

  static requireAuth(token: string): User {
    const user = this.validateToken(token);
    if (!user) {
      throw new Error('Authentication required');
    }
    return user;
  }

  static requireRole(user: User, allowedRoles: string[]): void {
    if (!allowedRoles.includes(user.role)) {
      throw new Error('Insufficient permissions');
    }
  }

  static requireTenant(user: User, tenantId: string): void {
    if (user.tenantId !== tenantId) {
      throw new Error('Access denied - tenant mismatch');
    }
  }
}