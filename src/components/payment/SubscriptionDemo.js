import React from 'react';
import { Lock, Unlock, Zap, Star, X, Check } from 'lucide-react';
import FeatureGate from './FeatureGate';
import useSubscription from '../../hooks/useSubscription';

const SubscriptionDemo = () => {
  const { getCurrentPlan, hasPlanFeature, getUsageStats } = useSubscription();
  
  const currentPlan = getCurrentPlan();
  const usage = getUsageStats();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Subscription System Demo
        </h1>
        <p className="text-gray-600">
          See how feature gating works with different subscription plans
        </p>
      </div>

      {/* Current Plan Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Plan Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Current Plan</h3>
            <p className="text-2xl font-bold text-blue-600">{currentPlan.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Restaurant Plans</h3>
            <p className="text-lg font-semibold text-gray-900">
              {usage.restaurantPlans}
              {currentPlan.limits.maxPlans !== -1 && (
                <span className="text-sm text-gray-500">/{currentPlan.limits.maxPlans}</span>
              )}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Advanced Analytics</h3>
            <div className="flex items-center">
              {hasPlanFeature('hasAdvancedAnalytics') ? (
                <Unlock className="w-5 h-5 text-green-500 mr-2" />
              ) : (
                <Lock className="w-5 h-5 text-gray-400 mr-2" />
              )}
              <span className={hasPlanFeature('hasAdvancedAnalytics') ? 'text-green-600' : 'text-gray-500'}>
                {hasPlanFeature('hasAdvancedAnalytics') ? 'Unlocked' : 'Locked'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Free Feature */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Unlock className="w-6 h-6 text-green-500 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Basic Financial Projections</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Available on all plans. Basic revenue and expense calculations.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Sample Calculation</h4>
            <p className="text-sm text-gray-600">
              Monthly Revenue: $50,000<br />
              Monthly Expenses: $35,000<br />
              <strong>Net Profit: $15,000</strong>
            </p>
          </div>
        </div>

        {/* Premium Feature */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <FeatureGate feature="hasAdvancedAnalytics">
            <div className="flex items-center mb-4">
              <Zap className="w-6 h-6 text-purple-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Advanced Analytics</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Premium feature with 5-year projections, market trends, and industry benchmarks.
            </p>
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Advanced Features</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 5-year financial projections</li>
                <li>• Market trend analysis</li>
                <li>• Industry benchmark comparison</li>
                <li>• Seasonal adjustment factors</li>
              </ul>
            </div>
          </FeatureGate>
        </div>
      </div>

      {/* Usage Limits Demo */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Limits</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Restaurant Plans</span>
            <div className="flex items-center">
              <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                <div 
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ 
                    width: `${currentPlan.limits.maxPlans === -1 ? 100 : (usage.restaurantPlans / currentPlan.limits.maxPlans) * 100}%` 
                  }}
                />
              </div>
              <span className="text-sm text-gray-600">
                {currentPlan.limits.maxPlans === -1 ? '∞' : `${usage.restaurantPlans}/${currentPlan.limits.maxPlans}`}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-700">Monthly Exports</span>
            <div className="flex items-center">
              <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                <div 
                  className="bg-green-500 h-2 rounded-full"
                  style={{ 
                    width: `${currentPlan.limits.maxExports === -1 ? 100 : (usage.exportsThisMonth / currentPlan.limits.maxExports) * 100}%` 
                  }}
                />
              </div>
              <span className="text-sm text-gray-600">
                {currentPlan.limits.maxExports === -1 ? '∞' : `${usage.exportsThisMonth}/${currentPlan.limits.maxExports}`}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-700">Team Collaboration</span>
            <div className="flex items-center">
              {currentPlan.limits.hasCollaboration ? (
                <Unlock className="w-5 h-5 text-green-500 mr-2" />
              ) : (
                <Lock className="w-5 h-5 text-gray-400 mr-2" />
              )}
              <span className={currentPlan.limits.hasCollaboration ? 'text-green-600' : 'text-gray-500'}>
                {currentPlan.limits.hasCollaboration ? 'Available' : 'Not Available'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Comparison */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Features Comparison</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Feature</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Free</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Professional</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Business</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-3 px-4 text-gray-700">Restaurant Plans</td>
                <td className="text-center py-3 px-4">1</td>
                <td className="text-center py-3 px-4">∞</td>
                <td className="text-center py-3 px-4">∞</td>
                <td className="text-center py-3 px-4">∞</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-700">Advanced Analytics</td>
                <td className="text-center py-3 px-4">
                  <X className="w-4 h-4 text-red-500 mx-auto" />
                </td>
                <td className="text-center py-3 px-4">
                  <Check className="w-4 h-4 text-green-500 mx-auto" />
                </td>
                <td className="text-center py-3 px-4">
                  <Check className="w-4 h-4 text-green-500 mx-auto" />
                </td>
                <td className="text-center py-3 px-4">
                  <Check className="w-4 h-4 text-green-500 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-700">Team Collaboration</td>
                <td className="text-center py-3 px-4">
                  <X className="w-4 h-4 text-red-500 mx-auto" />
                </td>
                <td className="text-center py-3 px-4">
                  <X className="w-4 h-4 text-red-500 mx-auto" />
                </td>
                <td className="text-center py-3 px-4">
                  <Check className="w-4 h-4 text-green-500 mx-auto" />
                </td>
                <td className="text-center py-3 px-4">
                  <Check className="w-4 h-4 text-green-500 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-700">API Access</td>
                <td className="text-center py-3 px-4">
                  <X className="w-4 h-4 text-red-500 mx-auto" />
                </td>
                <td className="text-center py-3 px-4">
                  <X className="w-4 h-4 text-red-500 mx-auto" />
                </td>
                <td className="text-center py-3 px-4">
                  <X className="w-4 h-4 text-red-500 mx-auto" />
                </td>
                <td className="text-center py-3 px-4">
                  <Check className="w-4 h-4 text-green-500 mx-auto" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
        <Star className="w-12 h-12 text-blue-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Ready to Unlock Premium Features?
        </h3>
        <p className="text-gray-600 mb-4">
          Upgrade to Professional and get access to advanced analytics, unlimited plans, and much more.
        </p>
        <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200">
          View Pricing Plans
        </button>
      </div>
    </div>
  );
};

export default SubscriptionDemo;
