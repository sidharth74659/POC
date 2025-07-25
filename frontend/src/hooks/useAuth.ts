import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
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
      setUser(response.data.user);
    } else {
      localStorage.removeItem('auth_token');
      setToken(null);
    }
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    console.log('[useAuth] login called', { email, password });
    const response = await AuthController.login(email, password);
    console.log('[useAuth] AuthController.login response', response);
    if (response.success && response.data) {
      const { token: authToken, user: userData } = response.data;
      console.log('[useAuth] Setting token and user', { authToken, userData });
      localStorage.setItem('auth_token', authToken);
      
      // Force synchronous state updates
      flushSync(() => {
        setToken(authToken);
        setUser(userData);
      });
      
      console.log('[useAuth] About to setUser with:', userData);
      console.log('[useAuth] setUser called, user should be updated');
      console.log('[useAuth] Login success, user set', userData);
      return { success: true };
    }
    console.log('[useAuth] Login failed', response.error);
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

  useEffect(() => {
    console.log('[useAuth] user/token changed', { user, token });
  }, [user, token]);

  return {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };
}