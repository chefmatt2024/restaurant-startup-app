import React from 'react';
import { useApp } from '../../contexts/AppContext';
import FormField from '../ui/FormField';
import SectionCard from '../ui/SectionCard';
import AIAssistant from '../ai/AIAssistant';
import { MapPin, Building, DollarSign, Users, Sparkles } from 'lucide-react';

const ExecutiveSummary = () => {
  const { state, actions } = useApp();
  const data = state.businessPlan.executiveSummary;

  const handleFieldChange = (field, value) => {
    actions.updateBusinessPlan('executiveSummary', { [field]: value });
  };

  // Boston restaurant market context
  const bostonContext = {
    avgStartupCost: 485000, // Average restaurant startup cost in Boston
    avgRevPerSeat: 75000,   // Average annual revenue per seat
    competitorDensity: 2.1, // Restaurants per 1000 residents
    avgRent: 45,           // Per sq ft annually
    marketSize: 1.2,       // Billion dollar market
  };

  return (
    <div className="animate-fade-in">
      <SectionCard 
        title="Executive Summary - Boston Restaurant" 
        description="Provide a high-level overview of your Boston restaurant concept, leveraging local market insights and opportunities."
        color="blue"
      >
        {/* Boston Market Insights */}
        <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Boston Restaurant Market Context
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-white p-3 rounded border">
              <div className="font-semibold text-blue-700">Market Size</div>
              <div className="text-lg font-bold">${bostonContext.marketSize}B</div>
              <div className="text-gray-600">Annual revenue</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="font-semibold text-blue-700">Avg Startup</div>
              <div className="text-lg font-bold">${(bostonContext.avgStartupCost / 1000).toFixed(0)}K</div>
              <div className="text-gray-600">Initial investment</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="font-semibold text-blue-700">Competition</div>
              <div className="text-lg font-bold">{bostonContext.competitorDensity}</div>
              <div className="text-gray-600">Restaurants/1K residents</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="font-semibold text-blue-700">Revenue/Seat</div>
              <div className="text-lg font-bold">${(bostonContext.avgRevPerSeat / 1000).toFixed(0)}K</div>
              <div className="text-gray-600">Annual potential</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <FormField
            label="Restaurant Name"
            type="text"
            value={data.businessName}
            onChange={(value) => handleFieldChange('businessName', value)}
            placeholder="Boston Bites Cafe"
            required
          />
          
          <FormField
            label="Restaurant Type"
            type="select"
            value={data.businessType}
            onChange={(value) => handleFieldChange('businessType', value)}
            options={[
              { value: 'fine-dining', label: 'Fine Dining' },
              { value: 'casual-dining', label: 'Casual Dining' },
              { value: 'fast-casual', label: 'Fast Casual' },
              { value: 'quick-service', label: 'Quick Service/Fast Food' },
              { value: 'cafe', label: 'Cafe/Coffee Shop' },
              { value: 'bar-grill', label: 'Bar & Grill' },
              { value: 'food-truck', label: 'Food Truck' },
              { value: 'catering', label: 'Catering Service' },
              { value: 'bakery', label: 'Bakery/Pastry Shop' },
              { value: 'ethnic', label: 'Ethnic Cuisine' },
              { value: 'other', label: 'Other' }
            ]}
          />
          
          <FormField
            label="Boston Location/Neighborhood"
            type="select"
            value={data.location}
            onChange={(value) => handleFieldChange('location', value)}
            options={[
              { value: '', label: 'Select Boston Area...' },
              { value: 'back-bay', label: 'Back Bay' },
              { value: 'beacon-hill', label: 'Beacon Hill' },
              { value: 'north-end', label: 'North End' },
              { value: 'south-end', label: 'South End' },
              { value: 'downtown', label: 'Downtown/Financial District' },
              { value: 'cambridge', label: 'Cambridge' },
              { value: 'somerville', label: 'Somerville' },
              { value: 'fenway', label: 'Fenway/Kenmore' },
              { value: 'seaport', label: 'Seaport District' },
              { value: 'faneuil-hall', label: 'Faneuil Hall/Quincy Market' },
              { value: 'newbury-street', label: 'Newbury Street' },
              { value: 'harvard-square', label: 'Harvard Square' },
              { value: 'davis-square', label: 'Davis Square' },
              { value: 'jamaica-plain', label: 'Jamaica Plain' },
              { value: 'charlestown', label: 'Charlestown' },
              { value: 'southie', label: 'South Boston' },
              { value: 'other', label: 'Other Boston Area' }
            ]}
          />
          
          <FormField
            label="Funding Request"
            type="text"
            value={data.fundingRequest}
            onChange={(value) => handleFieldChange('fundingRequest', value)}
            placeholder={`$${(bostonContext.avgStartupCost / 1000).toFixed(0)},000 (Boston avg)`}
          />
        </div>

        {/* Boston-Specific Guidance */}
        <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
            <Building className="w-4 h-4 mr-2" />
            Boston Restaurant Considerations
          </h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• <strong>Licensing:</strong> Boston requires food service license, liquor license (if applicable), and entertainment license</li>
            <li>• <strong>Health Dept:</strong> Boston Public Health Commission inspections and certification required</li>
            <li>• <strong>Zoning:</strong> Check Boston zoning laws for restaurant use in your chosen neighborhood</li>
            <li>• <strong>Labor:</strong> Massachusetts minimum wage is $15/hour (higher than federal)</li>
            <li>• <strong>Seasonality:</strong> Consider tourist seasons, college calendar, and winter impact on foot traffic</li>
            <li>• <strong>Competition:</strong> High restaurant density requires strong differentiation strategy</li>
          </ul>
        </div>
        
        <div className="space-y-6">
          <FormField
            label="Mission Statement"
            type="textarea"
            value={data.missionStatement}
            onChange={(value) => handleFieldChange('missionStatement', value)}
            placeholder="To serve authentic, locally-sourced cuisine that celebrates Boston's rich culinary heritage while providing exceptional dining experiences in the heart of [neighborhood]."
            rows={3}
          />
          
          <FormField
            label="Key Success Factors"
            type="textarea"
            value={data.keySuccessFactors}
            onChange={(value) => handleFieldChange('keySuccessFactors', value)}
            placeholder="• Prime Boston location with high foot traffic
• Experienced culinary team with local market knowledge  
• Strong relationships with Boston-area suppliers
• Differentiated menu concept for competitive Boston market
• Comprehensive marketing strategy targeting locals and tourists"
            rows={4}
          />
          
          <FormField
            label="Financial Summary"
            type="textarea"
            value={data.financialSummary}
            onChange={(value) => handleFieldChange('financialSummary', value)}
            placeholder={`• Projected Year 1 Revenue: $650,000
• Target Gross Margin: 65-70%
• Break-even Timeline: 18-24 months
• Initial Investment: $${(bostonContext.avgStartupCost / 1000).toFixed(0)},000
• Projected ROI: 15-20% by Year 3`}
            rows={4}
          />

          {/* Boston Market Opportunity */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-3 flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
              Boston Market Opportunity
            </h4>
            <div className="text-sm text-green-700 space-y-2">
              <p><strong>Growing Food Scene:</strong> Boston's restaurant industry continues to expand with increasing tourism and local dining culture.</p>
              <p><strong>Educated Demographics:</strong> High concentration of colleges and universities creates diverse, sophisticated customer base.</p>
              <p><strong>Tourism Impact:</strong> 22+ million annual visitors provide significant revenue opportunities.</p>
              <p><strong>Local Support:</strong> Strong "eat local" movement and community support for neighborhood businesses.</p>
            </div>
          </div>
        </div>

        {/* Quick Stats Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-100 p-4 rounded-lg text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <div className="text-sm text-blue-700 font-medium">Target Market</div>
            <div className="text-xs text-blue-600 mt-1">Local professionals, tourists, students</div>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg text-center">
            <Building className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <div className="text-sm text-purple-700 font-medium">Location Strategy</div>
            <div className="text-xs text-purple-600 mt-1">High-traffic Boston neighborhood</div>
          </div>
          <div className="bg-green-100 p-4 rounded-lg text-center">
            <DollarSign className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <div className="text-sm text-green-700 font-medium">Revenue Model</div>
            <div className="text-xs text-green-600 mt-1">Dine-in, takeout, catering, delivery</div>
          </div>
        </div>

        {/* AI Assistant */}
        <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">AI Writing Assistant</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Let AI help you write a compelling executive summary. Provide your restaurant concept details and AI will generate professional content.
          </p>
          <AIAssistant
            context={{
              concept: data.restaurantConcept,
              location: data.location,
              targetMarket: data.targetMarket,
              uniqueValue: data.uniqueValueProposition,
              financialHighlights: data.financialHighlights
            }}
            section="executiveSummary"
            placeholder="Ask: 'Write an executive summary for my restaurant' or 'Improve my executive summary'..."
            onGenerate={(generatedContent) => {
              // Parse and apply generated content
              if (window.confirm('Apply AI-generated executive summary? You can edit it after.')) {
                // Try to extract key sections from AI response
                const sections = generatedContent.split(/\n\n/);
                actions.updateBusinessPlan('executiveSummary', {
                  executiveSummary: generatedContent,
                  lastUpdated: new Date().toISOString()
                });
              }
            }}
          />
        </div>
      </SectionCard>
    </div>
  );
};

export default ExecutiveSummary; 