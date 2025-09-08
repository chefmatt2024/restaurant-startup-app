import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import Dashboard from './pages/Dashboard';
import SignInModal from './components/auth/SignInModal';
import LoadingSpinner from './components/ui/LoadingSpinner';
import MessageModal from './components/ui/MessageModal';
import './App.css';

function AppContent() {
  const { state } = useApp();
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  
  // Check authentication status on mount
  useEffect(() => {
    if (!state.isLoading && !hasCheckedAuth) {
      setHasCheckedAuth(true);
      // Show sign-in modal if not authenticated
      if (!state.isAuthenticated && !state.userId) {
        setShowSignInModal(true);
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
      />
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