import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { AlertTriangle, Clock, Star, X, ArrowRight, Zap } from 'lucide-react';

const TrialExpirationBanner = ({ onUpgrade }) => {
  const { state } = useApp();
  const [trialData, setTrialData] = useState(null);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [hoursRemaining, setHoursRemaining] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const checkTrialStatus = () => {
      // Check localStorage for trial data
      const storedTrialData = localStorage.getItem('trialData');
      if (storedTrialData) {
        const data = JSON.parse(storedTrialData);
        setTrialData(data);
        
        // Calculate time remaining
        const trialEnd = new Date(data.trialEndDate);
        const now = new Date();
        const diffTime = trialEnd - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
        
        setDaysRemaining(Math.max(0, diffDays));
        setHoursRemaining(Math.max(0, diffHours));
        
        // Show banner if trial is active and within reminder window
        const isActive = diffDays > 0;
        const shouldShow = isActive && (diffDays <= 5) && !isDismissed;
        setShowBanner(shouldShow);
      } else {
        // Check if user has subscription (paid user)
        if (state.subscription?.status === 'active' && state.subscription?.plan !== 'free') {
          setShowBanner(false);
        }
      }
    };

    checkTrialStatus();
    const interval = setInterval(checkTrialStatus, 60 * 60 * 1000); // Check every hour
    return () => clearInterval(interval);
  }, [isDismissed, state.subscription]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setShowBanner(false);
    // Store dismissal for this specific day
    const dismissalKey = `trialBannerDismissed_${new Date().toDateString()}`;
    localStorage.setItem(dismissalKey, 'true');
  };

  const getBannerType = () => {
    if (daysRemaining === 0) return 'expired';
    if (daysRemaining <= 1) return 'urgent';
    if (daysRemaining <= 2) return 'warning';
    if (daysRemaining <= 3) return 'info';
    return 'info';
  };

  const getBannerContent = () => {
    const type = getBannerType();
    
    switch (type) {
      case 'expired':
        return {
          bgColor: 'bg-red-600',
          textColor: 'text-white',
          icon: <AlertTriangle className="w-5 h-5" />,
          title: 'Your Free Trial Has Expired',
          message: 'Upgrade now to continue accessing all features and keep your data.',
          cta: 'Upgrade Now',
          urgent: true
        };
      case 'urgent':
        return {
          bgColor: 'bg-red-500',
          textColor: 'text-white',
          icon: <AlertTriangle className="w-5 h-5" />,
          title: `Only ${hoursRemaining} hours left in your trial!`,
          message: 'Upgrade now to keep all your work and continue planning your restaurant.',
          cta: 'Upgrade Now',
          urgent: true
        };
      case 'warning':
        return {
          bgColor: 'bg-orange-500',
          textColor: 'text-white',
          icon: <Clock className="w-5 h-5" />,
          title: `${daysRemaining} days left in your free trial`,
          message: 'Don\'t lose your progress! Upgrade now to keep all your business plans and data.',
          cta: 'Upgrade Now',
          urgent: false
        };
      case 'info':
        return {
          bgColor: 'bg-blue-600',
          textColor: 'text-white',
          icon: <Star className="w-5 h-5" />,
          title: `${daysRemaining} days remaining in your free trial`,
          message: 'Make the most of your trial. Upgrade anytime to unlock all features permanently.',
          cta: 'View Plans',
          urgent: false
        };
      default:
        return {
          bgColor: 'bg-blue-600',
          textColor: 'text-white',
          icon: <Star className="w-5 h-5" />,
          title: `${daysRemaining} days remaining`,
          message: 'Your free trial is active. Upgrade anytime to continue.',
          cta: 'View Plans',
          urgent: false
        };
    }
  };

  if (!showBanner || !trialData) return null;

  const bannerContent = getBannerContent();

  return (
    <div className={`${bannerContent.bgColor} ${bannerContent.textColor} shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="flex-shrink-0">
              {bannerContent.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1">{bannerContent.title}</h3>
              <p className="text-sm opacity-90">{bannerContent.message}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 ml-4">
            <button
              onClick={() => {
                if (onUpgrade) {
                  onUpgrade();
                } else {
                  window.location.href = '/#pricing';
                }
              }}
              className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                bannerContent.urgent
                  ? 'bg-white text-red-600 hover:bg-gray-100'
                  : 'bg-white bg-opacity-20 hover:bg-opacity-30 text-white'
              }`}
            >
              <span>{bannerContent.cta}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            
            {!bannerContent.urgent && (
              <button
                onClick={handleDismiss}
                className="text-white hover:text-gray-200 transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrialExpirationBanner;


