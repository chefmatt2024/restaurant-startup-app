import React, { useState } from 'react';
import { 
  Users, 
  Mail, 
  BarChart3, 
  Settings,
  Shield,
  Database,
  Bell,
  HelpCircle
} from 'lucide-react';
import AdminAccessControl from './AdminAccessControl';
import UserManagement from './UserManagement';
import LeadManagement from './LeadManagement';
import AnalyticsDashboard from './AnalyticsDashboard';
import EmailManagement from './EmailManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');

  const adminTabs = [
    { id: 'users', name: 'User Management', icon: Users, component: UserManagement },
    { id: 'leads', name: 'Lead Management', icon: Mail, component: LeadManagement },
    { id: 'analytics', name: 'Analytics', icon: BarChart3, component: AnalyticsDashboard },
    { id: 'emails', name: 'Email Campaigns', icon: Mail, component: EmailManagement },
    { id: 'settings', name: 'Settings', icon: Settings, component: null },
    { id: 'security', name: 'Security', icon: Shield, component: null },
    { id: 'database', name: 'Database', icon: Database, component: null },
    { id: 'notifications', name: 'Notifications', icon: Bell, component: null },
    { id: 'support', name: 'Support', icon: HelpCircle, component: null }
  ];

  const renderActiveTab = () => {
    const tab = adminTabs.find(t => t.id === activeTab);
    if (tab && tab.component) {
      const Component = tab.component;
      return <Component />;
    }
    
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-6xl text-gray-300 mb-4">
            {tab?.icon && <tab.icon className="w-16 h-16 mx-auto" />}
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            {tab?.name} Coming Soon
          </h3>
          <p className="text-gray-600">
            This feature is under development and will be available soon.
          </p>
        </div>
      </div>
    );
  };

  return (
    <AdminAccessControl>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Manage users, leads, and system operations</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleString()}
                </div>
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <nav className="space-y-1">
                {adminTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {renderActiveTab()}
            </div>
          </div>
        </div>
      </div>
    </AdminAccessControl>
  );
};

export default AdminDashboard;
