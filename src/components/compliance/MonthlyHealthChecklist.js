import React, { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import SectionCard from '../ui/SectionCard';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Utensils, 
  Thermometer, 
  Shield, 
  Droplets, 
  Trash2, 
  Bug, 
  Lightbulb,
  Calendar,
  FileText,
  Clock
} from 'lucide-react';

const MonthlyHealthChecklist = () => {
  const { state, actions } = useApp();
  const [currentMonth, setCurrentMonth] = useState(new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
  const [completedItems, setCompletedItems] = useState({});

  // Health code categories based on Boston Mayor's Food Court violation codes
  const healthCodeCategories = [
    {
      id: 'food-protection-management',
      title: 'Food Protection Management',
      icon: Shield,
      color: 'red',
      critical: true,
      items: [
        {
          id: 'pic-assigned',
          code: 'M-1 (590.003(A))',
          description: 'Person In Charge (PIC) Assigned',
          type: 'Risk Factor Critical',
          frequency: 'Daily',
          checklist: [
            'Ensure PIC is designated and present during all operating hours',
            'Verify PIC has proper ServSafe certification',
            'Confirm PIC understands their responsibilities',
            'Document PIC assignments in staff schedule'
          ]
        },
        {
          id: 'pic-knowledgeable',
          code: 'M-2 (590.003(B))',
          description: 'Person In Charge Knowledgeable',
          type: 'Risk Factor Critical',
          frequency: 'Daily',
          checklist: [
            'PIC demonstrates knowledge of food safety principles',
            'PIC can identify critical control points',
            'PIC knows proper temperature requirements',
            'PIC understands HACCP procedures'
          ]
        },
        {
          id: 'pic-performing-duties',
          code: 'M-3 (2-103.11)',
          description: 'Person In Charge Performing Duties',
          type: 'Risk Factor Critical',
          frequency: 'Daily',
          checklist: [
            'PIC actively monitors food safety practices',
            'PIC corrects violations immediately',
            'PIC ensures proper handwashing procedures',
            'PIC monitors temperature controls'
          ]
        },
        {
          id: 'consumer-advisories',
          code: 'M-7 (3-603.11)',
          description: 'Consumer Advisories',
          type: 'Risk Factor Critical',
          frequency: 'Daily',
          checklist: [
            'Menu includes consumer advisories for undercooked items',
            'Advisories are clearly visible to customers',
            'Staff can explain advisories to customers',
            'Advisories comply with local requirements'
          ]
        }
      ]
    },
    {
      id: 'food-safety',
      title: 'Food Safety & Sources',
      icon: Utensils,
      color: 'orange',
      critical: true,
      items: [
        {
          id: 'approved-source',
          code: '1-1 (590.004A/B)',
          description: 'Approved Source',
          type: 'Risk Factor Critical',
          frequency: 'Daily',
          checklist: [
            'All food from approved suppliers only',
            'Shellfish have proper identification tags',
            'No home-prepared foods served',
            'Supplier certificates are current and valid'
          ]
        },
        {
          id: 'no-spoilage',
          code: '1-2 (3-101.11)',
          description: 'No Spoilage',
          type: 'Risk Factor Critical',
          frequency: 'Daily',
          checklist: [
            'Check all food for signs of spoilage',
            'Remove any spoiled or contaminated food',
            'Verify expiration dates on all products',
            'Properly dispose of spoiled items'
          ]
        },
        {
          id: 'receiving-sound-condition',
          code: '1-3 (3-202.11-.15)',
          description: 'Receiving/Sound Condition',
          type: 'Risk Factor Critical',
          frequency: 'Daily',
          checklist: [
            'Inspect all deliveries upon arrival',
            'Check temperature of refrigerated/frozen items',
            'Verify packaging is intact and clean',
            'Reject any damaged or contaminated products'
          ]
        },
        {
          id: 'shellstock-id',
          code: '1-5 (3-202.18)',
          description: 'Shellstock ID',
          type: 'Critical',
          frequency: 'Daily',
          checklist: [
            'Shellfish tags are properly attached',
            'Tags are kept for 90 days from sale',
            'Tags show harvest date and location',
            'Shellfish are from approved waters'
          ]
        }
      ]
    },
    {
      id: 'temperature-controls',
      title: 'Temperature Controls',
      icon: Thermometer,
      color: 'blue',
      critical: true,
      items: [
        {
          id: 'cooking-temperatures',
          code: '3-1 (3-401.11-.12)',
          description: 'Cooking Temperatures',
          type: 'Risk Factor Critical',
          frequency: 'Daily',
          checklist: [
            'Poultry: 165°F for 15 seconds',
            'Ground meat: 155°F for 15 seconds',
            'Pork, beef, veal, lamb: 145°F for 15 seconds',
            'Fish: 145°F for 15 seconds',
            'Use calibrated thermometer for all checks'
          ]
        },
        {
          id: 'hot-cold-holding',
          code: '3-4 (3-501.16)',
          description: 'Hot and Cold Holding',
          type: 'Risk Factor Critical',
          frequency: 'Every 2 hours',
          checklist: [
            'Hot foods held at 140°F or above',
            'Cold foods held at 41°F or below',
            'Check temperatures every 2 hours',
            'Document all temperature checks',
            'Discard food held at unsafe temperatures'
          ]
        },
        {
          id: 'cooling-procedures',
          code: '3-3 (3-501.14)',
          description: 'Cooling',
          type: 'Risk Factor Critical',
          frequency: 'Daily',
          checklist: [
            'Cool from 135°F to 70°F within 2 hours',
            'Cool from 70°F to 41°F within 4 hours',
            'Use shallow pans for cooling',
            'Stir food during cooling process',
            'Use ice baths for rapid cooling'
          ]
        },
        {
          id: 'reheating',
          code: '3-2 (3-403.11)',
          description: 'Reheating',
          type: 'Risk Factor Critical',
          frequency: 'As needed',
          checklist: [
            'Reheat to 165°F within 2 hours',
            'Use calibrated thermometer',
            'Reheat only once',
            'Discard if not properly reheated'
          ]
        }
      ]
    },
    {
      id: 'food-protection',
      title: 'Food Protection from Contamination',
      icon: Shield,
      color: 'green',
      critical: true,
      items: [
        {
          id: 'no-reservice',
          code: '7-1 (3-306.14)',
          description: 'No Reservice of Potentially Hazardous Food',
          type: 'Critical',
          frequency: 'Daily',
          checklist: [
            'No reservice of unwrapped foods',
            'No reservice of potentially hazardous foods',
            'Single-use items used only once',
            'Proper portioning to prevent reservice'
          ]
        },
        {
          id: 'separation-segregation',
          code: '8-2 (3-302.11)',
          description: 'Separation, Segregation, No Cross Contamination',
          type: 'Risk Factor Critical',
          frequency: 'Daily',
          checklist: [
            'Raw and cooked foods properly separated',
            'Different cutting boards for different foods',
            'Proper storage order in refrigerators',
            'Clean and sanitize between different foods'
          ]
        },
        {
          id: 'handling-food',
          code: '9-1 (3-301.11(C))',
          description: 'Handling of Food and Ice Minimized',
          type: 'Critical',
          frequency: 'Daily',
          checklist: [
            'Minimize bare hand contact with ready-to-eat foods',
            'Use utensils, gloves, or deli tissue',
            'Proper handwashing before food handling',
            'No bare hand contact with ice'
          ]
        }
      ]
    },
    {
      id: 'equipment-utensils',
      title: 'Equipment and Utensils',
      icon: Utensils,
      color: 'purple',
      critical: false,
      items: [
        {
          id: 'food-contact-surfaces',
          code: '14-1 (4-202.11)',
          description: 'Food Contact Surfaces Designed, Maintained',
          type: 'Non-Critical',
          frequency: 'Daily',
          checklist: [
            'Cutting boards smooth and easily cleanable',
            'No deep knife marks or cracks',
            'Surfaces properly maintained',
            'Replace when no longer cleanable'
          ]
        },
        {
          id: 'dishwashing-facilities',
          code: '16-1 (4-501.11/.15)',
          description: 'Dishwashing Facilities Designed, Maintained',
          type: 'Non-Critical',
          frequency: 'Daily',
          checklist: [
            'Dishwasher operating properly',
            'Three-compartment sink available',
            'Proper sanitizer concentration',
            'Test strips available for sanitizer'
          ]
        },
        {
          id: 'food-contact-clean',
          code: '22-1 (4-602.11)',
          description: 'Food Contact Surfaces Clean',
          type: 'Critical',
          frequency: 'Daily',
          checklist: [
            'All food contact surfaces clean',
            'No encrusted food on tableware',
            'Proper cleaning and sanitizing procedures',
            'Surfaces sanitized after cleaning'
          ]
        }
      ]
    },
    {
      id: 'water-sewage',
      title: 'Water and Sewage',
      icon: Droplets,
      color: 'cyan',
      critical: true,
      items: [
        {
          id: 'water-safe',
          code: '27-1 (5-101.11)',
          description: 'Water Safe, Approved System',
          type: 'Risk Factor Critical',
          frequency: 'Daily',
          checklist: [
            'Water from approved public system',
            'No cross-connections',
            'Water pressure adequate',
            'Hot water available at all times'
          ]
        },
        {
          id: 'sewage-disposal',
          code: '28-1 (5-402.13)',
          description: 'Sewage and Waste Water Disposal',
          type: 'Critical',
          frequency: 'Daily',
          checklist: [
            'No sewage backup',
            'Proper waste water disposal',
            'Drains functioning properly',
            'No standing water in facility'
          ]
        }
      ]
    },
    {
      id: 'handwashing',
      title: 'Handwashing Facilities',
      icon: Droplets,
      color: 'indigo',
      critical: true,
      items: [
        {
          id: 'handwash-convenient',
          code: '31-1 (5-503.11)',
          description: 'Number, Convenient',
          type: 'Risk Factor Critical',
          frequency: 'Daily',
          checklist: [
            'Adequate number of handwash sinks',
            'Sinks conveniently located',
            'Sinks accessible to all work areas',
            'Sinks not blocked or used for other purposes'
          ]
        },
        {
          id: 'handwash-supplies',
          code: '32-3 (6-301.11-02.11)',
          description: 'Hand Cleanser, Hand Drying, Toilet Tissue',
          type: 'Non-Critical',
          frequency: 'Daily',
          checklist: [
            'Soap available at all handwash sinks',
            'Paper towels or air dryer available',
            'Toilet tissue in restrooms',
            'Handwashing signs posted'
          ]
        }
      ]
    },
    {
      id: 'refuse-pest',
      title: 'Refuse and Pest Control',
      icon: Trash2,
      color: 'gray',
      critical: false,
      items: [
        {
          id: 'refuse-adequate',
          code: '33-1 (5-501.13-.17)',
          description: 'Adequate Number, Frequency, Covered, Clean',
          type: 'Non-Critical',
          frequency: 'Daily',
          checklist: [
            'Adequate number of refuse containers',
            'Containers have tight-fitting covers',
            'Containers cleaned regularly',
            'Refuse removed frequently'
          ]
        },
        {
          id: 'pest-control',
          code: '35-1 (6-501.111/.115)',
          description: 'Insects, Rodents, Animals, Outer Openings',
          type: 'Critical',
          frequency: 'Daily',
          checklist: [
            'No evidence of rodents or insects',
            'Outer openings properly sealed',
            'Pest control measures in place',
            'Regular pest control inspections'
          ]
        }
      ]
    }
  ];

  const handleItemToggle = (categoryId, itemId, checklistIndex) => {
    const key = `${categoryId}-${itemId}-${checklistIndex}`;
    setCompletedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const stats = useMemo(() => {
    const totalItems = healthCodeCategories.reduce((total, category) => 
      total + category.items.reduce((catTotal, item) => catTotal + item.checklist.length, 0), 0
    );
    const completedCount = Object.values(completedItems).filter(Boolean).length;
    return { completed: completedCount, total: totalItems, percentage: totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0 };
  }, [completedItems]);

  return (
    <SectionCard
      title="Monthly Health Code Checklist"
      description="Based on Boston Mayor's Food Court violation codes - complete monthly to maintain compliance"
    >
      <div className="space-y-6">
        {/* Header with stats */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-green-800">{currentMonth} Health Code Checklist</h3>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-800">{stats.percentage}%</div>
              <div className="text-sm text-green-600">{stats.completed} of {stats.total} items completed</div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${stats.percentage}%` }}
            ></div>
          </div>
        </div>

        {/* Categories */}
        {healthCodeCategories.map((category) => {
          const IconComponent = category.icon;
          const categoryStats = category.items.reduce((acc, item) => {
            const itemCompleted = item.checklist.filter((_, index) => 
              completedItems[`${category.id}-${item.id}-${index}`]
            ).length;
            return {
              completed: acc.completed + itemCompleted,
              total: acc.total + item.checklist.length
            };
          }, { completed: 0, total: 0 });

          return (
            <div key={category.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    category.critical ? 'bg-red-100' : 'bg-gray-100'
                  }`}>
                    <IconComponent className={`w-5 h-5 ${
                      category.critical ? 'text-red-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{category.title}</h4>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        category.critical 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {category.critical ? 'Critical' : 'Non-Critical'}
                      </span>
                      <span className="text-sm text-gray-500">
                        {categoryStats.completed}/{categoryStats.total} completed
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">
                    {Math.round((categoryStats.completed / categoryStats.total) * 100)}%
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {category.items.map((item) => (
                  <div key={item.id} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h5 className="font-medium text-gray-900">{item.description}</h5>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500">{item.code}</span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            item.type.includes('Critical') 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.type}
                          </span>
                          <span className="text-xs text-gray-500">{item.frequency}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {item.checklist.map((checklistItem, index) => {
                        const isCompleted = completedItems[`${category.id}-${item.id}-${index}`];
                        return (
                          <label key={index} className="flex items-start space-x-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={isCompleted}
                              onChange={() => handleItemToggle(category.id, item.id, index)}
                              className="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            />
                            <span className={`text-sm flex-1 group-hover:text-gray-900 transition-colors ${
                              isCompleted ? 'text-gray-500 line-through' : 'text-gray-700'
                            }`}>
                              {checklistItem}
                            </span>
                            {isCompleted && <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Footer with resources */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-2">Resources & Contact Information:</p>
              <ul className="space-y-1">
                <li>• <strong>Boston Inspectional Services:</strong> 617-635-5300</li>
                <li>• <strong>Email:</strong> isd@boston.gov</li>
                <li>• <strong>Mayor's Food Court:</strong> <a href="https://www.boston.gov/health-and-human-services/mayors-food-court" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View violation data and inspection results</a></li>
                <li>• Complete this checklist monthly to maintain compliance and avoid violations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
};

export default MonthlyHealthChecklist;
