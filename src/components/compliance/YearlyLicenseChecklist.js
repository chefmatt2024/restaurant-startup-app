import React, { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import SectionCard from '../ui/SectionCard';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Calendar,
  Download,
  ExternalLink,
  RefreshCw,
  Shield,
  Building2,
  Utensils,
  DollarSign,
  Bell,
  Info
} from 'lucide-react';

const YearlyLicenseChecklist = () => {
  const { state, actions } = useApp();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [completedItems, setCompletedItems] = useState({});

  // Yearly license renewal checklist based on Boston and MA requirements
  const yearlyChecklist = {
    federal: [
      {
        id: 'federal-tax-return',
        name: 'Federal Tax Return (Form 1120/1120S)',
        agency: 'IRS',
        dueDate: 'March 15 (or extension)',
        frequency: 'Annual',
        priority: 'High',
        documents: ['Federal Tax Return', 'W-2 Forms', '1099 Forms'],
        notes: 'File annual federal tax return for business entity'
      },
      {
        id: 'federal-unemployment-tax',
        name: 'Federal Unemployment Tax (FUTA)',
        agency: 'IRS',
        dueDate: 'January 31',
        frequency: 'Annual',
        priority: 'High',
        documents: ['Form 940'],
        notes: 'Annual FUTA tax return'
      }
    ],
    state: [
      {
        id: 'ma-business-registration-renewal',
        name: 'Massachusetts Business Registration Renewal',
        agency: 'Massachusetts Secretary of State',
        dueDate: 'Annually by anniversary date',
        frequency: 'Annual',
        priority: 'High',
        documents: ['Annual Report', 'Filing Fee Payment'],
        notes: 'Renew business entity registration annually'
      },
      {
        id: 'ma-sales-tax-renewal',
        name: 'Massachusetts Sales Tax Permit Renewal',
        agency: 'Massachusetts Department of Revenue',
        dueDate: 'Annually',
        frequency: 'Annual',
        priority: 'High',
        documents: ['Sales Tax Return', 'Payment'],
        notes: 'Renew sales tax permit and file returns'
      },
      {
        id: 'ma-income-tax',
        name: 'Massachusetts Income Tax Return',
        agency: 'Massachusetts Department of Revenue',
        dueDate: 'March 15 (or extension)',
        frequency: 'Annual',
        priority: 'High',
        documents: ['MA Tax Return', 'Supporting Documents'],
        notes: 'File annual state income tax return'
      },
      {
        id: 'ma-unemployment-insurance',
        name: 'Massachusetts Unemployment Insurance',
        agency: 'Massachusetts Department of Unemployment Assistance',
        dueDate: 'Quarterly',
        frequency: 'Quarterly',
        priority: 'High',
        documents: ['Quarterly Wage Report', 'Payment'],
        notes: 'File quarterly unemployment insurance reports'
      }
    ],
    city: [
      {
        id: 'boston-business-certificate-renewal',
        name: 'Boston Business Certificate Renewal',
        agency: 'City of Boston',
        dueDate: 'Annually by anniversary date',
        frequency: 'Annual',
        priority: 'High',
        documents: ['Business Certificate Renewal Form', 'Payment'],
        notes: 'Renew Boston Business Certificate annually'
      },
      {
        id: 'food-establishment-permit-renewal',
        name: 'Food Establishment Permit Renewal',
        agency: 'Boston Public Health Commission',
        dueDate: 'Annually',
        frequency: 'Annual',
        priority: 'High',
        documents: [
          'Food Establishment Permit Application (Form 4/14)',
          'Updated Site Plans (if changes)',
          'ServSafe Certification (if expired)',
          'Payment'
        ],
        notes: 'Annual renewal required. Use Form 4/14 for renewal.',
        formReference: {
          name: 'Food Establishment Permit Application (Form 4/14)',
          localPath: 'C:\\Users\\chefm\\Downloads\\Food Establishment permit app 4 14.pdf'
        }
      },
      {
        id: 'health-permit-renewal',
        name: 'Health Department Permit Renewal',
        agency: 'Boston Public Health Commission',
        dueDate: 'Annually',
        frequency: 'Annual',
        priority: 'High',
        documents: ['Health Permit Renewal Form', 'Inspection Report', 'Payment'],
        notes: 'Annual health permit renewal required'
      },
      {
        id: 'fire-permit-renewal',
        name: 'Fire Department Permit Renewal',
        agency: 'Boston Fire Department',
        dueDate: 'Annually',
        frequency: 'Annual',
        priority: 'High',
        documents: ['Fire Permit Renewal Form', 'Annual Inspection Certificate', 'Payment'],
        notes: 'Annual fire safety inspection and permit renewal'
      },
      {
        id: 'alcohol-license-renewal',
        name: 'Alcohol License Renewal (if applicable)',
        agency: 'Boston Licensing Board',
        dueDate: 'Annually by December 31',
        frequency: 'Annual',
        priority: 'High',
        documents: ['Alcohol License Renewal Application', 'Payment ($1,200-$3,000)'],
        notes: 'Annual alcohol license renewal required'
      },
      {
        id: 'entertainment-license-renewal',
        name: 'Entertainment License Renewal (if applicable)',
        agency: 'Boston Licensing Board',
        dueDate: 'Annually',
        frequency: 'Annual',
        priority: 'High',
        documents: ['Entertainment License Renewal Form', 'Payment'],
        notes: 'Required if offering live music or entertainment'
      },
      {
        id: 'outdoor-dining-renewal',
        name: 'Outdoor Dining Permit Renewal (if applicable)',
        agency: 'Boston Public Works',
        dueDate: 'Annually (April-November season)',
        frequency: 'Annual',
        priority: 'Medium',
        documents: ['Outdoor Dining Renewal Application', 'Insurance Certificate', 'Payment'],
        notes: 'Seasonal permit renewal for outdoor seating'
      },
      {
        id: 'signage-permit-renewal',
        name: 'Signage Permit Renewal (if modified)',
        agency: 'Boston Public Works',
        dueDate: 'As needed',
        frequency: 'As needed',
        priority: 'Low',
        documents: ['Sign Permit Application (if modified)', 'Payment'],
        notes: 'Only required if sign is modified or replaced'
      }
    ]
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const allItems = [
      ...yearlyChecklist.federal,
      ...yearlyChecklist.state,
      ...yearlyChecklist.city
    ];
    const total = allItems.length;
    const completed = allItems.filter(item => completedItems[item.id]).length;
    const upcoming = allItems.filter(item => {
      const dueDate = item.dueDate;
      // Simple check for items due soon (this could be enhanced with actual date parsing)
      return dueDate && !completedItems[item.id];
    }).length;

    return {
      total,
      completed,
      upcoming,
      completionPercentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }, [completedItems]);

  const toggleItem = (itemId) => {
    setCompletedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const getDueDateColor = (dueDate) => {
    // This is a simplified version - in production, you'd parse actual dates
    if (dueDate.includes('January') || dueDate.includes('March')) {
      return 'text-red-600 bg-red-50';
    }
    if (dueDate.includes('Quarterly')) {
      return 'text-yellow-600 bg-yellow-50';
    }
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <RefreshCw className="w-8 h-8 mr-3 text-blue-600" />
              Yearly License & Permit Renewal Checklist
            </h1>
            <p className="text-gray-600 mt-2">
              Track all annual and quarterly license renewals for {currentYear}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={currentYear}
              onChange={(e) => setCurrentYear(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              {[currentYear - 1, currentYear, currentYear + 1].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <FileText className="w-8 h-8" />
            <span className="text-3xl font-bold">{stats.completionPercentage}%</span>
          </div>
          <p className="text-blue-100 text-sm">Completion Rate</p>
          <p className="text-xs text-blue-200 mt-1">{stats.completed} of {stats.total} completed</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-8 h-8" />
            <span className="text-3xl font-bold">{stats.completed}</span>
          </div>
          <p className="text-green-100 text-sm">Completed</p>
          <p className="text-xs text-green-200 mt-1">Renewals finished</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8" />
            <span className="text-3xl font-bold">{stats.upcoming}</span>
          </div>
          <p className="text-yellow-100 text-sm">Upcoming</p>
          <p className="text-xs text-yellow-200 mt-1">Pending renewals</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Bell className="w-8 h-8" />
            <span className="text-3xl font-bold">{stats.total}</span>
          </div>
          <p className="text-purple-100 text-sm">Total Items</p>
          <p className="text-xs text-purple-200 mt-1">All renewals</p>
        </div>
      </div>

      {/* Reference Document */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-1">Yearly Licenses Reference Guide</h3>
            <p className="text-sm text-blue-700 mb-2">
              For detailed information on all Boston and Massachusetts yearly license requirements, refer to:
            </p>
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">
                Yearly Licenses Boston and MA.pdf
              </span>
              <span className="text-xs text-blue-600">
                (C:\Users\chefm\Downloads\yearly linceses boston and ma.pdf)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Federal Requirements */}
      <SectionCard title="Federal Level Renewals" color="blue">
        <div className="space-y-3">
          {yearlyChecklist.federal.map(item => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={completedItems[item.id] || false}
                  onChange={() => toggleItem(item.id)}
                  className="mt-1 h-5 w-5 text-blue-600 rounded"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded ${getDueDateColor(item.dueDate)}`}>
                      {item.dueDate}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{item.agency} • {item.frequency}</p>
                  {item.documents && item.documents.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-gray-700 mb-1">Required Documents:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {item.documents.map((doc, idx) => (
                          <li key={idx} className="flex items-center space-x-1">
                            <FileText className="w-3 h-3" />
                            <span>{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {item.notes && (
                    <p className="text-xs text-gray-500 mt-2 italic">{item.notes}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* State Requirements */}
      <SectionCard title="State Level Renewals (Massachusetts)" color="green">
        <div className="space-y-3">
          {yearlyChecklist.state.map(item => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={completedItems[item.id] || false}
                  onChange={() => toggleItem(item.id)}
                  className="mt-1 h-5 w-5 text-green-600 rounded"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded ${getDueDateColor(item.dueDate)}`}>
                      {item.dueDate}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{item.agency} • {item.frequency}</p>
                  {item.documents && item.documents.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-gray-700 mb-1">Required Documents:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {item.documents.map((doc, idx) => (
                          <li key={idx} className="flex items-center space-x-1">
                            <FileText className="w-3 h-3" />
                            <span>{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {item.notes && (
                    <p className="text-xs text-gray-500 mt-2 italic">{item.notes}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* City Requirements */}
      <SectionCard title="City Level Renewals (Boston)" color="purple">
        <div className="space-y-3">
          {yearlyChecklist.city.map(item => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={completedItems[item.id] || false}
                  onChange={() => toggleItem(item.id)}
                  className="mt-1 h-5 w-5 text-purple-600 rounded"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded ${getDueDateColor(item.dueDate)}`}>
                      {item.dueDate}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{item.agency} • {item.frequency}</p>
                  
                  {/* Special handling for Food Establishment Permit with form reference */}
                  {item.formReference && (
                    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-xs font-medium text-blue-900 mb-1">Required Form:</p>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-xs text-blue-700">{item.formReference.name}</span>
                        <span className="text-xs text-blue-500">({item.formReference.localPath})</span>
                      </div>
                    </div>
                  )}
                  
                  {item.documents && item.documents.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-gray-700 mb-1">Required Documents:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {item.documents.map((doc, idx) => (
                          <li key={idx} className="flex items-center space-x-1">
                            <FileText className="w-3 h-3" />
                            <span>{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {item.notes && (
                    <p className="text-xs text-gray-500 mt-2 italic">{item.notes}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
};

export default YearlyLicenseChecklist;


