import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { AppProvider, useApp } from './contexts/AppContext';
import Dashboard from './pages/Dashboard';
import RestaurantBusinessPlannerLanding from './components/unified/RestaurantBusinessPlannerLanding';
import SignInModal from './components/auth/SignInModal';
import TrialSignup from './components/auth/TrialSignup';
import TrialOnboarding from './components/auth/TrialOnboarding';
import TermsAndPrivacy from './components/auth/TermsAndPrivacy';
import LoadingSpinner from './components/ui/LoadingSpinner';
import MessageModal from './components/ui/MessageModal';
import { SessionManager, trackUsage } from './utils/accessControl';
import analyticsService from './services/analytics';
import FeedbackCollector from './components/feedback/FeedbackCollector';
import './App.css';

function AppContent() {
  const { state, actions } = useApp();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showTrialSignup, setShowTrialSignup] = useState(false);
  const [showTrialOnboarding, setShowTrialOnboarding] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const [, setHasAcceptedTerms] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  
  // Check authentication status on mount
  useEffect(() => {
    if (!state.isLoading && !hasCheckedAuth) {
      setHasCheckedAuth(true);
      
      // Check if user has accepted terms
      const termsAccepted = localStorage.getItem('termsAccepted');
      if (termsAccepted === 'true') {
        setHasAcceptedTerms(true);
      }
      
      // Always require authentication - show terms first, then trial signup
      if (!termsAccepted) {
        setShowTermsModal(true);
      } else if (state.isAuthenticated && state.userId) {
        // User is signed in - don't show trial popup
        // Start session tracking
        SessionManager.startSession(state.userId);
        trackUsage('APP_ACCESS', 'login', { userId: state.userId });
        
        // Track user login
        analyticsService.track('user_login', {
          userId: state.userId,
          loginMethod: 'email',
          timestamp: Date.now()
        });
      } else if (!state.isAuthenticated || !state.userId) {
        // User is not authenticated - show trial signup
        if (state.activeTab === 'trial-signup') {
          setShowTrialSignup(true);
        } else {
          setShowTrialSignup(true);
        }
      }
    }
  }, [state.isLoading, state.isAuthenticated, state.userId, state.activeTab, hasCheckedAuth]);

  // Handle terms acceptance
  const handleTermsAccept = () => {
    localStorage.setItem('termsAccepted', 'true');
    setHasAcceptedTerms(true);
    setShowTermsModal(false);
    
    // Track terms acceptance
    trackUsage('TERMS', 'accepted', { userId: state.userId || 'anonymous' });
    
    // Show trial signup only if user is NOT authenticated
    if (!state.isAuthenticated && !state.userId) {
      setShowTrialSignup(true);
    }
    // If user is already authenticated, don't show trial signup
  };

  const handleTermsDecline = () => {
    // Redirect to external page or show message
    alert('You must accept the terms to use this application.');
    window.location.href = 'https://www.google.com';
  };
  
  // Show loading spinner while initializing
  if (state.isLoading && !hasCheckedAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show terms modal if not accepted
  if (showTermsModal) {
    return (
      <TermsAndPrivacy 
        onAccept={handleTermsAccept}
        onDecline={handleTermsDecline}
      />
    );
  }
  
  // Show dashboard - accessible to all users
  return (
    <div className="App min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/landing" element={
          <div className="App min-h-screen bg-white">
            <RestaurantBusinessPlannerLanding />
            {state.activeTab === 'sign-in' && (
              <SignInModal 
                isOpen={true}
                onClose={() => {}}
                allowClose={true}
              />
            )}
          </div>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <LoadingSpinner />
      <MessageModal />
      
      {/* Trial Signup Modal - Only show if user is not authenticated */}
      {!state.isAuthenticated && (
        <TrialSignup 
          isOpen={showTrialSignup}
          onClose={() => setShowTrialSignup(false)}
          onSuccess={() => {
            setShowTrialSignup(false);
            setShowTrialOnboarding(true);
          }}
        />
      )}
      
      {/* Trial Onboarding Modal - Only show if user is not authenticated */}
      {!state.isAuthenticated && (
        <TrialOnboarding 
          isOpen={showTrialOnboarding}
          onComplete={() => {
            setShowTrialOnboarding(false);
            // Navigate to dashboard or first step
            actions.setActiveTab('idea-formation');
          }}
        />
      )}
      
      {/* Sign-in Modal Overlay */}
      <SignInModal 
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        allowClose={true}
      />
      
      {/* Feedback Modal */}
      <FeedbackCollector 
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        context={{ page: window.location.pathname }}
      />
      
      {/* Floating Feedback Button */}
      <button
        onClick={() => setShowFeedbackModal(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
        title="Share Feedback"
      >
        <MessageSquare className="h-6 w-6" />
      </button>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App; 