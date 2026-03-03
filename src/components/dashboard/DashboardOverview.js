import React, { useMemo, useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { OPENING_PLAN_TOTAL_TASKS } from '../startup/OpeningPlan';
import QuickStartTemplates from '../onboarding/QuickStartTemplates';
import { getSectionStatus, PROGRESS_SECTION_ORDER } from '../../utils/sectionStatus';
import { getEnabledFeatureIds } from '../../config/featurePresets';
import { LOCATION_OPTIONS } from '../../config/areaContent';
import {
  CheckCircle,
  ArrowRight,
  ChevronRight,
  Compass,
  Lightbulb,
  BarChart3,
  Target,
  DollarSign,
  Users,
  Building,
  Calendar,
  Truck,
  Utensils,
  Palette,
  Shield
} from 'lucide-react';

const sectionMeta = {
  'startup-and-opening': { icon: Compass },
  'concept-pitch': { icon: Lightbulb },
  'market-competition': { icon: BarChart3 },
  'offer-marketing': { icon: Target },
  'financials': { icon: DollarSign },
  'team-cap-table': { icon: Users },
  'operations': { icon: Building },
  'timeline': { icon: Calendar },
  'vendors-expenses': { icon: Truck },
  'equipment-menu': { icon: Utensils },
  'branding': { icon: Palette },
  'compliance': { icon: Shield }
};

const DashboardOverview = ({ onSwitchToDetailed }) => {
  const { state, actions } = useApp();
  const [showTemplates, setShowTemplates] = useState(false);

  const sectionStatus = useMemo(() => {
    const currentDraft = state.drafts.find(draft => draft.id === state.currentDraftId);
    const enabledIds = getEnabledFeatureIds(currentDraft?.enabledFeatures);
    const base = getSectionStatus(currentDraft, state.openingPlanProgress?.completedTaskIds || []);
    const sections = {};
    PROGRESS_SECTION_ORDER.forEach(id => {
      if (enabledIds !== null && !enabledIds.includes(id)) return;
      if (base[id]) sections[id] = { ...base[id], icon: sectionMeta[id]?.icon };
    });
    return sections;
  }, [state.drafts, state.currentDraftId, state.openingPlanProgress?.completedTaskIds]);

  const progress = useMemo(() => {
    const sections = Object.values(sectionStatus);
    const completed = sections.filter(s => s.completed).length;
    const total = sections.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  }, [sectionStatus]);

  // For new users (< 40% complete), prioritize Licenses & Permits
  const nextTask = useMemo(() => {
    const isNewUser = progress.percentage < 40;
    const complianceNotDone = sectionStatus.compliance && !sectionStatus.compliance.completed;
    if (isNewUser && complianceNotDone) {
      return { id: 'compliance', ...sectionStatus.compliance, action: () => onSwitchToDetailed?.('compliance') };
    }
    const id = PROGRESS_SECTION_ORDER.find(id => sectionStatus[id] && !sectionStatus[id].completed);
    if (!id) return null;
    return { id, ...sectionStatus[id], action: () => onSwitchToDetailed?.(id) };
  }, [sectionStatus, onSwitchToDetailed, progress.percentage]);

  const currentDraft = state.drafts.find(draft => draft.id === state.currentDraftId);
  const freeAssessment = currentDraft?.freeAssessment;
  const openingPlanCompleted = state.openingPlanProgress?.completedTaskIds?.length ?? 0;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Status — one clear line */}
      <div className="mb-8">
        <p className="text-sm text-slate-600 mb-1">{currentDraft?.name || 'New project'}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-slate-900">{progress.percentage}%</span>
          <span className="text-slate-500">complete</span>
          <span className="text-slate-400 mx-2">·</span>
          <span className="text-slate-600">{progress.completed} of {progress.total} sections</span>
        </div>
        <div className="mt-3 h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-slate-800 rounded-full transition-all duration-500"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </div>

      {/* What to do next — single focus */}
      <div className="mb-8">
        {nextTask ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <p className="text-sm font-medium text-slate-500 mb-2">Next step</p>
            <button
              onClick={nextTask.action}
              className="w-full flex items-center gap-4 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 transition-all text-left group"
            >
              {(() => {
                const Icon = nextTask.icon;
                return Icon ? <Icon className="w-8 h-8 text-slate-600 flex-shrink-0" /> : null;
              })()}
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-slate-900">{nextTask.label}</h2>
                <p className="text-sm text-slate-500 mt-0.5">Click to continue</p>
              </div>
              <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-emerald-200 bg-emerald-50/50 p-6 flex items-center gap-4">
            <CheckCircle className="w-12 h-12 text-emerald-600 flex-shrink-0" />
            <div>
              <h2 className="text-lg font-semibold text-slate-900">All sections complete</h2>
              <p className="text-slate-600">Review your plan or manage operations.</p>
            </div>
            <button
              onClick={() => onSwitchToDetailed?.()}
              className="ml-auto px-4 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 text-sm"
            >
              Open Restaurant View
            </button>
          </div>
        )}
      </div>

      {/* Opening Plan — compact status */}
      <button
        type="button"
        onClick={() => onSwitchToDetailed?.('startup-and-opening')}
        className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 mb-4 text-left"
      >
        <span className="flex items-center gap-2 text-sm">
          <Compass className="w-4 h-4 text-slate-500" />
          Opening Plan: {openingPlanCompleted}/{OPENING_PLAN_TOTAL_TASKS} tasks
        </span>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </button>

      {/* Secondary: Open Restaurant + optional cards */}
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => onSwitchToDetailed?.()}
          className="w-full flex items-center justify-between p-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-left"
        >
          <span className="font-medium text-slate-800">Open Restaurant View</span>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </button>
        <p className="text-xs text-slate-500 px-1">
          Licenses, permits, vendors, financials & documents
        </p>

        {progress.percentage < 20 && (
          <button
            onClick={() => setShowTemplates(true)}
            className="w-full flex items-center gap-4 p-4 rounded-lg border border-violet-200 bg-violet-50/50 hover:bg-violet-50 text-left"
          >
            <span className="text-2xl">✨</span>
            <div>
              <p className="font-medium text-slate-900">New here? Start with a template</p>
              <p className="text-sm text-slate-600">Pre-filled for your restaurant type</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 ml-auto" />
          </button>
        )}

        {freeAssessment && (
          <button
            type="button"
            onClick={() => onSwitchToDetailed?.('operations')}
            className="w-full flex items-center justify-between p-4 rounded-lg border border-amber-200 bg-amber-50/50 hover:bg-amber-50 text-left"
          >
            <span className="font-medium text-slate-800">Continue due diligence</span>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
        )}
      </div>

      {/* Location — minimal */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <label className="text-xs text-slate-500">Location</label>
        <select
          value={state.financialData?.restaurantDetails?.location || 'Boston'}
          onChange={(e) => actions.updateFinancialData('restaurantDetails', { ...state.financialData?.restaurantDetails, location: e.target.value })}
          className="mt-1 block w-full max-w-xs rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
        >
          {LOCATION_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <QuickStartTemplates
        isOpen={showTemplates}
        onClose={() => setShowTemplates(false)}
        onSelect={(templateKey) => {
          setShowTemplates(false);
          actions.showMessage('Success', 'Template applied successfully!', 'success');
        }}
      />
    </div>
  );
};

export default DashboardOverview;
