import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import Header from '../components/layout/Header';
import TabNavigation, { DETAIL_VIEW_TABS } from '../components/layout/TabNavigation';
import { getSectionStatus } from '../utils/sectionStatus';
import GuideAssistant from '../components/onboarding/GuideAssistant';
import AIAssistant from '../components/ai/AIAssistant';
import { getAIPlaceholderForStep, getAIContextForStep } from '../config/aiStepContext';
import { ChevronRight, LayoutDashboard, List, Sparkles } from 'lucide-react';
import DashboardOverview from '../components/dashboard/DashboardOverview';
import OperationsPlan from '../components/business-plan/OperationsPlan';
import FinancialProjections from '../components/financial/FinancialProjections';
import VendorManagement from '../components/vendors/VendorManagement';
import TimelineManager from '../components/project/TimelineManager';
import BusinessAnalytics from '../components/analytics/BusinessAnalytics';
import BrandingPlanner from '../components/branding/BrandingPlanner';
import StartupAndOpeningPlan from '../components/startup/StartupAndOpeningPlan';
import ConceptAndPitch from '../components/ideation/ConceptAndPitch';
import MarketAndCompetition from '../components/business-plan/MarketAndCompetition';
import OfferAndMarketing from '../components/business-plan/OfferAndMarketing';
import TeamAndCapTable from '../components/business-plan/TeamAndCapTable';
import EquipmentAndMenu from '../components/equipment/EquipmentAndMenu';
import ComplianceHub from '../components/compliance/ComplianceHub';
import PricingPage from '../components/payment/PricingPage';
import SubscriptionManager from '../components/payment/SubscriptionManager';
import AdminDashboard from '../components/admin/AdminDashboard';
import DocumentImporter from '../components/import/DocumentImporter';
import WelcomeTour from '../components/onboarding/WelcomeTour';
import TrialExpirationBanner from '../components/trial/TrialExpirationBanner';
import OnboardingDocumentsWorkflow from '../components/onboarding/OnboardingDocumentsWorkflow';
import ReportsView from '../components/reports/ReportsView';
import LedgerView from '../components/ledger/LedgerView';
import SOPManager from '../components/sops/SOPManager';
import ProcessMapView from '../components/process/ProcessMapView';

