import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import FormField from '../ui/FormField';
import SectionCard from '../ui/SectionCard';
import AIResearchPanel from '../ai/AIResearchPanel';
import AIAssistant from '../ai/AIAssistant';
import { aiService } from '../../services/aiService';
import { TrendingUp, Users, MapPin, DollarSign, Target, BarChart3, Globe, Building, Utensils, RefreshCw, Lightbulb, Star, Zap, Heart, Sparkles, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

// Enhanced Boston restaurant market data with location-specific demographics
const bostonMarketData = {
    marketSize: {
      totalRestaurants: 4200,
      annualRevenue: 2.8, // billion
      employmentSize: 78000,
      growthRate: 3.2
    },
    demographics: {
      population: 695506,
      medianAge: 32.1,
      medianIncome: 71115,
      collegeEducated: 47.9,
      touristVisits: 21.2 // million annually
    },
    trends: [
      { trend: 'Farm-to-table dining', growth: '+12%', impact: 'High', icon: Heart, color: 'green' },
      { trend: 'Craft beer/cocktails', growth: '+8%', impact: 'High', icon: Utensils, color: 'blue' },
      { trend: 'Food delivery/ghost kitchens', growth: '+25%', impact: 'Very High', icon: Zap, color: 'orange' },
      { trend: 'Sustainable/eco-friendly', growth: '+15%', impact: 'Medium', icon: Globe, color: 'emerald' },
      { trend: 'Ethnic fusion cuisine', growth: '+10%', impact: 'High', icon: Star, color: 'purple' }
    ],
    neighborhoods: [
      { 
        name: 'Back Bay', 
        restaurants: 280, 
        avgRent: 85, 
        competition: 'Very High', 
        tourism: 'High',
        demographics: {
          medianAge: 34.2,
          medianIncome: 125000,
          population: 18500,
          primarySegments: ['Affluent Professionals', 'Tourists', 'Shoppers'],
          diningPreferences: ['Upscale dining', 'Wine bars', 'Brunch spots', 'Fine dining'],
          peakHours: ['Lunch (12-2pm)', 'Dinner (7-9pm)', 'Weekend brunch'],
          averageCheck: '$45-75'
        }
      },
      { 
        name: 'North End', 
        restaurants: 120, 
        avgRent: 65, 
        competition: 'High', 
        tourism: 'Very High',
        demographics: {
          medianAge: 31.8,
          medianIncome: 85000,
          population: 12300,
          primarySegments: ['Tourists', 'Italian-Americans', 'Food enthusiasts'],
          diningPreferences: ['Italian cuisine', 'Family dining', 'Wine pairings', 'Historic atmosphere'],
          peakHours: ['Dinner (6-9pm)', 'Weekend lunch', 'Tourist hours'],
          averageCheck: '$35-55'
        }
      },
      { 
        name: 'Seaport', 
        restaurants: 180, 
        avgRent: 75, 
        competition: 'High', 
        tourism: 'Medium',
        demographics: {
          medianAge: 28.5,
          medianIncome: 95000,
          population: 15800,
          primarySegments: ['Tech workers', 'Young professionals', 'Business travelers'],
          diningPreferences: ['Fast-casual', 'Healthy options', 'Quick service', 'Modern atmosphere'],
          peakHours: ['Lunch (11:30-1:30pm)', 'After-work (5-7pm)', 'Weekend casual'],
          averageCheck: '$18-35'
        }
      },
      { 
        name: 'South End', 
        restaurants: 180, 
        avgRent: 75, 
        competition: 'High', 
        tourism: 'Medium',
        demographics: {
          medianAge: 33.1,
          medianIncome: 78000,
          population: 22100,
          primarySegments: ['Young professionals', 'Artists', 'LGBTQ+ community'],
          diningPreferences: ['Trendy concepts', 'Craft cocktails', 'Farm-to-table', 'Artisanal'],
          peakHours: ['Dinner (7-9pm)', 'Weekend brunch', 'Late night'],
          averageCheck: '$30-50'
        }
      },
      { 
        name: 'Cambridge', 
        restaurants: 220, 
        avgRent: 55, 
        competition: 'Medium', 
        tourism: 'High',
        demographics: {
          medianAge: 29.7,
          medianIncome: 82000,
          population: 118000,
          primarySegments: ['Students', 'Academics', 'Tech workers'],
          diningPreferences: ['International cuisine', 'Student-friendly', 'Intellectual atmosphere', 'Late night'],
          peakHours: ['Lunch (12-2pm)', 'Dinner (6-8pm)', 'Late night (10pm+)'],
          averageCheck: '$20-40'
        }
      },
      { 
        name: 'Somerville', 
        restaurants: 140, 
        avgRent: 45, 
        competition: 'Medium', 
        tourism: 'Low',
        demographics: {
          medianAge: 30.2,
          medianIncome: 72000,
          population: 81400,
          primarySegments: ['Young families', 'Professionals', 'Students'],
          diningPreferences: ['Neighborhood spots', 'Family dining', 'Casual atmosphere', 'Value-oriented'],
          peakHours: ['Dinner (6-8pm)', 'Weekend family meals', 'Takeout'],
          averageCheck: '$25-45'
        }
      },
      { 
        name: 'Jamaica Plain', 
        restaurants: 100, 
        avgRent: 35, 
        competition: 'Low', 
        tourism: 'Low',
        demographics: {
          medianAge: 35.8,
          medianIncome: 65000,
          population: 42000,
          primarySegments: ['Families', 'Young professionals', 'Artists'],
          diningPreferences: ['Community-focused', 'Local ingredients', 'Casual dining', 'Family-friendly'],
          peakHours: ['Dinner (6-8pm)', 'Weekend family meals', 'Community events'],
          averageCheck: '$20-35'
        }
      }
    ]
};

// Popular markets for quick selection
const POPULAR_MARKETS = [
  'Boston, MA',
  'New York, NY',
  'Los Angeles, CA',
  'Chicago, IL',
  'San Francisco, CA',
  'Miami, FL',
  'Seattle, WA',
  'Austin, TX',
  'Denver, CO',
  'Portland, OR',
  'Nashville, TN',
  'Atlanta, GA',
  'Philadelphia, PA',
  'Washington, DC',
  'San Diego, CA'
];

const MarketAnalysis = () => {
  const { state, actions } = useApp();
  const data = state.businessPlan.marketAnalysis;
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMarket, setSelectedMarket] = useState(data?.selectedMarket || 'Boston, MA');
  const [marketData, setMarketData] = useState(data?.customMarketData || bostonMarketData);
  const [isGeneratingMarket, setIsGeneratingMarket] = useState(false);
  const [marketGenerationError, setMarketGenerationError] = useState(null);
  const [customMarketName, setCustomMarketName] = useState('');

  // Load saved market data on mount
  useEffect(() => {
    if (data?.selectedMarket && data?.customMarketData) {
      setSelectedMarket(data.selectedMarket);
      setMarketData(data.customMarketData);
    }
  }, []);

  const handleFieldChange = (field, value) => {
    actions.updateBusinessPlan('marketAnalysis', { [field]: value });
  };

  // Generate market data using AI
  const generateMarketData = async (marketName, restaurantType) => {
    setIsGeneratingMarket(true);
    setMarketGenerationError(null);

    try {
      const restaurantConcept = state.businessPlan.ideation?.restaurantConcept || restaurantType || 'restaurant';
      
      const prompt = `Generate comprehensive restaurant market analysis data for ${marketName}. Provide a detailed JSON response with the following structure:

{
  "marketSize": {
    "totalRestaurants": <number>,
    "annualRevenue": <number in billions>,
    "employmentSize": <number>,
    "growthRate": <percentage>
  },
  "demographics": {
    "population": <number>,
    "medianAge": <number>,
    "medianIncome": <number>,
    "collegeEducated": <percentage>,
    "touristVisits": <number in millions>
  },
  "trends": [
    {
      "trend": "<trend name>",
      "growth": "<+X%>",
      "impact": "<High/Medium/Low>",
      "color": "<green/blue/orange/purple>"
    }
  ],
  "neighborhoods": [
    {
      "name": "<neighborhood name>",
      "restaurants": <number>,
      "avgRent": <number per sq ft>,
      "competition": "<Very High/High/Medium/Low>",
      "tourism": "<Very High/High/Medium/Low>",
      "demographics": {
        "medianAge": <number>,
        "medianIncome": <number>,
        "population": <number>,
        "primarySegments": ["<segment1>", "<segment2>"],
        "diningPreferences": ["<pref1>", "<pref2>"],
        "peakHours": ["<hour1>", "<hour2>"],
        "averageCheck": "$<X-Y>"
      }
    }
  ]
}

Focus on ${restaurantConcept} restaurants. Include 5-7 key market trends and 4-6 major neighborhoods. Use realistic data based on ${marketName}'s actual market conditions.`;

      const response = await aiService.generateCompletion(prompt, {
        systemPrompt: `You are a restaurant market research expert. Provide accurate, realistic market data in valid JSON format. Only return the JSON object, no additional text.`,
        maxTokens: 3000,
        temperature: 0.3,
      });

      // Parse the JSON response
      let parsedData;
      try {
        // Try to extract JSON from markdown code blocks if present
        const jsonMatch = response.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) || response.match(/(\{[\s\S]*\})/);
        const jsonString = jsonMatch ? jsonMatch[1] : response;
        parsedData = JSON.parse(jsonString);
      } catch (parseError) {
        // If parsing fails, try to create a structured response from the text
        console.error('Failed to parse AI response as JSON, creating fallback data');
        parsedData = createFallbackMarketData(marketName, restaurantConcept);
      }

      // Validate and enhance the data structure
      const enhancedData = {
        marketSize: parsedData.marketSize || bostonMarketData.marketSize,
        demographics: parsedData.demographics || bostonMarketData.demographics,
        trends: parsedData.trends || bostonMarketData.trends,
        neighborhoods: parsedData.neighborhoods || bostonMarketData.neighborhoods,
      };

      // Map icon names to actual icon components
      enhancedData.trends = enhancedData.trends.map(trend => ({
        ...trend,
        icon: getTrendIcon(trend.trend),
      }));

      setMarketData(enhancedData);
      
      // Save to business plan
      actions.updateBusinessPlan('marketAnalysis', {
        selectedMarket: marketName,
        customMarketData: enhancedData,
        lastMarketUpdate: new Date().toISOString(),
      });

      actions.showMessage('Success', `Market analysis generated for ${marketName}!`, 'success');
    } catch (error) {
      console.error('Error generating market data:', error);
      setMarketGenerationError(`Failed to generate market data: ${error.message}`);
      actions.showMessage('Error', 'Failed to generate market data. Please try again.', 'error');
    } finally {
      setIsGeneratingMarket(false);
    }
  };

  // Helper function to get trend icons
  const getTrendIcon = (trendName) => {
    const lowerTrend = trendName.toLowerCase();
    if (lowerTrend.includes('farm') || lowerTrend.includes('local') || lowerTrend.includes('sustainable')) return Heart;
    if (lowerTrend.includes('beer') || lowerTrend.includes('cocktail') || lowerTrend.includes('beverage')) return Utensils;
    if (lowerTrend.includes('delivery') || lowerTrend.includes('ghost') || lowerTrend.includes('virtual')) return Zap;
    if (lowerTrend.includes('eco') || lowerTrend.includes('green') || lowerTrend.includes('environment')) return Globe;
    if (lowerTrend.includes('fusion') || lowerTrend.includes('ethnic') || lowerTrend.includes('international')) return Star;
    return TrendingUp;
  };

  // Fallback market data generator if AI fails
  const createFallbackMarketData = (marketName, restaurantType) => {
    return {
      marketSize: {
        totalRestaurants: 2000,
        annualRevenue: 1.5,
        employmentSize: 40000,
        growthRate: 2.5
      },
      demographics: {
        population: 500000,
        medianAge: 35,
        medianIncome: 60000,
        collegeEducated: 40,
        touristVisits: 10
      },
      trends: [
        { trend: 'Local sourcing', growth: '+10%', impact: 'High', color: 'green' },
        { trend: 'Craft beverages', growth: '+7%', impact: 'High', color: 'blue' },
        { trend: 'Food delivery', growth: '+20%', impact: 'Very High', color: 'orange' },
        { trend: 'Sustainable practices', growth: '+12%', impact: 'Medium', color: 'emerald' },
        { trend: 'Diverse cuisine', growth: '+8%', impact: 'High', color: 'purple' }
      ],
      neighborhoods: [
        {
          name: 'Downtown',
          restaurants: 150,
          avgRent: 50,
          competition: 'High',
          tourism: 'High',
          demographics: {
            medianAge: 32,
            medianIncome: 75000,
            population: 30000,
            primarySegments: ['Professionals', 'Tourists'],
            diningPreferences: ['Upscale', 'Quick service'],
            peakHours: ['Lunch', 'Dinner'],
            averageCheck: '$25-50'
          }
        }
      ]
    };
  };

  const handleMarketChange = async (marketName) => {
    setSelectedMarket(marketName);
    
    // If it's Boston, use the hardcoded data
    if (marketName === 'Boston, MA') {
      setMarketData(bostonMarketData);
      actions.updateBusinessPlan('marketAnalysis', {
        selectedMarket: marketName,
        customMarketData: bostonMarketData,
      });
    } else {
      // Generate new market data
      await generateMarketData(marketName);
    }
  };

  const handleCustomMarketSubmit = async () => {
    if (!customMarketName.trim()) {
      actions.showMessage('Error', 'Please enter a market name', 'error');
      return;
    }
    await generateMarketData(customMarketName.trim());
    setCustomMarketName('');
  };

  const getCompetitionColor = (level) => {
    switch(level) {
      case 'Very High': return 'text-red-600 bg-red-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const selectedNeighborhood = useMemo(() => {
    const location = state.businessPlan.ideation?.location;
    if (!location) return null;
    
    // Map location values to neighborhood names (only for Boston)
    if (selectedMarket === 'Boston, MA') {
      const locationMap = {
        'north-end': 'North End',
        'back-bay': 'Back Bay',
        'seaport': 'Seaport',
        'south-end': 'South End',
        'cambridge': 'Cambridge',
        'beacon-hill': 'Back Bay',
        'faneuil-hall': 'North End',
        'financial-district': 'Seaport'
      };
      
      const neighborhoodName = locationMap[location];
      return marketData.neighborhoods.find(n => n.name === neighborhoodName) || null;
    }
    
    // For other markets, try to find a matching neighborhood or return the first one
    return marketData.neighborhoods?.[0] || null;
  }, [state.businessPlan.ideation?.location, selectedMarket, marketData]);

  // Auto-update market analysis based on selected location
  const autoUpdateMarketAnalysis = () => {
    if (!selectedNeighborhood) return;
    
    const locationInsights = {
      targetMarket: `Primary: ${selectedNeighborhood.demographics.primarySegments.join(', ')}. Average age ${selectedNeighborhood.demographics.medianAge}, median income $${selectedNeighborhood.demographics.medianIncome.toLocaleString()}.`,
      marketSize: `${selectedNeighborhood.name} dining market: Approximately $${Math.round(selectedNeighborhood.restaurants * 0.8)}M annually. Targeting 0.5-1% market share.`,
      competitiveAnalysis: `Key competitors: ${selectedNeighborhood.restaurants} restaurants in area. Competition level: ${selectedNeighborhood.competition}. Differentiation through ${selectedNeighborhood.demographics.diningPreferences.slice(0, 2).join(' and ')}.`,
      marketTrends: `Growing demand for ${selectedNeighborhood.demographics.diningPreferences.slice(0, 3).join(', ')}, and ${selectedNeighborhood.competition === 'High' || selectedNeighborhood.competition === 'Very High' ? 'unique positioning' : 'local community focus'}.`,
      customerDemographics: `Primary: ${selectedNeighborhood.demographics.primarySegments.slice(0, 2).join(' and ')}, ages ${Math.round(selectedNeighborhood.demographics.medianAge - 5)}-${Math.round(selectedNeighborhood.demographics.medianAge + 15)}, income $${Math.round(selectedNeighborhood.demographics.medianIncome * 0.8).toLocaleString()}+. Secondary: ${selectedNeighborhood.demographics.primarySegments.slice(2, 3).join(', ')}.`
    };

    // Update the market analysis with location-specific insights
    actions.updateBusinessPlan('marketAnalysis', locationInsights);
  };

  const tabs = [
    { id: 'overview', label: 'Market Overview', icon: Globe },
    { id: 'demographics', label: 'Demographics', icon: Users },
    { id: 'competition', label: 'Competition', icon: Target },
    { id: 'trends', label: 'Market Trends', icon: TrendingUp },
    { id: 'analysis', label: 'Your Analysis', icon: BarChart3 },
    { id: 'location-insights', label: 'Location Insights', icon: MapPin }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Market Size Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Restaurants</p>
              <p className="text-2xl font-bold text-blue-900">{marketData.marketSize.totalRestaurants.toLocaleString()}</p>
            </div>
            <Utensils className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Annual Revenue</p>
              <p className="text-2xl font-bold text-green-900">${marketData.marketSize.annualRevenue}B</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Employment</p>
              <p className="text-2xl font-bold text-purple-900">{marketData.marketSize.employmentSize.toLocaleString()}</p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">Growth Rate</p>
              <p className="text-2xl font-bold text-orange-900">{marketData.marketSize.growthRate}%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Industry Overview */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Building className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">{selectedMarket} Restaurant Industry Overview</h3>
        </div>
        
        <div className="prose text-gray-700 max-w-none">
          <p className="mb-4">
            {selectedMarket}'s restaurant industry represents a {marketData.marketSize.annualRevenue >= 2 ? 'robust' : marketData.marketSize.annualRevenue >= 1 ? 'significant' : 'growing'} ${marketData.marketSize.annualRevenue} billion market with over {marketData.marketSize.totalRestaurants.toLocaleString()} establishments employing 
            {marketData.marketSize.employmentSize.toLocaleString()} people. The market has shown {marketData.marketSize.growthRate >= 3 ? 'strong' : marketData.marketSize.growthRate >= 2 ? 'steady' : 'moderate'} growth of {marketData.marketSize.growthRate}% annually.
          </p>
          
          <p className="mb-4">
            Key factors driving market growth include:
          </p>
          
          <ul className="list-disc list-inside space-y-1 mb-4">
            {marketData.demographics.touristVisits > 10 && (
              <li>Strong tourism industry with {marketData.demographics.touristVisits}M visitors annually</li>
            )}
            <li>Median household income of ${marketData.demographics.medianIncome.toLocaleString()}</li>
            <li>{marketData.demographics.collegeEducated}% college-educated population, median age {marketData.demographics.medianAge}</li>
            <li>Growing food delivery and ghost kitchen segments</li>
            <li>Increasing demand for sustainable and locally-sourced dining</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderDemographics = () => (
    <div className="space-y-6">
      {/* Demographics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-center">
          <Users className="h-8 w-8 text-indigo-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-indigo-600">Population</p>
          <p className="text-xl font-bold text-indigo-900">{marketData.demographics.population.toLocaleString()}</p>
        </div>
        
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 text-center">
          <BarChart3 className="h-8 w-8 text-teal-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-teal-600">Median Age</p>
          <p className="text-xl font-bold text-teal-900">{marketData.demographics.medianAge}</p>
        </div>
        
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
          <DollarSign className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-emerald-600">Median Income</p>
          <p className="text-xl font-bold text-emerald-900">${marketData.demographics.medianIncome.toLocaleString()}</p>
        </div>
        
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 text-center">
          <MapPin className="h-8 w-8 text-rose-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-rose-600">Annual Tourists</p>
          <p className="text-xl font-bold text-rose-900">{marketData.demographics.touristVisits}M</p>
        </div>
      </div>

      {/* Customer Segments */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Customer Segments</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Young Professionals (25-35)</h4>
              <p className="text-sm text-gray-600 mb-2">32% of population • High disposable income • Tech/healthcare workers</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Quick lunch</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">After-work dining</span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Delivery</span>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-2">College Students (18-24)</h4>
              <p className="text-sm text-gray-600 mb-2">18% of population • Budget-conscious • Social dining</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Casual dining</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Group meals</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Late night</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 mb-2">Tourists & Visitors</h4>
              <p className="text-sm text-gray-600 mb-2">21.2M annually • Experience-seeking • Higher spending</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">Local specialties</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">Fine dining</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">Historic areas</span>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-orange-900 mb-2">Families & Locals (35+)</h4>
              <p className="text-sm text-gray-600 mb-2">28% of population • Regular customers • Value-oriented</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">Family dining</span>
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">Takeout</span>
                <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">Neighborhood spots</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCompetition = () => (
    <div className="space-y-6">
      {/* Neighborhood Analysis */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Competition by Neighborhood</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Neighborhood</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Restaurants</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Avg Rent/sq ft</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Competition</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Tourism</th>
              </tr>
            </thead>
            <tbody>
              {marketData.neighborhoods.map((neighborhood, index) => (
                <tr key={index} className={`border-b border-gray-100 ${selectedNeighborhood && neighborhood.name === selectedNeighborhood.name ? 'bg-blue-50' : ''}`}>
                  <td className="py-3 px-4 font-medium text-gray-900">{neighborhood.name}</td>
                  <td className="py-3 px-4 text-gray-700">{neighborhood.restaurants}</td>
                  <td className="py-3 px-4 text-gray-700">${neighborhood.avgRent}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCompetitionColor(neighborhood.competition)}`}>
                      {neighborhood.competition}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCompetitionColor(neighborhood.tourism)}`}>
                      {neighborhood.tourism}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Location Analysis */}
      {selectedNeighborhood && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            Your Selected Location: {selectedNeighborhood.name}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm font-medium text-gray-600">Market Density</p>
              <p className="text-2xl font-bold text-gray-900">{selectedNeighborhood.restaurants} restaurants</p>
              <p className="text-xs text-gray-500">Competition level: {selectedNeighborhood.competition}</p>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm font-medium text-gray-600">Rental Cost</p>
              <p className="text-2xl font-bold text-gray-900">${selectedNeighborhood.avgRent}/sq ft</p>
              <p className="text-xs text-gray-500">Annual commercial rent</p>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm font-medium text-gray-600">Tourism Impact</p>
              <p className="text-2xl font-bold text-gray-900">{selectedNeighborhood.tourism}</p>
              <p className="text-xs text-gray-500">Visitor traffic level</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderTrends = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Current Market Trends</h3>
        </div>
        
        <div className="space-y-4">
          {marketData.trends.map((trend, index) => {
            const TrendIcon = trend.icon || TrendingUp;
            return (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <TrendIcon className={`h-5 w-5 text-${trend.color || 'green'}-600`} />
                  <h4 className="font-semibold text-gray-900">{trend.trend}</h4>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-sm font-medium rounded">
                    {trend.growth}
                  </span>
                  <span className={`px-2 py-1 text-sm font-medium rounded ${
                    trend.impact === 'Very High' ? 'bg-red-100 text-red-800' :
                    trend.impact === 'High' ? 'bg-orange-100 text-orange-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {trend.impact} Impact
                  </span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm">
                {trend.description || `This trend is showing ${trend.growth} growth in ${selectedMarket} and has ${trend.impact.toLowerCase()} impact on the restaurant market.`}
              </p>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderAnalysis = () => (
    <div className="space-y-6">
      <FormField
        label="Industry Overview & Market Size"
        type="textarea"
        value={data.industryOverview}
        onChange={(value) => handleFieldChange('industryOverview', value)}
        placeholder={`Based on the data above, describe how your restaurant fits into ${selectedMarket}'s $${marketData.marketSize.annualRevenue}B restaurant market. Consider market size, growth trends, and your target segment.`}
        rows={4}
      />
      
      <FormField
        label="Target Market Definition"
        type="textarea"
        value={data.targetMarket}
        onChange={(value) => handleFieldChange('targetMarket', value)}
        placeholder="Define your primary and secondary customer segments. Reference the demographic data - will you target young professionals, tourists, families, or students?"
        rows={4}
      />
      
      <FormField
        label="Competitive Positioning"
        type="textarea"
        value={data.competitiveAnalysis}
        onChange={(value) => handleFieldChange('competitiveAnalysis', value)}
        placeholder={`In ${selectedNeighborhood?.name || 'your chosen location'} (${selectedNeighborhood?.restaurants || 'local'} restaurants), how will you differentiate? What's your competitive advantage?`}
        rows={4}
      />
      
      <FormField
        label="Market Opportunity Assessment"
        type="textarea"
        value={data.marketSize}
        onChange={(value) => handleFieldChange('marketSize', value)}
        placeholder="What specific market opportunity are you targeting? Consider underserved segments, emerging trends, or gaps in your chosen neighborhood."
        rows={3}
      />
      
      <FormField
        label="Trend Alignment Strategy"
        type="textarea"
        value={data.marketTrends}
        onChange={(value) => handleFieldChange('marketTrends', value)}
        placeholder="How will your restaurant align with current trends like farm-to-table, delivery, sustainability, or craft beverages?"
        rows={3}
      />
      
      <FormField
        label="Customer Demographics & Behavior"
        type="textarea"
        value={data.customerDemographics}
        onChange={(value) => handleFieldChange('customerDemographics', value)}
        placeholder="Describe your ideal customers' dining habits, spending patterns, and preferences. How will you reach and retain them?"
        rows={3}
      />
    </div>
  );

  return (
    <div className="animate-fade-in">
      <SectionCard 
        title={`${selectedMarket} Restaurant Market Analysis`}
        description={`Comprehensive analysis of ${selectedMarket}'s restaurant market with AI-powered data and competitive insights.`}
        color="green"
      >
        {/* Market Selector */}
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Market
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedMarket}
                  onChange={(e) => handleMarketChange(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  disabled={isGeneratingMarket}
                >
                  {POPULAR_MARKETS.map((market) => (
                    <option key={market} value={market}>
                      {market}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleMarketChange(selectedMarket)}
                  disabled={isGeneratingMarket}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isGeneratingMarket ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      <span>Refresh</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Market
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customMarketName}
                  onChange={(e) => setCustomMarketName(e.target.value)}
                  placeholder="e.g., Portland, ME"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleCustomMarketSubmit()}
                  disabled={isGeneratingMarket}
                />
                <button
                  onClick={handleCustomMarketSubmit}
                  disabled={isGeneratingMarket || !customMarketName.trim()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isGeneratingMarket ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Generate</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          
          {marketGenerationError && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <p className="text-sm text-red-700">{marketGenerationError}</p>
            </div>
          )}
          
          {data?.lastMarketUpdate && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <p className="text-sm text-green-700">
                Market data last updated: {new Date(data.lastMarketUpdate).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'demographics' && renderDemographics()}
        {activeTab === 'competition' && renderCompetition()}
        {activeTab === 'trends' && renderTrends()}
        {activeTab === 'analysis' && renderAnalysis()}
        {activeTab === 'location-insights' && (
          <div className="space-y-6">
            {/* AI Research Panel */}
            <AIResearchPanel
              location={data.location || 'Boston'}
              restaurantType={data.restaurantConcept || null}
              onDataReceived={(results) => {
                // Auto-populate fields with AI research results
                if (results) {
                  actions.updateBusinessPlan('marketAnalysis', {
                    marketSize: results,
                    lastUpdated: new Date().toISOString()
                  });
                }
              }}
            />

            {/* Existing Location Insights */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Lightbulb className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Location Insights</h3>
              </div>
              <p className="text-gray-700">
                Based on your selected location, here are some key insights and recommendations:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-4">
                <li>
                  <strong>Target Market:</strong> {data.targetMarket || 'No specific target market defined yet.'}
                </li>
                <li>
                  <strong>Competitive Positioning:</strong> {data.competitiveAnalysis || 'No competitive analysis provided.'}
                </li>
                <li>
                  <strong>Market Opportunity:</strong> {data.marketSize || 'No market opportunity assessment provided.'}
                </li>
                <li>
                  <strong>Trend Alignment:</strong> {data.marketTrends || 'No trend alignment strategy provided.'}
                </li>
                <li>
                  <strong>Customer Demographics:</strong> {data.customerDemographics || 'No customer demographics provided.'}
                </li>
              </ul>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={autoUpdateMarketAnalysis}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Update Insights
                </button>
              </div>
            </div>

            {/* AI Assistant for Market Analysis */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
              </div>
              <AIAssistant
                context={{
                  location: data.location || 'Boston',
                  concept: data.restaurantConcept,
                  targetMarket: data.targetMarket,
                  competitiveAnalysis: data.competitiveAnalysis
                }}
                section="marketAnalysis"
                placeholder="Ask about market trends, demographics, competition, or get help writing your analysis..."
                onGenerate={(generatedContent) => {
                  // Allow user to review and apply AI-generated content
                  if (window.confirm('Apply AI-generated content to your market analysis?')) {
                    actions.updateBusinessPlan('marketAnalysis', {
                      marketAnalysis: generatedContent,
                      lastUpdated: new Date().toISOString()
                    });
                  }
                }}
              />
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default MarketAnalysis; 