import React, { useState } from 'react';
import SectionCard from '../ui/SectionCard';
import { 
  Lightbulb, CheckCircle, MapPin, ArrowRight, Play, BookOpen,
  Star, Clock, DollarSign, Target, Shield
} from 'lucide-react';

const StartupJourney = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  // Simple 5-Step Journey
  const simpleSteps = [
    {
      id: 'idea',
      title: '💡 Start with Your Idea',
      description: 'What kind of restaurant do you want to open?',
      timeNeeded: '1-2 days',
      difficulty: 'Easy',
      actions: [
        'Think about your favorite type of food',
        'Consider what\'s missing in your Boston neighborhood', 
        'Write down 3 restaurant concepts you\'d love to visit'
      ],
      nextStep: 'Talk to potential customers and get feedback',
      bostonTip: 'Boston loves authentic food - focus on what you\'re passionate about!'
    },
    {
      id: 'plan',
      title: '📋 Create a Simple Plan',
      description: 'Turn your idea into a basic business plan',
      timeNeeded: '1 week',
      difficulty: 'Easy',
      actions: [
        'Use our Business Plan tabs to fill out key sections',
        'Focus on Executive Summary and Market Analysis first',
        'Don\'t worry about perfection - just get started!'
      ],
      nextStep: 'Research costs and create basic financial projections',
      bostonTip: 'Keep it simple - you can always add details later!'
    },
    {
      id: 'money',
      title: '💰 Figure Out the Money',
      description: 'How much will you need and where will it come from?',
      timeNeeded: '3-5 days',
      difficulty: 'Medium',
      actions: [
        'Use our Financial Projections tool',
        'Research Boston restaurant costs (we provide benchmarks)',
        'List potential funding sources (savings, loans, investors)'
      ],
      nextStep: 'Start looking for a location',
      bostonTip: 'Typical Boston restaurant startup: $175K-$400K depending on size'
    },
    {
      id: 'location',
      title: '📍 Find Your Spot',
      description: 'Scout locations and understand requirements',
      timeNeeded: '2-4 weeks',
      difficulty: 'Medium',
      actions: [
        'Walk around Boston neighborhoods you\'re considering',
        'Check our Documents & Compliance section for permits needed',
        'Talk to commercial real estate agents'
      ],
      nextStep: 'Apply for permits and licenses',
      bostonTip: 'Consider foot traffic, parking, and T-accessibility for customers'
    },
    {
      id: 'launch',
      title: '🚀 Make It Happen',
      description: 'Get permits, build out, hire staff, and open!',
      timeNeeded: '3-6 months',
      difficulty: 'Hard',
      actions: [
        'Follow our detailed permit checklist',
        'Use our Equipment Planning tool for buildout',
        'Connect with our Boston vendor contacts'
      ],
      nextStep: 'Grand opening celebration!',
      bostonTip: 'Allow extra time for permits - Boston can take 2-3x longer than expected'
    }
  ];

  // Quick Action Cards
  const quickActions = [
    {
      title: 'Idea Formation',
      description: 'Start developing your concept',
      icon: Lightbulb,
      color: 'yellow',
      link: 'idea-formation'
    },
    {
      title: 'Business Plan',
      description: 'Create your business plan',
      icon: BookOpen,
      color: 'blue', 
      link: 'executive-summary'
    },
    {
      title: 'Financial Planning',
      description: 'Calculate costs & projections',
      icon: DollarSign,
      color: 'green',
      link: 'financial-projections'
    },
    {
      title: 'Get Documents',
      description: 'See required permits & licenses',
      icon: Shield,
      color: 'red',
      link: 'documents'
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleStepCompletion = (stepId) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepId)) {
      newCompleted.delete(stepId);
    } else {
      newCompleted.add(stepId);
    }
    setCompletedSteps(newCompleted);
  };

  const nextStep = () => {
    if (currentStep < simpleSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progressPercentage = Math.round((completedSteps.size / simpleSteps.length) * 100);

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <SectionCard 
        title="🚀 Your Restaurant Journey Made Simple" 
        description="A step-by-step guide to opening your Boston restaurant - we'll keep it easy!"
        color="blue"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-100 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Your Progress</h4>
            <div className="text-2xl font-bold text-blue-700">{progressPercentage}%</div>
            <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Steps Completed</h4>
            <div className="text-2xl font-bold text-green-700">{completedSteps.size}</div>
            <div className="text-sm text-green-600">of {simpleSteps.length} steps</div>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2">Estimated Timeline</h4>
            <div className="text-lg font-bold text-purple-700">4-8 months</div>
            <div className="text-sm text-purple-600">from idea to opening</div>
          </div>
        </div>
      </SectionCard>

      {/* Step-by-Step Wizard */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Step {currentStep + 1} of {simpleSteps.length}
          </h2>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(simpleSteps[currentStep].difficulty)}`}>
              {simpleSteps[currentStep].difficulty}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              <Clock className="h-4 w-4 mr-1" />
              {simpleSteps[currentStep].timeNeeded}
            </span>
          </div>
        </div>

        {/* Current Step Content */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-8 mb-6">
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">{simpleSteps[currentStep].title}</div>
            <p className="text-xl text-gray-700 mb-4">{simpleSteps[currentStep].description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* What to Do */}
            <div className="bg-white rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-blue-600" />
                What to Do:
              </h4>
              <ul className="space-y-3">
                {simpleSteps[currentStep].actions.map((action, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                    </div>
                    <span className="text-gray-700">{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Boston Tip & Next Step */}
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h5 className="font-medium text-green-900 mb-2 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  Boston Tip:
                </h5>
                <p className="text-sm text-green-700">{simpleSteps[currentStep].bostonTip}</p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h5 className="font-medium text-purple-900 mb-2 flex items-center">
                  <ArrowRight className="h-4 w-4 mr-1" />
                  What's Next:
                </h5>
                <p className="text-sm text-purple-700">{simpleSteps[currentStep].nextStep}</p>
              </div>
            </div>
          </div>

          {/* Mark Complete Button */}
          <div className="text-center mt-6">
            <button
              onClick={() => toggleStepCompletion(simpleSteps[currentStep].id)}
              className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                completedSteps.has(simpleSteps[currentStep].id)
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {completedSteps.has(simpleSteps[currentStep].id) ? (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Completed!
                </>
              ) : (
                <>
                  <Star className="h-5 w-5 mr-2" />
                  Mark as Complete
                </>
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            ← Previous Step
          </button>

          <div className="flex items-center space-x-2">
            {simpleSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-blue-600'
                    : completedSteps.has(simpleSteps[index].id)
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextStep}
            disabled={currentStep === simpleSteps.length - 1}
            className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              currentStep === simpleSteps.length - 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Next Step →
          </button>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Play className="h-5 w-5 mr-2 text-blue-600" />
          Quick Actions - Jump Right In!
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className="p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <action.icon className="h-8 w-8 text-blue-600 mb-3" />
              <h4 className="font-semibold text-gray-900 mb-2">{action.title}</h4>
              <p className="text-sm text-gray-600">{action.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Encouragement */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <CheckCircle className="h-8 w-8 text-green-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">You've Got This! 🎉</h3>
            <p className="text-gray-600">
              Opening a restaurant is challenging, but thousands of people do it successfully every year. 
              Take it one step at a time, use the resources we've built for you, and don't be afraid to ask for help!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupJourney;