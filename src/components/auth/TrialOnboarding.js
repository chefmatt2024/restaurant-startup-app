import React, { useState } from 'react';
import { CheckCircle, Star, Clock, Zap, ArrowRight, Target, BarChart3, Users, MapPin } from 'lucide-react';

const TrialOnboarding = ({ isOpen, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: <Star className="w-8 h-8 text-green-600" />,
      title: "Welcome to Your Free Trial!",
      description: "You now have 5 days of full access to plan your restaurant like a pro.",
      features: [
        "Complete restaurant business planning tools",
        "Financial projections and modeling",
        "Market research and analysis",
        "Equipment and operations planning",
        "Compliance and permit tracking"
      ]
    },
    {
      icon: <Target className="w-8 h-8 text-blue-600" />,
      title: "Let's Start Planning",
      description: "Begin with your restaurant concept and build from there.",
      action: "Start with Business Concept",
      nextTab: "idea-formation"
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-purple-600" />,
      title: "Financial Planning",
      description: "Create detailed financial projections that investors will trust.",
      action: "Plan Your Finances",
      nextTab: "financial-projections"
    },
    {
      icon: <MapPin className="w-8 h-8 text-orange-600" />,
      title: "Market Research",
      description: "Analyze your competition and find the perfect location.",
      action: "Research Your Market",
      nextTab: "competitive-analysis"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  if (!isOpen) return null;

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full">
        <div className="p-8">
          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    index <= currentStep ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Step Content */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              {currentStepData.icon}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentStepData.title}
            </h2>
            <p className="text-gray-600 mb-6">
              {currentStepData.description}
            </p>

            {/* Features List (for first step) */}
            {currentStep === 0 && (
              <div className="text-left bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">What's Included in Your Trial:</h3>
                <ul className="space-y-2">
                  {currentStepData.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Trial Info */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-green-900">
                  5 days remaining in your free trial
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            {currentStep < steps.length - 1 ? (
              <>
                <button
                  onClick={handleSkip}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Skip Tour
                </button>
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                >
                  {currentStepData.action}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </>
            ) : (
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center text-lg font-semibold"
              >
                <Zap className="w-5 h-5 mr-2" />
                Start Planning My Restaurant
              </button>
            )}
          </div>

          {/* Trial Benefits */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">No Credit Card</h4>
                <p className="text-xs text-gray-600">Required to start</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">Full Access</h4>
                <p className="text-xs text-gray-600">To all features</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <Star className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">Cancel Anytime</h4>
                <p className="text-xs text-gray-600">No commitments</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrialOnboarding;
