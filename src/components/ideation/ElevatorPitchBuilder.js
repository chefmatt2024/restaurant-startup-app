import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../contexts/AppContext';
import SectionCard from '../ui/SectionCard';
import FormField from '../ui/FormField';
import { 
  Mic, 
  Clock, 
  Target, 
  CheckCircle,
  Play,
  Pause,
  RotateCcw,
  Copy,
  Sparkles
} from 'lucide-react';

const ElevatorPitchBuilder = () => {
  const { state, actions } = useApp();
  const [selectedTemplate, setSelectedTemplate] = useState('problem-solution');
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [targetTime, setTargetTime] = useState(30);

  const pitchData = state.businessPlan?.elevatorPitch || {
    template: 'problem-solution',
    hook: '',
    problem: '',
    solution: '',
    uniqueValue: '',
    target: '',
    traction: '',
    ask: '',
    finalPitch: '',
    practiceNotes: ''
  };

  const ideationData = state.businessPlan?.ideation || {};

  const handleInputChange = useCallback((field, value) => {
    actions.updateBusinessPlan('elevatorPitch', {
      ...pitchData,
      [field]: value
    });
  }, [actions, pitchData]);

  // Auto-populate fields from ideation data
  useEffect(() => {
    if (ideationData.initialProblem && !pitchData.problem) {
      handleInputChange('problem', ideationData.initialProblem);
    }
    if (ideationData.solutionIdea && !pitchData.solution) {
      handleInputChange('solution', ideationData.solutionIdea);
    }
    if (ideationData.targetAudience && !pitchData.target) {
      handleInputChange('target', ideationData.targetAudience);
    }
    if (ideationData.differentiator && !pitchData.uniqueValue) {
      handleInputChange('uniqueValue', ideationData.differentiator);
    }
  }, [ideationData, pitchData.problem, pitchData.solution, pitchData.target, pitchData.uniqueValue, handleInputChange]);

  // Timer functionality
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!isTimerRunning && timerSeconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setTimerSeconds(0);
    setIsTimerRunning(false);
  };

  const getTimeColor = () => {
    if (timerSeconds <= targetTime) return 'text-green-600';
    if (timerSeconds <= targetTime + 15) return 'text-yellow-600';
    return 'text-red-600';
  };

  const templates = [
    {
      id: 'problem-solution',
      name: 'Problem-Solution',
      description: 'Classic approach: Problem → Solution → Market',
      structure: 'Hook → Problem → Solution → Unique Value → Target → Ask'
    },
    {
      id: 'story-driven',
      name: 'Story-Driven',
      description: 'Personal narrative approach',
      structure: 'Personal Story → Problem → Solution → Vision → Ask'
    },
    {
      id: 'market-opportunity',
      name: 'Market Opportunity',
      description: 'Focus on market size and opportunity',
      structure: 'Market Size → Problem → Solution → Traction → Ask'
    }
  ];

  const generatePitch = () => {
    let pitch = '';
    
    if (selectedTemplate === 'problem-solution') {
      pitch = `${pitchData.hook || '[Your attention-grabbing opening]'} 

${pitchData.problem || '[The problem you\'re solving]'}

That's why I'm creating ${ideationData.businessName || '[Your Restaurant Name]'} - ${pitchData.solution || '[your solution]'}.

What makes us different is ${pitchData.uniqueValue || '[your unique advantage]'}.

We're targeting ${pitchData.target || '[your target customers]'} in Boston's ${ideationData.location || '[neighborhood]'} area.

${pitchData.traction || '[Any early traction/validation you have]'}

${pitchData.ask || '[What you\'re asking for - investment, partnership, etc.]'}`;
    }
    
    handleInputChange('finalPitch', pitch.trim());
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pitchData.finalPitch);
    actions.showMessage('Copied!', 'Elevator pitch copied to clipboard', 'success');
  };

  const bostonPitchTips = [
    {
      title: 'Local Connection',
      tip: 'Mention specific Boston neighborhoods, landmarks, or culture'
    },
    {
      title: 'Market Size',
      tip: 'Boston restaurant market is $2.8B annually'
    },
    {
      title: 'Competitive Advantage',
      tip: 'What makes you different from North End Italian or Back Bay fine dining?'
    },
    {
      title: 'Tourism Angle',
      tip: '25 million tourists visit Boston annually - mention if relevant'
    },
    {
      title: 'University Market',
      tip: '250,000 students in Boston area - huge opportunity'
    }
  ];

  const sampleHooks = [
    "Did you know that 73% of Boston food delivery orders are after 9 PM, but only 12% of restaurants stay open late?",
    "Last week, I waited 45 minutes for mediocre pasta in the North End and paid $28 for it.",
    "Boston has 400+ Italian restaurants, but none serve authentic Northern Italian cuisine the way my grandmother did.",
    "What if I told you there's a $50 million gap in Boston's healthy fast-casual market?"
  ];

  return (
    <SectionCard
      title="Elevator Pitch Builder"
      description="Craft a compelling 30-60 second pitch that captures your restaurant concept"
      icon={Mic}
      color="indigo"
    >
      <div className="space-y-8">
        {/* Timer Section */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-indigo-600" />
              Practice Timer
            </h3>
            <div className="flex items-center space-x-4">
              <select
                value={targetTime}
                onChange={(e) => setTargetTime(Number(e.target.value))}
                className="text-sm border border-gray-300 rounded px-3 py-1"
              >
                <option value={30}>30 seconds</option>
                <option value={60}>60 seconds</option>
                <option value={90}>90 seconds</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-6">
            <div className={`text-4xl font-bold ${getTimeColor()}`}>
              {formatTime(timerSeconds)}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`p-3 rounded-full ${isTimerRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white transition-colors`}
              >
                {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button
                onClick={resetTimer}
                className="p-3 rounded-full bg-gray-500 hover:bg-gray-600 text-white transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {timerSeconds > targetTime && (
            <div className="mt-4 text-center text-red-600 text-sm">
              Over target time by {timerSeconds - targetTime} seconds
            </div>
          )}
        </div>

        {/* Template Selection */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Your Pitch Style</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedTemplate === template.id 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h4 className="font-semibold text-gray-900">{template.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                <p className="text-xs text-gray-500 mt-2">{template.structure}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pitch Builder */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Build Your Pitch</h3>

            <FormField
              label="Hook (Attention Grabber)"
              type="textarea"
              value={pitchData.hook}
              onChange={(value) => handleInputChange('hook', value)}
              placeholder="Start with a surprising statistic, question, or personal story..."
              rows={3}
            />

            <FormField
              label="Problem"
              type="textarea"
              value={pitchData.problem}
              onChange={(value) => handleInputChange('problem', value)}
              placeholder="What problem are you solving? Make it relatable and specific to Boston..."
              rows={3}
            />

            <FormField
              label="Solution"
              type="textarea"
              value={pitchData.solution}
              onChange={(value) => handleInputChange('solution', value)}
              placeholder="How does your restaurant solve this problem? Be specific..."
              rows={3}
            />

            <FormField
              label="Unique Value Proposition"
              type="textarea"
              value={pitchData.uniqueValue}
              onChange={(value) => handleInputChange('uniqueValue', value)}
              placeholder="What makes you different from existing Boston restaurants?"
              rows={3}
            />

            <FormField
              label="Target Market"
              type="textarea"
              value={pitchData.target}
              onChange={(value) => handleInputChange('target', value)}
              placeholder="Who are your customers? Be specific about Boston demographics..."
              rows={3}
            />

            <FormField
              label="Traction/Validation"
              type="textarea"
              value={pitchData.traction}
              onChange={(value) => handleInputChange('traction', value)}
              placeholder="Any early validation? Customer interest, pre-orders, market research..."
              rows={3}
            />

            <FormField
              label="The Ask"
              type="textarea"
              value={pitchData.ask}
              onChange={(value) => handleInputChange('ask', value)}
              placeholder="What do you want? Investment, partnership, customers, feedback..."
              rows={3}
            />

            <button
              onClick={generatePitch}
              className="btn-primary flex items-center space-x-2 w-full"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Complete Pitch</span>
            </button>
          </div>

          {/* Tips & Generated Pitch */}
          <div className="space-y-6">
            {/* Sample Hooks */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-3">Sample Boston-Specific Hooks</h4>
              <div className="space-y-3">
                {sampleHooks.map((hook, index) => (
                  <div
                    key={index}
                    onClick={() => handleInputChange('hook', hook)}
                    className="p-3 bg-white border border-blue-200 rounded cursor-pointer hover:bg-blue-50 transition-colors"
                  >
                    <p className="text-sm text-blue-800">"{hook}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Boston Tips */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="font-semibold text-green-900 mb-3">Boston Pitch Tips</h4>
              <div className="space-y-3">
                {bostonPitchTips.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-green-900">{tip.title}:</span>
                      <span className="text-green-800 ml-1">{tip.tip}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Generated Pitch */}
            {pitchData.finalPitch && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-indigo-900">Your Complete Pitch</h4>
                  <div className="flex space-x-2">
                    <button
                      onClick={copyToClipboard}
                      className="p-2 text-indigo-600 hover:bg-indigo-100 rounded transition-colors"
                      title="Copy to clipboard"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="bg-white p-4 rounded border border-indigo-200">
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {pitchData.finalPitch}
                  </p>
                </div>
                <div className="mt-4 text-sm text-indigo-700">
                  Word count: {pitchData.finalPitch.split(' ').length} words
                  <span className="ml-4">
                    Estimated speaking time: {Math.ceil(pitchData.finalPitch.split(' ').length / 2.5)} seconds
                  </span>
                </div>
              </div>
            )}

            {/* Practice Notes */}
            <FormField
              label="Practice Notes & Feedback"
              type="textarea"
              value={pitchData.practiceNotes}
              onChange={(value) => handleInputChange('practiceNotes', value)}
              placeholder="Record notes from practice sessions, feedback from others, improvements to make..."
              rows={4}
            />
          </div>
        </div>

        {/* Practice Section */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Practice Guidelines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-yellow-900 mb-2">Delivery Tips</h4>
              <ul className="space-y-1 text-sm text-yellow-800">
                <li>• Make eye contact and smile</li>
                <li>• Speak clearly and at moderate pace</li>
                <li>• Use confident body language</li>
                <li>• Practice with a timer</li>
                <li>• End with a specific ask</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-yellow-900 mb-2">Common Scenarios</h4>
              <ul className="space-y-1 text-sm text-yellow-800">
                <li>• Networking events</li>
                <li>• Investor meetings</li>
                <li>• Customer conversations</li>
                <li>• Partner discussions</li>
                <li>• Media interviews</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <button
            onClick={() => actions.setActiveTab('idea-formation')}
            className="btn-secondary"
          >
            ← Back to Idea Formation
          </button>
          <button
            onClick={() => actions.setActiveTab('executive-summary')}
            className="btn-primary"
          >
            Start Business Plan →
          </button>
        </div>
      </div>
    </SectionCard>
  );
};

export default ElevatorPitchBuilder; 