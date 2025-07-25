import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { TenantRegistration } from './components/auth/TenantRegistration';
import { LoginForm } from './components/auth/LoginForm';
import { Dashboard } from './components/dashboard/Dashboard';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { useAuth } from './hooks/useAuth';
import { TenantController } from './api/controllers/tenantController';
import { Tenant } from './types';

function App() {
  const { user, loading: authLoading } = useAuth();
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [appLoading, setAppLoading] = useState(true);
  const [forceUpdate, setForceUpdate] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Force re-render when user changes
  useEffect(() => {
    console.log('[App] User received from useAuth:', { user, hasUser: !!user });
    setForceUpdate(prev => prev + 1);
  }, [user]);

  // Manual navigation check - if user is set but we're still on login, force navigation
  useEffect(() => {
    if (user && location.pathname === '/login' && !authLoading) {
      console.log('[App] MANUAL NAVIGATION: User is set but still on login, forcing navigation to /orders');
      navigate('/orders', { replace: true });
    }
  }, [user, location.pathname, authLoading, navigate]);

  useEffect(() => {
    console.log('[App] useEffect triggered', { user, authLoading, location: location.pathname, forceUpdate });
    if (!authLoading) {
      if (user) {
        // User is authenticated, navigate to orders if not already there
        console.log('[App] User is authenticated, checking if should navigate to orders');
        if (location.pathname !== '/orders') {
          console.log('[App] Navigating to /orders');
          navigate('/orders', { replace: true });
        } else {
          console.log('[App] Already on /orders, no navigation needed');
        }
      } else {
        // User is not authenticated, check tenant status and navigate accordingly
        console.log('[App] User is not authenticated, checking tenant status');
        checkTenantStatus();
      }
      setAppLoading(false);
    }
    // eslint-disable-next-line
  }, [user, authLoading, location.pathname, navigate, forceUpdate]);

  // Debug useEffect to track user changes
  useEffect(() => {
    console.log('[App] User state changed:', { user, hasUser: !!user });
  }, [user]);

  const checkTenantStatus = async () => {
    const host = window.location.host;
    const parts = host.split('.');
    let subdomain = '';
    if (parts.length > 2) {
      subdomain = parts[0];
    }
    if (!subdomain) {
      navigate('/register', { replace: true });
      return;
    }
    try {
      const response = await TenantController.getTenantBySubdomain(subdomain);
      if (response.success && response.data) {
        setCurrentTenant(response.data);
        navigate('/login', { replace: true });
      } else {
        navigate('/register', { replace: true });
      }
    } catch {
      navigate('/register', { replace: true });
    }
  };

  const handleRegistrationComplete = (tenant: Tenant) => {
    setCurrentTenant(tenant);
    navigate('/login', { replace: true });
  };

  if (authLoading || appLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginForm tenantName={currentTenant?.name} />} />
      <Route path="/register" element={<TenantRegistration onRegistrationComplete={handleRegistrationComplete} />} />
      <Route path="/orders" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to={user ? '/orders' : '/login'} replace />} />
    </Routes>
  );
}

export default App;