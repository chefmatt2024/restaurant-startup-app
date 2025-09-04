import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import SectionCard from '../ui/SectionCard';
import {
  Calendar, CheckCircle, Clock, DollarSign, FileText, MapPin, 
  Building, Users, Utensils, Truck, Shield, Target, TrendingUp,
  AlertCircle, Info, Star, ArrowRight, Play, BookOpen, Zap, Lightbulb,
  BarChart3
} from 'lucide-react';

const OpeningPlan = () => {
  const { state } = useApp();
  const [activePhase, setActivePhase] = useState('preparation');
  const [completedTasks, setCompletedTasks] = useState(new Set());

  const [showCelebration, setShowCelebration] = useState(false);
  const [lastCompletedTask, setLastCompletedTask] = useState(null);

  const toggleTaskCompletion = (taskId) => {
    const newCompleted = new Set(completedTasks);
    const wasCompleted = newCompleted.has(taskId);
    
    if (wasCompleted) {
      newCompleted.delete(taskId);
      setLastCompletedTask(null);
    } else {
      newCompleted.add(taskId);
      // Find the task details for celebration
      const task = openingPhases.flatMap(phase => phase.tasks).find(t => t.id === taskId);
      setLastCompletedTask(task);
      setShowCelebration(true);
      
      // Hide celebration after 3 seconds
      setTimeout(() => setShowCelebration(false), 3000);
    }
    
    setCompletedTasks(newCompleted);
  };

  const getProgressPercentage = (phaseTasks) => {
    const completed = phaseTasks.filter(task => completedTasks.has(task.id)).length;
    return Math.round((completed / phaseTasks.length) * 100);
  };

  // Get next priority tasks across all phases
  const getNextPriorityTasks = () => {
    const allTasks = openingPhases.flatMap(phase => 
      phase.tasks.map(task => ({
        ...task,
        phaseId: phase.id,
        phaseTitle: phase.title,
        phaseColor: phase.color
      }))
    );
    
    // Filter incomplete tasks and sort by priority and phase order
    const incompleteTasks = allTasks.filter(task => !completedTasks.has(task.id));
    
    const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
    const phaseOrder = { 'preparation': 1, 'financial': 2, 'location': 3, 'permits': 4, 'buildout': 5, 'operations': 6 };
    
    return incompleteTasks.sort((a, b) => {
      // First by priority
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      // Then by phase order
      return phaseOrder[a.phaseId] - phaseOrder[b.phaseId];
    }).slice(0, 5); // Show top 5 next tasks
  };

  // Get overall progress across all phases
  const getOverallProgress = () => {
    const totalTasks = openingPhases.reduce((acc, phase) => acc + phase.tasks.length, 0);
    const completedCount = completedTasks.size;
    return {
      percentage: Math.round((completedCount / totalTasks) * 100),
      completed: completedCount,
      total: totalTasks
    };
  };

  // Comprehensive Opening Plan Phases
  const openingPhases = [
    {
      id: 'preparation',
      title: 'Phase 1: Preparation & Planning',
      description: 'Lay the foundation for your restaurant success',
      duration: '2-4 weeks',
      color: 'blue',
      tasks: [
        {
          id: 'business-concept',
          title: 'Define Business Concept',
          description: 'Finalize your restaurant concept, cuisine type, and target market',
          timeEstimate: '3-5 days',
          priority: 'High',
          category: 'ideation',
          bostonTip: 'Boston loves authentic, chef-driven concepts. Consider seasonal menus and local sourcing.',
          actions: [
            'Complete Idea Formation section',
            'Define your unique value proposition',
            'Research Boston food trends and gaps',
            'Create elevator pitch'
          ]
        },
        {
          id: 'business-plan',
          title: 'Create Business Plan',
          description: 'Develop comprehensive business plan with financial projections',
          timeEstimate: '1-2 weeks',
          priority: 'High',
          category: 'planning',
          bostonTip: 'Include detailed market analysis for your target neighborhood. Boston has diverse demographics.',
          actions: [
            'Complete Executive Summary',
            'Conduct Market Analysis',
            'Create Financial Projections',
            'Define Operations Plan'
          ]
        },
        {
          id: 'team-planning',
          title: 'Plan Management Team',
          description: 'Outline key roles and organizational structure',
          timeEstimate: '3-5 days',
          priority: 'Medium',
          category: 'planning',
          bostonTip: 'Boston has a strong culinary talent pool. Plan for competitive salaries and benefits.',
          actions: [
            'Define key management roles',
            'Create organizational chart',
            'Plan compensation structure',
            'Identify potential advisors'
          ]
        }
      ]
    },
    {
      id: 'financial',
      title: 'Phase 2: Financial Planning & Funding',
      description: 'Secure the resources needed to launch',
      duration: '3-6 weeks',
      color: 'green',
      tasks: [
        {
          id: 'cost-analysis',
          title: 'Calculate Startup Costs',
          description: 'Determine total investment needed for Boston market',
          timeEstimate: '1 week',
          priority: 'High',
          category: 'financial',
          bostonTip: 'Boston restaurant startup costs: $175K-$400K. Include 20% contingency for unexpected expenses.',
          actions: [
            'Use Financial Projections tool',
            'Research Boston real estate costs',
            'Calculate equipment and buildout costs',
            'Estimate working capital needs'
          ]
        },
        {
          id: 'funding-strategy',
          title: 'Develop Funding Strategy',
          description: 'Identify and secure funding sources',
          timeEstimate: '2-4 weeks',
          priority: 'High',
          category: 'financial',
          bostonTip: 'Consider SBA loans, local business grants, and angel investors familiar with Boston market.',
          actions: [
            'Assess personal investment capacity',
            'Research SBA loan options',
            'Identify potential investors',
            'Prepare funding presentations'
          ]
        },
        {
          id: 'financial-documents',
          title: 'Prepare Financial Documents',
          description: 'Create professional financial packages for lenders/investors',
          timeEstimate: '1 week',
          priority: 'Medium',
          category: 'financial',
          bostonTip: 'Boston lenders appreciate detailed market analysis and conservative projections.',
          actions: [
            'Create 3-year financial projections',
            'Prepare cash flow analysis',
            'Develop break-even analysis',
            'Assemble funding package'
          ]
        },
        {
          id: 'boston-funding-opportunities',
          title: 'Boston-Specific Funding Opportunities',
          description: 'Research and apply for Boston-specific grants and funding programs',
          timeEstimate: '2-3 weeks',
          priority: 'Medium',
          category: 'financial',
          bostonTip: 'Boston offers several small business grants and programs. Check the Mayor\'s Office of Economic Development for current opportunities.',
          actions: [
            'Research Boston small business grants',
            'Apply for Mayor\'s Office of Economic Development programs',
            'Check Massachusetts Growth Capital Corporation opportunities',
            'Investigate neighborhood-specific funding programs',
            'Apply for diversity and inclusion business grants'
          ]
        }
      ]
    },
    {
      id: 'location',
      title: 'Phase 3: Location & Real Estate',
      description: 'Find and secure your perfect location',
      duration: '4-8 weeks',
      color: 'purple',
      tasks: [
        {
          id: 'neighborhood-research',
          title: 'Research Target Neighborhoods',
          description: 'Analyze Boston neighborhoods for optimal location',
          timeEstimate: '1-2 weeks',
          priority: 'High',
          category: 'location',
          bostonTip: 'Consider foot traffic, parking, T-accessibility, and neighborhood character. Popular areas: Back Bay, South End, Cambridge.',
          actions: [
            'Walk target neighborhoods',
            'Analyze foot traffic patterns',
            'Research parking availability',
            'Evaluate T-accessibility'
          ]
        },
        {
          id: 'property-search',
          title: 'Search for Properties',
          description: 'Find available commercial spaces that meet your criteria',
          timeEstimate: '2-4 weeks',
          priority: 'High',
          category: 'location',
          bostonTip: 'Work with commercial real estate agents familiar with Boston restaurant market. Space moves quickly.',
          actions: [
            'Engage commercial real estate agent',
            'Set up property alerts',
            'Schedule property viewings',
            'Evaluate space requirements'
          ]
        },
        {
          id: 'lease-negotiation',
          title: 'Negotiate Lease Terms',
          description: 'Secure favorable lease terms and conditions',
          timeEstimate: '1-2 weeks',
          priority: 'High',
          category: 'location',
          bostonTip: 'Boston commercial leases are complex. Consider buildout allowances, rent escalations, and renewal options.',
          actions: [
            'Review lease terms carefully',
            'Negotiate buildout allowances',
            'Secure option periods',
            'Consult with attorney'
          ]
        },
        {
          id: 'boston-zoning-compliance',
          title: 'Boston Zoning & Neighborhood Compliance',
          description: 'Ensure location complies with Boston zoning laws and neighborhood requirements',
          timeEstimate: '1-2 weeks',
          priority: 'High',
          category: 'location',
          bostonTip: 'Boston has strict zoning laws. Some neighborhoods have additional restrictions on restaurant operations.',
          actions: [
            'Verify zoning compliance for restaurant use',
            'Check neighborhood-specific restrictions',
            'Review parking requirements',
            'Confirm signage regulations',
            'Check noise and operating hour restrictions'
          ]
        }
      ]
    },
    {
      id: 'permits',
      title: 'Phase 4: Permits & Compliance',
      description: 'Navigate Boston\'s regulatory requirements',
      duration: '2-4 months',
      color: 'red',
      tasks: [
        {
          id: 'business-certificate',
          title: 'City of Boston Business Certificate',
          description: 'Obtain the required City of Boston Business Certificate (formerly Business License)',
          timeEstimate: '2-4 weeks',
          priority: 'High',
          category: 'compliance',
          bostonTip: 'The Business Certificate is mandatory for all businesses operating in Boston. Apply online through the City of Boston website.',
          actions: [
            'Complete online application at boston.gov',
            'Provide business name and address',
            'Submit required documentation',
            'Pay $50 application fee',
            'Receive certificate within 2-4 weeks'
          ]
        },
        {
          id: 'business-licenses',
          title: 'Additional Business Licenses',
          description: 'Secure all required business and operational licenses beyond the basic certificate',
          timeEstimate: '4-6 weeks',
          priority: 'High',
          category: 'compliance',
          bostonTip: 'Boston requires multiple specialized licenses. Each has different requirements and timelines.',
          actions: [
            'Apply for food service establishment license',
            'Obtain common victualler license (if serving food)',
            'Secure entertainment license (if applicable)',
            'Get health department approval',
            'Apply for signage permit'
          ]
        },
        {
          id: 'alcohol-licensing',
          title: 'Alcohol License (if applicable)',
          description: 'Secure alcohol license from Boston Licensing Board',
          timeEstimate: '8-12 weeks',
          priority: 'Medium',
          category: 'compliance',
          bostonTip: 'Alcohol licenses in Boston are highly regulated. Consider hiring a licensing attorney for complex applications.',
          actions: [
            'Determine license type needed (beer/wine vs. full liquor)',
            'Complete application with Boston Licensing Board',
            'Submit floor plans and business plan',
            'Attend public hearing',
            'Pay licensing fees ($1,200-$3,000 annually)'
          ]
        },
        {
          id: 'building-permits',
          title: 'Secure Building Permits',
          description: 'Obtain permits for construction and buildout',
          timeEstimate: '4-8 weeks',
          priority: 'High',
          category: 'compliance',
          bostonTip: 'Boston building permits require detailed plans. Work with experienced architects and contractors.',
          actions: [
            'Submit architectural plans',
            'Obtain building permits',
            'Secure electrical permits',
            'Get plumbing permits'
          ]
        },
        {
          id: 'inspections',
          title: 'Schedule Inspections',
          description: 'Complete all required inspections before opening',
          timeEstimate: '1-2 weeks',
          priority: 'High',
          category: 'compliance',
          bostonTip: 'Schedule inspections early. Boston inspectors are thorough and may require multiple visits.',
          actions: [
            'Schedule building inspection',
            'Complete health inspection',
            'Pass fire safety inspection',
            'Get final occupancy permit'
          ]
        },
        {
          id: 'boston-specific-requirements',
          title: 'Boston-Specific Requirements',
          description: 'Complete additional Boston-specific regulatory requirements',
          timeEstimate: '2-3 weeks',
          priority: 'High',
          category: 'compliance',
          bostonTip: 'Boston has unique requirements including accessibility compliance, environmental regulations, and neighborhood-specific rules.',
          actions: [
            'Complete accessibility compliance review',
            'Submit environmental impact assessment',
            'Obtain neighborhood association approval (if required)',
            'Register with Boston Business Directory',
            'Complete diversity and inclusion training (if applicable)'
          ]
        }
      ]
    },
    {
      id: 'buildout',
      title: 'Phase 5: Buildout & Equipment',
      description: 'Transform your space into a restaurant',
      duration: '2-4 months',
      color: 'orange',
      tasks: [
        {
          id: 'design-planning',
          title: 'Plan Design & Layout',
          description: 'Create functional and attractive restaurant design',
          timeEstimate: '2-3 weeks',
          priority: 'High',
          category: 'buildout',
          bostonTip: 'Boston diners appreciate thoughtful design. Consider seasonal outdoor dining options.',
          actions: [
            'Work with restaurant designer',
            'Plan kitchen layout',
            'Design dining room flow',
            'Plan outdoor space (if applicable)'
          ]
        },
        {
          id: 'equipment-selection',
          title: 'Select & Order Equipment',
          description: 'Choose and procure all necessary equipment',
          timeEstimate: '3-4 weeks',
          priority: 'High',
          category: 'buildout',
          bostonTip: 'Boston has excellent restaurant equipment suppliers. Consider energy efficiency and maintenance.',
          actions: [
            'Use Equipment Planning tool',
            'Get multiple vendor quotes',
            'Order long-lead items first',
            'Plan equipment delivery schedule'
          ]
        },
        {
          id: 'construction',
          title: 'Manage Construction',
          description: 'Oversee buildout and construction process',
          timeEstimate: '6-12 weeks',
          priority: 'High',
          category: 'buildout',
          bostonTip: 'Boston construction costs are high. Get multiple bids and plan for delays.',
          actions: [
            'Hire experienced contractor',
            'Monitor construction progress',
            'Manage change orders',
            'Ensure quality control'
          ]
        }
      ]
    },
    {
      id: 'operations',
      title: 'Phase 6: Operations & Launch',
      description: 'Prepare for opening and launch operations',
      duration: '1-2 months',
      color: 'indigo',
      tasks: [
        {
          id: 'staffing',
          title: 'Hire & Train Staff',
          description: 'Build your team and prepare them for opening',
          timeEstimate: '3-4 weeks',
          priority: 'High',
          category: 'operations',
          bostonTip: 'Boston has a competitive labor market. Offer competitive wages and benefits to attract talent.',
          actions: [
            'Create job descriptions',
            'Recruit key staff members',
            'Develop training programs',
            'Establish HR policies'
          ]
        },
        {
          id: 'menu-development',
          title: 'Finalize Menu & Pricing',
          description: 'Complete menu development and pricing strategy',
          timeEstimate: '2-3 weeks',
          priority: 'Medium',
          category: 'operations',
          bostonTip: 'Boston diners appreciate seasonal menus and local ingredients. Price competitively for your neighborhood.',
          actions: [
            'Complete menu planning',
            'Set pricing strategy',
            'Source ingredients',
            'Test recipes'
          ]
        },
        {
          id: 'marketing-launch',
          title: 'Launch Marketing Campaign',
          description: 'Create buzz and attract customers',
          timeEstimate: '2-3 weeks',
          priority: 'Medium',
          category: 'operations',
          bostonTip: 'Boston has active food media and social media communities. Leverage local influencers and food bloggers.',
          actions: [
            'Develop marketing strategy',
            'Create social media presence',
            'Plan grand opening events',
            'Engage local media'
          ]
        },
        {
          id: 'soft-opening',
          title: 'Conduct Soft Opening',
          description: 'Test operations with limited customers',
          timeEstimate: '1 week',
          priority: 'High',
          category: 'operations',
          bostonTip: 'Use soft opening to refine operations. Boston diners are forgiving during this phase.',
          actions: [
            'Invite friends and family',
            'Test all systems',
            'Refine operations',
            'Gather feedback'
          ]
        },
        {
          id: 'boston-operations-compliance',
          title: 'Boston Operations Compliance',
          description: 'Ensure ongoing compliance with Boston-specific operational requirements',
          timeEstimate: '1 week',
          priority: 'High',
          category: 'operations',
          bostonTip: 'Boston has ongoing compliance requirements including waste management, accessibility, and labor regulations.',
          actions: [
            'Set up waste management and recycling program',
            'Ensure accessibility compliance',
            'Implement labor law compliance procedures',
            'Register for Boston business tax requirements',
            'Set up ongoing permit renewal calendar'
          ]
        }
      ]
    }
  ];

  const getPhaseColor = (color) => {
    const colors = {
      blue: 'border-blue-200 bg-blue-50',
      green: 'border-green-200 bg-green-50',
      purple: 'border-purple-200 bg-purple-50',
      red: 'border-red-200 bg-red-50',
      orange: 'border-orange-200 bg-orange-50',
      indigo: 'border-indigo-200 bg-indigo-50'
    };
    return colors[color] || 'border-gray-200 bg-gray-50';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      High: 'bg-red-100 text-red-800',
      Medium: 'bg-yellow-100 text-yellow-800',
      Low: 'bg-green-100 text-green-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      ideation: Lightbulb,
      planning: BookOpen,
      financial: DollarSign,
      location: MapPin,
      compliance: Shield,
      buildout: Building,
      operations: Users
    };
    return icons[category] || Info;
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <SectionCard
        title="🎯 Your Boston Restaurant Opening Plan"
        description="A comprehensive roadmap to successfully open your restaurant in Boston, incorporating local insights and best practices."
        color="blue"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-100 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Overall Progress</h4>
            <div className="text-2xl font-bold text-blue-700">
              {Math.round((completedTasks.size / openingPhases.reduce((acc, phase) => acc + phase.tasks.length, 0)) * 100)}%
            </div>
            <div className="text-sm text-blue-600">Complete</div>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Tasks Completed</h4>
            <div className="text-2xl font-bold text-green-700">{completedTasks.size}</div>
            <div className="text-sm text-green-600">of {openingPhases.reduce((acc, phase) => acc + phase.tasks.length, 0)} tasks</div>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2">Estimated Timeline</h4>
            <div className="text-lg font-bold text-purple-700">8-12 months</div>
            <div className="text-sm text-purple-600">from start to opening</div>
          </div>
          <div className="bg-orange-100 p-4 rounded-lg">
            <h4 className="font-semibold text-orange-800 mb-2">Current Phase</h4>
            <div className="text-lg font-bold text-orange-700">
              {openingPhases.find(p => p.id === activePhase)?.title.split(':')[0]}
            </div>
            <div className="text-sm text-orange-600">Active</div>
          </div>
        </div>
      </SectionCard>

      {/* Enhanced Progress & Next Steps */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {/* Progress Timeline */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
            Your Opening Journey Timeline
          </h3>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            <div className="space-y-4">
              {openingPhases.map((phase, index) => {
                const progress = getProgressPercentage(phase.tasks);
                const isCompleted = progress === 100;
                const isCurrent = activePhase === phase.id;
                const isUpcoming = index > openingPhases.findIndex(p => p.id === activePhase);
                
                return (
                  <div key={phase.id} className="relative flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      isCompleted ? 'bg-green-500 border-green-500 text-white' :
                      isCurrent ? 'bg-blue-500 border-blue-500 text-white' :
                      isUpcoming ? 'bg-gray-200 border-gray-300 text-gray-400' :
                      'bg-gray-100 border-gray-200 text-gray-500'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    <div className={`flex-1 min-w-0 ${isUpcoming ? 'opacity-50' : ''}`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className={`text-sm font-semibold ${
                          isCompleted ? 'text-green-700' :
                          isCurrent ? 'text-blue-700' :
                          'text-gray-700'
                        }`}>
                          {phase.title}
                        </h4>
                        <span className="text-xs text-gray-500">({phase.duration})</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{phase.description}</p>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            isCompleted ? 'bg-green-500' :
                            isCurrent ? 'bg-blue-500' : 'bg-gray-300'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {progress}% complete
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Overall Progress */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Target className="h-5 w-5 mr-2 text-blue-600" />
              Overall Progress
            </h3>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
              <div className="text-center mb-3">
                <div className="text-3xl font-bold text-blue-700">
                  {getOverallProgress().percentage}%
                </div>
                <div className="text-sm text-blue-600">
                  {getOverallProgress().completed} of {getOverallProgress().total} tasks completed
                </div>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-3 mb-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${getOverallProgress().percentage}%` }}
                />
              </div>
              <div className="text-xs text-blue-600 text-center">
                {getOverallProgress().percentage >= 100 ? '🎉 All tasks completed!' : 
                 getOverallProgress().percentage >= 75 ? '🚀 Almost there!' :
                 getOverallProgress().percentage >= 50 ? '📈 Halfway there!' :
                 getOverallProgress().percentage >= 25 ? '💪 Getting started!' : '🌟 Let\'s begin!'}
              </div>
            </div>
          </div>

          {/* Phase Progress Summary */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="h-5 w-4 mr-2 text-green-600" />
              Phase Progress
            </h3>
            <div className="space-y-3">
              {openingPhases.map((phase) => {
                const progress = getProgressPercentage(phase.tasks);
                const completedCount = phase.tasks.filter(task => completedTasks.has(task.id)).length;
                return (
                  <div key={phase.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {phase.title.split(':')[0]}
                      </span>
                      <span className="text-xs text-gray-500">
                        {completedCount}/{phase.tasks.length}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          progress === 100 ? 'bg-green-500' :
                          progress >= 75 ? 'bg-blue-500' :
                          progress >= 50 ? 'bg-yellow-500' :
                          progress >= 25 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Next Priority Tasks */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <ArrowRight className="h-5 w-4 mr-2 text-purple-600" />
              What to Do Next
            </h3>
            <div className="space-y-3">
              {getNextPriorityTasks().map((task, index) => (
                <div key={task.id} className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-3">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-purple-700">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">{task.title}</h4>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{task.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-purple-600 font-medium">{task.phaseTitle.split(':')[0]}</span>
                        <button
                          onClick={() => {
                            setActivePhase(task.phaseId);
                            toggleTaskCompletion(task.id);
                          }}
                          className="text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700 transition-colors"
                        >
                          Mark Complete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Phase Navigation */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-wrap gap-2">
          {openingPhases.map((phase) => (
            <button
              key={phase.id}
              onClick={() => setActivePhase(phase.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activePhase === phase.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {phase.title.split(':')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Active Phase Content */}
      {openingPhases.map((phase) => (
        phase.id === activePhase && (
          <div key={phase.id} className="space-y-6">
            {/* Phase Header */}
            <div className={`border-2 rounded-lg p-6 ${getPhaseColor(phase.color)}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{phase.title}</h2>
                  <p className="text-gray-700 mb-3">{phase.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Duration: {phase.duration}
                    </span>
                    <span className="flex items-center">
                      <Target className="h-4 w-4 mr-1" />
                      Progress: {getProgressPercentage(phase.tasks)}%
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-700">
                    {getProgressPercentage(phase.tasks)}%
                  </div>
                  <div className="text-sm text-gray-600">Complete</div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage(phase.tasks)}%` }}
                />
              </div>
            </div>

            {/* Tasks */}
            <div className="space-y-4">
              {phase.tasks.map((task) => (
                <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {(() => {
                          const IconComponent = getCategoryIcon(task.category);
                          return <IconComponent className="h-5 w-5 text-blue-600" />;
                        })()}
                        <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{task.description}</p>
                      
                      {/* Boston Tip */}
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                        <div className="flex items-start space-x-2">
                          <MapPin className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h5 className="font-medium text-green-900 text-sm">Boston Tip:</h5>
                            <p className="text-sm text-green-700">{task.bostonTip}</p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <h5 className="font-medium text-blue-900 text-sm mb-2">Actions:</h5>
                        <ul className="space-y-1">
                          {task.actions.map((action, index) => (
                            <li key={index} className="flex items-start space-x-2 text-sm text-blue-800">
                              <span className="flex-shrink-0 w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center mt-0.5">
                                <span className="text-xs font-medium text-blue-700">{index + 1}</span>
                              </span>
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="ml-4 text-right">
                      <div className="text-sm text-gray-500 mb-2">
                        <Clock className="h-4 w-4 inline mr-1" />
                        {task.timeEstimate}
                      </div>
                      <button
                        onClick={() => toggleTaskCompletion(task.id)}
                        className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                          completedTasks.has(task.id)
                            ? 'bg-green-600 text-white'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {completedTasks.has(task.id) ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Completed
                          </>
                        ) : (
                          <>
                            <Star className="h-4 w-4 mr-2" />
                            Mark Complete
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      ))}

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Zap className="h-5 w-5 mr-2 text-blue-600" />
          Quick Actions - Jump to Specific Areas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <BookOpen className="h-8 w-8 text-blue-600 mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Business Plan</h4>
            <p className="text-sm text-gray-600">Complete your business plan sections</p>
          </div>
          <div className="p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <DollarSign className="h-8 w-8 text-green-600 mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Financial Planning</h4>
            <p className="text-sm text-gray-600">Calculate costs and projections</p>
          </div>
          <div className="p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <Shield className="h-8 w-8 text-red-600 mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Compliance</h4>
            <p className="text-sm text-gray-600">Check permits and requirements</p>
          </div>
          <div className="p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <Building className="h-8 w-8 text-orange-600 mb-3" />
            <h4 className="font-semibold text-gray-900 mb-2">Equipment</h4>
            <p className="text-sm text-gray-600">Plan your equipment needs</p>
          </div>
        </div>
      </div>

      {/* Boston-Specific Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-blue-600" />
          Boston Restaurant Market Insights
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 text-sm">Market Opportunities</h4>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">Strong food culture with diverse demographics</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">High foot traffic in popular neighborhoods</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">Excellent public transportation access</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">Active food media and social media communities</span>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 text-sm">Key Challenges</h4>
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">High real estate and labor costs</span>
            </div>
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">Complex permitting process (2-4 months)</span>
            </div>
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">Competitive market with high standards</span>
            </div>
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">Strict zoning and neighborhood regulations</span>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 text-sm">Boston-Specific Requirements</h4>
            <div className="flex items-start space-x-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">City of Boston Business Certificate required</span>
            </div>
            <div className="flex items-start space-x-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">Multiple specialized licenses needed</span>
            </div>
            <div className="flex items-start space-x-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">Accessibility compliance mandatory</span>
            </div>
            <div className="flex items-start space-x-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-700">Waste management and recycling programs</span>
            </div>
          </div>
        </div>
      </div>

       {/* Task Summary & Statistics */}
       <div className="bg-white border border-gray-200 rounded-lg p-6">
         <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
           <BarChart3 className="h-5 w-5 mr-2 text-indigo-600" />
           Task Summary & Statistics
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
           <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-center">
             <div className="text-2xl font-bold text-indigo-700 mb-1">
               {openingPhases.length}
             </div>
             <div className="text-sm text-indigo-600">Total Phases</div>
           </div>
           <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
             <div className="text-2xl font-bold text-green-700 mb-1">
               {openingPhases.reduce((acc, phase) => acc + phase.tasks.length, 0)}
             </div>
             <div className="text-sm text-green-600">Total Tasks</div>
           </div>
           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
             <div className="text-2xl font-bold text-blue-700 mb-1">
               {openingPhases.flatMap(phase => phase.tasks).filter(task => task.priority === 'High').length}
             </div>
             <div className="text-sm text-blue-600">High Priority</div>
           </div>
           <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
             <div className="text-2xl font-bold text-purple-700 mb-1">
               {Math.round((completedTasks.size / openingPhases.reduce((acc, phase) => acc + phase.tasks.length, 0)) * 100)}%
             </div>
             <div className="text-sm text-purple-600">Completion Rate</div>
           </div>
         </div>
       </div>

       {/* Celebration Modal */}
       {showCelebration && lastCompletedTask && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
           <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center animate-bounce">
             <div className="text-6xl mb-4">🎉</div>
             <h3 className="text-xl font-bold text-gray-900 mb-2">Task Completed!</h3>
             <p className="text-gray-600 mb-4">{lastCompletedTask.title}</p>
             <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
               <p className="text-sm text-green-700">
                 Great progress! You're one step closer to opening your Boston restaurant.
               </p>
             </div>
             <button
               onClick={() => setShowCelebration(false)}
               className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
             >
               Continue
             </button>
           </div>
         </div>
       )}
     </div>
   );
 };

export default OpeningPlan;
