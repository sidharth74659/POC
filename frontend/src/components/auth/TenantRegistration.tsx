import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { TenantController } from '../../api/controllers/tenantController';
import { Building2, CheckCircle } from 'lucide-react';

interface TenantRegistrationProps {
  onRegistrationComplete: (tenant: any) => void;
}

export function TenantRegistration({ onRegistrationComplete }: TenantRegistrationProps) {
  const [formData, setFormData] = useState({
    tenantName: '',
    subdomain: '',
    adminEmail: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.tenantName.trim()) {
      newErrors.tenantName = 'Company name is required';
    }

    if (!formData.subdomain.trim()) {
      newErrors.subdomain = 'Subdomain is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.subdomain)) {
      newErrors.subdomain = 'Subdomain can only contain lowercase letters, numbers, and hyphens';
    }

    if (!formData.adminEmail.trim()) {
      newErrors.adminEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail)) {
      newErrors.adminEmail = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await TenantController.registerTenant({
        tenantName: formData.tenantName,
        subdomain: formData.subdomain,
        adminEmail: formData.adminEmail,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName
      });

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          onRegistrationComplete(response.data?.tenant);
        }, 2000);
      } else {
        setErrors({ submit: response.error || 'Registration failed' });
      }
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
          <p className="text-gray-600 mb-4">
            Your tenant has been created successfully. Setting up your environment...
          </p>
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8">
        <div className="text-center mb-8">
          <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Create Your Account</h1>
          <p className="text-gray-600 mt-2">Set up your multi-tenant SaaS environment</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="tenantName"
            label="Company Name"
            value={formData.tenantName}
            onChange={handleChange}
            error={errors.tenantName}
            placeholder="Acme Corporation"
            required
          />

          <Input
            name="subdomain"
            label="Subdomain"
            value={formData.subdomain}
            onChange={handleChange}
            error={errors.subdomain}
            placeholder="acme-corp"
            helperText="This will be your unique URL: subdomain.example.com"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              name="firstName"
              label="First Name"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
              placeholder="John"
              required
            />

            <Input
              name="lastName"
              label="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              error={errors.lastName}
              placeholder="Doe"
              required
            />
          </div>

          <Input
            name="adminEmail"
            type="email"
            label="Admin Email"
            value={formData.adminEmail}
            onChange={handleChange}
            error={errors.adminEmail}
            placeholder="admin@acme-corp.com"
            required
          />

          <Input
            name="password"
            type="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="••••••••"
            required
          />

          <Input
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="••••••••"
            required
          />

          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            loading={loading}
            disabled={loading}
          >
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}