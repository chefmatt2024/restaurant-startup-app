import React, { useState, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import Header from '../components/layout/Header';
import TabNavigation, { DETAIL_VIEW_TABS } from '../components/layout/TabNavigation';
import { getSectionStatus } from '../utils/sectionStatus';
import { ChevronRight, LayoutDashboard, List } from 'lucide-react';
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

const Dashboard = () => {
  const { state, actions } = useApp();
  const [showOverview, setShowOverview] = useState(true);

  const currentDraft = state.drafts?.find(d => d.id === state.currentDraftId);
  const sectionStatus = useMemo(() => getSectionStatus(currentDraft), [currentDraft]);
  const completedCount = useMemo(() => Object.values(sectionStatus).filter(s => s.completed).length, [sectionStatus]);
  const totalSections = useMemo(() => Object.keys(sectionStatus).length, [sectionStatus]);
  const activeTabInfo = DETAIL_VIEW_TABS.find(t => t.id === state.activeTab);
  const currentSectionLabel = activeTabInfo?.label ?? 'Detailed View';
  const isCurrentSectionComplete = sectionStatus[state.activeTab]?.completed;

  const renderActiveTab = () => {
    switch (state.activeTab) {
      case 'startup-and-opening':
        return <StartupAndOpeningPlan />;
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
      {/* View Toggle - sticky below header so it's always visible */}
      <div className="sticky top-0 z-20 bg-white border-b-2 border-gray-200 shadow-md">
        <div className="max-w-[95%] xl:max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6 py-3">
          <div className="flex flex-wrap items-center justify-end gap-3">
            <span className="text-xs text-gray-500 sm:mr-auto">
              {showOverview ? 'High-level progress & next steps' : 'Vendors, financials & all plan sections'}
            </span>
            <span className="text-sm font-medium text-gray-600 hidden sm:inline">Switch view:</span>
            <div className="inline-flex p-1.5 bg-gray-100 rounded-lg border border-gray-200">
              <button
                onClick={() => setShowOverview(true)}
                className={`px-5 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                  showOverview
                    ? 'bg-white text-blue-600 shadow-sm border border-gray-200'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Overview
              </button>
              <button
                onClick={() => setShowOverview(false)}
                className={`px-5 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                  !showOverview
                    ? 'bg-white text-blue-600 shadow-sm border border-gray-200'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-4 h-4" />
                Operating
              </button>
            </div>
          </div>
        </div>
      </div>
      <TrialExpirationBanner onUpgrade={handleUpgrade} />
      <div className="max-w-[95%] xl:max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6 py-8">
        {showOverview ? (
          <DashboardOverview onSwitchToDetailed={handleSwitchToDetailed} />
        ) : (
          <div className="modern-card overflow-hidden shadow-2xl">
            <TabNavigation sectionStatus={sectionStatus} />
            {/* Breadcrumb + section title - where you are */}
            <div className="px-6 lg:px-8 pt-4 pb-2 border-b border-gray-100 bg-gray-50/50">
              <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2" aria-label="Breadcrumb">
                <button
                  type="button"
                  onClick={() => setShowOverview(true)}
                  className="hover:text-blue-600 font-medium transition-colors"
                >
                  Overview
                </button>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700 font-medium">Operating</span>
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
            <div className="p-6 lg:p-8 bg-gradient-to-br from-white to-gray-50">
              {renderActiveTab()}
            </div>
          </div>
        )}
      </div>
      <WelcomeTour
        isOpen={showWelcomeTour}
        onComplete={handleTourComplete}
        onSkip={handleTourComplete}
      />
    </div>
  );
};

export default Dashboard; 