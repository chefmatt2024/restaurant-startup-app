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
  Map
} from 'lucide-react';

/** Phase: pre-opening/plan only, operations only, or both. See TAB_SECTIONS_CHART.md. */
export const TAB_PHASES = {
  PRE_OPENING: 'preOpening',
  OPERATIONS: 'operations',
  BOTH: 'both',
};

/** Section labels for sidebar grouping (order: pre-opening → operations → both). */
export const TAB_SECTION_LABELS = {
  [TAB_PHASES.PRE_OPENING]: 'Pre-opening & Plan',
  [TAB_PHASES.OPERATIONS]: 'Operations',
  [TAB_PHASES.BOTH]: 'Both (plan & operations)',
};

// Order: Pre-opening block first, then Plan & Operations (both), then Operations (post-open). See TAB_SECTIONS_CHART.md.
export const DETAIL_VIEW_TABS = [
  { id: 'startup-and-opening', label: 'Startup & Opening Plan', icon: Compass, color: 'blue', description: 'Journey & local roadmap', phase: TAB_PHASES.PRE_OPENING },
  { id: 'process-map', label: 'Process map', icon: Map, color: 'slate', description: 'Start to opening: full journey', phase: TAB_PHASES.PRE_OPENING },
  { id: 'concept-pitch', label: 'Concept & Pitch', icon: Lightbulb, color: 'yellow', description: 'Idea, elevator pitch, exec summary', phase: TAB_PHASES.PRE_OPENING },
  { id: 'market-competition', label: 'Market & Competition', icon: BarChart3, color: 'green', description: 'Market & competitive analysis', phase: TAB_PHASES.PRE_OPENING },
  { id: 'offer-marketing', label: 'Offer & Marketing', icon: Target, color: 'purple', description: 'Products, services, marketing', phase: TAB_PHASES.PRE_OPENING },
  { id: 'timeline', label: 'Project Timeline', icon: Calendar, color: 'indigo', description: 'Milestones & dates to open', phase: TAB_PHASES.PRE_OPENING },
  { id: 'branding', label: 'Branding Planner', icon: Palette, color: 'purple', description: 'Brand identity & materials', phase: TAB_PHASES.PRE_OPENING },
  { id: 'financials', label: 'Financial Projections', icon: DollarSign, color: 'green', description: 'Revenue, costs, P&L & funding', phase: TAB_PHASES.BOTH },
  { id: 'team-cap-table', label: 'Team & Cap Table', icon: Users, color: 'indigo', description: 'Staffing, management team & cap table', phase: TAB_PHASES.BOTH },
  { id: 'operations', label: 'Operations', icon: Building, color: 'purple', description: 'Facility, staffing & run of house', phase: TAB_PHASES.BOTH },
  { id: 'vendors-expenses', label: 'Vendors & Expenses', icon: Truck, color: 'orange', description: 'Vendors, expenses & ledger', phase: TAB_PHASES.BOTH },
  { id: 'equipment-menu', label: 'Equipment & Menu', icon: Utensils, color: 'orange', description: 'Equipment planning & menu builder', phase: TAB_PHASES.BOTH },
  { id: 'compliance', label: 'Compliance', icon: Shield, color: 'red', description: 'Documents, licenses, certifications', phase: TAB_PHASES.BOTH },
  { id: 'documents', label: 'Documents', icon: FileCheck, color: 'blue', description: 'Onboarding doc workflow', phase: TAB_PHASES.BOTH },
  { id: 'import', label: 'Import Document', icon: FileText, color: 'blue', description: 'Upload & extract data', phase: TAB_PHASES.BOTH },
  { id: 'reports', label: 'Reports', icon: BarChart3, color: 'green', description: 'P&L, variance, progress', phase: TAB_PHASES.OPERATIONS },
  { id: 'sops', label: 'SOPs', icon: ClipboardList, color: 'indigo', description: 'Standard operating procedures', phase: TAB_PHASES.OPERATIONS },
  { id: 'business-analytics', label: 'Business Analytics', icon: BarChart3, color: 'blue', description: 'Metrics & dashboards', phase: TAB_PHASES.OPERATIONS }
];

const SECTION_ORDER = [TAB_PHASES.PRE_OPENING, TAB_PHASES.BOTH, TAB_PHASES.OPERATIONS];

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
  const tabsBySection = useMemo(() => {
    const bySection = { [TAB_PHASES.PRE_OPENING]: [], [TAB_PHASES.OPERATIONS]: [], [TAB_PHASES.BOTH]: [] };
    tabs.forEach((tab) => {
      const phase = tab.phase || TAB_PHASES.BOTH;
      if (bySection[phase]) bySection[phase].push(tab);
      else bySection[TAB_PHASES.BOTH].push(tab);
    });
    return bySection;
  }, [tabs]);
  const navRef = useRef(null);
  const activeRef = useRef(null);

  // Scroll active tab into view when it changes (for vertical sidebar)
  useEffect(() => {
    if (activeRef.current && navRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [state.activeTab]);

  const isSidebar = variant === 'sidebar';

  const renderTabButton = (tab) => {
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
  };

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
        {isSidebar ? (
          <div className="flex flex-col gap-4">
            {SECTION_ORDER.map((phase) => {
              const sectionTabs = tabsBySection[phase] || [];
              if (sectionTabs.length === 0) return null;
              const label = TAB_SECTION_LABELS[phase];
              return (
                <div key={phase}>
                  <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 mb-1">
                    {label}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {sectionTabs.map(renderTabButton)}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-wrap items-end justify-end gap-y-2 gap-x-1 overflow-x-auto pb-2 pt-4">
            {tabs.map(renderTabButton)}
          </div>
        )}
      </div>
    </nav>
  );
};

export default TabNavigation; 