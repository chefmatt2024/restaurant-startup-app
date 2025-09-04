import React from 'react';
import { useApp } from '../../contexts/AppContext';

const DebugInfo = () => {
  const { state } = useApp();

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-4 rounded-lg text-xs max-w-xs z-50">
      <div className="font-bold mb-2">Debug Info</div>
      <div>Active Tab: {state.activeTab}</div>
      <div>Drafts: {state.drafts.length}</div>
      <div>Current Draft: {state.currentDraftId}</div>
      <div>Loading: {state.isLoading ? 'Yes' : 'No'}</div>
      <div>Authenticated: {state.isAuthenticated ? 'Yes' : 'No'}</div>
      <div>User ID: {state.userId || 'None'}</div>
    </div>
  );
};

export default DebugInfo;
