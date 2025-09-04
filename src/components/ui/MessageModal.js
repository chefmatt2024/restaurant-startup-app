import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const MessageModal = () => {
  const { state, actions } = useApp();

  if (!state.showMessage) return null;

  const getIcon = () => {
    switch (state.message.type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-600" />;
      default:
        return <Info className="w-6 h-6 text-blue-600" />;
    }
  };

  const getBackgroundColor = () => {
    switch (state.message.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg shadow-lg max-w-md w-full border-2 ${getBackgroundColor()}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              {getIcon()}
              <h3 className="text-lg font-semibold text-gray-900">
                {state.message.title}
              </h3>
            </div>
            <button
              onClick={actions.hideMessage}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-700 mb-6">{state.message.text}</p>
          <div className="flex justify-end">
            <button
              onClick={actions.hideMessage}
              className="btn-primary"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageModal; 