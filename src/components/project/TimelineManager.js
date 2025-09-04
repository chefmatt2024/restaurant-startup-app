import React, { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import SectionCard from '../ui/SectionCard';
import { Calendar, CheckCircle, Clock, AlertTriangle, Target, Users, Building, FileText, ChefHat } from 'lucide-react';

const TimelineManager = () => {
  const { state, actions } = useApp();
  const [selectedPhase, setSelectedPhase] = useState('all');
  const [showCompleted, setShowCompleted] = useState(true);

  // Restaurant launch timeline with realistic timeframes
  const defaultTimeline = [
    // Phase 1: Planning & Permits (Weeks 1-8)
    {
      id: 'concept-development',
      title: 'Concept Development',
      phase: 'planning',
      category: 'business',
      durationWeeks: 2,
      startWeek: 1,
      priority: 'high',
      dependencies: [],
      tasks: [
        'Complete business plan',
        'Finalize menu concept',
        'Determine target market',
        'Set pricing strategy'
      ],
      status: 'not-started',
      notes: ''
    },
    {
      id: 'location-search',
      title: 'Location Search & Lease',
      phase: 'planning',
      category: 'real-estate',
      durationWeeks: 4,
      startWeek: 1,
      priority: 'high',
      dependencies: [],
      tasks: [
        'Research Boston neighborhoods',
        'Tour potential locations',
        'Negotiate lease terms',
        'Sign lease agreement'
      ],
      status: 'not-started',
      notes: ''
    },
    {
      id: 'permits-licenses',
      title: 'Permits & Licenses',
      phase: 'planning',
      category: 'legal',
      durationWeeks: 6,
      startWeek: 3,
      priority: 'high',
      dependencies: ['location-search'],
      tasks: [
        'Apply for business license',
        'Submit food service permit',
        'Apply for liquor license',
        'Get building permits',
        'Fire department approval'
      ],
      status: 'not-started',
      notes: ''
    },
    {
      id: 'financing',
      title: 'Secure Financing',
      phase: 'planning',
      category: 'finance',
      durationWeeks: 4,
      startWeek: 2,
      priority: 'high',
      dependencies: ['concept-development'],
      tasks: [
        'Prepare financial projections',
        'Submit loan applications',
        'Meet with investors',
        'Secure funding commitments'
      ],
      status: 'not-started',
      notes: ''
    },

    // Phase 2: Design & Construction (Weeks 6-16)
    {
      id: 'design-planning',
      title: 'Design & Architecture',
      phase: 'construction',
      category: 'design',
      durationWeeks: 3,
      startWeek: 6,
      priority: 'high',
      dependencies: ['location-search', 'permits-licenses'],
      tasks: [
        'Hire architect/designer',
        'Create floor plans',
        'Design kitchen layout',
        'Select interior finishes'
      ],
      status: 'not-started',
      notes: ''
    },
    {
      id: 'construction',
      title: 'Construction & Renovation',
      phase: 'construction',
      category: 'construction',
      durationWeeks: 8,
      startWeek: 9,
      priority: 'high',
      dependencies: ['design-planning'],
      tasks: [
        'Hire general contractor',
        'Demolition work',
        'Electrical & plumbing',
        'Kitchen installation',
        'Dining room buildout'
      ],
      status: 'not-started',
      notes: ''
    },
    {
      id: 'equipment-procurement',
      title: 'Equipment & Furniture',
      phase: 'construction',
      category: 'procurement',
      durationWeeks: 4,
      startWeek: 10,
      priority: 'medium',
      dependencies: ['design-planning'],
      tasks: [
        'Order kitchen equipment',
        'Purchase furniture',
        'Install POS system',
        'Set up sound/lighting'
      ],
      status: 'not-started',
      notes: ''
    },

    // Phase 3: Operations Setup (Weeks 14-20)
    {
      id: 'staff-hiring',
      title: 'Staff Recruitment',
      phase: 'operations',
      category: 'staffing',
      durationWeeks: 4,
      startWeek: 14,
      priority: 'high',
      dependencies: ['permits-licenses'],
      tasks: [
        'Post job listings',
        'Interview candidates',
        'Background checks',
        'Hire key positions'
      ],
      status: 'not-started',
      notes: ''
    },
    {
      id: 'staff-training',
      title: 'Staff Training',
      phase: 'operations',
      category: 'staffing',
      durationWeeks: 2,
      startWeek: 17,
      priority: 'high',
      dependencies: ['staff-hiring'],
      tasks: [
        'ServSafe certification',
        'POS system training',
        'Menu training',
        'Service standards'
      ],
      status: 'not-started',
      notes: ''
    },
    {
      id: 'vendor-setup',
      title: 'Vendor Relationships',
      phase: 'operations',
      category: 'procurement',
      durationWeeks: 2,
      startWeek: 16,
      priority: 'medium',
      dependencies: ['permits-licenses'],
      tasks: [
        'Set up food suppliers',
        'Establish delivery schedules',
        'Negotiate pricing',
        'Set up accounts'
      ],
      status: 'not-started',
      notes: ''
    },
    {
      id: 'menu-testing',
      title: 'Menu Development & Testing',
      phase: 'operations',
      category: 'culinary',
      durationWeeks: 3,
      startWeek: 16,
      priority: 'high',
      dependencies: ['equipment-procurement', 'staff-hiring'],
      tasks: [
        'Recipe development',
        'Cost analysis',
        'Tasting sessions',
        'Menu finalization'
      ],
      status: 'not-started',
      notes: ''
    },

    // Phase 4: Marketing & Launch (Weeks 18-24)
    {
      id: 'marketing-setup',
      title: 'Marketing & Branding',
      phase: 'launch',
      category: 'marketing',
      durationWeeks: 4,
      startWeek: 18,
      priority: 'medium',
      dependencies: ['design-planning'],
      tasks: [
        'Create website',
        'Social media setup',
        'Design marketing materials',
        'Local PR outreach'
      ],
      status: 'not-started',
      notes: ''
    },
    {
      id: 'soft-opening',
      title: 'Soft Opening',
      phase: 'launch',
      category: 'operations',
      durationWeeks: 1,
      startWeek: 20,
      priority: 'high',
      dependencies: ['construction', 'staff-training', 'menu-testing'],
      tasks: [
        'Friends & family service',
        'Test all systems',
        'Collect feedback',
        'Make adjustments'
      ],
      status: 'not-started',
      notes: ''
    },
    {
      id: 'grand-opening',
      title: 'Grand Opening',
      phase: 'launch',
      category: 'marketing',
      durationWeeks: 1,
      startWeek: 22,
      priority: 'high',
      dependencies: ['soft-opening', 'marketing-setup'],
      tasks: [
        'Grand opening event',
        'Media coverage',
        'Special promotions',
        'Community engagement'
      ],
      status: 'not-started',
      notes: ''
    }
  ];

  // Load timeline from state or use default
  const timeline = state.projectTimeline || defaultTimeline;

  const phases = [
    { id: 'all', label: 'All Phases', color: 'gray' },
    { id: 'planning', label: 'Planning & Permits', color: 'blue' },
    { id: 'construction', label: 'Design & Construction', color: 'orange' },
    { id: 'operations', label: 'Operations Setup', color: 'green' },
    { id: 'launch', label: 'Marketing & Launch', color: 'purple' }
  ];

  const categories = {
    business: { icon: FileText, color: 'blue' },
    'real-estate': { icon: Building, color: 'indigo' },
    legal: { icon: FileText, color: 'red' },
    finance: { icon: Target, color: 'green' },
    design: { icon: Building, color: 'purple' },
    construction: { icon: Building, color: 'orange' },
    procurement: { icon: Target, color: 'yellow' },
    staffing: { icon: Users, color: 'teal' },
    culinary: { icon: ChefHat, color: 'pink' },
    marketing: { icon: Target, color: 'indigo' },
    operations: { icon: Clock, color: 'emerald' }
  };

  const filteredTimeline = useMemo(() => {
    return timeline.filter(item => {
      if (selectedPhase !== 'all' && item.phase !== selectedPhase) return false;
      if (!showCompleted && item.status === 'completed') return false;
      return true;
    }).sort((a, b) => a.startWeek - b.startWeek);
  }, [timeline, selectedPhase, showCompleted]);

  const updateMilestoneStatus = (milestoneId, status, notes = '') => {
    const updatedTimeline = timeline.map(item => 
      item.id === milestoneId 
        ? { ...item, status, notes, completedDate: status === 'completed' ? new Date().toISOString() : null }
        : item
    );
    actions.updateProjectTimeline(updatedTimeline);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'delayed': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'on-hold': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const timelineStats = useMemo(() => {
    const total = timeline.length;
    const completed = timeline.filter(item => item.status === 'completed').length;
    const inProgress = timeline.filter(item => item.status === 'in-progress').length;
    const delayed = timeline.filter(item => item.status === 'delayed').length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, inProgress, delayed, progress };
  }, [timeline]);

  const getDependencyStatus = (dependencies) => {
    if (!dependencies || dependencies.length === 0) return 'ready';
    
    const dependentItems = timeline.filter(item => dependencies.includes(item.id));
    const allCompleted = dependentItems.every(item => item.status === 'completed');
    const anyDelayed = dependentItems.some(item => item.status === 'delayed');
    
    if (allCompleted) return 'ready';
    if (anyDelayed) return 'blocked';
    return 'waiting';
  };

  return (
    <div className="animate-fade-in">
      <SectionCard 
        title="Restaurant Launch Timeline" 
        description="Track your progress from concept to grand opening with our comprehensive project management system."
        color="indigo"
      >
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-blue-600">Total Milestones</p>
            <p className="text-2xl font-bold text-blue-900">{timelineStats.total}</p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-green-600">Completed</p>
            <p className="text-2xl font-bold text-green-900">{timelineStats.completed}</p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-blue-600">In Progress</p>
            <p className="text-2xl font-bold text-blue-900">{timelineStats.inProgress}</p>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-red-600">Delayed</p>
            <p className="text-2xl font-bold text-red-900">{timelineStats.delayed}</p>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
            <Target className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-purple-600">Progress</p>
            <p className="text-2xl font-bold text-purple-900">{timelineStats.progress}%</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm font-medium text-gray-700 mb-2">
            <span>Overall Progress</span>
            <span>{timelineStats.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${timelineStats.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Phase:</span>
            {phases.map(phase => (
              <button
                key={phase.id}
                onClick={() => setSelectedPhase(phase.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedPhase === phase.id
                    ? `bg-${phase.color}-100 text-${phase.color}-800`
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {phase.label}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="showCompleted"
              checked={showCompleted}
              onChange={(e) => setShowCompleted(e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="showCompleted" className="text-sm font-medium text-gray-700">
              Show completed
            </label>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          {filteredTimeline.map((milestone, index) => {
            const CategoryIcon = categories[milestone.category]?.icon || FileText;
            const dependencyStatus = getDependencyStatus(milestone.dependencies);
            
            return (
              <div 
                key={milestone.id} 
                className={`border-l-4 ${getPriorityColor(milestone.priority)} bg-white border border-gray-200 rounded-lg p-6 shadow-sm`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <CategoryIcon className={`h-6 w-6 text-${categories[milestone.category]?.color || 'gray'}-600`} />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{milestone.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Week {milestone.startWeek}-{milestone.startWeek + milestone.durationWeeks - 1}</span>
                        <span>•</span>
                        <span>{milestone.durationWeeks} weeks</span>
                        <span>•</span>
                        <span className="capitalize">{milestone.priority} priority</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(milestone.status)}
                    <select
                      value={milestone.status}
                      onChange={(e) => updateMilestoneStatus(milestone.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-sm font-medium border-0 ${getStatusColor(milestone.status)}`}
                    >
                      <option value="not-started">Not Started</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="delayed">Delayed</option>
                      <option value="on-hold">On Hold</option>
                    </select>
                  </div>
                </div>

                {/* Dependencies */}
                {milestone.dependencies && milestone.dependencies.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Dependencies:</h4>
                    <div className="flex flex-wrap gap-2">
                      {milestone.dependencies.map(depId => {
                        const dep = timeline.find(item => item.id === depId);
                        return dep ? (
                          <span 
                            key={depId}
                            className={`px-2 py-1 text-xs rounded-full ${
                              dep.status === 'completed' ? 'bg-green-100 text-green-800' :
                              dep.status === 'delayed' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {dep.title}
                          </span>
                        ) : null;
                      })}
                    </div>
                    {dependencyStatus === 'blocked' && (
                      <p className="text-sm text-red-600 mt-2">⚠️ Blocked by delayed dependencies</p>
                    )}
                    {dependencyStatus === 'waiting' && (
                      <p className="text-sm text-yellow-600 mt-2">⏳ Waiting for dependencies to complete</p>
                    )}
                  </div>
                )}

                {/* Tasks */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Key Tasks:</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    {milestone.tasks.map((task, taskIndex) => (
                      <li key={taskIndex} className="text-sm text-gray-600 flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3 text-gray-400" />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes:</label>
                  <textarea
                    value={milestone.notes}
                    onChange={(e) => updateMilestoneStatus(milestone.id, milestone.status, e.target.value)}
                    placeholder="Add notes, updates, or blockers..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    rows={2}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {filteredTimeline.length === 0 && (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No milestones found for the selected filters.</p>
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default TimelineManager; 