import React, { useMemo, useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import GettingStartedChecklist from '../onboarding/GettingStartedChecklist';
import { OPENING_PLAN_TOTAL_TASKS } from '../startup/OpeningPlan';
import QuickStartTemplates from '../onboarding/QuickStartTemplates';
import {
  CheckCircle, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  FileText, 
  Users, 
  DollarSign, 
  Target,
  Calendar,
  BarChart3,
  Building,
  Lightbulb,
  Mic,
  Compass,
  Shield,
  Truck,
  Wrench,
  Utensils,
  Palette,
  ArrowRight,
  Star,
  Zap,
  Rocket,
  Sparkles
} from 'lucide-react';

const DashboardOverview = ({ onSwitchToDetailed }) => {
  const { state, actions } = useApp();
  const [showTemplates, setShowTemplates] = useState(false);

  // Calculate completion status for each section
  const sectionStatus = useMemo(() => {
    const currentDraft = state.drafts.find(draft => draft.id === state.currentDraftId);
    if (!currentDraft) return {};

    // Helper function to check if an object has meaningful content
    const hasContent = (obj) => {
      if (!obj) return false;
      if (typeof obj === 'string') return obj.trim().length > 0;
      if (Array.isArray(obj)) return obj.length > 0;
      if (typeof obj === 'object') {
        return Object.values(obj).some(val => {
          if (typeof val === 'string') return val.trim().length > 0;
          if (typeof val === 'number') return val > 0;
          if (Array.isArray(val)) return val.length > 0;
          if (typeof val === 'object') return hasContent(val);
          return false;
        });
      }
      return false;
    };

    const ideaDone = !!(currentDraft.businessPlan?.ideation?.businessConcept || currentDraft.businessPlan?.ideation?.coreInspiration || currentDraft.businessPlan?.ideation?.solutionIdea);
    const pitchDone = !!(currentDraft.businessPlan?.elevatorPitch?.finalPitch || currentDraft.businessPlan?.elevatorPitch?.hook);
    const summaryDone = !!(currentDraft.businessPlan?.executiveSummary?.businessName || currentDraft.businessPlan?.executiveSummary?.missionStatement);
    const marketDone = !!(currentDraft.businessPlan?.marketAnalysis?.targetMarket || currentDraft.businessPlan?.marketAnalysis?.marketSize || currentDraft.businessPlan?.marketAnalysis?.competitiveAnalysis);
    const competitiveDone = !!(currentDraft.businessPlan?.marketAnalysis?.competitiveAnalysis);
    const servicesDone = !!(currentDraft.businessPlan?.serviceDescription?.productsServices);
    const marketingDone = !!(currentDraft.businessPlan?.marketingStrategy?.marketingMix || currentDraft.businessPlan?.marketingStrategy?.customerAcquisition);
    const managementDone = !!(currentDraft.businessPlan?.managementTeam?.keyPersonnel);
    const capTableDone = !!(currentDraft.financialData?.capTable?.entries?.length > 0);
    const equipmentDone = !!(currentDraft.equipmentData?.equipment?.length > 0);
    const menuDone = !!(currentDraft.menuData?.menuItems?.length > 0);
    const documentsDone = !!(currentDraft.complianceData?.documents?.length > 0);

    const sections = {
      'concept-pitch': {
        label: 'Concept & Pitch',
        icon: Lightbulb,
        color: 'yellow',
        completed: !!(ideaDone || pitchDone || summaryDone),
        priority: 'high'
      },
      'market-competition': {
        label: 'Market & Competition',
        icon: BarChart3,
        color: 'green',
        completed: !!(marketDone || competitiveDone),
        priority: 'high'
      },
      'offer-marketing': {
        label: 'Offer & Marketing',
        icon: Target,
        color: 'purple',
        completed: !!(servicesDone || marketingDone),
        priority: 'high'
      },
      'operations': {
        label: 'Operations Plan',
        icon: Building,
        color: 'purple',
        completed: !!(currentDraft.businessPlan?.operationsPlan?.location || currentDraft.businessPlan?.operationsPlan?.staffingPlan),
        priority: 'medium'
      },
      'team-cap-table': {
        label: 'Team & Cap Table',
        icon: Users,
        color: 'indigo',
        completed: !!(managementDone || capTableDone),
        priority: 'medium'
      },
      'financials': {
        label: 'Financial Projections',
        icon: DollarSign,
        color: 'green',
        completed: !!(currentDraft.financialData?.revenue?.foodSales > 0 || currentDraft.financialData?.revenue?.beverageSales > 0 || currentDraft.financialData?.operatingExpenses?.rent > 0 || currentDraft.financialData?.startupCosts?.totalBuildCost > 0 || currentDraft.financialData?.startupCosts?.purchasePrice > 0 || currentDraft.financialData?.restaurantOperations?.seats > 0 || currentDraft.financialData?.restaurantType?.buildCosts > 0 || currentDraft.financialData?.restaurantType?.purchasePrice > 0),
        priority: 'high'
      },
      'vendors': {
        label: 'Vendor Management',
        icon: Truck,
        color: 'orange',
        completed: !!(currentDraft.vendors && currentDraft.vendors.length > 0),
        priority: 'low'
      },
      'equipment-menu': {
        label: 'Equipment & Menu',
        icon: Utensils,
        color: 'orange',
        completed: !!(equipmentDone || menuDone),
        priority: 'medium'
      },
      'branding': {
        label: 'Branding Planner',
        icon: Palette,
        color: 'purple',
        completed: !!(currentDraft.brandingData?.brandName),
        priority: 'low'
      },
      'compliance': {
        label: 'Compliance',
        icon: Shield,
        color: 'red',
        completed: documentsDone,
        priority: 'high'
      }
    };

    return sections;
  }, [state.drafts, state.currentDraftId]);

  // Calculate overall progress
  const progress = useMemo(() => {
    const sections = Object.values(sectionStatus);
    const completed = sections.filter(s => s.completed).length;
    const total = sections.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    return { completed, total, percentage };
  }, [sectionStatus]);

  // Get next recommended tasks
  const nextTasks = useMemo(() => {
    const sections = Object.entries(sectionStatus)
      .filter(([_, section]) => !section.completed)
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b[1].priority] - priorityOrder[a[1].priority];
      })
      .slice(0, 3);

    return sections.map(([id, section]) => ({
      id,
      ...section,
      action: () => {
        if (onSwitchToDetailed) onSwitchToDetailed(id);
      }
    }));
  }, [sectionStatus, onSwitchToDetailed]);

  // Get recent activity
  const recentActivity = useMemo(() => {
    const currentDraft = state.drafts.find(draft => draft.id === state.currentDraftId);
    if (!currentDraft) return [];

    const activities = [];
    
    if (currentDraft.updatedAt) {
      activities.push({
        type: 'update',
        message: 'Draft updated',
        time: new Date(currentDraft.updatedAt),
        icon: FileText
      });
    }

    if (currentDraft.createdAt) {
      activities.push({
        type: 'create',
        message: 'Draft created',
        time: new Date(currentDraft.createdAt),
        icon: Star
      });
    }

    return activities.sort((a, b) => b.time - a.time).slice(0, 3);
  }, [state.drafts, state.currentDraftId]);

  const currentDraft = state.drafts.find(draft => draft.id === state.currentDraftId);

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
      {/* Main content */}
      <div className="flex-1 min-w-0 space-y-6">
      {/* Welcome Header */}
      <div className="bg-slate-800 rounded-lg p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-3 text-white">
              Welcome back, {state.user?.displayName || 'Restaurant Planner'}!
            </h1>
            <p className="text-slate-200 text-lg">
              {currentDraft ? `Working on: ${currentDraft.name}` : 'Ready to start your restaurant journey?'}
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-white">{progress.percentage}%</div>
            <div className="text-slate-300 text-sm font-medium">Complete</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-6 bg-slate-700 rounded-full h-3">
          <div 
            className="bg-blue-600 rounded-full h-3 transition-all duration-700 ease-out"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
        <div className="mt-3 text-sm text-slate-300 font-medium">
          {progress.completed} of {progress.total} sections completed
        </div>
      </div>

      {/* Quick Start Templates - Show for new users */}
      {progress.percentage < 20 && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">New to Restaurant Planning?</h3>
                <p className="text-sm text-gray-600">
                  Start with a pre-filled template for your restaurant type
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowTemplates(true)}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <span>Browse Templates</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="modern-card p-6 hover-lift">
          <div className="flex items-center">
            <div className="p-3 bg-green-600 rounded-lg shadow-sm">
              <CheckCircle className="w-7 h-7 text-white" />
            </div>
            <div className="ml-4">
              <div className="text-3xl font-bold text-gray-900">{progress.completed}</div>
              <div className="text-sm font-medium text-gray-600">Completed</div>
            </div>
          </div>
        </div>

        <div className="modern-card p-6 hover-lift">
          <div className="flex items-center">
            <div className="p-3 bg-amber-500 rounded-lg shadow-sm">
              <Clock className="w-7 h-7 text-white" />
            </div>
            <div className="ml-4">
              <div className="text-3xl font-bold text-gray-900">{progress.total - progress.completed}</div>
              <div className="text-sm font-medium text-gray-600">Remaining</div>
            </div>
          </div>
        </div>

        <div className="modern-card p-6 hover-lift">
          <div className="flex items-center">
            <div className="p-3 bg-blue-600 rounded-lg shadow-sm">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div className="ml-4">
              <div className="text-3xl font-bold text-gray-900">{state.drafts.length}</div>
              <div className="text-sm font-medium text-gray-600">Drafts</div>
            </div>
          </div>
        </div>

        <div className="modern-card p-6 hover-lift">
          <div className="flex items-center">
            <div className="p-3 bg-purple-600 rounded-lg shadow-sm">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div className="ml-4">
              <div className="text-3xl font-bold text-gray-900">{progress.percentage}%</div>
              <div className="text-sm font-medium text-gray-600">Progress</div>
            </div>
          </div>
        </div>
      </div>

      {/* What needs to be done - clear summary */}
      <div className="modern-card bg-amber-50 border border-amber-200">
        <div className="p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500 rounded-lg">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">What needs to be done</h2>
              <p className="text-sm text-gray-600">
                {progress.completed === progress.total ? (
                  'All sections complete. Review your plan or open Detailed View to edit.'
                ) : (
                  <>
                    <span className="font-semibold text-amber-800">{progress.total - progress.completed} section{progress.total - progress.completed !== 1 ? 's' : ''} remaining.</span>
                    {' '}Start with the next priority tasks below or use the checklist on the right.
                  </>
                )}
              </p>
            </div>
          </div>
          {progress.completed < progress.total && onSwitchToDetailed && (
            <button
              type="button"
              onClick={onSwitchToDetailed}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors flex items-center gap-2"
            >
              Open Detailed View
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
        {/* Opening Plan progress */}
        {(() => {
          const completed = state.openingPlanProgress?.completedTaskIds?.length ?? 0;
          const total = OPENING_PLAN_TOTAL_TASKS;
          const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
          return (
            <div className="px-4 pb-4 pt-0">
              <button
                type="button"
                onClick={() => onSwitchToDetailed && onSwitchToDetailed('startup-and-opening')}
                className="w-full text-left flex items-center justify-between p-3 rounded-lg bg-white border border-amber-200 hover:bg-amber-50 transition-colors"
              >
                <span className="flex items-center gap-2 font-medium text-gray-800">
                  <Compass className="h-4 w-4 text-amber-600" />
                  Opening Plan: {completed}/{total} tasks ({pct}%)
                </span>
                <ArrowRight className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          );
        })()}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Tasks */}
        <div className="modern-card">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-500 rounded-lg mr-3">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Next Priority Tasks</h2>
            </div>
          </div>
          <div className="p-6">
            {nextTasks.length > 0 ? (
              <div className="space-y-4">
                {nextTasks.map((task, index) => {
                  const IconComponent = task.icon;
                  const priorityColors = {
                    high: 'text-white bg-red-600',
                    medium: 'text-white bg-yellow-500',
                    low: 'text-white bg-green-600'
                  };
                  
                  return (
                    <button
                      key={task.id}
                      onClick={task.action}
                      className="w-full text-left p-5 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group hover-lift"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-xl shadow-md ${priorityColors[task.priority]}`}>
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 text-lg">{task.label}</div>
                            <div className="text-sm font-medium text-gray-600 capitalize">{task.priority} priority</div>
                          </div>
                        </div>
                        <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">All tasks completed!</h3>
                <p className="text-gray-500">Great job! Your business plan is ready.</p>
              </div>
            )}
          </div>
        </div>

        {/* Section Status */}
        <div className="modern-card">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center">
              <div className="p-2 bg-blue-600 rounded-lg mr-3">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Section Status</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {Object.entries(sectionStatus).map(([id, section]) => {
                const IconComponent = section.icon;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onSwitchToDetailed && onSwitchToDetailed(id)}
                    className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg shadow-sm ${
                        section.completed 
                          ? 'bg-green-600' 
                          : 'bg-gray-400'
                      }`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-bold text-gray-900 text-lg">{section.label}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        section.priority === 'high' ? 'bg-red-100 text-red-700 border border-red-200' :
                        section.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                        'bg-green-100 text-green-700 border border-green-200'
                      }`}>
                        {section.priority}
                      </span>
                      {section.completed ? (
                        <div className="p-2 bg-green-100 rounded-full">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                      ) : (
                        <div className="p-2 bg-gray-100 rounded-full">
                          <Clock className="w-5 h-5 text-gray-500" />
                        </div>
                      )}
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="modern-card">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button
              onClick={() => {
                actions.setActiveTab('startup-and-opening');
                if (onSwitchToDetailed) onSwitchToDetailed();
              }}
              className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 text-center group hover-lift"
            >
              <div className="p-4 bg-blue-600 rounded-lg w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Compass className="w-8 h-8 text-white" />
              </div>
              <div className="font-bold text-gray-900 text-lg mb-2">Startup Journey</div>
              <div className="text-sm text-gray-600">Complete process guide</div>
            </button>

            <button
              onClick={() => {
                actions.setActiveTab('startup-and-opening');
                if (onSwitchToDetailed) onSwitchToDetailed();
              }}
              className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-400 hover:bg-red-50 transition-all duration-200 text-center group hover-lift"
            >
              <div className="p-4 bg-red-600 rounded-lg w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div className="font-bold text-gray-900 text-lg mb-2">Opening Plan</div>
              <div className="text-sm text-gray-600">Boston restaurant roadmap</div>
            </button>

            <button
              onClick={() => {
                actions.setActiveTab('business-analytics');
                if (onSwitchToDetailed) onSwitchToDetailed();
              }}
              className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all duration-200 text-center group hover-lift"
            >
              <div className="p-4 bg-green-600 rounded-lg w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div className="font-bold text-gray-900 text-lg mb-2">Analytics</div>
              <div className="text-sm text-gray-600">View progress & insights</div>
            </button>

            <button
              onClick={() => {
                actions.setActiveTab('compliance');
                if (onSwitchToDetailed) onSwitchToDetailed();
              }}
              className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 text-center group hover-lift"
            >
              <div className="p-4 bg-orange-600 rounded-lg w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="font-bold text-gray-900 text-lg mb-2">Health Code</div>
              <div className="text-sm text-gray-600">Monthly compliance checklist</div>
            </button>
          </div>
        </div>
      </div>

      {/* Open Your Restaurant CTA */}
      <div className="modern-card bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="p-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <Rocket className="w-8 h-8" />
                <h2 className="text-2xl font-bold">Ready to Open Your Restaurant?</h2>
              </div>
              <p className="text-blue-100 text-lg mb-4">
                Track all your documents, manage licenses at city, state, and federal levels, and never miss a renewal deadline.
              </p>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => onSwitchToDetailed && onSwitchToDetailed('compliance')}
                  className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 flex items-center space-x-2 shadow-lg"
                >
                  <Rocket className="w-5 h-5" />
                  <span>Open Restaurant Manager</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <span className="text-blue-100 text-sm">
                  Track documents • Manage licenses • Renewal reminders
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start Templates Modal */}
      <QuickStartTemplates
        isOpen={showTemplates}
        onClose={() => setShowTemplates(false)}
        onSelect={(templateKey) => {
          setShowTemplates(false);
          actions.showMessage('Success', 'Template applied successfully!', 'success');
        }}
      />
      </div>

      {/* Right sidebar - Getting Started Checklist */}
      {progress.percentage < 50 && (
        <aside className="lg:w-80 flex-shrink-0 order-first lg:order-none">
          <div className="lg:sticky lg:top-4">
            <GettingStartedChecklist />
          </div>
        </aside>
      )}
    </div>
  );
};

export default DashboardOverview;
