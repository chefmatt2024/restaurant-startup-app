import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import Header from '../components/layout/Header';
import TabNavigation from '../components/layout/TabNavigation';
import DashboardOverview from '../components/dashboard/DashboardOverview';
import ExecutiveSummary from '../components/business-plan/ExecutiveSummary';
import MarketAnalysis from '../components/business-plan/MarketAnalysis';
import OperationsPlan from '../components/business-plan/OperationsPlan';
import ManagementTeam from '../components/business-plan/ManagementTeam';
import ServiceDescription from '../components/business-plan/ServiceDescription';
import MarketingStrategy from '../components/business-plan/MarketingStrategy';
import FinancialProjections from '../components/financial/FinancialProjections';
import VendorManagement from '../components/vendors/VendorManagement';
import IdeaFormation from '../components/ideation/IdeaFormation';
import ElevatorPitchBuilder from '../components/ideation/ElevatorPitchBuilder';
import DocumentsCompliance from '../components/compliance/DocumentsCompliance';
import TimelineManager from '../components/project/TimelineManager';
import BusinessAnalytics from '../components/analytics/BusinessAnalytics';
import EquipmentPlanning from '../components/equipment/EquipmentPlanning';
import MenuBuilder from '../components/menu/MenuBuilder';
import BrandingPlanner from '../components/branding/BrandingPlanner';
import CompetitiveAnalysis from '../components/business-plan/CompetitiveAnalysis';
import StartupJourney from '../components/startup/StartupJourney';
import OpeningPlan from '../components/startup/OpeningPlan';
import PricingPage from '../components/payment/PricingPage';
import SubscriptionManager from '../components/payment/SubscriptionManager';
import SubscriptionDemo from '../components/payment/SubscriptionDemo';
import BrandingUpdater from '../components/tools/BrandingUpdater';
import DebugInfo from '../components/ui/DebugInfo';
import WelcomeMessage from '../components/auth/WelcomeMessage';

const Dashboard = () => {
  const { state, actions } = useApp();
  const [showOverview, setShowOverview] = useState(true);

  const renderActiveTab = () => {
    switch (state.activeTab) {
      case 'startup-journey':
        return <StartupJourney />;
      case 'opening-plan':
        return <OpeningPlan />;
      case 'idea-formation':
        
        return <IdeaFormation />;
      case 'elevator-pitch':
        return <ElevatorPitchBuilder />;
      case 'timeline':
        return <TimelineManager />;
      case 'executive-summary':
        return <ExecutiveSummary />;
      case 'market-analysis':
        return <MarketAnalysis />;
      case 'operations':
        return <OperationsPlan />;
      case 'management':
        return <ManagementTeam />;
      case 'services':
        return <ServiceDescription />;
      case 'marketing':
        return <MarketingStrategy />;
      case 'financials':
        return <FinancialProjections />;
      case 'vendors':
        return <VendorManagement />;
      case 'equipment-planning':
        return <EquipmentPlanning />;
      case 'menu-builder':
        return <MenuBuilder />;
              case 'branding':
          return <BrandingPlanner />;
        case 'competitive-analysis':
          return <CompetitiveAnalysis />;
        case 'documents':
          return <DocumentsCompliance />;
      case 'business-analytics':
        return <BusinessAnalytics />;
      case 'pricing':
        return <PricingPage />;
      case 'subscription':
        return <SubscriptionManager />;
      case 'subscription-demo':
        return <SubscriptionDemo />;
      case 'branding-updater':
        return <BrandingUpdater />;
      default:
        return <StartupJourney />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* View Toggle */}
        <div className="mb-8">
          <div className="modern-card p-1 inline-flex shadow-lg">
            <button
              onClick={() => setShowOverview(true)}
              className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                showOverview 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setShowOverview(false)}
              className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                !showOverview 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Detailed View
            </button>
          </div>
        </div>

        {showOverview ? (
          <DashboardOverview onSwitchToDetailed={() => setShowOverview(false)} />
        ) : (
          <div className="modern-card overflow-hidden shadow-2xl">
            <TabNavigation />
            <div className="p-6 lg:p-8 bg-gradient-to-br from-white to-gray-50">
              {renderActiveTab()}
            </div>
          </div>
        )}
      </div>
      <DebugInfo />
      <WelcomeMessage 
        isOpen={state.showWelcomeMessage} 
        onClose={() => actions.hideWelcomeMessage()} 
      />
    </div>
  );
};

export default Dashboard; 