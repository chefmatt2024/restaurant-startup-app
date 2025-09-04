import React from 'react';
import { useApp } from '../../contexts/AppContext';

const LoadingSpinner = () => {
  const { state } = useApp();

  if (!state.isLoading) return null;

  return (
    <div className="loading-overlay">
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner; 