const Dashboard = () => {
  const { state, actions } = useApp();
  const [showOverview, setShowOverview] = useState(true);

  const currentDraft = state.drafts?.find(d => d.id === state.currentDraftId);
  const sectionStatus = useMemo(
    () => getSectionStatus(currentDraft, state.openingPlanProgress?.completedTaskIds || []),
    [currentDraft, state.openingPlanProgress?.completedTaskIds]
  );
  const completedCount = useMemo(() => Object.values(sectionStatus).filter(s => s.completed).length, [sectionStatus]);
  const totalSections = useMemo(() => Object.keys(sectionStatus).length, [sectionStatus]);
  const activeTabInfo = DETAIL_VIEW_TABS.find(t => t.id === state.activeTab);
  const currentSectionLabel = activeTabInfo?.label ?? 'Detailed View';
  const isCurrentSectionComplete = sectionStatus[state.activeTab]?.completed;

  const renderActiveTab = () => {
    switch (state.activeTab) {
      case 'startup-and-opening':
        return <StartupAndOpeningPlan />;
      case 'process-map':
        return <ProcessMapView />;
      case 'concept-pitch':
        return <ConceptAndPitch />;
      case 'market-competition':
        return <MarketAndCompetition />;
      case 'offer-marketing':
        return <OfferAndMarketing />;
      case 'timeline':
        return <TimelineManager />;
      case 'operations':
        return <OperationsPlan />;
      case 'team-cap-table':
        return <TeamAndCapTable />;
      case 'financials':
        return <FinancialProjections />;
      case 'vendors':
        return <VendorManagement />;
      case 'equipment-menu':
        return <EquipmentAndMenu />;
      case 'branding':
        return <BrandingPlanner />;
      case 'compliance':
        return <ComplianceHub />;
      case 'documents':
        return (
          <div className="space-y-6">
            <OnboardingDocumentsWorkflow />
          </div>
        );
      case 'reports':
        return <ReportsView />;
      case 'ledger':
        return <LedgerView />;
      case 'sops':
        return <SOPManager />;
      case 'business-analytics':
        return <BusinessAnalytics />;
      case 'pricing':
        return <PricingPage />;
      case 'subscription':
        return <SubscriptionManager />;
      case 'admin':
        return <AdminDashboard />;
      case 'import':
        return <DocumentImporter />;
      default:
        return <StartupAndOpeningPlan />;
    }
  };

  const [showWelcomeTour, setShowWelcomeTour] = React.useState(false);
  const [showGuideAssistant, setShowGuideAssistant] = useState(false);

  // Check if user should see welcome tour (only once for new users)
  React.useEffect(() => {
    if (!state.isAuthenticated || !state.userId) return;
    
    const tourCompleted = localStorage.getItem('welcomeTourCompleted');
    const isNewUser = !tourCompleted;
    
    if (isNewUser) {
      // Show tour after a short delay to ensure dashboard is loaded
      const timer = setTimeout(() => {
        setShowWelcomeTour(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [state.isAuthenticated, state.userId]);

  const handleTourComplete = () => {
    localStorage.setItem('welcomeTourCompleted', 'true');
    setShowWelcomeTour(false);
  };

  const handleUpgrade = () => {
    actions.setActiveTab('pricing');
  };

  const handleSwitchToDetailed = (tabId) => {
    setShowOverview(false);
    if (tabId) actions.setActiveTab(tabId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* View mode toggle: Planning (Overview) vs Open Restaurant - always visible below header */}
      <div className="sticky top-0 z-20 bg-white border-b-2 border-indigo-200 shadow-md">
        <div className="max-w-[95%] xl:max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-gray-600">
              {showOverview ? 'Planning your restaurant' : 'Open restaurant — vendors, financials & compliance'}
            </span>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-sm font-medium text-gray-600 hidden sm:inline">Mode:</span>
              <div className="inline-flex p-1.5 bg-gray-100 rounded-lg border-2 border-gray-300" role="group" aria-label="Switch between planning and open restaurant view">
                <button
                  onClick={() => setShowOverview(true)}
                  className={`px-4 sm:px-5 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                    showOverview
                      ? 'bg-white text-blue-600 shadow-sm border border-gray-200 ring-2 ring-blue-200'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Planning
                </button>
                <button
                  onClick={() => setShowOverview(false)}
                  className={`px-4 sm:px-5 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                    !showOverview
                      ? 'bg-white text-indigo-600 shadow-sm border border-gray-200 ring-2 ring-indigo-200'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="w-4 h-4" />
                  Open Restaurant
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <TrialExpirationBanner onUpgrade={handleUpgrade} />
      <div className="max-w-[95%] xl:max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6 py-8">
        {showOverview ? (
          <DashboardOverview onSwitchToDetailed={handleSwitchToDetailed} />
        ) : (
          <div className="modern-card overflow-hidden shadow-2xl flex flex-col">
            {/* Progress bar at top: breadcrumb + section title */}
            <div className="px-6 lg:px-8 pt-4 pb-2 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
              <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2" aria-label="Breadcrumb">
                <button
                  type="button"
                  onClick={() => setShowOverview(true)}
                  className="hover:text-blue-600 font-medium transition-colors"
                >
                  Overview
                </button>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700 font-medium">Open Restaurant</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900 font-semibold" aria-current="page">{currentSectionLabel}</span>
              </nav>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-900">{currentSectionLabel}</h1>
              <p className="text-sm text-gray-500 mt-1">
                {totalSections > 0 ? (
                  <>
                    <span className="font-medium text-gray-700">{completedCount} of {totalSections}</span> plan sections complete
                    {!isCurrentSectionComplete && (
                      <span className="ml-2 text-amber-600 font-medium">• Complete this section below</span>
                    )}
                  </>
                ) : null}
              </p>
            </div>
            {/* Main content (left) + tabs (right) */}
            <div className="flex flex-1 min-h-0">
              <div className="flex-1 min-w-0 flex flex-col min-h-0">
                <div className="flex-1 min-h-0 p-6 lg:p-8 bg-gradient-to-br from-white to-gray-50 overflow-auto">
                  {renderActiveTab()}
                </div>
                {/* Step-aware AI Assistant: available on every step */}
                <div className="flex-shrink-0 border-t border-gray-200 bg-white px-6 py-4">
                  <AIAssistant
                    section={state.activeTab}
                    context={getAIContextForStep(state.activeTab, state)}
                    placeholder={getAIPlaceholderForStep(state.activeTab)}
                    showQuickActions={false}
                  />
                </div>
              </div>
              <TabNavigation sectionStatus={sectionStatus} variant="sidebar" />
            </div>
          </div>
        )}
      </div>
      <WelcomeTour
        isOpen={showWelcomeTour}
        onComplete={handleTourComplete}
        onSkip={handleTourComplete}
      />

      {/* AI Step Guide - floating button opens popup that walks through steps */}
      <button
        type="button"
        onClick={() => setShowGuideAssistant(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        aria-label="Open step-by-step guide"
      >
        <Sparkles className="w-7 h-7" />
      </button>
      <GuideAssistant
        isOpen={showGuideAssistant}
        onClose={() => setShowGuideAssistant(false)}
        sectionStatus={sectionStatus}
      />
    </div>
  );
};

export default Dashboard; 