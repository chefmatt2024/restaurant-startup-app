import React, { useState, useEffect } from 'react';
import { Clock, Star, AlertCircle, Zap } from 'lucide-react';

const TrialStatus = ({ onUpgrade }) => {
  const [trialData, setTrialData] = useState(null);
  const [daysRemaining, setDaysRemaining] = useState(0);

  useEffect(() => {
    const storedTrialData = localStorage.getItem('trialData');
    if (storedTrialData) {
      const data = JSON.parse(storedTrialData);
      setTrialData(data);
      
      // Calculate days remaining
      const trialEnd = new Date(data.trialEndDate);
      const now = new Date();
      const diffTime = trialEnd - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysRemaining(Math.max(0, diffDays));
    }
  }, []);

  if (!trialData) return null;

  const getStatusColor = () => {
    if (daysRemaining > 7) return 'text-green-600';
    if (daysRemaining > 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = () => {
    if (daysRemaining > 7) return <Star className="w-4 h-4" />;
    if (daysRemaining > 3) return <Clock className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  const getStatusMessage = () => {
    if (daysRemaining > 7) return `${daysRemaining} days left in your free trial`;
    if (daysRemaining > 3) return `${daysRemaining} days remaining - time to upgrade!`;
    if (daysRemaining > 0) return `Only ${daysRemaining} days left - upgrade now!`;
    return 'Trial expired - upgrade to continue';
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Trial Status */}
      <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()} bg-gray-100`}>
        {getStatusIcon()}
        <span className="ml-1">{getStatusMessage()}</span>
      </div>

      {/* Upgrade Button */}
      <button
        onClick={onUpgrade}
        className="flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
      >
        <Zap className="w-4 h-4 mr-1" />
        Upgrade Now
      </button>
    </div>
  );
};

export default TrialStatus;
