import React, { useState } from 'react';
import { Header } from './Header';
import { Navigation } from './Navigation';
import { UsersManagement } from './UsersManagement';
import { OrdersManagement } from './OrdersManagement';
import { Analytics } from './Analytics';
import { useAuth } from '../../hooks/useAuth';

export function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(() => {
    return user?.role === 'admin' ? 'users' : 'orders';
  });

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UsersManagement />;
      case 'orders':
        return <OrdersManagement />;
      case 'analytics':
        return <Analytics />;
      default:
        return <OrdersManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </main>
    </div>
  );
}