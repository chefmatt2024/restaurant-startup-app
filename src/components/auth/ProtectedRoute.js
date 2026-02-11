import React from 'react';
import { useApp } from '../../contexts/AppContext';
import ImprovedAuthFlow from './ImprovedAuthFlow';

/**
 * ProtectedRoute Component
 * Ensures users must be authenticated (with at least a free trial) before accessing the app
 */
const ProtectedRoute = ({ children }) => {
  const { state } = useApp();
  const [showAuthFlow, setShowAuthFlow] = React.useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = React.useState(false);

  React.useEffect(() => {
    // Wait for initial auth check to complete
    if (!state.isLoading && !hasCheckedAuth) {
      setHasCheckedAuth(true);
    }
    
    // Show auth flow if not authenticated
    if (hasCheckedAuth && (!state.isAuthenticated || !state.userId)) {
      setShowAuthFlow(true);
    } else if (state.isAuthenticated && state.userId) {
      // User authenticated - hide auth flow
      setShowAuthFlow(false);
    }
  }, [state.isLoading, state.isAuthenticated, state.userId, hasCheckedAuth]);

  // Show loading while checking auth
  if (state.isLoading || !hasCheckedAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show auth flow and block access
  if (!state.isAuthenticated || !state.userId) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome to Restaurant Business Planner
              </h1>
              <p className="text-gray-600">
                Sign up for your free 5-day trial to get started
              </p>
            </div>
            <div className="animate-pulse">
              <div className="h-2 bg-blue-200 rounded-full w-48 mx-auto"></div>
            </div>
          </div>
        </div>
        <ImprovedAuthFlow
          isOpen={showAuthFlow}
          onClose={() => {
            // Don't allow closing without authentication - user must sign in
            // Keep auth flow open
          }}
          onSuccess={() => {
            setShowAuthFlow(false);
          }}
        />
      </>
    );
  }

  // User is authenticated - show the protected content
  return <>{children}</>;
};

export default ProtectedRoute;

