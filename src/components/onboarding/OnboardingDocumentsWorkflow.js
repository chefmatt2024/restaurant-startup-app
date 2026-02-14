import React, { useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import SectionCard from '../ui/SectionCard';
import { FileText, CheckCircle, Circle, ChevronRight, Download, Presentation } from 'lucide-react';

const DOC_STEPS = [
  { id: 'name', label: 'Name your plan', tabId: null, check: (draft) => !!(draft?.name && draft.name !== `Draft ${draft.id}`) },
  { id: 'concept', label: 'Complete concept & pitch', tabId: 'concept-pitch', check: (draft) => !!(draft?.businessPlan?.executiveSummary?.businessName || draft?.businessPlan?.elevatorPitch?.hook) },
  { id: 'financials', label: 'Complete financials', tabId: 'financials', check: (draft) => !!((draft?.financialData?.revenue?.foodSales ?? 0) > 0 || (draft?.financialData?.startupCosts?.leaseholdImprovements ?? 0) > 0 || (draft?.financialData?.restaurantOperations?.seats ?? 0) > 0) },
  { id: 'business-plan', label: 'Generate business plan PDF', tabId: 'financials', docType: 'business-plan' },
  { id: 'investor-pack', label: 'Optional: Generate investor pack (pitch deck)', tabId: 'financials', docType: 'pitch-deck' }
];

const OnboardingDocumentsWorkflow = () => {
  const { state, actions } = useApp();
  const currentDraft = state.drafts?.find((d) => d.id === state.currentDraftId);
  const documentVersions = state.documentVersions || [];

  const stepStatus = useMemo(() => {
    return DOC_STEPS.map((step) => {
      if (step.check) {
        return { ...step, done: step.check(currentDraft) };
      }
      const last = documentVersions.filter((v) => v.type === step.docType).sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt))[0];
      return { ...step, done: !!last, lastGeneratedAt: last?.generatedAt };
    });
  }, [currentDraft, documentVersions]);

  const handleTakeMeThere = (tabId) => {
    if (tabId) actions.setActiveTab(tabId);
  };

  return (
    <SectionCard title="Onboarding documents workflow" color="blue">
      <p className="text-sm text-gray-600 mb-4">
        Follow these steps to create and export your business plan and investor materials.
      </p>
      <ul className="space-y-3">
        {stepStatus.map((step) => (
          <li key={step.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 hover:bg-gray-100">
            {step.done ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" aria-hidden />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" aria-hidden />
            )}
            <div className="flex-1 min-w-0">
              <span className={step.done ? 'text-gray-600' : 'text-gray-900 font-medium'}>{step.label}</span>
              {step.lastGeneratedAt && (
                <span className="block text-xs text-gray-500 mt-0.5">
                  Last generated: {new Date(step.lastGeneratedAt).toLocaleDateString()}
                </span>
              )}
            </div>
            {step.tabId && (
              <button
                type="button"
                onClick={() => handleTakeMeThere(step.tabId)}
                className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                {step.done && step.docType ? 'Regenerate' : 'Take me there'}
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-2">
        <span className="text-xs text-gray-500">
          In <strong>Financial Projections</strong>, use &quot;Generate Investor Documents&quot; to create your Business Plan PDF or Pitch Deck. Versions are recorded here.
        </span>
      </div>
    </SectionCard>
  );
};

export default OnboardingDocumentsWorkflow;
