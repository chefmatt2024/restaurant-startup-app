import React, { useState } from 'react';
import { CreditCard, Settings, Download, Users, Zap, Star } from 'lucide-react';
import useSubscription from '../../hooks/useSubscription';
import { useApp } from '../../contexts/AppContext';
import { formatPrice, createCustomerPortalSession } from '../../services/stripe';

const SubscriptionManager = () => {
  const { state, actions } = useApp();
  const { 
    subscription, 
    getCurrentPlan, 
    getUsageStats, 
    getDaysUntilRenewal,
    isTrialing,
    isCancelled,
    isPastDue
  } = useSubscription();
  
  const [loading, setLoading] = useState(false);

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      const url = await createCustomerPortalSession(state.userId);
      window.location.href = url;
    } catch (error) {
      console.error('Error opening customer portal:', error);
      actions.showMessage('Error', 'Failed to open billing portal', 'error');
    } finally {
      setLoading(false);
    }
  };

  const currentPlan = getCurrentPlan();
  const usage = getUsageStats();
  const daysUntilRenewal = getDaysUntilRenewal();

  const getStatusColor = () => {
    if (isPastDue()) return 'text-red-600 bg-red-100';
    if (isCancelled()) return 'text-amber-600 bg-amber-100';
    if (isTrialing()) return 'text-blue-600 bg-blue-100';
    return 'text-green-600 bg-green-100';
  };

  const getStatusText = () => {
    if (isPastDue()) return 'Payment Required';
    if (isCancelled()) return 'Cancelled';
    if (isTrialing()) return 'Trial';
    return 'Active';
  };

  return (
    <div className="space-y-6">
      {/* Current Subscription Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Subscription Details
          </h2>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Current Plan</h3>
            <p className="text-2xl font-bold text-gray-900">{currentPlan.name}</p>
            <p className="text-sm text-gray-600">
              {formatPrice(currentPlan.price)}
              {currentPlan.price > 0 && '/month'}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Next Billing</h3>
            <p className="text-lg font-semibold text-gray-900">
              {daysUntilRenewal !== null 
                ? `${daysUntilRenewal} days` 
                : 'N/A'
              }
            </p>
            <p className="text-sm text-gray-600">
              {subscription?.currentPeriodEnd 
                ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
                : 'No active subscription'
              }
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Plan Features</h3>
            <div className="flex flex-wrap gap-1">
              {currentPlan.features.slice(0, 2).map((feature, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                >
                  {feature}
                </span>
              ))}
              {currentPlan.features.length > 2 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                  +{currentPlan.features.length - 2} more
                </span>
              )}
            </div>
          </div>
        </div>

        {currentPlan.price > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleManageSubscription}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Settings className="w-4 h-4 mr-2" />
              )}
              Manage Billing
            </button>
          </div>
        )}
      </div>

      {/* Usage Statistics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage This Month</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Restaurant Plans</p>
              <p className="text-2xl font-bold text-gray-900">
                {usage.restaurantPlans}
                {currentPlan.limits.maxPlans !== -1 && (
                  <span className="text-sm text-gray-500">/{currentPlan.limits.maxPlans}</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <Download className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Exports</p>
              <p className="text-2xl font-bold text-gray-900">
                {usage.exportsThisMonth}
                {currentPlan.limits.maxExports !== -1 && (
                  <span className="text-sm text-gray-500">/{currentPlan.limits.maxExports}</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg mr-4">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Collaborators</p>
              <p className="text-2xl font-bold text-gray-900">
                {usage.collaborators}
                {currentPlan.limits.hasCollaboration && (
                  <span className="text-xs text-green-600 ml-1">∞</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Prompts */}
      {currentPlan.id === 'free' && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
          <div className="flex items-start">
            <div className="p-2 bg-blue-100 rounded-lg mr-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Unlock Premium Features
              </h3>
              <p className="text-gray-600 mb-4">
                Upgrade to Professional to access unlimited restaurant plans, advanced analytics, and premium support.
              </p>
              <button
                onClick={() => actions.setActiveTab('pricing')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              >
                View Plans & Pricing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trial Information */}
      {isTrialing() && (
        <div className="bg-amber-50 rounded-lg border border-amber-200 p-6">
          <div className="flex items-start">
            <div className="p-2 bg-amber-100 rounded-lg mr-4">
              <Star className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Free Trial Active
              </h3>
              <p className="text-gray-600 mb-4">
                You're currently enjoying a free trial of {currentPlan.name}. 
                Your trial will end on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}.
              </p>
              <button
                onClick={handleManageSubscription}
                className="bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-700 transition-colors duration-200"
              >
                Manage Subscription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManager;
