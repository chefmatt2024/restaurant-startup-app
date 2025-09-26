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
  AlertCircle,
  X
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import AuthModal from './AuthModal';

const SignInModal = ({ isOpen, onClose }) => {
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
    if (isOpen) {
      loadPreviousUsers();
    }
  }, [isOpen, loadPreviousUsers]);

  const handleUserSelect = async (user) => {
    if (!actions) return;
    
    try {
      actions.setLoading(true);
      
      if (user.isAnonymous) {
        // For anonymous users, we'll need to handle this differently
        // since we can't directly sign them in
        actions.showMessage('Info', 'Anonymous users cannot be directly signed in. Please create a new account or sign in with email.', 'info');
      } else {
        // For registered users, show message that direct sign-in isn't implemented yet
        actions.showMessage('Info', 'User switching feature coming soon. Please sign in with your email and password.', 'info');
      }
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
      day: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Welcome Back!</h2>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Sign in to continue your restaurant planning journey</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 ml-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6">
            {/* Previous Users Section */}
            {previousUsers.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Previous Users
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {previousUsers.map((user) => (
                    <div
                      key={user.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {user.displayName || 'Anonymous User'}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {user.email || 'No email'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                            <div className="flex items-center">
                              <FileText className="w-3 h-3 mr-1" />
                              {user.drafts?.length || 0} drafts
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatDate(user.createdAt)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleUserSelect(user)}
                            className="p-1 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded transition-colors"
                            title="Sign in as this user"
                          >
                            <LogIn className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(user.id)}
                            className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New User Options */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                New User Options
              </h3>
              
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
                  <h3 className="font-medium text-gray-900 mb-1">Create Account</h3>
                  <p className="text-sm text-gray-500">
                    Sign up with email and password
                  </p>
                </button>

                {/* Google Sign In */}
                <button
                  onClick={async () => {
                    if (!actions) return;
                    
                    try {
                      await actions.signInWithGoogle();
                      onClose();
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
            </div>

            {/* Existing User Sign In */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <LogIn className="w-5 h-5 mr-2" />
                Existing User Sign In
              </h3>
              
              <button
                onClick={() => {
                  setAuthMode('login');
                  setShowAuthModal(true);
                }}
                className="w-full p-4 border border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors duration-200 text-center"
              >
                <Mail className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <h3 className="font-medium text-gray-900 mb-1">Sign in with Email</h3>
                <p className="text-sm text-gray-500">
                  Sign in with your existing account
                </p>
              </button>
            </div>

            {/* Help Section */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Need Help?</p>
                  <p className="mb-2">If you're having trouble signing in, try the "Try Anonymously" option to explore the app first.</p>
                  <p className="text-xs">For technical support, check the Firebase Console setup guides in the project documentation.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => {
            setShowAuthModal(false);
            loadPreviousUsers(); // Refresh user list after auth
          }}
          initialMode={authMode}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete User Account</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this user account? This action cannot be undone and will remove all associated data.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(showDeleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SignInModal;
