import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Shield, Building2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface LoginFormProps {
  tenantId?: string;
  tenantName?: string;
  onBackToRegistration?: () => void;
}

export function LoginForm({ tenantId, tenantName, onBackToRegistration }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password, tenantId);
      
      if (!result.success) {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8">
        <div className="text-center mb-8">
          {tenantName ? (
            <>
              <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900">{tenantName}</h1>
              <p className="text-gray-600 mt-2">Sign in to your account</p>
            </>
          ) : (
            <>
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
              <p className="text-gray-600 mt-2">Access the admin dashboard</p>
            </>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="email"
            type="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            placeholder="admin@example.com"
            required
          />

          <Input
            name="password"
            type="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            loading={loading}
            disabled={loading}
          >
            Sign In
          </Button>
        </form>

        {onBackToRegistration && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Need to create a new tenant?{' '}
              <button
                onClick={onBackToRegistration}
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Register here
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}