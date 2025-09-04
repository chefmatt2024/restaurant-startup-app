import React, { useState, useMemo } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Bell, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

const ComplianceCalendar = ({ requirements = [], onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); // month, week

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate project start date (assuming today)
  const projectStartDate = new Date();

  // Generate calendar data with compliance events
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get first day of month and last day
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Get starting date (Sunday before first day)
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Generate 42 days for 6-week calendar grid
    const days = [];
    const currentDay = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dayEvents = [];
      
      // Add requirement deadlines
      requirements.forEach(req => {
        const deadlineDate = new Date(projectStartDate);
        deadlineDate.setDate(deadlineDate.getDate() + req.daysFromStart);
        
        if (deadlineDate.toDateString() === currentDay.toDateString()) {
          dayEvents.push({
            id: req.id,
            title: req.title,
            type: 'deadline',
            priority: req.priority,
            status: req.status,
            category: req.category
          });
        }
        
        // Add renewal dates if approved
        if (req.status === 'approved' && req.compliance?.renewal !== 'Not required') {
          const renewalDate = new Date(deadlineDate);
          renewalDate.setFullYear(renewalDate.getFullYear() + 1); // Assume annual renewal
          
          if (renewalDate.toDateString() === currentDay.toDateString()) {
            dayEvents.push({
              id: `${req.id}-renewal`,
              title: `${req.title} Renewal`,
              type: 'renewal',
              priority: req.priority,
              status: 'pending',
              category: req.category
            });
          }
        }
      });
      
      days.push({
        date: new Date(currentDay),
        isCurrentMonth: currentDay.getMonth() === month,
        isToday: currentDay.toDateString() === new Date().toDateString(),
        events: dayEvents
      });
      
      currentDay.setDate(currentDay.getDate() + 1);
    }
    
    return days;
  }, [currentDate, requirements, projectStartDate]);

  // Get upcoming deadlines (next 30 days)
  const upcomingDeadlines = useMemo(() => {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    return requirements
      .map(req => {
        const deadlineDate = new Date(projectStartDate);
        deadlineDate.setDate(deadlineDate.getDate() + req.daysFromStart);
        return { ...req, deadlineDate };
      })
      .filter(req => req.deadlineDate >= today && req.deadlineDate <= thirtyDaysFromNow && req.status !== 'approved')
      .sort((a, b) => a.deadlineDate - b.deadlineDate);
  }, [requirements, projectStartDate]);

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getEventColor = (event) => {
    if (event.type === 'renewal') {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
    
    switch (event.priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEventIcon = (event) => {
    if (event.type === 'renewal') {
      return <Clock className="w-3 h-3" />;
    }
    
    switch (event.status) {
      case 'approved':
        return <CheckCircle className="w-3 h-3" />;
      case 'overdue':
        return <AlertTriangle className="w-3 h-3" />;
      default:
        return <Bell className="w-3 h-3" />;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Compliance Calendar
        </h3>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setView('month')}
              className={`px-3 py-1 text-sm rounded ${
                view === 'month' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1 text-sm rounded ${
                view === 'list' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              List
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-lg font-medium">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button
              onClick={() => navigateMonth(1)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {view === 'month' ? (
        <div className="space-y-4">
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day headers */}
            {daysOfWeek.map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-600 border-b">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {calendarData.map((day, index) => (
              <div
                key={index}
                className={`min-h-[80px] p-1 border border-gray-100 ${
                  !day.isCurrentMonth ? 'bg-gray-50' : 'bg-white'
                } ${day.isToday ? 'bg-blue-50 border-blue-200' : ''}`}
                onClick={() => onDateClick && onDateClick(day.date)}
              >
                <div className={`text-sm font-medium mb-1 ${
                  !day.isCurrentMonth ? 'text-gray-400' : 
                  day.isToday ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {day.date.getDate()}
                </div>
                
                <div className="space-y-1">
                  {day.events.slice(0, 2).map(event => (
                    <div
                      key={event.id}
                      className={`text-xs px-1 py-0.5 rounded border ${getEventColor(event)} flex items-center space-x-1`}
                      title={event.title}
                    >
                      {getEventIcon(event)}
                      <span className="truncate">{event.title.length > 15 ? event.title.substring(0, 15) + '...' : event.title}</span>
                    </div>
                  ))}
                  {day.events.length > 2 && (
                    <div className="text-xs text-gray-500 px-1">
                      +{day.events.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Upcoming Deadlines (Next 30 Days)</h4>
          {upcomingDeadlines.length > 0 ? (
            <div className="space-y-3">
              {upcomingDeadlines.map(req => (
                <div key={req.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      req.priority === 'high' ? 'bg-red-500' :
                      req.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-900">{req.title}</p>
                      <p className="text-sm text-gray-600">{req.agency}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {req.deadlineDate.toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {Math.ceil((req.deadlineDate - new Date()) / (1000 * 60 * 60 * 24))} days
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900">No upcoming deadlines</h4>
              <p className="text-gray-600">All requirements are on track or completed</p>
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>High Priority</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Medium Priority</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Low Priority</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Renewal</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceCalendar; 