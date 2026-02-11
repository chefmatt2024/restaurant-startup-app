import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { authService } from '../../services/firebase';
import EnhancedAuthModal from './EnhancedAuthModal';
import TermsAndPrivacy from './TermsAndPrivacy';
import { 
  CheckCircle, 
  Star, 
  ArrowRight, 
  Sparkles,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';

/**
 * Improved Authentication Flow Component
 * Handles both new user signup and returning user login with a streamlined UX
 */
const ImprovedAuthFlow = ({ isOpen, onClose, onSuccess }) => {
  const { state, actions } = useApp();
  const [step, setStep] = useState('check'); // 'check', 'terms', 'auth', 'welcome'
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [isNewUser, setIsNewUser] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Check user status on mount
  useEffect(() => {
    if (isOpen) {
      const termsAccepted = localStorage.getItem('termsAccepted') === 'true';
      const lastUserEmail = localStorage.getItem('lastUserEmail');
      const isAuthenticated = state.isAuthenticated && state.userId;
      
      setHasAcceptedTerms(termsAccepted);
      
      if (isAuthenticated) {
        // User is already logged in - close flow
        onSuccess && onSuccess();
        onClose();
      } else if (!termsAccepted) {
        // First time user - show terms first
        setStep('terms');
        setIsNewUser(true);
      } else if (lastUserEmail) {
        // Returning user - show login with email pre-filled
        setStep('auth');
        setAuthMode('login');
        setUserEmail(lastUserEmail);
        setShowAuthModal(true);
      } else {
        // No previous user - show auth options
        setStep('auth');
        setAuthMode('register');
        setShowAuthModal(true);
      }
    }
  }, [isOpen, state.isAuthenticated, state.userId, onSuccess, onClose]);

  // Listen for successful authentication
  useEffect(() => {
    if (state.isAuthenticated && state.userId && showAuthModal) {
      // User successfully authenticated
      const user = authService.getCurrentUser();
      if (user && user.email) {
        localStorage.setItem('lastUserEmail', user.email);
        setUserEmail(user.email);
      }
      
      // Check if this is a new user (just registered)
      if (authMode === 'register') {
        setStep('welcome');
        setIsNewUser(true);
      } else {
        // Returning user - show welcome back
        onSuccess && onSuccess();
        actions.showMessage('Success', `Welcome back, ${user?.displayName || user?.email || 'there'}!`, 'success');
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    }
  }, [state.isAuthenticated, state.userId, showAuthModal, authMode, onSuccess, onClose, actions]);

  const handleTermsAccept = () => {
    localStorage.setItem('termsAccepted', 'true');
    setHasAcceptedTerms(true);
    setStep('auth');
    setAuthMode('register');
    setShowAuthModal(true);
  };

  const handleTermsDecline = () => {
    alert('You must accept the Terms of Service and Privacy Policy to use the application.');
  };

  const handleAuthClose = () => {
    setShowAuthModal(false);
    // If user closes auth modal without signing in, close the entire flow
    if (!state.isAuthenticated) {
      onClose();
    }
  };

  const handleWelcomeComplete = () => {
    onSuccess && onSuccess();
    onClose();
  };

  if (!isOpen) return null;

  // Terms Step
  if (step === 'terms') {
    return (
      <TermsAndPrivacy
        isOpen={true}
        onAccept={handleTermsAccept}
        onDecline={handleTermsDecline}
      />
    );
  }

  // Welcome Step (for new users)
  if (step === 'welcome' && isNewUser) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-t-xl text-white text-center">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Welcome to Your Restaurant Planning Journey!</h2>
            <p className="text-blue-100 text-lg">
              You're all set to start building your dream restaurant
            </p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Success Message */}
            <div className="flex items-center space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-900">Account Created Successfully!</p>
                <p className="text-sm text-green-700">Your 5-day free trial has started</p>
              </div>
            </div>

            {/* Features Overview */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What You Can Do Now:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                  <Star className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">Business Planning</h4>
                    <p className="text-sm text-gray-600">Create your restaurant concept and business plan</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">Financial Projections</h4>
                    <p className="text-sm text-gray-600">Build detailed financial models and forecasts</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                  <Users className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">Market Research</h4>
                    <p className="text-sm text-gray-600">Analyze competition and find your market fit</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-orange-50 rounded-lg">
                  <Zap className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900">AI-Powered Insights</h4>
                    <p className="text-sm text-gray-600">Get intelligent recommendations and analysis</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Start Tips */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Start Tips:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <ArrowRight className="w-4 h-4 text-blue-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Start with <strong>Idea Formation</strong> to define your restaurant concept</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="w-4 h-4 text-blue-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Use <strong>Financial Projections</strong> to build your business model</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="w-4 h-4 text-blue-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Explore <strong>Market Analysis</strong> to understand your competition</span>
                </li>
                <li className="flex items-start">
                  <ArrowRight className="w-4 h-4 text-blue-600 mr-2 mt-1 flex-shrink-0" />
                  <span>Save your work regularly - everything is automatically saved!</span>
                </li>
              </ul>
            </div>

            {/* Action Button */}
            <button
              onClick={handleWelcomeComplete}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Auth Step
  if (step === 'auth' && showAuthModal) {
    return (
      <EnhancedAuthModal
        isOpen={showAuthModal}
        onClose={handleAuthClose}
        initialMode={authMode}
        initialEmail={userEmail}
      />
    );
  }

  return null;
};

export default ImprovedAuthFlow;

