import React, { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import FormField from '../ui/FormField';
import SectionCard from '../ui/SectionCard';
import { RefreshCw, Lightbulb, MapPin, Users, Target, TrendingUp, DollarSign } from 'lucide-react';

const MarketingStrategy = () => {
  const { state, actions } = useApp();
  const data = state.businessPlan.marketingStrategy;
  const [activeTab, setActiveTab] = useState('strategy');

  const handleFieldChange = (field, value) => {
    actions.updateBusinessPlan('marketingStrategy', { [field]: value });
  };

  // Location-based marketing insights
  const locationMarketingInsights = useMemo(() => {
    const location = state.businessPlan.ideation?.location;
    if (!location) return null;

    const insights = {
      'north-end': {
        primaryAudience: 'Tourists & Italian-Americans',
        marketingChannels: ['Google Maps', 'TripAdvisor', 'Food blogs', 'Italian cultural events'],
        messaging: 'Authentic Italian heritage, family atmosphere, historic North End location',
        peakTimes: 'Dinner (6-9pm), Weekend lunch, Tourist hours',
        pricing: 'Mid-range ($35-55 per person)',
        promotions: 'Wine pairing events, Italian cooking classes, tourist packages'
      },
      'back-bay': {
        primaryAudience: 'Affluent professionals & tourists',
        marketingChannels: ['Luxury lifestyle magazines', 'Business publications', 'High-end social media', 'Concierge services'],
        messaging: 'Sophisticated dining experience, premium quality, upscale atmosphere',
        peakTimes: 'Lunch (12-2pm), Dinner (7-9pm), Weekend brunch',
        pricing: 'Premium ($45-75 per person)',
        promotions: 'Wine tastings, business lunch specials, weekend brunch packages'
      },
      'seaport': {
        primaryAudience: 'Tech workers & young professionals',
        marketingChannels: ['LinkedIn', 'Tech blogs', 'Corporate wellness programs', 'Delivery apps'],
        messaging: 'Modern, healthy options, quick service, tech-friendly atmosphere',
        peakTimes: 'Lunch (11:30-1:30pm), After-work (5-7pm), Weekend casual',
        pricing: 'Fast-casual ($18-35 per person)',
        promotions: 'Corporate lunch programs, healthy meal subscriptions, tech meetup catering'
      },
      'south-end': {
        primaryAudience: 'Young professionals & artists',
        marketingChannels: ['Instagram', 'Local art blogs', 'LGBTQ+ publications', 'Community events'],
        messaging: 'Trendy, artistic atmosphere, craft cocktails, farm-to-table',
        peakTimes: 'Dinner (7-9pm), Weekend brunch, Late night',
        pricing: 'Mid-range ($30-50 per person)',
        promotions: 'Art gallery openings, craft cocktail workshops, community events'
      },
      'cambridge': {
        primaryAudience: 'Students & academics',
        marketingChannels: ['University publications', 'Student social media', 'Academic conferences', 'Campus events'],
        messaging: 'Intellectual atmosphere, international cuisine, student-friendly',
        peakTimes: 'Lunch (12-2pm), Dinner (6-8pm), Late night (10pm+)',
        pricing: 'Student-friendly ($20-40 per person)',
        promotions: 'Student discounts, academic event catering, international food festivals'
      }
    };

    return insights[location] || insights['north-end']; // Default fallback
  }, [state.businessPlan.ideation?.location]);

  // Auto-update marketing strategy based on location
  const autoUpdateMarketingStrategy = () => {
    if (!locationMarketingInsights) return;

    const strategyUpdates = {
      marketingMix: `Product: ${locationMarketingInsights.messaging}. Price: ${locationMarketingInsights.pricing}. Place: ${state.businessPlan.ideation?.location} location. Promotion: ${locationMarketingInsights.marketingChannels.join(', ')}.`,
      salesStrategy: `Target audience: ${locationMarketingInsights.primaryAudience}. Peak hours: ${locationMarketingInsights.peakTimes}. Sales channels: ${locationMarketingInsights.marketingChannels.join(', ')}.`,
      customerAcquisition: `Primary: ${locationMarketingInsights.marketingChannels.slice(0, 3).join(', ')}. Secondary: ${locationMarketingInsights.marketingChannels.slice(3).join(', ')}. Focus on ${locationMarketingInsights.primaryAudience.toLowerCase()} through ${locationMarketingInsights.messaging.toLowerCase()}.`,
      brandingStrategy: `Position as ${locationMarketingInsights.messaging}. Target ${locationMarketingInsights.primaryAudience.toLowerCase()} with ${locationMarketingInsights.messaging.toLowerCase()}.`,
      digitalMarketing: `Website: SEO for ${state.businessPlan.ideation?.location} restaurants. Social media: ${locationMarketingInsights.marketingChannels.filter(channel => channel.includes('social') || channel.includes('Instagram') || channel.includes('LinkedIn')).join(', ')}. Online advertising: Google Ads for ${locationMarketingInsights.primaryAudience.toLowerCase()}.`
    };

    actions.updateBusinessPlan('marketingStrategy', strategyUpdates);
  };

  const tabs = [
    { id: 'strategy', label: 'Marketing Strategy', icon: Target },
    { id: 'demographics', label: 'Target Demographics', icon: Users },
    { id: 'channels', label: 'Marketing Channels', icon: TrendingUp },
    { id: 'location-insights', label: 'Location Insights', icon: MapPin }
  ];

  const renderStrategy = () => (
    <div className="space-y-6">
      <FormField
        label="Marketing Mix (4 P's)"
        type="textarea"
        value={data.marketingMix}
        onChange={(value) => handleFieldChange('marketingMix', value)}
        placeholder="Product, Price, Place, Promotion strategy"
        rows={4}
      />
      
      <FormField
        label="Sales Strategy"
        type="textarea"
        value={data.salesStrategy}
        onChange={(value) => handleFieldChange('salesStrategy', value)}
        placeholder="Sales process, channels, team structure, targets"
        rows={3}
      />
      
      <FormField
        label="Customer Acquisition"
        type="textarea"
        value={data.customerAcquisition}
        onChange={(value) => handleFieldChange('customerAcquisition', value)}
        placeholder="How will you find and attract new customers?"
        rows={3}
      />
      
      <FormField
        label="Branding Strategy"
        type="textarea"
        value={data.brandingStrategy}
        onChange={(value) => handleFieldChange('brandingStrategy', value)}
        placeholder="Brand positioning, messaging, visual identity"
        rows={3}
      />
      
      <FormField
        label="Digital Marketing"
        type="textarea"
        value={data.digitalMarketing}
        onChange={(value) => handleFieldChange('digitalMarketing', value)}
        placeholder="Website, social media, SEO, online advertising strategy"
        rows={3}
      />
    </div>
  );

  const renderDemographics = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Target Customer Demographics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Primary Audience</h4>
              <p className="text-gray-600">{locationMarketingInsights?.primaryAudience || 'Select a location to see insights'}</p>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Peak Dining Times</h4>
              <p className="text-gray-600">{locationMarketingInsights?.peakTimes || 'Select a location to see insights'}</p>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Price Point</h4>
              <p className="text-gray-600">{locationMarketingInsights?.pricing || 'Select a location to see insights'}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Key Messaging</h4>
              <p className="text-gray-600">{locationMarketingInsights?.messaging || 'Select a location to see insights'}</p>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Promotional Opportunities</h4>
              <p className="text-gray-600">{locationMarketingInsights?.promotions || 'Select a location to see insights'}</p>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Competitive Advantages</h4>
              <p className="text-gray-600">Location-specific positioning, target audience focus, unique atmosphere</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderChannels = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-900 mb-4">Recommended Marketing Channels</h3>
        
        {locationMarketingInsights ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Primary Channels</h4>
              <div className="space-y-2">
                {locationMarketingInsights.marketingChannels.slice(0, 3).map((channel, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">{channel}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Secondary Channels</h4>
              <div className="space-y-2">
                {locationMarketingInsights.marketingChannels.slice(3).map((channel, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">{channel}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">Select a location in your business concept to see recommended marketing channels.</p>
        )}
      </div>
    </div>
  );

  const renderLocationInsights = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Lightbulb className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-purple-900">Location-Based Marketing Insights</h3>
        </div>
        
        {locationMarketingInsights ? (
          <div className="space-y-4">
            <p className="text-gray-700">
              Based on your selected location (<strong>{state.businessPlan.ideation?.location}</strong>), 
              here are tailored marketing insights and recommendations:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Target Audience</h4>
                <p className="text-gray-600">{locationMarketingInsights.primaryAudience}</p>
              </div>
              
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Key Messaging</h4>
                <p className="text-gray-600">{locationMarketingInsights.messaging}</p>
              </div>
              
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Peak Times</h4>
                <p className="text-gray-600">{locationMarketingInsights.peakTimes}</p>
              </div>
              
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Price Strategy</h4>
                <p className="text-gray-600">{locationMarketingInsights.pricing}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Recommended Promotions</h4>
              <p className="text-gray-600">{locationMarketingInsights.promotions}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-600 mb-2">No Location Selected</h4>
            <p className="text-gray-500">
              Go to your Business Concept section and select a Boston location to see 
              location-specific marketing insights and recommendations.
            </p>
          </div>
        )}
        
        {locationMarketingInsights && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={autoUpdateMarketingStrategy}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Auto-Update Strategy</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <SectionCard 
        title="Marketing & Sales Strategy" 
        description="Outline how you'll attract and retain customers with location-based insights."
        color="pink"
      >
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-pink-500 text-pink-600'
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
        {activeTab === 'strategy' && renderStrategy()}
        {activeTab === 'demographics' && renderDemographics()}
        {activeTab === 'channels' && renderChannels()}
        {activeTab === 'location-insights' && renderLocationInsights()}
      </SectionCard>
    </div>
  );
};

export default MarketingStrategy; 