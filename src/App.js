import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { AppProvider, useApp } from './contexts/AppContext';
import Dashboard from './pages/Dashboard';
import RestaurantBusinessPlannerLanding from './components/unified/RestaurantBusinessPlannerLanding';
import InvestorLanding from './components/landing/InvestorLanding';
import SignInModal from './components/auth/SignInModal';
import ProtectedRoute from './components/auth/ProtectedRoute';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import TechPage from './pages/TechPage';
import SitemapPage from './pages/SitemapPage';
import FAQPage from './pages/FAQPage';
import LoadingSpinner from './components/ui/LoadingSpinner';
import MessageModal from './components/ui/MessageModal';
import { SessionManager, trackUsage } from './utils/accessControl';
import analyticsService from './services/analytics';
import FeedbackCollector from './components/feedback/FeedbackCollector';
import './App.css';

function AppContent() {
  const { state } = useApp();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  
  // Check authentication status on mount
  useEffect(() => {
    if (!state.isLoading && !hasCheckedAuth) {
      setHasCheckedAuth(true);
      
      if (state.isAuthenticated && state.userId) {
        // User is signed in - start session tracking
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
  
  // Show dashboard - protected route (requires authentication)
  return (
    <div className="App min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
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
        <Route path="/investors" element={
          <div className="App min-h-screen bg-white">
            <InvestorLanding />
          </div>
        } />
        <Route path="/restaurant-startup-app" element={
          <div className="App min-h-screen bg-white">
            <InvestorLanding />
          </div>
        } />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/tech" element={<TechPage />} />
        <Route path="/sitemap" element={<SitemapPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <LoadingSpinner />
      <MessageModal />
      
      {/* Sign-in Modal Overlay (for manual sign-in from header) */}
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