import { useState, useEffect, useContext } from 'react';
import { useApp } from '../contexts/AppContext';
import { getPlanById, hasFeature, canAccessFeature } from '../services/stripe';

export const useSubscription = () => {
  const { state } = useApp();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get subscription from user data
  useEffect(() => {
    if (state.user && state.user.subscription) {
      setSubscription(state.user.subscription);
    } else {
      // Default to free plan if no subscription data
      setSubscription({
        status: 'active',
        plan: 'free',
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false
      });
    }
    setLoading(false);
  }, [state.user]);

  // Helper functions
  const getCurrentPlan = () => {
    return getPlanById(subscription?.plan || 'free');
  };

  const isActive = () => {
    return subscription?.status === 'active' || subscription?.status === 'trialing';
  };

  const isTrialing = () => {
    return subscription?.status === 'trialing';
  };

  const isCancelled = () => {
    return subscription?.cancelAtPeriodEnd || subscription?.status === 'cancelled';
  };

  const isPastDue = () => {
    return subscription?.status === 'past_due';
  };

  const hasPlanFeature = (feature) => {
    if (!subscription) return false;
    return hasFeature(subscription.plan, feature);
  };

  const canUseFeature = (feature, currentUsage = 0) => {
    if (!subscription) return false;
    return canAccessFeature(subscription.plan, feature, currentUsage);
  };

  const getDaysUntilRenewal = () => {
    if (!subscription?.currentPeriodEnd) return null;
    const now = new Date();
    const renewalDate = new Date(subscription.currentPeriodEnd);
    const diffTime = renewalDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getTrialDaysRemaining = () => {
    if (!isTrialing() || !subscription?.trialEnd) return null;
    const now = new Date();
    const trialEnd = new Date(subscription.trialEnd);
    const diffTime = trialEnd - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getUsageStats = () => {
    // This would typically come from your backend
    // For now, we'll return mock data
    return {
      restaurantPlans: state.drafts?.length || 0,
      exportsThisMonth: 0, // Track this in your app
      collaborators: 0 // Track this in your app
    };
  };

  const getUpgradeReasons = () => {
    const currentPlan = getCurrentPlan();
    const usage = getUsageStats();
    const reasons = [];

    if (currentPlan.id === 'free') {
      if (usage.restaurantPlans >= 1) {
        reasons.push('You\'ve reached the limit of 1 restaurant plan');
      }
      if (usage.exportsThisMonth >= 3) {
        reasons.push('You\'ve used all 3 monthly exports');
      }
      if (!hasPlanFeature('hasAdvancedAnalytics')) {
        reasons.push('Unlock advanced financial analytics');
      }
    }

    if (currentPlan.id === 'professional') {
      if (!hasPlanFeature('hasCollaboration')) {
        reasons.push('Add team collaboration features');
      }
      if (!hasPlanFeature('hasApiAccess')) {
        reasons.push('Get API access for integrations');
      }
    }

    return reasons;
  };

  return {
    subscription,
    loading,
    error,
    getCurrentPlan,
    isActive,
    isTrialing,
    isCancelled,
    isPastDue,
    hasPlanFeature,
    canUseFeature,
    getDaysUntilRenewal,
    getTrialDaysRemaining,
    getUsageStats,
    getUpgradeReasons
  };
};

export default useSubscription;
