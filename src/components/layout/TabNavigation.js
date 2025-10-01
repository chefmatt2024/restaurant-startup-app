import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { 
  FileText, 
  Users, 
  Building,
  Shield,
  Lightbulb,
  Mic,
  BarChart3,
  Calendar,
  DollarSign,
  Target,
  Truck,
  Wrench,
  Compass,
  Utensils,
  Palette,
  CreditCard,
  Star,
  Settings
} from 'lucide-react';

const TabNavigation = () => {
  const { state, actions } = useApp();

  const tabs = [
    { id: 'startup-journey', label: 'Startup Journey', icon: Compass, color: 'blue', description: 'Complete process guide' },
    { id: 'opening-plan', label: 'Opening Plan', icon: Target, color: 'red', description: 'Boston restaurant roadmap' },
    { id: 'idea-formation', label: 'Idea Formation', icon: Lightbulb, color: 'yellow' },
    { id: 'elevator-pitch', label: 'Elevator Pitch', icon: Mic, color: 'green' },
    { id: 'executive-summary', label: 'Executive Summary', icon: FileText, color: 'blue' },
    { id: 'market-analysis', label: 'Market Analysis', icon: BarChart3, color: 'green' },

    { id: 'services', label: 'Products/Services', icon: Target, color: 'purple' },
    { id: 'marketing', label: 'Marketing', icon: Target, color: 'pink' },
    { id: 'operations', label: 'Operations', icon: Building, color: 'purple' },
    { id: 'management', label: 'Management', icon: Users, color: 'indigo' },
    { id: 'financials', label: 'Financial Projections', icon: DollarSign, color: 'green' },
    { id: 'business-analytics', label: 'Business Analytics', icon: BarChart3, color: 'blue' },
    { id: 'pricing', label: 'Pricing', icon: DollarSign, color: 'green' },
    { id: 'subscription', label: 'Subscription', icon: CreditCard, color: 'purple' },
    { id: 'subscription-demo', label: 'Subscription Demo', icon: Star, color: 'blue' },
    { id: 'branding-updater', label: 'Branding Tool', icon: Palette, color: 'purple' },
    { id: 'admin', label: 'Admin Dashboard', icon: Settings, color: 'gray', description: 'User & lead management' },
    { id: 'timeline', label: 'Project Timeline', icon: Calendar, color: 'indigo' },
    { id: 'vendors', label: 'Vendor Management', icon: Truck, color: 'orange' },
    { id: 'equipment-planning', label: 'Equipment Planning', icon: Wrench, color: 'purple' },
    { id: 'menu-builder', label: 'Menu Builder', icon: Utensils, color: 'orange', description: 'Menu design & pricing' },
    { id: 'branding', label: 'Branding Planner', icon: Palette, color: 'purple', description: 'Brand identity & materials' },
    { id: 'competitive-analysis', label: 'Competitive Analysis', icon: Target, color: 'blue', description: 'Market analysis & positioning' },
    {
      id: 'documents',
      label: 'Documents & Compliance',
      icon: Shield,
      color: 'red',
      description: 'Permits & licenses'
    }
  ];

  return (
    <nav className="bg-gray-50 border-b border-gray-200">
      <div className="px-6">
        <div className="flex space-x-2 overflow-x-auto pb-2 pt-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = state.activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => actions.setActiveTab(tab.id)}
                className={`
                  flex-shrink-0 flex items-center space-x-2 px-4 py-3 rounded-t-lg font-medium text-sm transition-all duration-200
                  ${isActive 
                    ? 'bg-white text-blue-600 border-b-2 border-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-medium">{tab.label}</div>
                  <div className="text-xs text-gray-500">{tab.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default TabNavigation; 