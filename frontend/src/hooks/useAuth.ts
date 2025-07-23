import { useState, useEffect } from 'react';
import { User } from '../types';
import { AuthController } from '../api/controllers/authController';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('auth_token')
  );

  useEffect(() => {
    if (token) {
      validateSession();
    } else {
      setLoading(false);
    }
  }, [token]);

  const validateSession = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    const response = await AuthController.validateSession(token);
    if (response.success && response.data) {
      setUser(response.data);
    } else {
      localStorage.removeItem('auth_token');
      setToken(null);
    }
    setLoading(false);
  };

  const login = async (email: string, password: string, tenantId?: string) => {
    const response = await AuthController.login(email, password, tenantId);
    
    if (response.success && response.data) {
      const { token: authToken, user: userData } = response.data;
      localStorage.setItem('auth_token', authToken);
      setToken(authToken);
      setUser(userData);
      return { success: true };
    }
    
    return { success: false, error: response.error };
  };

  const logout = async () => {
    if (token) {
      await AuthController.logout(token);
      localStorage.removeItem('auth_token');
      setToken(null);
      setUser(null);
    }
  };

  return {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };
}