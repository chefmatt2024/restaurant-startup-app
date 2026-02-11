import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  LogIn, 
  Mail, 
  X
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import AuthModal from './EnhancedAuthModal';

const SignInModal = ({ isOpen, onClose, allowClose = true }) => {
  const { state, actions } = useApp();
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login', 'register'
  const [lastUserEmail, setLastUserEmail] = useState('');

  // Load last user email on mount
  useEffect(() => {
    if (isOpen) {
      const lastEmail = localStorage.getItem('lastUserEmail');
      if (lastEmail) {
        setLastUserEmail(lastEmail);
        setAuthMode('login'); // Default to login if we have a previous email
      }
    }
  }, [isOpen]);

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
            {allowClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 ml-2"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6">
            {/* Quick Sign In Section */}
            {lastUserEmail && (
              <div className="mb-6 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                <p className="text-sm text-indigo-800 mb-3 font-medium">
                  Welcome back! Sign in with your previous account:
                </p>
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setShowAuthModal(true);
                  }}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Mail className="w-5 h-5" />
                  <span>Sign in as {lastUserEmail}</span>
                </button>
                <button
                  onClick={() => {
                    setLastUserEmail('');
                    setAuthMode('register');
                  }}
                  className="mt-2 text-sm text-indigo-600 hover:text-indigo-700"
                >
                  Use a different account
                </button>
              </div>
            )}

            {/* Auth Options */}
            <div className="space-y-4">
              {/* Sign In Option */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign In
                </h3>
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setShowAuthModal(true);
                  }}
                  className="w-full p-4 border-2 border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors duration-200 text-left"
                >
                  <div className="flex items-center space-x-3">
                    <Mail className="w-6 h-6 text-gray-400" />
                    <div>
                      <h4 className="font-medium text-gray-900">Sign in with Email</h4>
                      <p className="text-sm text-gray-500">Use your existing account</p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>

              {/* Create Account Option */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Account
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setAuthMode('register');
                      setShowAuthModal(true);
                    }}
                    className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors duration-200 text-center"
                  >
                    <Mail className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <h4 className="font-medium text-gray-900 mb-1">Email & Password</h4>
                    <p className="text-sm text-gray-500">Create a new account</p>
                  </button>

                  <button
                    onClick={async () => {
                      if (!actions) return;
                      
                      try {
                        await actions.signInWithGoogle();
                        onClose();
                      } catch (error) {
                        actions.showMessage('Error', `Google sign-in failed: ${error.message || 'Please try again.'}`, 'error');
                      }
                    }}
                    className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-colors duration-200 text-center"
                  >
                    <div className="w-8 h-8 bg-red-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">G</span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">Google Sign In</h4>
                    <p className="text-sm text-gray-500">Quick sign in</p>
                  </button>
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
            // If user successfully authenticated, close the sign-in modal too
            if (state.isAuthenticated) {
              onClose();
            }
          }}
          initialMode={authMode}
          initialEmail={lastUserEmail}
        />
      )}

    </>
  );
};

export default SignInModal;
