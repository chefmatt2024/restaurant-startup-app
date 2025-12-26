import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Shield, Lock, AlertTriangle, CheckCircle } from 'lucide-react';

const AdminAccessControl = ({ children }) => {
  const { state } = useApp();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [accessLevel, setAccessLevel] = useState('none');

  // Define admin access levels and requirements
  const accessLevels = {
    none: { name: 'No Access', color: 'text-red-600', icon: Lock },
    viewer: { name: 'Viewer', color: 'text-blue-600', icon: Shield },
    manager: { name: 'Manager', color: 'text-green-600', icon: CheckCircle },
    admin: { name: 'Admin', color: 'text-purple-600', icon: Shield }
  };

  const checkAdminAccess = async () => {
    setIsLoading(true);
    
    try {
      // Check if user is authenticated
      if (!state.user) {
        setAccessLevel('none');
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }

      // Check user's admin status
      const userEmail = state.user.email;
      const isAdmin = await checkUserAdminStatus(userEmail);
      
      if (isAdmin) {
        setAccessLevel('admin');
        setIsAuthorized(true);
      } else {
        setAccessLevel('none');
        setIsAuthorized(false);
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      setAccessLevel('none');
      setIsAuthorized(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAdminAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.user]);

  const checkUserAdminStatus = async (email) => {
    // Define authorized admin emails
    const adminEmails = [
      'matt@iterumfoods.com',
      'hello@iterumfoods.xyz',
      'admin@iterumfoods.xyz'
    ];

    // For demo purposes, also allow any @iterumfoods.com email
    const isIterumEmail = email && email.endsWith('@iterumfoods.com');
    const isAuthorizedEmail = adminEmails.includes(email.toLowerCase());
    
    return isAuthorizedEmail || isIterumEmail;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access the admin dashboard.
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-left">
                <h3 className="text-sm font-medium text-yellow-800">Admin Access Required</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Only authorized administrators can access this section. 
                  Contact your system administrator if you believe this is an error.
                </p>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            <p>Current user: {state.user?.email || 'Not logged in'}</p>
            <p>Access level: {accessLevels[accessLevel].name}</p>
          </div>

          <div className="mt-6">
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Admin Access Indicator */}
      <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
        <div className="flex items-center">
          <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
          <div>
            <p className="text-sm text-green-800">
              <strong>Admin Access Granted</strong> - You have full administrative privileges
            </p>
            <p className="text-xs text-green-600 mt-1">
              Access Level: {accessLevels[accessLevel].name} | User: {state.user?.email}
            </p>
          </div>
        </div>
      </div>
      
      {children}
    </div>
  );
};

export default AdminAccessControl;
