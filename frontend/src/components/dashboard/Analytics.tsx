import React from 'react';
import { BarChart3, Users, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react';

export function Analytics() {
  // Mock analytics data
  const stats = [
    {
      name: 'Total Users',
      value: '2',
      change: '+0%',
      changeType: 'neutral',
      icon: Users
    },
    {
      name: 'Total Orders',
      value: '1',
      change: '+0%',
      changeType: 'neutral',
      icon: ShoppingCart
    },
    {
      name: 'Revenue',
      value: '$109.97',
      change: '+0%',
      changeType: 'neutral',
      icon: DollarSign
    },
    {
      name: 'Growth Rate',
      value: '0%',
      change: '+0%',
      changeType: 'neutral',
      icon: TrendingUp
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
        <p className="text-gray-600 mt-1">Overview of your tenant's performance</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.name} className="bg-white overflow-hidden shadow-sm rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {item.name}
                      </dt>
                      <dd className="text-lg font-semibold text-gray-900">
                        {item.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                  <span className={`font-medium ${
                    item.changeType === 'increase' 
                      ? 'text-green-600' 
                      : item.changeType === 'decrease' 
                      ? 'text-red-600' 
                      : 'text-gray-600'
                  }`}>
                    {item.change}
                  </span>
                  <span className="text-gray-500"> from last month</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center mb-4">
          <BarChart3 className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Activity Overview</h3>
        </div>
        
        <div className="text-center py-12">
          <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Analytics Data Yet</h4>
          <p className="text-gray-500 max-w-sm mx-auto">
            Start using the application to see detailed analytics and insights about your tenant's performance.
          </p>
        </div>
      </div>
    </div>
  );
}