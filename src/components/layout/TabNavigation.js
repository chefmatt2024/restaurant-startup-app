import React, { useRef, useEffect, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import { getEnabledFeatureIds } from '../../config/featurePresets';
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
  CheckCircle,
  ClipboardList,
  FileCheck,
  Map,
  BookOpen
} from 'lucide-react';

// Export for breadcrumb/section title in Dashboard. Order = pre-opening journey (matches PROGRESS_SECTION_ORDER).
export const DETAIL_VIEW_TABS = [
    { id: 'startup-and-opening', label: 'Startup & Opening Plan', icon: Compass, color: 'blue', description: 'Journey & local roadmap' },
    { id: 'process-map', label: 'Process map', icon: Map, color: 'slate', description: 'Start to opening: full journey' },
    { id: 'concept-pitch', label: 'Concept & Pitch', icon: Lightbulb, color: 'yellow', description: 'Idea, elevator pitch, exec summary' },
    { id: 'market-competition', label: 'Market & Competition', icon: BarChart3, color: 'green', description: 'Market & competitive analysis' },
    { id: 'offer-marketing', label: 'Offer & Marketing', icon: Target, color: 'purple', description: 'Products, services, marketing' },
    { id: 'financials', label: 'Financial Projections', icon: DollarSign, color: 'green' },
    { id: 'team-cap-table', label: 'Team & Cap Table', icon: Users, color: 'indigo', description: 'Staffing, management team & cap table' },
    { id: 'operations', label: 'Operations', icon: Building, color: 'purple' },
    { id: 'timeline', label: 'Project Timeline', icon: Calendar, color: 'indigo' },
    { id: 'vendors', label: 'Vendor Management', icon: Truck, color: 'orange' },
    { id: 'equipment-menu', label: 'Equipment & Menu', icon: Utensils, color: 'orange', description: 'Equipment planning & menu builder' },
    { id: 'branding', label: 'Branding Planner', icon: Palette, color: 'purple', description: 'Brand identity & materials' },
    { id: 'compliance', label: 'Compliance', icon: Shield, color: 'red', description: 'Documents, licenses, certifications' },
    { id: 'documents', label: 'Documents', icon: FileCheck, color: 'blue', description: 'Onboarding doc workflow' },
    { id: 'reports', label: 'Reports', icon: BarChart3, color: 'green', description: 'P&L, variance, progress' },
    { id: 'ledger', label: 'Ledger', icon: BookOpen, color: 'amber', description: 'Expenses & invoices' },
    { id: 'sops', label: 'SOPs', icon: ClipboardList, color: 'indigo', description: 'Standard operating procedures' },
    { id: 'import', label: 'Import Document', icon: FileText, color: 'blue', description: 'Upload & extract data' },
    { id: 'business-analytics', label: 'Business Analytics', icon: BarChart3, color: 'blue' }
];

const TabNavigation = ({ sectionStatus = {}, variant = 'sidebar' }) => {
  const { state, actions } = useApp();
  const currentDraft = state.drafts?.find((d) => d.id === state.currentDraftId);
  const enabledIds = useMemo(
    () => getEnabledFeatureIds(currentDraft?.enabledFeatures),
    [currentDraft?.enabledFeatures]
  );
  const tabs = useMemo(
    () =>
      enabledIds === null
        ? DETAIL_VIEW_TABS
        : DETAIL_VIEW_TABS.filter((tab) => enabledIds.includes(tab.id)),
    [enabledIds]
  );
  const navRef = useRef(null);
  const activeRef = useRef(null);

  // Scroll active tab into view when it changes (for vertical sidebar)
  useEffect(() => {
    if (activeRef.current && navRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [state.activeTab]);

  const isSidebar = variant === 'sidebar';

  return (
    <nav
      ref={navRef}
      className={
        isSidebar
          ? 'w-56 flex-shrink-0 border-l border-gray-200 bg-gray-50 overflow-y-auto'
          : 'bg-gray-50 border-b border-gray-200'
      }
      aria-label="Section navigation"
    >
      <div className={isSidebar ? 'py-4 px-2 space-y-0.5 sticky top-0' : 'px-6 flex justify-end'}>
        <div className={isSidebar ? 'flex flex-col gap-0.5' : 'flex flex-wrap items-end justify-end gap-y-2 gap-x-1 overflow-x-auto pb-2 pt-4'}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = state.activeTab === tab.id;
            const isCompleted = sectionStatus[tab.id]?.completed;
            return (
              <button
                key={tab.id}
                ref={isActive ? activeRef : null}
                onClick={() => actions.setActiveTab(tab.id)}
                className={`
                  w-full flex items-center gap-2 rounded-lg font-medium text-sm transition-all duration-200 text-left
                  ${isSidebar ? 'px-3 py-2.5' : 'px-4 py-3 space-x-2'}
                  ${isSidebar ? (isActive ? 'bg-white text-blue-600 border-l-4 border-blue-600 shadow-sm' : 'border-l-4 border-transparent text-gray-600 hover:text-gray-900 hover:bg-white/50') : ''}
                  ${!isSidebar && isActive ? 'bg-white text-blue-600 border-b-2 border-blue-600 shadow-sm ring-2 ring-blue-200 ring-inset' : ''}
                  ${!isSidebar && !isActive ? 'text-gray-600 hover:text-gray-900 hover:bg-white/50' : ''}
                `}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate flex items-center gap-1.5">
                    <span className="truncate">{tab.label}</span>
                    {isCompleted && (
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" aria-label="Completed" />
                    )}
                  </div>
                  {isSidebar && tab.description && (
                    <div className="text-xs text-gray-500 truncate">{tab.description}</div>
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