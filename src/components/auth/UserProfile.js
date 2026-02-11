import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { authService } from '../../services/firebase';
import { 
  User, 
  Mail, 
  Calendar, 
  LogOut, 
  Edit3, 
  X,
  Check,
  AlertCircle,
  Loader2,
  Settings,
  CreditCard,
  Shield,
  DollarSign,
  Star
} from 'lucide-react';
import AdminDashboard from '../admin/AdminDashboard';
import SubscriptionManager from '../payment/SubscriptionManager';
import PricingPage from '../payment/PricingPage';
import SubscriptionDemo from '../payment/SubscriptionDemo';

const UserProfile = ({ isOpen, onClose, initialSection = 'profile' }) => {
  const { state, actions } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeSection, setActiveSection] = useState(initialSection); // 'profile', 'pricing', 'subscription', 'subscription-demo', 'admin'
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: state.user?.displayName || '',
    email: state.user?.email || ''
  });

  const currentUser = authService.getCurrentUser();

  // Check admin status and set initial section
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!state.user?.email) {
        setIsAdmin(false);
        return;
      }
      
      const adminEmails = [
        'matt@iterumfoods.com',
        'hello@iterumfoods.xyz',
        'admin@iterumfoods.xyz'
      ];
      const userEmail = state.user.email.toLowerCase();
      const isIterumEmail = userEmail.endsWith('@iterumfoods.com');
      const isAuthorizedEmail = adminEmails.includes(userEmail);
      setIsAdmin(isAuthorizedEmail || isIterumEmail);
    };
    
    if (isOpen) {
      checkAdminStatus();
      // Set initial section when modal opens
      setActiveSection(initialSection);
    }
  }, [state.user, isOpen, initialSection]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSaveProfile = async () => {
    if (!profileData.displayName.trim()) {
      setError('Display name is required');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await authService.updateUserProfile({
        displayName: profileData.displayName
      });
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      // console.error('Profile update error:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await authService.signOut();
      onClose();
    } catch (error) {
      // console.error('Sign out error:', error);
      setError('Failed to sign out. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">User Profile</h2>
              <p className="text-sm text-gray-600">Manage your account settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 flex-shrink-0">
          <button
            onClick={() => setActiveSection('profile')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeSection === 'profile'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Profile</span>
            </div>
          </button>
          <button
            onClick={() => setActiveSection('pricing')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeSection === 'pricing'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4" />
              <span>Pricing</span>
            </div>
          </button>
          <button
            onClick={() => setActiveSection('subscription')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeSection === 'subscription'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4" />
              <span>Subscription</span>
            </div>
          </button>
          <button
            onClick={() => setActiveSection('subscription-demo')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeSection === 'subscription-demo'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4" />
              <span>Demo</span>
            </div>
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveSection('admin')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeSection === 'admin'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </div>
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {activeSection === 'profile' && (
            <div className="p-6 space-y-6">
          {/* User Info */}
          <div className="space-y-4">
            {/* Display Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    name="displayName"
                    value={profileData.displayName}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setProfileData({
                        displayName: currentUser?.displayName || '',
                        email: currentUser?.email || ''
                      });
                      setError('');
                    }}
                    className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-900">
                    {currentUser?.displayName || 'No name set'}
                  </span>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900">
                  {currentUser?.email || 'No email set'}
                </span>
              </div>
            </div>

            {/* Account Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Type
              </label>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900">
                  {currentUser?.isAnonymous ? 'Anonymous User' : 'Registered User'}
                </span>
              </div>
            </div>

            {/* User ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User ID
              </label>
              <div className="p-3 bg-gray-50 rounded-lg">
                <code className="text-sm text-gray-600 font-mono">
                  {currentUser?.uid || 'Unknown'}
                </code>
              </div>
            </div>

            {/* Created Date */}
            {currentUser?.metadata?.creationTime && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Member Since
                </label>
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">
                    {formatDate(currentUser.metadata.creationTime)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-sm text-green-700">{success}</span>
            </div>
          )}

          {/* Account Stats */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Your Data</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {state.drafts?.length || 0}
                </div>
                <div className="text-xs text-blue-600">Draft Plans</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {state.vendors?.length || 0}
                </div>
                <div className="text-xs text-green-600">Vendors</div>
              </div>
            </div>
          </div>
        </div>
          )}

          {activeSection === 'pricing' && (
            <div className="p-6">
              <PricingPage />
            </div>
          )}

          {activeSection === 'subscription' && (
            <div className="p-6">
              <SubscriptionManager />
            </div>
          )}

          {activeSection === 'subscription-demo' && (
            <div className="p-6">
              <SubscriptionDemo />
            </div>
          )}

          {activeSection === 'admin' && isAdmin && (
            <div className="p-6">
              <AdminDashboard />
            </div>
          )}
        </div>

        {/* Footer */}
        {activeSection === 'profile' && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
            <div className="flex space-x-3">
              <button
                onClick={handleSignOut}
                disabled={isLoading}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
                <span>Sign Out</span>
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
        {activeSection !== 'profile' && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex-shrink-0">
            <button
              onClick={onClose}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
