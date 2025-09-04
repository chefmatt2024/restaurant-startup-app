import React from 'react';
import { useApp } from '../contexts/AppContext';
import Header from '../components/layout/Header';
import TabNavigation from '../components/layout/TabNavigation';
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
import DebugInfo from '../components/ui/DebugInfo';
import WelcomeMessage from '../components/auth/WelcomeMessage';

const Dashboard = () => {
  const { state, actions } = useApp();

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
      default:
        return <StartupJourney />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <TabNavigation />
          <div className="p-6 lg:p-8">
            {renderActiveTab()}
          </div>
        </div>
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