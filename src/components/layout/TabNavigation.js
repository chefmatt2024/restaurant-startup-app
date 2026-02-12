import React, { useRef, useEffect } from 'react';
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
  Rocket,
  Award,
  CheckCircle
} from 'lucide-react';

// Export for breadcrumb/section title in Dashboard
export const DETAIL_VIEW_TABS = [
    { id: 'startup-and-opening', label: 'Startup & Opening Plan', icon: Compass, color: 'blue', description: 'Journey & Boston roadmap' },
    { id: 'import', label: 'Import Document', icon: FileText, color: 'blue', description: 'Upload & extract data' },
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
    },
    {
      id: 'open-restaurant',
      label: 'Open Restaurant',
      icon: Rocket,
      color: 'purple',
      description: 'Document & license manager'
    },
    {
      id: 'certifications',
      label: 'Certifications',
      icon: Award,
      color: 'green',
      description: 'Staff certifications & training'
    }
];

const TabNavigation = ({ sectionStatus = {} }) => {
  const { state, actions } = useApp();
  const tabs = DETAIL_VIEW_TABS;
  const navRef = useRef(null);
  const activeRef = useRef(null);

  // Scroll active tab into view when it changes
  useEffect(() => {
    if (activeRef.current && navRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [state.activeTab]);

  return (
    <nav ref={navRef} className="bg-gray-50 border-b border-gray-200">
      <div className="px-6">
        <div className="flex flex-wrap items-end justify-end gap-y-2 overflow-x-auto pb-2 pt-4">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = state.activeTab === tab.id;
            const isCondensed = index < 1;
            const isCompleted = sectionStatus[tab.id]?.completed;
            return (
              <button
                key={tab.id}
                ref={isActive ? activeRef : null}
                onClick={() => actions.setActiveTab(tab.id)}
                className={`
                  flex-shrink-0 flex items-center space-x-1.5 rounded-t-lg font-medium text-sm transition-all duration-200
                  ${isCondensed ? 'px-3 py-2' : 'px-4 py-3 space-x-2'}
                  ${isActive
                    ? 'bg-white text-blue-600 border-b-2 border-blue-600 shadow-sm ring-2 ring-blue-200 ring-inset'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }
                `}
              >
                <Icon className={isCondensed ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
                <div className="text-left">
                  <div className="font-medium whitespace-nowrap flex items-center gap-1.5">
                    {tab.label}
                    {isCompleted && (
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" aria-label="Completed" />
                    )}
                  </div>
                  {!isCondensed && tab.description && (
                    <div className="text-xs text-gray-500">{tab.description}</div>
                  )}
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