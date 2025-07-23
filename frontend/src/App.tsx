import React, { useState, useEffect } from 'react';
import { TenantRegistration } from './components/auth/TenantRegistration';
import { LoginForm } from './components/auth/LoginForm';
import { Dashboard } from './components/dashboard/Dashboard';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { useAuth } from './hooks/useAuth';
import { TenantController } from './api/controllers/tenantController';
import { Tenant } from './types';

function App() {
  const { user, loading: authLoading } = useAuth();
  const [currentView, setCurrentView] = useState<'registration' | 'login' | 'dashboard'>('registration');
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        setCurrentView('dashboard');
      } else {
        // Check if we're on a tenant subdomain (in a real app, this would be determined by URL)
        checkTenantStatus();
      }
      setAppLoading(false);
    }
  }, [user, authLoading]);

  const checkTenantStatus = async () => {
    // In a real application, you would extract the subdomain from the URL
    // For demo purposes, we'll simulate this
    const demoSubdomain = 'acme-corp';
    
    try {
      const response = await TenantController.getTenantBySubdomain(demoSubdomain);
      if (response.success && response.data) {
        setCurrentTenant(response.data);
        setCurrentView('login');
      } else {
        setCurrentView('registration');
      }
    } catch (error) {
      setCurrentView('registration');
    }
  };

  const handleRegistrationComplete = (tenant: Tenant) => {
    setCurrentTenant(tenant);
    setCurrentView('login');
  };

  const handleBackToRegistration = () => {
    setCurrentTenant(null);
    setCurrentView('registration');
  };

  if (authLoading || appLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (currentView === 'dashboard' && user) {
    return <Dashboard />;
  }

  if (currentView === 'login') {
    return (
      <LoginForm
        tenantId={currentTenant?.id}
        tenantName={currentTenant?.name}
        onBackToRegistration={handleBackToRegistration}
      />
    );
  }

  return <TenantRegistration onRegistrationComplete={handleRegistrationComplete} />;
}

export default App;