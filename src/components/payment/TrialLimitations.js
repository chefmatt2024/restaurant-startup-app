import React from 'react';
import { Lock, Star, Zap, ArrowRight, Clock, CheckCircle } from 'lucide-react';

const TrialLimitations = ({ onUpgrade, feature, trialDaysRemaining }) => {
  const limitations = {
    'financial-projections': {
      title: 'Advanced Financial Projections',
      description: 'Unlock detailed financial modeling with market trends, funding sources, and debt service calculations.',
      features: [
        'Market trend analysis',
        'Funding source planning',
        'Debt service calculations',
        'Advanced revenue modeling',
        'Export to Excel/PDF'
      ]
    },
    'competitive-analysis': {
      title: 'Competitive Analysis',
      description: 'Access comprehensive market research and competitor analysis tools.',
      features: [
        'Competitor mapping',
        'Market saturation analysis',
        'Pricing strategy insights',
        'Location scoring',
        'Industry benchmarks'
      ]
    },
    'equipment-planning': {
      title: 'Equipment Planning',
      description: 'Get access to detailed equipment lists and vendor recommendations.',
      features: [
        'Complete equipment catalogs',
        'Vendor recommendations',
        'Cost optimization',
        'Installation planning',
        'Maintenance schedules'
      ]
    },
    'menu-development': {
      title: 'Menu Development',
      description: 'Create professional menus with cost analysis and nutritional information.',
      features: [
        'Menu design tools',
        'Cost analysis',
        'Nutritional calculations',
        'Profit margin optimization',
        'Menu engineering'
      ]
    },
    'staff-planning': {
      title: 'Staff Planning',
      description: 'Plan your team structure with detailed role definitions and scheduling.',
      features: [
        'Role definitions',
        'Scheduling tools',
        'Training plans',
        'Compensation analysis',
        'Performance metrics'
      ]
    },
    'compliance-tracking': {
      title: 'Compliance Tracking',
      description: 'Stay on top of all permits, licenses, and regulatory requirements.',
      features: [
        'Permit tracking',
        'License management',
        'Regulatory updates',
        'Deadline alerts',
        'Document storage'
      ]
    }
  };

  const currentLimitation = limitations[feature] || {
    title: 'Premium Feature',
    description: 'This feature is available with a paid subscription.',
    features: [
      'Advanced planning tools',
      'Detailed analytics',
      'Export capabilities',
      'Priority support',
      'Unlimited projects'
    ]
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full">
        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentLimitation.title}
            </h2>
            <p className="text-gray-600">
              {currentLimitation.description}
            </p>
          </div>

          {/* Trial Status */}
          {trialDaysRemaining > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-blue-600 mr-2" />
                <div>
                  <h3 className="font-semibold text-blue-900">
                    {trialDaysRemaining} days left in your free trial
                  </h3>
                  <p className="text-sm text-blue-700">
                    Upgrade now to unlock all features
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Features List */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">What you'll get:</h3>
            <ul className="space-y-2">
              {currentLimitation.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Pricing Preview */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">$29</div>
              <div className="text-sm text-gray-600 mb-2">per month</div>
              <div className="text-xs text-gray-500">
                Cancel anytime • No setup fees
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onUpgrade}
              className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 flex items-center justify-center"
            >
              <Zap className="w-4 h-4 mr-2" />
              Upgrade Now
            </button>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Maybe Later
            </button>
          </div>

          {/* Trial Benefits */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="text-center text-sm text-gray-600">
              <Star className="w-4 h-4 inline mr-1" />
              Join 500+ successful restaurateurs who planned with Iterum Foods
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrialLimitations;
