import React, { useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
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
  Zap
} from 'lucide-react';

const DashboardOverview = ({ onSwitchToDetailed }) => {
  const { state, actions } = useApp();

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

    const sections = {
      'idea-formation': {
        label: 'Idea Formation',
        icon: Lightbulb,
        color: 'yellow',
        completed: !!(currentDraft.businessPlan?.ideation?.businessConcept || 
                     currentDraft.businessPlan?.ideation?.coreInspiration ||
                     currentDraft.businessPlan?.ideation?.solutionIdea),
        priority: 'high'
      },
      'elevator-pitch': {
        label: 'Elevator Pitch',
        icon: Mic,
        color: 'green',
        completed: !!(currentDraft.businessPlan?.elevatorPitch?.finalPitch || 
                     currentDraft.businessPlan?.elevatorPitch?.hook),
        priority: 'high'
      },
      'executive-summary': {
        label: 'Executive Summary',
        icon: FileText,
        color: 'blue',
        completed: !!(currentDraft.businessPlan?.executiveSummary?.businessName || 
                     currentDraft.businessPlan?.executiveSummary?.missionStatement),
        priority: 'high'
      },
      'market-analysis': {
        label: 'Market Analysis',
        icon: BarChart3,
        color: 'green',
        completed: !!(currentDraft.businessPlan?.marketAnalysis?.targetMarket || 
                     currentDraft.businessPlan?.marketAnalysis?.marketSize ||
                     currentDraft.businessPlan?.marketAnalysis?.competitiveAnalysis),
        priority: 'high'
      },
      'competitive-analysis': {
        label: 'Competitive Analysis',
        icon: Target,
        color: 'blue',
        completed: !!(currentDraft.businessPlan?.marketAnalysis?.competitiveAnalysis),
        priority: 'medium'
      },
      'services': {
        label: 'Products/Services',
        icon: Target,
        color: 'purple',
        completed: !!(currentDraft.businessPlan?.serviceDescription?.productsServices),
        priority: 'high'
      },
      'operations': {
        label: 'Operations Plan',
        icon: Building,
        color: 'purple',
        completed: !!(currentDraft.businessPlan?.operationsPlan?.location || 
                     currentDraft.businessPlan?.operationsPlan?.staffingPlan),
        priority: 'medium'
      },
      'management': {
        label: 'Management Team',
        icon: Users,
        color: 'indigo',
        completed: !!(currentDraft.businessPlan?.managementTeam?.keyPersonnel),
        priority: 'medium'
      },
      'marketing': {
        label: 'Marketing Strategy',
        icon: Target,
        color: 'pink',
        completed: !!(currentDraft.businessPlan?.marketingStrategy?.marketingMix || 
                     currentDraft.businessPlan?.marketingStrategy?.customerAcquisition),
        priority: 'medium'
      },
      'financials': {
        label: 'Financial Projections',
        icon: DollarSign,
        color: 'green',
        completed: !!(currentDraft.financialData?.revenue?.foodSales > 0 || 
                     currentDraft.financialData?.revenue?.beverageSales > 0 ||
                     currentDraft.financialData?.operatingExpenses?.rent > 0 ||
                     currentDraft.financialData?.startupCosts?.totalBuildCost > 0 ||
                     currentDraft.financialData?.startupCosts?.purchasePrice > 0 ||
                     currentDraft.financialData?.restaurantOperations?.seats > 0 ||
                     currentDraft.financialData?.restaurantType?.buildCosts > 0 ||
                     currentDraft.financialData?.restaurantType?.purchasePrice > 0),
        priority: 'high'
      },
      'vendors': {
        label: 'Vendor Management',
        icon: Truck,
        color: 'orange',
        completed: !!(currentDraft.vendors && currentDraft.vendors.length > 0),
        priority: 'low'
      },
      'equipment-planning': {
        label: 'Equipment Planning',
        icon: Wrench,
        color: 'purple',
        completed: !!(currentDraft.equipmentData?.equipment?.length > 0),
        priority: 'medium'
      },
      'menu-builder': {
        label: 'Menu Builder',
        icon: Utensils,
        color: 'orange',
        completed: !!(currentDraft.menuData?.menuItems?.length > 0),
        priority: 'medium'
      },
      'branding': {
        label: 'Branding Planner',
        icon: Palette,
        color: 'purple',
        completed: !!(currentDraft.brandingData?.brandName),
        priority: 'low'
      },
      'documents': {
        label: 'Documents & Compliance',
        icon: Shield,
        color: 'red',
        completed: !!(currentDraft.complianceData?.documents?.length > 0),
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
        actions.setActiveTab(id);
        if (onSwitchToDetailed) onSwitchToDetailed();
      }
    }));
  }, [sectionStatus, actions]);

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
    <div className="space-y-6">
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
                  <div key={id} className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
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
                    </div>
                  </div>
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
                actions.setActiveTab('startup-journey');
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
                actions.setActiveTab('opening-plan');
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
                actions.setActiveTab('documents');
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
    </div>
  );
};

export default DashboardOverview;
