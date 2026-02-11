import React from 'react';
import { Lock, Zap, Star } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import useSubscription from '../../hooks/useSubscription';

const FeatureGate = ({ 
  feature, 
  children, 
  fallback = null,
  showUpgradePrompt = true,
  className = ''
}) => {
  const { actions } = useApp();
  const { hasPlanFeature, canUseFeature, getCurrentPlan, getUsageStats, loading } = useSubscription();

  // Special case: financial_projections should always be available (it's in all plans)
  const isFinancialProjections = feature === 'financial_projections';
  
  // During loading, allow financial_projections to render (it's available to all)
  if (loading && isFinancialProjections) {
    return <div className={className}>{children}</div>;
  }

  // Check if user has access to the feature
  const hasAccess = isFinancialProjections ? true : hasPlanFeature(feature);
  const usage = getUsageStats();
  const canUse = isFinancialProjections ? true : canUseFeature(feature, usage[feature] || 0);

  // If user has access and can use the feature, render children
  if (hasAccess && canUse) {
    return <div className={className}>{children}</div>;
  }

  // If user doesn't have access and we should show upgrade prompt
  if (showUpgradePrompt) {
    return (
      <div className={`relative ${className}`}>
        {/* Blurred content */}
        <div className="filter blur-sm pointer-events-none">
          {children}
        </div>
        
        {/* Overlay with upgrade prompt */}
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 backdrop-blur-sm rounded-lg">
          <div className="text-center p-6 max-w-md">
            <div className="mb-4">
              <Lock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Premium Feature
              </h3>
              <p className="text-gray-600 text-sm">
                {getUpgradeMessage(feature, getCurrentPlan())}
              </p>
            </div>
            
            <button
              onClick={() => {
                actions.setActiveTab('pricing');
              }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center mx-auto"
            >
              <Zap className="w-4 h-4 mr-2" />
              Upgrade to Unlock
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Return fallback or nothing
  return fallback;
};

const getUpgradeMessage = (feature, currentPlan) => {
  const messages = {
    hasAdvancedAnalytics: 'Unlock advanced financial analytics, 5-year projections, and detailed market insights.',
    hasCollaboration: 'Add team collaboration features to work together on your restaurant plans.',
    hasApiAccess: 'Get API access for custom integrations and advanced automation.',
    maxPlans: 'Create unlimited restaurant plans and manage multiple concepts.',
    maxExports: 'Export unlimited PDF and Excel reports without watermarks.'
  };

  return messages[feature] || 'This feature requires a paid subscription.';
};

// Usage limit component
export const UsageLimit = ({ feature, current, max, children }) => {
  const { actions } = useApp();
  const { getCurrentPlan } = useSubscription();
  
  const currentPlan = getCurrentPlan();
  const isAtLimit = max !== -1 && current >= max;
  const percentage = max !== -1 ? (current / max) * 100 : 0;

  if (!isAtLimit) {
    return <div>{children}</div>;
  }

  return (
    <div className="relative">
      <div className="filter blur-sm pointer-events-none">
        {children}
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 backdrop-blur-sm rounded-lg">
        <div className="text-center p-6 max-w-md">
          <div className="mb-4">
            <Star className="w-12 h-12 text-amber-500 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Usage Limit Reached
            </h3>
            <p className="text-gray-600 text-sm">
              You've used {current} of {max} {feature} this month. Upgrade to continue.
            </p>
            
            <div className="mt-3 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>
          
          <button
            onClick={() => {
              actions.setActiveTab('pricing');
            }}
            className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-700 transition-all duration-200 flex items-center mx-auto"
          >
            <Star className="w-4 h-4 mr-2" />
            Upgrade Plan
          </button>
        </div>
      </div>
    </div>
  );
};

// Subscription status component
export const SubscriptionStatus = () => {
  const { subscription, getCurrentPlan, getDaysUntilRenewal, isActive, isTrialing } = useSubscription();
  
  if (!subscription) return null;

  const currentPlan = getCurrentPlan();
  const daysUntilRenewal = getDaysUntilRenewal();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">
            Current Plan: {currentPlan.name}
          </h3>
          <p className="text-xs text-gray-500">
            {isTrialing() ? 'Trial Period' : 'Active Subscription'}
          </p>
        </div>
        
        <div className="text-right">
          {daysUntilRenewal !== null && (
            <p className="text-xs text-gray-500">
              {daysUntilRenewal > 0 
                ? `Renews in ${daysUntilRenewal} days`
                : 'Renewed today'
              }
            </p>
          )}
          
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            isActive() 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {isActive() ? 'Active' : 'Inactive'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureGate;
