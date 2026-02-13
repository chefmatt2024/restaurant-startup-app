import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { CheckCircle, Circle, Target, BarChart3, FileText, MapPin, Building2, Users, ArrowRight, Compass, Shield } from 'lucide-react';

const GettingStartedChecklist = () => {
  const { state, actions } = useApp();
  const [completedItems, setCompletedItems] = useState(new Set());
  const [isMinimized, setIsMinimized] = useState(false);

  // Order matches pre-opening journey (same as progress bar)
  const checklistItems = [
    {
      id: 'opening-plan',
      title: 'Start Opening Plan',
      description: 'Track your lease → permits → buildout → opening checklist',
      tab: 'startup-and-opening',
      icon: <Compass className="w-5 h-5" />,
      checkFunction: () => {
        const completed = state.openingPlanProgress?.completedTaskIds?.length ?? 0;
        return completed > 0;
      }
    },
    {
      id: 'idea',
      title: 'Define Your Restaurant Concept',
      description: 'Start with your restaurant idea and vision',
      tab: 'concept-pitch',
      icon: <Target className="w-5 h-5" />,
      checkFunction: () => {
        const draft = state.drafts?.find(d => d.id === state.currentDraftId);
        return draft?.businessPlan?.ideation?.businessConcept?.length > 0;
      }
    },
    {
      id: 'market',
      title: 'Research Your Market',
      description: 'Analyze competition and target market',
      tab: 'market-competition',
      icon: <MapPin className="w-5 h-5" />,
      checkFunction: () => {
        const draft = state.drafts?.find(d => d.id === state.currentDraftId);
        return draft?.businessPlan?.marketAnalysis?.targetMarket?.length > 0;
      }
    },
    {
      id: 'offer-marketing',
      title: 'Define Offer & Marketing',
      description: 'Products, services, and how you’ll reach customers',
      tab: 'offer-marketing',
      icon: <Target className="w-5 h-5" />,
      checkFunction: () => {
        const draft = state.drafts?.find(d => d.id === state.currentDraftId);
        return !!(draft?.businessPlan?.serviceDescription?.productsServices || draft?.businessPlan?.marketingStrategy?.marketingMix || draft?.businessPlan?.marketingStrategy?.customerAcquisition);
      }
    },
    {
      id: 'financials',
      title: 'Create Financial Projections',
      description: 'Set up your startup costs and revenue projections',
      tab: 'financials',
      icon: <BarChart3 className="w-5 h-5" />,
      checkFunction: () => {
        const draft = state.drafts?.find(d => d.id === state.currentDraftId);
        return draft?.financialData?.restaurantOperations?.seats > 0;
      }
    },
    {
      id: 'team',
      title: 'Define Management Team',
      description: 'Outline your key team members',
      tab: 'team-cap-table',
      icon: <Users className="w-5 h-5" />,
      checkFunction: () => {
        const draft = state.drafts?.find(d => d.id === state.currentDraftId);
        return !!(draft?.businessPlan?.managementTeam?.keyPersonnel || (draft?.businessPlan?.managementTeam?.teamMembers?.length > 0));
      }
    },
    {
      id: 'operations',
      title: 'Plan Operations',
      description: 'Set up equipment, menu, and vendors',
      tab: 'operations',
      icon: <Building2 className="w-5 h-5" />,
      checkFunction: () => {
        const draft = state.drafts?.find(d => d.id === state.currentDraftId);
        return !!(draft?.businessPlan?.operationsPlan?.location || draft?.businessPlan?.operationsPlan?.staffingPlan || (draft?.equipmentData?.equipment?.length > 0) || (draft?.menuData?.menuItems?.length > 0));
      }
    },
    {
      id: 'timeline',
      title: 'Create Opening Timeline',
      description: 'Plan your restaurant opening schedule',
      tab: 'timeline',
      icon: <FileText className="w-5 h-5" />,
      checkFunction: () => {
        return state.drafts?.some(d => d.timeline?.milestones?.length > 0);
      }
    },
    {
      id: 'compliance',
      title: 'Start Permits & Compliance',
      description: 'Track licenses, permits, and inspections (Boston requirements)',
      tab: 'compliance',
      icon: <Shield className="w-5 h-5" />,
      checkFunction: () => {
        const completed = state.openingPlanProgress?.completedTaskIds || [];
        const permitTaskIds = ['business-certificate', 'business-licenses', 'building-permits', 'food-establishment-permit', 'certificate-of-occupancy', 'inspections', 'alcohol-licensing', 'boston-specific-requirements'];
        const hasPermitProgress = permitTaskIds.some(id => completed.includes(id));
        const draft = state.drafts?.find(d => d.id === state.currentDraftId);
        const hasComplianceData = !!(draft?.complianceData?.documents?.length > 0);
        return hasPermitProgress || hasComplianceData;
      }
    }
  ];

  useEffect(() => {
    const checkCompleted = () => {
      const completed = new Set();
      checklistItems.forEach(item => {
        if (item.checkFunction()) {
          completed.add(item.id);
        }
      });
      setCompletedItems(completed);
    };

    checkCompleted();
    // Re-check when state changes
    const interval = setInterval(checkCompleted, 2000);
    return () => clearInterval(interval);
  }, [state.drafts, state.currentDraftId]);

  const totalItems = checklistItems.length;
  const completedCount = completedItems.size;
  const progress = totalItems > 0 ? (completedCount / totalItems) * 100 : 0;

  if (isMinimized) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <button
          onClick={() => setIsMinimized(false)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-gray-900">Getting Started Checklist</div>
              <div className="text-sm text-gray-600">
                {completedCount} of {totalItems} completed
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 rounded-full h-2 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Target className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Getting Started Checklist</h3>
            <p className="text-sm text-gray-600">
              {completedCount} of {totalItems} completed
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsMinimized(true)}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="px-4 pt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 rounded-full h-2 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-center text-sm text-gray-600 mt-2">
          {Math.round(progress)}% Complete
        </div>
      </div>

      {/* Checklist Items */}
      <div className="p-4 space-y-3">
        {checklistItems.map((item) => {
          const isCompleted = completedItems.has(item.id);
          return (
            <div
              key={item.id}
              className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${
                isCompleted ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {isCompleted ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <div className={`${isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                    {item.icon}
                  </div>
                  <h4 className={`font-medium ${isCompleted ? 'text-green-900 line-through' : 'text-gray-900'}`}>
                    {item.title}
                  </h4>
                </div>
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                {!isCompleted && (
                  <button
                    onClick={() => actions.setActiveTab(item.tab)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-1"
                  >
                    <span>Go to {item.title}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Message */}
      {completedCount === totalItems && (
        <div className="p-4 bg-green-50 border-t border-green-200 rounded-b-lg">
          <div className="flex items-center space-x-2 text-green-800">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Congratulations! You've completed the getting started checklist.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default GettingStartedChecklist;


