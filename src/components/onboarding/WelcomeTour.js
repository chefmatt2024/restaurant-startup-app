import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../contexts/AppContext';
import { X, ArrowRight, ArrowLeft, CheckCircle, Target, BarChart3, FileText, Users, MapPin, Building2, Sparkles } from 'lucide-react';

const WelcomeTour = ({ isOpen, onComplete, onSkip }) => {
  const { actions } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  
  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to Restaurant Business Planner!',
      description: 'Let\'s take a quick tour to help you get started. This will only take 2 minutes.',
      icon: <Sparkles className="w-8 h-8 text-blue-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            You're about to discover powerful tools to plan your restaurant from concept to opening day.
          </p>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Your 5-day free trial</strong> gives you full access to all features. No credit card required!
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'idea',
      title: 'Start with Your Concept',
      description: 'Define your restaurant idea and vision',
      icon: <Target className="w-8 h-8 text-purple-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Begin by defining your restaurant concept, target market, and unique value proposition.
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
            <li>Restaurant type and cuisine</li>
            <li>Target customer demographics</li>
            <li>Unique selling points</li>
            <li>Brand identity</li>
          </ul>
          <button
            onClick={() => {
              actions.setActiveTab('concept-pitch');
              markStepComplete('idea');
            }}
            className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
          >
            <span>Go to Idea Formation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )
    },
    {
      id: 'financials',
      title: 'Plan Your Finances',
      description: 'Create detailed financial projections',
      icon: <BarChart3 className="w-8 h-8 text-green-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Build comprehensive financial projections that investors will trust. Calculate startup costs, operating expenses, and revenue forecasts.
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
            <li>Startup cost calculator</li>
            <li>Monthly operating expenses</li>
            <li>Revenue projections</li>
            <li>Break-even analysis</li>
          </ul>
          <button
            onClick={() => {
              actions.setActiveTab('financials');
              markStepComplete('financials');
            }}
            className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
          >
            <span>Go to Financial Projections</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )
    },
    {
      id: 'market',
      title: 'Research Your Market',
      description: 'Analyze competition and location',
      icon: <MapPin className="w-8 h-8 text-orange-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Understand your competitive landscape and find the perfect location for your restaurant.
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
            <li>Competitive analysis</li>
            <li>Market research</li>
            <li>Location evaluation</li>
            <li>Target market insights</li>
          </ul>
          <button
            onClick={() => {
              actions.setActiveTab('market-competition');
              markStepComplete('market');
            }}
            className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
          >
            <span>Go to Market Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )
    },
    {
      id: 'operations',
      title: 'Plan Operations',
      description: 'Equipment, menu, and compliance',
      icon: <Building2 className="w-8 h-8 text-indigo-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Plan your restaurant operations, from equipment needs to menu design and compliance requirements.
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
            <li>Equipment planning</li>
            <li>Menu builder</li>
            <li>Compliance tracking</li>
            <li>Vendor management</li>
          </ul>
        </div>
      )
    },
    {
      id: 'complete',
      title: 'You\'re All Set!',
      description: 'Start building your restaurant plan',
      icon: <CheckCircle className="w-8 h-8 text-green-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            You now know the basics. Start building your restaurant business plan step by step.
          </p>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-800">
              <strong>Tip:</strong> Your progress is automatically saved. Come back anytime to continue where you left off!
            </p>
          </div>
        </div>
      )
    }
  ];

  const markStepComplete = (stepId) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('welcomeTourCompleted', 'true');
    onComplete && onComplete();
  };

  const handleSkip = () => {
    localStorage.setItem('welcomeTourCompleted', 'true');
    onSkip && onSkip();
  };

  if (!isOpen) return null;

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-xl text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                {currentStepData.icon}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{currentStepData.title}</h2>
                <p className="text-blue-100 text-sm">{currentStepData.description}</p>
              </div>
            </div>
            <button
              onClick={handleSkip}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-center text-sm text-blue-100 mt-2">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStepData.content}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 rounded-b-xl">
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            
            <div className="flex space-x-2">
              <button
                onClick={handleSkip}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Skip Tour
              </button>
              <button
                onClick={handleNext}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
                {currentStep < steps.length - 1 && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeTour;


