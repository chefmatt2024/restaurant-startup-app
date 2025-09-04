import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import SectionCard from '../ui/SectionCard';
import FormField from '../ui/FormField';
import { 
  Lightbulb, 
  Target, 
  Users, 
  TrendingUp, 
  MapPin,
  Clock,
  DollarSign,
  ChevronRight,
  CheckCircle,
  Sparkles
} from 'lucide-react';

const IdeaFormation = () => {
  const { state, actions } = useApp();
  const [activeStep, setActiveStep] = useState(1);

  const ideationData = state.businessPlan?.ideation || {
    businessConcept: '',
    coreInspiration: '',
    targetAudience: '',
    initialProblem: '',
    solutionIdea: '',
    differentiator: '',
    businessType: '',
    location: '',
    timeCommitment: '',
    investmentLevel: '',
    successMeasure: '',
    personalMotivation: '',
    marketOpportunity: '',
    resourcesNeeded: '',
    riskAssessment: ''
  };

  const handleInputChange = (field, value) => {
    actions.updateBusinessPlan('ideation', {
      ...ideationData,
      [field]: value
    });
  };

  const bostonInspiration = [
    {
      type: 'Tourism & History',
      icon: MapPin,
      ideas: [
        'Revolutionary War themed dining experience',
        'Freedom Trail food tour business',
        'Historical reenactment catering',
        'Patriot-themed craft brewery'
      ]
    },
    {
      type: 'University Culture',
      icon: Users,
      ideas: [
        'Student-focused healthy meal delivery',
        'Study space café with brain foods',
        'Late-night comfort food for students',
        'Graduation celebration catering'
      ]
    },
    {
      type: 'Local Ingredients',
      icon: TrendingUp,
      ideas: [
        'New England seafood innovation',
        'Local farm-to-table concept',
        'Boston cream pie reinvention',
        'Craft beer with local hops'
      ]
    },
    {
      type: 'Neighborhood Character',
      icon: Target,
      ideas: [
        'North End modern Italian fusion',
        'Seaport tech worker fast-casual',
        'Back Bay upscale brunch spot',
        'South End artisanal market'
      ]
    }
  ];

  const businessTypes = [
    { value: 'restaurant', label: 'Full-Service Restaurant', commitment: 'High', investment: '$200K-$500K' },
    { value: 'fast-casual', label: 'Fast-Casual', commitment: 'Medium-High', investment: '$100K-$300K' },
    { value: 'cafe', label: 'Café/Coffee Shop', commitment: 'Medium', investment: '$50K-$150K' },
    { value: 'food-truck', label: 'Food Truck', commitment: 'Medium', investment: '$30K-$100K' },
    { value: 'catering', label: 'Catering Business', commitment: 'Medium', investment: '$20K-$80K' },
    { value: 'bakery', label: 'Bakery/Pastry Shop', commitment: 'High', investment: '$40K-$120K' },
    { value: 'bar', label: 'Bar/Pub', commitment: 'High', investment: '$150K-$400K' },
    { value: 'specialty', label: 'Specialty Food Store', commitment: 'Medium', investment: '$30K-$100K' }
  ];

  const steps = [
    { id: 1, title: 'Initial Inspiration', description: 'What sparked your interest?' },
    { id: 2, title: 'Problem & Solution', description: 'What problem will you solve?' },
    { id: 3, title: 'Business Model', description: 'How will it work?' },
    { id: 4, title: 'Personal Assessment', description: 'Are you ready for this?' },
    { id: 5, title: 'Initial Validation', description: 'Does this make sense?' }
  ];

  const completedSteps = () => {
    let completed = 0;
    if (ideationData.coreInspiration && ideationData.businessConcept) completed = Math.max(completed, 1);
    if (ideationData.initialProblem && ideationData.solutionIdea) completed = Math.max(completed, 2);
    if (ideationData.businessType && ideationData.location) completed = Math.max(completed, 3);
    if (ideationData.timeCommitment && ideationData.investmentLevel) completed = Math.max(completed, 4);
    if (ideationData.marketOpportunity && ideationData.successMeasure) completed = Math.max(completed, 5);
    return completed;
  };

  return (
    <SectionCard
      title="Business Idea Formation"
      description="Transform your restaurant concept from initial spark to structured business idea"
      icon={Lightbulb}
      color="yellow"
    >
      <div className="space-y-8">
        {/* Progress Steps */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-yellow-600" />
            Idea Development Process
          </h3>
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`relative flex flex-col items-center cursor-pointer ${
                    activeStep === step.id ? 'text-yellow-600' : 
                    completedSteps() >= step.id ? 'text-green-600' : 'text-gray-400'
                  }`}
                  onClick={() => setActiveStep(step.id)}
                >
                  <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold ${
                      activeStep === step.id ? 'border-yellow-600 bg-yellow-50' :
                      completedSteps() >= step.id ? 'border-green-600 bg-green-50' : 'border-gray-300 bg-white'
                    }`}
                  >
                    {completedSteps() >= step.id ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-sm font-medium">{step.title}</div>
                    <div className="text-xs">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <ChevronRight className="w-5 h-5 mx-4 text-gray-400" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Content */}
          <div className="space-y-6">
            {activeStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Step 1: Initial Inspiration</h3>
                
                <FormField
                  label="What's Your Core Inspiration?"
                  type="textarea"
                  value={ideationData.coreInspiration}
                  onChange={(value) => handleInputChange('coreInspiration', value)}
                  placeholder="What made you think about starting a restaurant? Personal experience, gap you noticed, passion for food, family tradition..."
                  rows={4}
                />

                <FormField
                  label="Business Concept (One Sentence)"
                  type="textarea"
                  value={ideationData.businessConcept}
                  onChange={(value) => handleInputChange('businessConcept', value)}
                  placeholder="A [type of restaurant] in [location] that serves [what] to [who] because [why it's needed]"
                  rows={3}
                />

                <FormField
                  label="Who Do You Want to Serve?"
                  type="textarea"
                  value={ideationData.targetAudience}
                  onChange={(value) => handleInputChange('targetAudience', value)}
                  placeholder="Busy professionals, college students, families, tourists, locals, health-conscious people..."
                  rows={3}
                />
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Step 2: Problem & Solution</h3>
                
                <FormField
                  label="What Problem Are You Solving?"
                  type="textarea"
                  value={ideationData.initialProblem}
                  onChange={(value) => handleInputChange('initialProblem', value)}
                  placeholder="Lack of healthy options, no late-night food, expensive dining, poor service, limited authentic cuisine..."
                  rows={4}
                />

                <FormField
                  label="How Will You Solve It?"
                  type="textarea"
                  value={ideationData.solutionIdea}
                  onChange={(value) => handleInputChange('solutionIdea', value)}
                  placeholder="Fresh ingredients, extended hours, competitive pricing, exceptional service, authentic recipes..."
                  rows={4}
                />

                <FormField
                  label="What Makes You Different?"
                  type="textarea"
                  value={ideationData.differentiator}
                  onChange={(value) => handleInputChange('differentiator', value)}
                  placeholder="Unique menu items, special atmosphere, innovative service model, local sourcing, family recipes..."
                  rows={4}
                />
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Step 3: Business Model</h3>
                
                <FormField
                  label="Business Type"
                  type="select"
                  value={ideationData.businessType}
                  onChange={(value) => handleInputChange('businessType', value)}
                  options={businessTypes.map(type => ({ value: type.value, label: type.label }))}
                />

                <FormField
                  label="Preferred Boston Location"
                  type="select"
                  value={ideationData.location}
                  onChange={(value) => handleInputChange('location', value)}
                  options={[
                    { value: '', label: 'Select a neighborhood...' },
                    { value: 'north-end', label: 'North End - Tourist & Italian heritage' },
                    { value: 'back-bay', label: 'Back Bay - Upscale shopping & dining' },
                    { value: 'seaport', label: 'Seaport - Modern business district' },
                    { value: 'south-end', label: 'South End - Trendy & artistic' },
                    { value: 'cambridge', label: 'Cambridge - University community' },
                    { value: 'beacon-hill', label: 'Beacon Hill - Historic & affluent' },
                    { value: 'faneuil-hall', label: 'Faneuil Hall - Tourist destination' },
                    { value: 'financial-district', label: 'Financial District - Business professionals' }
                  ]}
                />

                <FormField
                  label="How Will You Make Money?"
                  type="textarea"
                  value={ideationData.marketOpportunity}
                  onChange={(value) => handleInputChange('marketOpportunity', value)}
                  placeholder="Food sales, beverage sales, catering, delivery, special events, merchandise..."
                  rows={3}
                />
              </div>
            )}

            {activeStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Step 4: Personal Assessment</h3>
                
                <FormField
                  label="Time Commitment You Can Make"
                  type="select"
                  value={ideationData.timeCommitment}
                  onChange={(value) => handleInputChange('timeCommitment', value)}
                  options={[
                    { value: '', label: 'Select time commitment...' },
                    { value: 'part-time', label: 'Part-time (20-30 hrs/week) - Side business' },
                    { value: 'full-time', label: 'Full-time (40-50 hrs/week) - Primary job' },
                    { value: 'intensive', label: 'Intensive (60+ hrs/week) - All-in commitment' }
                  ]}
                />

                <FormField
                  label="Investment Level You're Considering"
                  type="select"
                  value={ideationData.investmentLevel}
                  onChange={(value) => handleInputChange('investmentLevel', value)}
                  options={[
                    { value: '', label: 'Select investment range...' },
                    { value: 'low', label: 'Low ($10K-$50K) - Food truck, catering' },
                    { value: 'medium', label: 'Medium ($50K-$150K) - Small café, counter service' },
                    { value: 'high', label: 'High ($150K-$350K) - Full restaurant' },
                    { value: 'premium', label: 'Premium ($350K+) - Upscale dining' }
                  ]}
                />

                <FormField
                  label="Personal Motivation"
                  type="textarea"
                  value={ideationData.personalMotivation}
                  onChange={(value) => handleInputChange('personalMotivation', value)}
                  placeholder="Why is this important to you? Financial freedom, creative expression, family legacy, community impact..."
                  rows={4}
                />

                <FormField
                  label="Resources You Already Have"
                  type="textarea"
                  value={ideationData.resourcesNeeded}
                  onChange={(value) => handleInputChange('resourcesNeeded', value)}
                  placeholder="Cooking skills, business experience, financial resources, connections, family recipes, equipment..."
                  rows={3}
                />
              </div>
            )}

            {activeStep === 5 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Step 5: Initial Validation</h3>
                
                <FormField
                  label="How Will You Measure Success?"
                  type="textarea"
                  value={ideationData.successMeasure}
                  onChange={(value) => handleInputChange('successMeasure', value)}
                  placeholder="Revenue targets, customer satisfaction, community impact, personal fulfillment, expansion goals..."
                  rows={4}
                />

                <FormField
                  label="Biggest Risks You See"
                  type="textarea"
                  value={ideationData.riskAssessment}
                  onChange={(value) => handleInputChange('riskAssessment', value)}
                  placeholder="Competition, high costs, location challenges, staffing, market changes, personal challenges..."
                  rows={4}
                />

                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Next Steps
                  </h4>
                  <ul className="space-y-2 text-green-800">
                    <li>• Create your elevator pitch (next section)</li>
                    <li>• Research your competition in the chosen Boston area</li>
                    <li>• Talk to potential customers for feedback</li>
                    <li>• Calculate rough financial requirements</li>
                    <li>• Develop your business plan (following sections)</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Boston-Specific Inspiration */}
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Boston Restaurant Inspiration
              </h3>
              <div className="space-y-4">
                {bostonInspiration.map((category, index) => {
                  const IconComponent = category.icon;
                  return (
                    <div key={index} className="border-l-4 border-blue-300 pl-4">
                      <h4 className="font-medium text-blue-900 flex items-center mb-2">
                        <IconComponent className="w-4 h-4 mr-2" />
                        {category.type}
                      </h4>
                      <ul className="space-y-1 text-sm text-blue-800">
                        {category.ideas.map((idea, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-blue-400 mr-2">•</span>
                            {idea}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Business Type Details */}
            {ideationData.businessType && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h4 className="font-semibold text-yellow-900 mb-3">
                  {businessTypes.find(t => t.value === ideationData.businessType)?.label} Details
                </h4>
                <div className="space-y-2 text-sm text-yellow-800">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Commitment: {businessTypes.find(t => t.value === ideationData.businessType)?.commitment}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span>Investment: {businessTypes.find(t => t.value === ideationData.businessType)?.investment}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Progress Summary */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Your Progress</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-center justify-between">
                  <span>Steps Completed</span>
                  <span className="font-medium">{completedSteps()}/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(completedSteps() / 5) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-3">
                  Complete all steps to move to the elevator pitch builder!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <div></div>
          <div className="flex space-x-3">
            {activeStep > 1 && (
              <button
                onClick={() => setActiveStep(activeStep - 1)}
                className="btn-secondary"
              >
                Previous Step
              </button>
            )}
            {activeStep < 5 && (
              <button
                onClick={() => setActiveStep(activeStep + 1)}
                className="btn-primary"
              >
                Next Step
              </button>
            )}
            {activeStep === 5 && completedSteps() === 5 && (
              <button
                onClick={() => actions.setActiveTab('elevator-pitch')}
                className="btn-primary flex items-center space-x-2"
              >
                <span>Create Elevator Pitch</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </SectionCard>
  );
};

export default IdeaFormation; 