export class AuthController {
  static async login(email: string, password: string) {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.message || 'Login failed' };
      return { success: true, data };
    } catch {
      return { success: false, error: 'Login failed' };
    }
  }

  static async logout(token: string) {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) return { success: false, error: 'Logout failed' };
      return { success: true };
    } catch {
      return { success: false, error: 'Logout failed' };
    }
  }

  static async validateSession(token: string) {
    try {
      const res = await fetch('/api/auth/me', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.message || 'Invalid session' };
      return { success: true, data };
    } catch {
      return { success: false, error: 'Session validation failed' };
    }
  }
}