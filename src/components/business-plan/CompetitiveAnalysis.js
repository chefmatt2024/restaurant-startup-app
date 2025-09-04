import React, { useState, useMemo } from 'react';
import { 
  Target, 
  TrendingUp, 
  Users, 
  CheckCircle,
  XCircle,
  AlertTriangle,
  BarChart3,
  PieChart,
  MapPin,
  Star,
  Award,
  Zap,
  Lightbulb,
  Shield,
  TrendingDown
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import FormField from '../ui/FormField';
import SectionCard from '../ui/SectionCard';

const CompetitiveAnalysis = () => {
  const { state, actions } = useApp();
  const [competitiveData, setCompetitiveData] = useState({
    competitors: [
      {
        id: 1,
        name: '',
        type: '',
        strengths: '',
        weaknesses: '',
        pricing: '',
        marketShare: '',
        uniqueFeatures: '',
        threatLevel: 'low'
      }
    ],
    marketGaps: '',
    competitiveAdvantages: [],
    differentiationStrategy: '',
    marketPositioning: '',
    pricingStrategy: '',
    valueProposition: '',
    customerSegments: [],
    marketOpportunities: ''
  });

  const competitorTypes = [
    'Direct Competitor (Same Cuisine)',
    'Indirect Competitor (Different Cuisine, Same Price Point)',
    'Substitute (Different Dining Experience)',
    'Fast Food/Quick Service',
    'Fine Dining',
    'Casual Dining',
    'Fast Casual',
    'Food Truck',
    'Catering Service',
    'Online Food Delivery'
  ];

  const threatLevels = [
    { value: 'low', label: 'Low Threat', color: 'text-green-600', bgColor: 'bg-green-100', icon: CheckCircle },
    { value: 'medium', label: 'Medium Threat', color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: AlertTriangle },
    { value: 'high', label: 'High Threat', color: 'text-red-600', bgColor: 'bg-red-100', icon: XCircle }
  ];

  const competitiveAdvantageOptions = [
    { value: 'superior-quality', label: 'Superior Food Quality', icon: Star, color: 'yellow' },
    { value: 'unique-menu', label: 'Unique Menu Items', icon: Zap, color: 'blue' },
    { value: 'better-service', label: 'Better Service', icon: Users, color: 'green' },
    { value: 'prime-location', label: 'Prime Location', icon: MapPin, color: 'purple' },
    { value: 'lower-prices', label: 'Lower Prices', icon: TrendingDown, color: 'green' },
    { value: 'faster-service', label: 'Faster Service', icon: Zap, color: 'orange' },
    { value: 'better-atmosphere', label: 'Better Atmosphere', icon: Award, color: 'pink' },
    { value: 'local-sourcing', label: 'Local Sourcing', icon: Shield, color: 'green' },
    { value: 'sustainability', label: 'Sustainability', icon: Shield, color: 'emerald' },
    { value: 'technology', label: 'Technology Integration', icon: Zap, color: 'blue' },
    { value: 'loyalty-programs', label: 'Loyalty Programs', icon: Star, color: 'purple' },
    { value: 'community', label: 'Community Involvement', icon: Users, color: 'indigo' },
    { value: 'chef-expertise', label: 'Chef Expertise', icon: Award, color: 'orange' },
    { value: 'wine-selection', label: 'Wine Selection', icon: Star, color: 'red' },
    { value: 'private-dining', label: 'Private Dining', icon: Users, color: 'purple' },
    { value: 'event-hosting', label: 'Event Hosting', icon: Award, color: 'blue' },
    { value: 'takeout-delivery', label: 'Takeout/Delivery', icon: Zap, color: 'green' },
    { value: 'mobile-app', label: 'Mobile App', icon: Zap, color: 'blue' },
    { value: 'online-ordering', label: 'Online Ordering', icon: Zap, color: 'green' },
    { value: 'reservation-system', label: 'Reservation System', icon: CheckCircle, color: 'blue' }
  ];

  const pricingStrategies = [
    { value: 'premium', label: 'Premium Pricing', description: 'High Quality, High Price', icon: Star, color: 'purple' },
    { value: 'penetration', label: 'Penetration Pricing', description: 'Low Price to Enter Market', icon: TrendingDown, color: 'green' },
    { value: 'competitive', label: 'Competitive Pricing', description: 'Match Competitor Prices', icon: Target, color: 'blue' },
    { value: 'value-based', label: 'Value-Based Pricing', description: 'Price Based on Perceived Value', icon: Award, color: 'orange' },
    { value: 'cost-plus', label: 'Cost-Plus Pricing', description: 'Cost + Markup', icon: TrendingUp, color: 'green' },
    { value: 'dynamic', label: 'Dynamic Pricing', description: 'Variable Based on Demand', icon: Zap, color: 'blue' },
    { value: 'bundle', label: 'Bundle Pricing', description: 'Package Deals', icon: Users, color: 'purple' },
    { value: 'psychological', label: 'Psychological Pricing', description: 'e.g., $9.99', icon: Lightbulb, color: 'yellow' }
  ];

  const customerSegmentOptions = [
    { value: 'young-professionals', label: 'Young Professionals (25-35)', icon: Users, color: 'blue', description: 'Urban, tech-savvy, value convenience' },
    { value: 'families', label: 'Families with Children', icon: Users, color: 'green', description: 'Kid-friendly, value-oriented, weekend diners' },
    { value: 'empty-nesters', label: 'Empty Nesters (50+)', icon: Users, color: 'purple', description: 'Disposable income, quality-focused, early diners' },
    { value: 'college-students', label: 'College Students', icon: Users, color: 'orange', description: 'Budget-conscious, social, late-night diners' },
    { value: 'tourists', label: 'Tourists', icon: Users, color: 'pink', description: 'Experience-seeking, photo-worthy, seasonal' },
    { value: 'business-professionals', label: 'Business Professionals', icon: Users, color: 'indigo', description: 'Lunch meetings, expense accounts, networking' },
    { value: 'food-enthusiasts', label: 'Food Enthusiasts', icon: Users, color: 'red', description: 'Adventurous eaters, social media active, trend followers' },
    { value: 'local-residents', label: 'Local Residents', icon: Users, color: 'emerald', description: 'Neighborhood regulars, community-focused, loyal customers' }
  ];

  const [activeTab, setActiveTab] = useState('competitors');
  const [showAddCompetitor, setShowAddCompetitor] = useState(false);
  const [editingCompetitor, setEditingCompetitor] = useState(null);

  const tabs = [
    { id: 'competitors', label: 'Competitor Analysis', icon: Target, color: 'red' },
    { id: 'advantages', label: 'Competitive Advantages', icon: Shield, color: 'green' },
    { id: 'strategy', label: 'Strategy & Positioning', icon: TrendingUp, color: 'blue' },
    { id: 'insights', label: 'Market Insights', icon: Lightbulb, color: 'yellow' }
  ];

  // Calculate competitive landscape metrics
  const competitiveMetrics = useMemo(() => {
    const totalCompetitors = competitiveData.competitors.length;
    const threatLevels = competitiveData.competitors.reduce((acc, comp) => {
      acc[comp.threatLevel] = (acc[comp.threatLevel] || 0) + 1;
      return acc;
    }, {});
    
    const avgMarketShare = competitiveData.competitors.reduce((sum, comp) => 
      sum + (parseFloat(comp.marketShare) || 0), 0) / totalCompetitors || 0;
    
    return {
      totalCompetitors,
      threatLevels,
      avgMarketShare,
      highThreatCount: threatLevels.high || 0,
      mediumThreatCount: threatLevels.medium || 0,
      lowThreatCount: threatLevels.low || 0
    };
  }, [competitiveData.competitors]);

  const handleFieldChange = (section, field, value) => {
    setCompetitiveData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const addCompetitor = () => {
    const newCompetitor = {
      id: Date.now(),
      name: '',
      type: '',
      strengths: '',
      weaknesses: '',
      pricing: '',
      marketShare: '',
      uniqueFeatures: '',
      threatLevel: 'low'
    };
    setCompetitiveData(prev => ({
      ...prev,
      competitors: [...prev.competitors, newCompetitor]
    }));
  };

  const updateCompetitor = (id, field, value) => {
    setCompetitiveData(prev => ({
      ...prev,
      competitors: prev.competitors.map(comp => 
        comp.id === id ? { ...comp, [field]: value } : comp
      )
    }));
  };

  const removeCompetitor = (id) => {
    setCompetitiveData(prev => ({
      ...prev,
      competitors: prev.competitors.filter(comp => comp.id !== id)
    }));
  };

  const toggleCompetitiveAdvantage = (advantage) => {
    const currentAdvantages = competitiveData.competitiveAdvantages;
    const newAdvantages = currentAdvantages.includes(advantage)
      ? currentAdvantages.filter(a => a !== advantage)
      : [...currentAdvantages, advantage];
    
    handleFieldChange('competitiveAdvantages', 'competitiveAdvantages', newAdvantages);
  };

  const toggleCustomerSegment = (segment) => {
    const currentSegments = competitiveData.customerSegments;
    const newSegments = currentSegments.includes(segment)
      ? currentSegments.filter(s => s !== segment)
      : [...currentSegments, segment];
    
    handleFieldChange('customerSegments', 'customerSegments', newSegments);
  };

  const renderCompetitors = () => (
    <div className="space-y-6">
      {/* Competitive Landscape Overview */}
      <div className="bg-gradient-to-r from-red-50 to-pink-100 border border-red-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="bg-red-100 p-3 rounded-full mr-4">
            <Target className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-red-900">Competitive Landscape</h3>
            <p className="text-red-700">Analyze your competitors and identify market opportunities</p>
          </div>
        </div>
        
        {/* Competitive Metrics Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{competitiveMetrics.totalCompetitors}</div>
            <div className="text-sm text-gray-600">Total Competitors</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{competitiveMetrics.highThreatCount}</div>
            <div className="text-sm text-gray-600">High Threat</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{competitiveMetrics.mediumThreatCount}</div>
            <div className="text-sm text-gray-600">Medium Threat</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{competitiveMetrics.lowThreatCount}</div>
            <div className="text-sm text-gray-600">Low Threat</div>
          </div>
        </div>
      </div>

      {/* Add Competitor Button */}
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold text-gray-900">Competitor Analysis</h4>
        <button
          onClick={addCompetitor}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
        >
          <Target className="h-4 w-4 mr-2" />
          Add Competitor
        </button>
      </div>

      {/* Competitor List */}
      <div className="space-y-4">
        {competitiveData.competitors.map((competitor, index) => (
          <div key={competitor.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-lg font-semibold text-gray-900">
                Competitor {index + 1}
              </h5>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${threatLevels.find(t => t.value === competitor.threatLevel)?.bgColor} ${threatLevels.find(t => t.value === competitor.threatLevel)?.color}`}>
                  {threatLevels.find(t => t.value === competitor.threatLevel)?.label}
                </span>
                <button
                  onClick={() => removeCompetitor(competitor.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Name"
                value={competitor.name}
                onChange={(value) => updateCompetitor(competitor.id, 'name', value)}
                placeholder="Competitor name"
              />
              
              <FormField
                label="Type"
                value={competitor.type}
                onChange={(value) => updateCompetitor(competitor.id, 'type', value)}
                placeholder="Select competitor type"
                type="select"
                options={competitorTypes}
              />
              
              <FormField
                label="Market Share (%)"
                value={competitor.marketShare}
                onChange={(value) => updateCompetitor(competitor.id, 'marketShare', value)}
                placeholder="0"
                type="number"
              />
              
              <FormField
                label="Pricing Strategy"
                value={competitor.pricing}
                onChange={(value) => updateCompetitor(competitor.id, 'pricing', value)}
                placeholder="Describe pricing approach"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormField
                label="Strengths"
                value={competitor.strengths}
                onChange={(value) => updateCompetitor(competitor.id, 'strengths', value)}
                placeholder="What do they do well?"
                multiline
                rows={3}
              />
              
              <FormField
                label="Weaknesses"
                value={competitor.weaknesses}
                onChange={(value) => updateCompetitor(competitor.id, 'weaknesses', value)}
                placeholder="Where do they fall short?"
                multiline
                rows={3}
              />
            </div>
            
            <FormField
              label="Unique Features"
              value={competitor.uniqueFeatures}
              onChange={(value) => updateCompetitor(competitor.id, 'uniqueFeatures', value)}
              placeholder="What makes them different?"
              multiline
              rows={2}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderCompetitiveAdvantages = () => (
    <div className="space-y-6">
      {/* Advantages Overview */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-100 border border-green-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <Shield className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-green-900">Competitive Advantages</h3>
            <p className="text-green-700">Identify and leverage your unique strengths in the market</p>
          </div>
        </div>
      </div>

      {/* Advantage Selection Grid */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Select Your Competitive Advantages</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {competitiveAdvantageOptions.map((advantage) => (
            <button
              key={advantage.value}
              onClick={() => toggleCompetitiveAdvantage(advantage.value)}
              className={`p-3 border-2 rounded-lg flex items-center transition-all duration-200 ${
                competitiveData.competitiveAdvantages.includes(advantage.value)
                  ? `border-${advantage.color}-500 bg-${advantage.color}-50 text-${advantage.color}-700`
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
              }`}
            >
              <advantage.icon className="h-4 w-4 mr-2" />
              {advantage.label}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Segments */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Target Customer Segments</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {customerSegmentOptions.map((segment) => (
            <button
              key={segment.value}
              onClick={() => toggleCustomerSegment(segment.value)}
              className={`p-3 border-2 rounded-lg text-left transition-all duration-200 ${
                competitiveData.customerSegments.includes(segment.value)
                  ? `border-${segment.color}-500 bg-${segment.color}-50 text-${segment.color}-700`
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div className="flex items-center mb-1">
                <segment.icon className="h-4 w-4 mr-2" />
                <span className="font-medium">{segment.label}</span>
              </div>
              <p className="text-xs opacity-75">{segment.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStrategy = () => (
    <div className="space-y-6">
      {/* Strategy Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-100 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <TrendingUp className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-blue-900">Strategy & Positioning</h3>
            <p className="text-blue-700">Define your competitive strategy and market positioning</p>
          </div>
        </div>
      </div>

      {/* Pricing Strategy Selection */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Pricing Strategy</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pricingStrategies.map((strategy) => (
            <button
              key={strategy.value}
              onClick={() => handleFieldChange('pricingStrategy', 'pricingStrategy', strategy.value)}
              className={`p-4 border-2 rounded-lg text-left transition-all duration-200 ${
                competitiveData.pricingStrategy === strategy.value
                  ? `border-${strategy.color}-500 bg-${strategy.color}-50 text-${strategy.color}-700`
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div className="flex items-center mb-2">
                <strategy.icon className="h-5 w-5 mr-2" />
                <span className="font-medium">{strategy.label}</span>
              </div>
              <p className="text-sm opacity-75">{strategy.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Strategy Fields */}
      <div className="space-y-4">
        <FormField
          label="Differentiation Strategy"
          value={competitiveData.differentiationStrategy}
          onChange={(value) => handleFieldChange('differentiationStrategy', 'differentiationStrategy', value)}
          placeholder="How will you stand out from competitors?"
          multiline
          rows={4}
        />
        
        <FormField
          label="Market Positioning"
          value={competitiveData.marketPositioning}
          onChange={(value) => handleFieldChange('marketPositioning', 'marketPositioning', value)}
          placeholder="How do you want to be perceived in the market?"
          multiline
          rows={4}
        />
        
        <FormField
          label="Value Proposition"
          value={competitiveData.valueProposition}
          onChange={(value) => handleFieldChange('valueProposition', 'valueProposition', value)}
          placeholder="What unique value do you provide to customers?"
          multiline
          rows={4}
        />
      </div>
    </div>
  );

  const renderInsights = () => (
    <div className="space-y-6">
      {/* Insights Overview */}
      <div className="bg-gradient-to-r from-yellow-50 to-amber-100 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <div className="bg-yellow-100 p-3 rounded-full mr-4">
            <Lightbulb className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-yellow-900">Market Insights</h3>
            <p className="text-yellow-700">Identify market gaps and opportunities for growth</p>
          </div>
        </div>
      </div>

      {/* Market Analysis Fields */}
      <div className="space-y-4">
        <FormField
          label="Market Gaps"
          value={competitiveData.marketGaps}
          onChange={(value) => handleFieldChange('marketGaps', 'marketGaps', value)}
          placeholder="What needs are not being met by current competitors?"
          multiline
          rows={4}
        />
        
        <FormField
          label="Market Opportunities"
          value={competitiveData.marketOpportunities}
          onChange={(value) => handleFieldChange('marketOpportunities', 'marketOpportunities', value)}
          placeholder="What emerging trends or opportunities can you capitalize on?"
          multiline
          rows={4}
        />
      </div>

      {/* Competitive Landscape Visualization */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Competitive Landscape Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">{competitiveMetrics.highThreatCount}</div>
            <div className="text-sm text-gray-600">High Threat Competitors</div>
            <div className="text-xs text-gray-500 mt-1">Require immediate attention</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{competitiveMetrics.mediumThreatCount}</div>
            <div className="text-sm text-gray-600">Medium Threat Competitors</div>
            <div className="text-xs text-gray-500 mt-1">Monitor closely</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{competitiveMetrics.lowThreatCount}</div>
            <div className="text-sm text-gray-600">Low Threat Competitors</div>
            <div className="text-xs text-gray-500 mt-1">Minimal concern</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <SectionCard 
        title="Competitive Analysis" 
        description="Analyze your competitors, identify your advantages, and develop strategies to win in the market."
        color="red"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-red-100 p-3 rounded-full">
              <Target className="h-8 w-8 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Competitive Intelligence</h2>
              <p className="text-gray-600">Understand your competitive landscape and position for success</p>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Tab Navigation */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? `border-${tab.color}-500 text-${tab.color}-600`
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </div>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'competitors' && renderCompetitors()}
          {activeTab === 'advantages' && renderCompetitiveAdvantages()}
          {activeTab === 'strategy' && renderStrategy()}
          {activeTab === 'insights' && renderInsights()}
        </div>
      </div>
    </div>
  );
};

export default CompetitiveAnalysis;
