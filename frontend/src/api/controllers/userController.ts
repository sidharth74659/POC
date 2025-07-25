export class UserController {
  static async getUsers(token: string, tenantId: string, page: number = 1, limit: number = 10) {
    try {
      const res = await fetch(`/api/users?tenantId=${encodeURIComponent(tenantId)}&page=${page}&limit=${limit}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const result = await res.json();
      if (!res.ok) return { success: false, error: result.message || 'Failed to get users', pagination: { page, limit, total: 0, totalPages: 0 } };
      return { success: true, data: result.users, pagination: result.pagination };
    } catch {
      return { success: false, error: 'Failed to get users', pagination: { page, limit, total: 0, totalPages: 0 } };
    }
  }

  static async createUser(token: string, tenantId: string, userData: { email: string; password: string; firstName: string; lastName: string; role: 'admin' | 'user'; }) {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...userData, tenantId }),
      });
      const result = await res.json();
      if (!res.ok) return { success: false, error: result.message || 'Failed to create user' };
      return { success: true, data: result.user };
    } catch {
      return { success: false, error: 'Failed to create user' };
    }
  }

  static async updateUser(token: string, tenantId: string, userId: string, updates: Partial<Record<string, unknown>>) {
    try {
      const res = await fetch(`/api/users/${encodeURIComponent(userId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...updates, tenantId }),
      });
      const result = await res.json();
      if (!res.ok) return { success: false, error: result.message || 'Failed to update user' };
      return { success: true, data: result.user };
    } catch {
      return { success: false, error: 'Failed to update user' };
    }
  }

  static async deleteUser(token: string, tenantId: string, userId: string) {
    try {
      const res = await fetch(`/api/users/${encodeURIComponent(userId)}?tenantId=${encodeURIComponent(tenantId)}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const result = await res.json();
      if (!res.ok) return { success: false, error: result.message || 'Failed to delete user' };
      return { success: true, message: result.message };
    } catch {
      return { success: false, error: 'Failed to delete user' };
    }
  }
}