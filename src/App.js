import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { AppProvider, useApp } from './contexts/AppContext';
import Dashboard from './pages/Dashboard';
import SignInModal from './components/auth/SignInModal';
import TermsAndPrivacy from './components/auth/TermsAndPrivacy';
import LoadingSpinner from './components/ui/LoadingSpinner';
import MessageModal from './components/ui/MessageModal';
import { SessionManager, trackUsage } from './utils/accessControl';
import analyticsService from './services/analytics';
import FeedbackCollector from './components/feedback/FeedbackCollector';
import './App.css';

function AppContent() {
  const { state } = useApp();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
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
      
      // Always require authentication - show terms first, then sign-in
      if (!termsAccepted) {
        setShowTermsModal(true);
      } else if (!state.isAuthenticated || !state.userId) {
        // Force sign-in - no anonymous access allowed
        setShowSignInModal(true);
      } else if (state.userId) {
        // Start session tracking
        SessionManager.startSession(state.userId);
        trackUsage('APP_ACCESS', 'login', { userId: state.userId });
        
        // Track user login
        analyticsService.track('user_login', {
          userId: state.userId,
          loginMethod: 'email',
          timestamp: Date.now()
        });
      }
    }
  }, [state.isLoading, state.isAuthenticated, state.userId, hasCheckedAuth]);

  // Handle terms acceptance
  const handleTermsAccept = () => {
    localStorage.setItem('termsAccepted', 'true');
    setHasAcceptedTerms(true);
    setShowTermsModal(false);
    
    // Track terms acceptance
    trackUsage('TERMS', 'accepted', { userId: state.userId || 'anonymous' });
    
    // Show sign-in modal if not authenticated
    if (!state.isAuthenticated && !state.userId) {
      setShowSignInModal(true);
    }
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
  
  // Show sign-in modal if not authenticated
  if (!state.isAuthenticated || !state.userId) {
    return (
      <div className="App min-h-screen bg-gray-50">
        <SignInModal 
          isOpen={true}
          onClose={() => {}} // Prevent closing when not authenticated
          allowClose={false} // Disable close button when not authenticated
        />
      </div>
    );
  }

  // Show dashboard with sign-in modal overlay if needed
  return (
    <div className="App min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <LoadingSpinner />
      <MessageModal />
      
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