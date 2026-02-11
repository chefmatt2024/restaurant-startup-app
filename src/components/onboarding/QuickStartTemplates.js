import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { RESTAURANT_TEMPLATES } from '../../utils/restaurantTemplates';
import { Store, Coffee, Utensils, Truck, Building2, Sparkles, X, CheckCircle } from 'lucide-react';

const QuickStartTemplates = ({ isOpen, onClose, onSelect }) => {
  const { actions } = useApp();
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const templateIcons = {
    italian: <Utensils className="w-8 h-8" />,
    'fast-casual': <Store className="w-8 h-8" />,
    bbq: <Utensils className="w-8 h-8" />,
    'fine-dining': <Building2 className="w-8 h-8" />,
    'food-truck': <Truck className="w-8 h-8" />,
    cafe: <Coffee className="w-8 h-8" />
  };

  const handleSelectTemplate = (templateKey) => {
    setSelectedTemplate(templateKey);
  };

  const handleApplyTemplate = () => {
    if (!selectedTemplate) return;
    
    const template = RESTAURANT_TEMPLATES[selectedTemplate];
    if (!template) return;

    // Apply template data to current draft
    if (template.financialData) {
      Object.keys(template.financialData).forEach(section => {
        actions.updateFinancialData(section, template.financialData[section]);
      });
    }

    if (template.businessPlan) {
      Object.keys(template.businessPlan).forEach(section => {
        actions.updateBusinessPlan(section, template.businessPlan[section]);
      });
    }

    // Track template usage
    if (window.gtag) {
      window.gtag('event', 'template_selected', {
        event_category: 'Onboarding',
        event_label: template.name,
        value: 1
      });
    }

    onSelect && onSelect(selectedTemplate);
    onClose();
  };

  if (!isOpen) return null;

  const templates = Object.entries(RESTAURANT_TEMPLATES).map(([key, template]) => ({
    key,
    ...template
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-xl text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Quick Start Templates</h2>
                <p className="text-blue-100 text-sm">Choose a template to get started quickly</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Select a restaurant type template to pre-fill your business plan with industry-standard data. 
            You can customize everything after applying the template.
          </p>

          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {templates.map((template) => {
              const isSelected = selectedTemplate === template.key;
              return (
                <button
                  key={template.key}
                  onClick={() => handleSelectTemplate(template.key)}
                  className={`p-6 rounded-lg border-2 transition-all text-left ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-3 rounded-lg ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {templateIcons[template.key] || <Store className="w-6 h-6" />}
                    </div>
                    {isSelected && (
                      <CheckCircle className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </button>
              );
            })}
          </div>

          {selectedTemplate && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-900 mb-2">
                {RESTAURANT_TEMPLATES[selectedTemplate].name} Template Selected
              </h4>
              <p className="text-sm text-blue-800">
                This template will pre-fill your financial projections, business plan sections, and operational data 
                with industry-standard values for this restaurant type. You can modify everything after applying.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 rounded-b-xl">
          <div className="flex justify-between items-center">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyTemplate}
              disabled={!selectedTemplate}
              className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                selectedTemplate
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span>Apply Template</span>
              <CheckCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickStartTemplates;


