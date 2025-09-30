import { useState, useEffect } from 'react';

const useTrialLimitations = () => {
  const [trialData, setTrialData] = useState(null);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [isTrialExpired, setIsTrialExpired] = useState(false);
  const [isTrialActive, setIsTrialActive] = useState(false);

  useEffect(() => {
    const checkTrialStatus = () => {
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
        setIsTrialExpired(diffDays <= 0);
        setIsTrialActive(diffDays > 0);
      } else {
        setIsTrialActive(false);
        setIsTrialExpired(false);
      }
    };

    checkTrialStatus();
    
    // Check every hour
    const interval = setInterval(checkTrialStatus, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const canAccessFeature = (feature) => {
    // If no trial data, assume paid user
    if (!trialData) return true;
    
    // If trial expired, no access
    if (isTrialExpired) return false;
    
    // Trial features (always available during trial)
    const trialFeatures = [
      'idea-formation',
      'basic-financials',
      'basic-menu',
      'basic-equipment'
    ];
    
    return trialFeatures.includes(feature) || !isTrialActive;
  };

  const getTrialStatus = () => {
    if (!trialData) return 'paid';
    if (isTrialExpired) return 'expired';
    if (isTrialActive) return 'active';
    return 'none';
  };

  const getUpgradePrompt = (feature) => {
    if (canAccessFeature(feature)) return null;
    
    return {
      title: 'Upgrade Required',
      message: 'This feature requires a paid subscription.',
      daysRemaining: daysRemaining
    };
  };

  return {
    trialData,
    daysRemaining,
    isTrialExpired,
    isTrialActive,
    canAccessFeature,
    getTrialStatus,
    getUpgradePrompt
  };
};

export default useTrialLimitations;
