import React, { useState, useEffect, useCallback } from 'react';
import { 
  User, 
  Plus, 
  LogIn, 
  Mail, 
  Calendar, 
  FileText, 
  Clock,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import AuthModal from './AuthModal';

const UserLoginScreen = () => {
  const { actions } = useApp();
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login', 'register'
  const [previousUsers, setPreviousUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const loadPreviousUsers = useCallback(async () => {
    if (!actions || !actions.getAllUsers) {
      return;
    }
    
    try {
      setLoading(true);
      const users = await actions.getAllUsers();
      setPreviousUsers(users || []);
    } catch (error) {
      // console.error('Error loading previous users:', error);
      setPreviousUsers([]);
    } finally {
      setLoading(false);
    }
  }, [actions]);

  useEffect(() => {
    loadPreviousUsers();
  }, [loadPreviousUsers]);

  const handleUserSelect = async (user) => {
    if (!actions) return;
    
    try {
      actions.setLoading(true);
      
      if (user.isAnonymous) {
        // For anonymous users, we'll need to handle this differently
        // since we can't directly sign them in
        actions.showMessage('Info', 'Anonymous users cannot be directly signed in. Please create a new account or sign in with email.', 'info');
        return;
      }
      
      // For registered users, we'll need to implement a way to switch users
      // This might require storing user credentials securely or using a different approach
      actions.showMessage('Info', 'User switching feature coming soon. Please sign in with your email and password.', 'info');
      
    } catch (error) {
      // console.error('Error selecting user:', error);
      actions.showMessage('Error', 'Failed to switch user. Please try again.', 'error');
    } finally {
      actions.setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!actions) return;
    
    try {
      await actions.deleteUserAccount(userId);
      await loadPreviousUsers();
      actions.showMessage('Success', 'User account deleted successfully.', 'success');
    } catch (error) {
      // console.error('Error deleting user:', error);
      actions.showMessage('Error', 'Failed to delete user account.', 'error');
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDraftCount = (user) => {
    return user.drafts ? user.drafts.length : 0;
  };

  const getLastActivity = (user) => {
    if (!user.drafts || user.drafts.length === 0) return 'No activity';
    
    const lastDraft = user.drafts.reduce((latest, draft) => {
      const draftDate = new Date(draft.updatedAt || draft.createdAt);
      const latestDate = new Date(latest.updatedAt || latest.createdAt);
      return draftDate > latestDate ? draft : latest;
    });
    
    return formatDate(lastDraft.updatedAt || lastDraft.createdAt);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Select a user account to continue your business planning journey, or create a new account to get started.
          </p>
        </div>

        {/* Authentication Status Warning */}
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
            <div className="text-center">
              <p className="text-sm font-medium text-yellow-800">
                🔧 Firebase Authentication Setup Required
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                Both Google and Email authentication need to be enabled in Firebase Console
              </p>
            </div>
          </div>
        </div>

        {/* Previous Users Section */}
        {previousUsers.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-indigo-600" />
              Previous Users
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {previousUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                        {user.isAnonymous ? (
                          <User className="w-5 h-5 text-indigo-600" />
                        ) : (
                          <Mail className="w-5 h-5 text-indigo-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {user.displayName || user.email || 'Anonymous User'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {user.isAnonymous ? 'Anonymous' : user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUserSelect(user)}
                        className="p-1 text-indigo-600 hover:text-indigo-800 transition-colors"
                        title="Sign in as this user"
                      >
                        <LogIn className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(user.id)}
                        className="p-1 text-red-600 hover:text-red-800 transition-colors"
                        title="Delete user account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      <span>{getDraftCount(user)} draft{getDraftCount(user) !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>Last active: {getLastActivity(user)}</span>
                    </div>
                    {user.createdAt && (
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>Created: {formatDate(user.createdAt)}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleUserSelect(user)}
                    className="w-full mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Continue as {user.displayName || user.email || 'Anonymous User'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New User Options */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Plus className="w-5 h-5 mr-2 text-indigo-600" />
            Create New Account
          </h2>
          <p className="text-gray-600 mb-6">
            Start fresh with a new business plan or create an account to save your progress.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email Registration */}
            <button
              onClick={() => {
                setAuthMode('register');
                setShowAuthModal(true);
              }}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors duration-200 text-center"
            >
              <Mail className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900 mb-1">Sign Up with Email</h3>
              <p className="text-sm text-gray-500">
                Create an account to save your progress
              </p>
            </button>

            {/* Google Sign In */}
            <button
              onClick={async () => {
                if (!actions) return;
                
                try {
                  await actions.signInWithGoogle();
                } catch (error) {
                  // console.error('Google sign-in failed:', error);
                  actions.showMessage('Error', `Google sign-in failed: ${error.message || 'Please try again.'}`, 'error');
                }
              }}
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors duration-200 text-center"
            >
              <div className="w-8 h-8 bg-red-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-white text-xs font-bold">G</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Sign in with Google</h3>
              <p className="text-sm text-gray-500">
                Quick sign in with your Google account
              </p>
            </button>
          </div>

          {/* Existing User Sign In */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600 mb-4">
              Already have an account?
            </p>
            <button
              onClick={() => {
                setAuthMode('login');
                setShowAuthModal(true);
              }}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In with Email
            </button>
            
            {/* Help Text */}
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-800">
                  <p className="font-medium mb-1">🚨 Authentication Not Configured</p>
                  <p className="mb-2">Both Google and Email/Password authentication are disabled in Firebase Console.</p>
                  <div className="bg-white p-2 rounded border text-xs">
                    <p className="font-medium mb-1">Quick Fix:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Go to <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Firebase Console</a></li>
                      <li>Select project: restaurant-startup-app</li>
                      <li>Authentication → Sign-in method</li>
                      <li>Enable Email/Password and Google</li>
                      <li>Add localhost to authorized domains</li>
                    </ol>
                  </div>
                  <p className="mt-2 text-xs">Until then, use "Try Anonymously" to explore the app.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md mx-4">
              <div className="flex items-center mb-4">
                <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete User Account
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this user account? This action cannot be undone and will permanently remove all associated data.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteUser(showDeleteConfirm)}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          mode={authMode}
        />
      )}
    </div>
  );
};

export default UserLoginScreen;
