import React, { useState } from 'react';
import { Search, MapPin, TrendingUp, Loader2, CheckCircle } from 'lucide-react';
import { researchMarketData } from '../../services/aiService';
import AIAssistant from './AIAssistant';

const AIResearchPanel = ({ location = 'Boston', restaurantType = null, onDataReceived }) => {
  const [researching, setResearching] = useState(false);
  const [researchResults, setResearchResults] = useState(null);
  const [error, setError] = useState(null);

  const handleResearch = async () => {
    setResearching(true);
    setError(null);
    setResearchResults(null);

    try {
      const results = await researchMarketData(location, restaurantType);
      setResearchResults(results);
      if (onDataReceived) {
        onDataReceived(results);
      }
    } catch (err) {
      setError(err.message || 'Failed to research market data');
    } finally {
      setResearching(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Search className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">AI Market Research</h3>
        </div>
        <button
          onClick={handleResearch}
          disabled={researching}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {researching ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Researching...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Research Market</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center space-x-2 mb-1">
            <MapPin className="w-4 h-4 text-gray-600" />
            <span className="text-xs text-gray-600">Location</span>
          </div>
          <span className="font-semibold text-gray-900">{location}</span>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center space-x-2 mb-1">
            <TrendingUp className="w-4 h-4 text-gray-600" />
            <span className="text-xs text-gray-600">Type</span>
          </div>
          <span className="font-semibold text-gray-900">{restaurantType || 'Restaurant'}</span>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center space-x-2 mb-1">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-xs text-gray-600">Status</span>
          </div>
          <span className="font-semibold text-green-600">
            {researching ? 'Researching...' : researchResults ? 'Complete' : 'Ready'}
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {researchResults && (
        <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
          <h4 className="font-semibold text-gray-900 mb-2">Research Results</h4>
          <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-700">
            {researchResults}
          </div>
        </div>
      )}

      <div className="mt-4">
        <AIAssistant
          context={{ location, restaurantType }}
          placeholder="Ask specific questions about the market..."
          showQuickActions={false}
        />
      </div>
    </div>
  );
};

export default AIResearchPanel;

