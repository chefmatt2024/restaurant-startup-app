import React from 'react';
import { useApp } from '../../contexts/AppContext';
import SectionCard from '../ui/SectionCard';
import {
  JOURNEY_STAGES,
  PROCESS_PHASES,
  LEASE_TO_OPENING_STEPS,
  FINAL_30_GATES
} from '../../config/processMap';
import { getAreaConfig, LOCATION_OPTIONS } from '../../config/areaContent';
import {
  Lightbulb,
  FileText,
  MapPin,
  Shield,
  Wrench,
  Rocket,
  CheckCircle,
  ChevronRight,
  Calendar,
  List,
  ArrowRight
} from 'lucide-react';

const STAGE_ICONS = { Lightbulb, FileText, MapPin, Shield, Wrench, Rocket, CheckCircle };

const ProcessMapView = () => {
  const { state, actions } = useApp();
  const completedTaskIds = new Set(state.openingPlanProgress?.completedTaskIds || []);
  const area = state.financialData?.restaurantDetails?.location || 'Boston';
  const areaConfig = getAreaConfig(area);

  const goToTab = (tabId) => {
    if (tabId) actions.setActiveTab(tabId);
  };

  const setArea = (value) => {
    actions.updateFinancialData('restaurantDetails', {
      ...state.financialData?.restaurantDetails,
      location: value
    });
  };

  return (
    <div className="space-y-8">
      {/* Area selector + Hero */}
      <SectionCard title="Start to opening: full process map" color="blue">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <MapPin className="w-4 h-4 text-blue-600" />
            Opening in
          </label>
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-900 bg-white"
          >
            {LOCATION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <span className="text-sm text-gray-500">— plan and tips update for this area.</span>
        </div>
        <p className="text-gray-600 mb-4">
          End-to-end path from idea to open doors. Use the sections below to jump to the right place in the app.
        </p>
        <p className="text-sm text-gray-500 mb-6">{areaConfig.typicalTimeline}</p>
        <div className="flex flex-wrap items-center gap-2 sm:gap-0">
          {JOURNEY_STAGES.map((stage, i) => {
            const Icon = STAGE_ICONS[stage.icon] || FileText;
            return (
              <React.Fragment key={stage.id}>
                <div className="flex flex-col items-center p-2 rounded-lg bg-gray-50 border border-gray-200 min-w-[80px] sm:min-w-0">
                  <Icon className="w-6 h-6 text-blue-600 mb-1" />
                  <span className="text-xs font-semibold text-gray-800 text-center">{stage.label}</span>
                  <span className="text-[10px] text-gray-500 hidden sm:block">{stage.duration}</span>
                </div>
                {i < JOURNEY_STAGES.length - 1 && (
                  <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0 hidden sm:block" aria-hidden />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </SectionCard>

      {/* Six phases (detailed) */}
      <SectionCard title="Six phases: where to work in the app" color="gray">
        <p className="text-sm text-gray-600 mb-4">
          Each phase has tasks in the <strong>Startup & Opening Plan</strong> tab. Use &quot;Open plan&quot; to track tasks; use the other links to fill in that section.
        </p>
        <ol className="space-y-4">
          {PROCESS_PHASES.map((phase) => (
            <li key={phase.id} className="flex flex-wrap items-start gap-4 p-4 rounded-xl border border-gray-200 bg-white hover:border-gray-300">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold">
                {phase.phaseNumber}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">{phase.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{phase.description}</p>
                <p className="text-xs text-gray-500 mt-2">{phase.duration} · {phase.taskSummary}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <button
                    type="button"
                    onClick={() => goToTab('startup-and-opening')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium"
                  >
                    <List className="w-4 h-4" />
                    Open plan
                  </button>
                  <button
                    type="button"
                    onClick={() => goToTab(phase.tabId)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm font-medium"
                  >
                    <ArrowRight className="w-4 h-4" />
                    {phase.tabId === 'concept-pitch' ? 'Concept & pitch' : phase.tabId === 'financials' ? 'Financials' : phase.tabId === 'operations' ? 'Operations' : phase.tabId === 'compliance' ? 'Compliance' : phase.tabId === 'equipment-menu' ? 'Equipment & menu' : 'Opening plan'}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </SectionCard>

      {/* Lease to opening (once you have a location) */}
      <SectionCard title="Once the lease is signed" color="slate">
        <p className="text-sm text-gray-600 mb-4">
          Simplified path from lease signing to opening. Permits often run in parallel with construction.
        </p>
        <div className="space-y-3">
          {LEASE_TO_OPENING_STEPS.map(({ step, name, summary, duration }) => (
            <div key={step} className="flex items-start gap-3 p-3 rounded-lg bg-white border border-gray-200">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-600 text-white flex items-center justify-center font-bold text-sm">
                {step}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900">{name}</div>
                <div className="text-sm text-gray-600">{summary}</div>
                <div className="text-xs text-gray-500 mt-1">{duration}</div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-4">
          {areaConfig.leaseToOpeningNote}
        </p>
        <button
          type="button"
          onClick={() => goToTab('timeline')}
          className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-sm"
        >
          <Calendar className="h-4 w-4" />
          Edit dates in Project Timeline
        </button>
      </SectionCard>

      {/* Final 30 days */}
      <SectionCard title="Final 30 days: pre-opening readiness" color="red">
        <p className="text-sm text-gray-600 mb-4">
          Critical gates before you open. Check these off in the Opening Plan; click a gate to go to that section.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {FINAL_30_GATES.map((gate) => {
            const done = completedTaskIds.has(gate.id);
            return (
              <button
                key={gate.id}
                type="button"
                onClick={() => goToTab(gate.tabId)}
                className={`flex items-center gap-2 p-3 rounded-lg border text-left text-sm transition-all ${
                  done
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-red-300 hover:bg-red-50/50'
                }`}
              >
                {done ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0 text-green-600" />
                ) : (
                  <span className="w-5 h-5 flex-shrink-0 rounded-full border-2 border-gray-300" />
                )}
                <span className="font-medium">{gate.label}</span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-gray-500 mt-3">
          You’re ready to open when permits are in hand, staff are trained, POS and inventory are live, and soft open is done.
        </p>
      </SectionCard>
    </div>
  );
};

export default ProcessMapView;
