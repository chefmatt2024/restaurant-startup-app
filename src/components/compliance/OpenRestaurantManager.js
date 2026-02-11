import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import SectionCard from '../ui/SectionCard';
import DocumentUploader from './DocumentUploader';
import DocumentVault from './DocumentVault';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Building2,
  Shield,
  Utensils,
  Calendar,
  Download,
  Upload,
  ExternalLink,
  ArrowRight,
  Star,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Zap,
  FileCheck,
  Archive,
  RefreshCw,
  Bell,
  Settings
} from 'lucide-react';

const OpenRestaurantManager = () => {
  const { state, actions } = useApp();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'documents', 'licenses', 'renewals', 'vault'
  const [completedDocuments, setCompletedDocuments] = useState({});
  const [licenseStatus, setLicenseStatus] = useState({});

  // Get all compliance requirements from the app state
  const allRequirements = useMemo(() => {
    // This would come from DocumentsCompliance or PermittingWizard
    // For now, we'll create a comprehensive list
    return {
      federal: [
        {
          id: 'ein',
          name: 'Employer Identification Number (EIN)',
          agency: 'IRS',
          level: 'federal',
          status: 'pending',
          expirationDate: null,
          renewalRequired: false,
          documents: []
        },
        {
          id: 'business-tax-id',
          name: 'Business Tax ID',
          agency: 'IRS',
          level: 'federal',
          status: 'pending',
          expirationDate: null,
          renewalRequired: false,
          documents: []
        }
      ],
      state: [
        {
          id: 'ma-business-registration',
          name: 'Massachusetts Business Registration',
          agency: 'Massachusetts Secretary of State',
          level: 'state',
          status: 'pending',
          expirationDate: null,
          renewalRequired: true,
          renewalFrequency: 'annual',
          documents: []
        },
        {
          id: 'ma-sales-tax',
          name: 'Massachusetts Sales Tax Permit',
          agency: 'Massachusetts Department of Revenue',
          level: 'state',
          status: 'pending',
          expirationDate: null,
          renewalRequired: true,
          renewalFrequency: 'annual',
          documents: []
        }
      ],
      city: [
        {
          id: 'boston-business-certificate',
          name: 'Boston Business Certificate',
          agency: 'City of Boston',
          level: 'city',
          status: 'pending',
          expirationDate: null,
          renewalRequired: true,
          renewalFrequency: 'annual',
          documents: []
        },
        {
          id: 'food-establishment-permit',
          name: 'Food Establishment Permit',
          agency: 'Boston Public Health Commission',
          level: 'city',
          status: 'pending',
          expirationDate: null,
          renewalRequired: true,
          renewalFrequency: 'annual',
          documents: [
            { name: 'Food Establishment Permit Application (Form 4/14)', type: 'PDF', uploaded: false }
          ]
        },
        {
          id: 'certificate-of-occupancy',
          name: 'Certificate of Occupancy',
          agency: 'Boston Inspectional Services',
          level: 'city',
          status: 'pending',
          expirationDate: null,
          renewalRequired: false,
          documents: [
            { name: 'When to Apply for CO Guide', type: 'PDF', uploaded: false }
          ]
        },
        {
          id: 'building-permit',
          name: 'Building/Renovation Permit',
          agency: 'Boston Inspectional Services',
          level: 'city',
          status: 'pending',
          expirationDate: null,
          renewalRequired: false,
          documents: []
        },
        {
          id: 'fire-permit',
          name: 'Fire Department Permit',
          agency: 'Boston Fire Department',
          level: 'city',
          status: 'pending',
          expirationDate: null,
          renewalRequired: true,
          renewalFrequency: 'annual',
          documents: []
        },
        {
          id: 'health-permit',
          name: 'Health Department Permit',
          agency: 'Boston Public Health Commission',
          level: 'city',
          status: 'pending',
          expirationDate: null,
          renewalRequired: true,
          renewalFrequency: 'annual',
          documents: []
        }
      ]
    };
  }, []);

  // Calculate completion statistics
  const stats = useMemo(() => {
    const all = [
      ...allRequirements.federal,
      ...allRequirements.state,
      ...allRequirements.city
    ];
    const total = all.length;
    const completed = all.filter(r => completedDocuments[r.id]?.status === 'completed').length;
    const pending = all.filter(r => !completedDocuments[r.id] || completedDocuments[r.id]?.status === 'pending').length;
    const expiringSoon = all.filter(r => {
      if (!r.expirationDate) return false;
      const daysUntilExpiry = Math.ceil((new Date(r.expirationDate) - new Date()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 90 && daysUntilExpiry > 0;
    }).length;

    return {
      total,
      completed,
      pending,
      expiringSoon,
      completionPercentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }, [allRequirements, completedDocuments]);

  // Mark document as completed
  const handleDocumentComplete = (requirementId, documentName) => {
    setCompletedDocuments(prev => ({
      ...prev,
      [requirementId]: {
        ...prev[requirementId],
        status: 'completed',
        completedAt: new Date().toISOString(),
        documents: [
          ...(prev[requirementId]?.documents || []),
          { name: documentName, uploadedAt: new Date().toISOString() }
        ]
      }
    }));
    actions.showMessage('Success', `Document "${documentName}" marked as completed!`, 'success');
  };

  // Update license status
  const handleLicenseUpdate = (requirementId, updates) => {
    setLicenseStatus(prev => ({
      ...prev,
      [requirementId]: {
        ...prev[requirementId],
        ...updates,
        lastUpdated: new Date().toISOString()
      }
    }));
  };

  // Render overview tab
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Progress Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <FileCheck className="w-8 h-8" />
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
          <p className="text-xs text-green-200 mt-1">All documents submitted</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-8 h-8" />
            <span className="text-3xl font-bold">{stats.pending}</span>
          </div>
          <p className="text-yellow-100 text-sm">Pending</p>
          <p className="text-xs text-yellow-200 mt-1">Awaiting completion</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Bell className="w-8 h-8" />
            <span className="text-3xl font-bold">{stats.expiringSoon}</span>
          </div>
          <p className="text-red-100 text-sm">Expiring Soon</p>
          <p className="text-xs text-red-200 mt-1">Renewal needed</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setActiveTab('documents')}
          className="p-6 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all text-left group"
        >
          <div className="flex items-center justify-between mb-3">
            <FileText className="w-8 h-8 text-blue-600" />
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">Document Tracker</h3>
          <p className="text-sm text-gray-600">View and manage all required documents</p>
        </button>

        <button
          onClick={() => setActiveTab('licenses')}
          className="p-6 bg-white border-2 border-gray-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all text-left group"
        >
          <div className="flex items-center justify-between mb-3">
            <Shield className="w-8 h-8 text-green-600" />
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">License Manager</h3>
          <p className="text-sm text-gray-600">Track licenses by city, state, and federal level</p>
        </button>

        <button
          onClick={() => setActiveTab('renewals')}
          className="p-6 bg-white border-2 border-gray-200 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-all text-left group"
        >
          <div className="flex items-center justify-between mb-3">
            <RefreshCw className="w-8 h-8 text-orange-600" />
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
          </div>
          <h3 className="font-bold text-gray-900 mb-1">Renewal Calendar</h3>
          <p className="text-sm text-gray-600">Never miss a renewal deadline</p>
        </button>
      </div>

      {/* Requirements by Level */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SectionCard title="Federal Requirements" color="blue">
          <div className="space-y-3">
            {allRequirements.federal.map(req => {
              const status = completedDocuments[req.id]?.status || 'pending';
              return (
                <div key={req.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-yellow-600" />
                    )}
                    <span className="text-sm font-medium text-gray-900">{req.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {status}
                  </span>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="State Requirements" color="green">
          <div className="space-y-3">
            {allRequirements.state.map(req => {
              const status = completedDocuments[req.id]?.status || 'pending';
              return (
                <div key={req.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-yellow-600" />
                    )}
                    <span className="text-sm font-medium text-gray-900">{req.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {status}
                  </span>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="City Requirements" color="purple">
          <div className="space-y-3">
            {allRequirements.city.map(req => {
              const status = completedDocuments[req.id]?.status || 'pending';
              return (
                <div key={req.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-yellow-600" />
                    )}
                    <span className="text-sm font-medium text-gray-900">{req.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {status}
                  </span>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>
    </div>
  );

  // Render documents tab
  const renderDocuments = () => (
    <div className="space-y-6">
      {['federal', 'state', 'city'].map(level => (
        <SectionCard 
          key={level} 
          title={`${level.charAt(0).toUpperCase() + level.slice(1)} Level Documents`}
          color={level === 'federal' ? 'blue' : level === 'state' ? 'green' : 'purple'}
        >
          <div className="space-y-4">
            {allRequirements[level].map(req => {
              const docStatus = completedDocuments[req.id];
              return (
                <div key={req.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{req.name}</h4>
                      <p className="text-sm text-gray-600">{req.agency}</p>
                    </div>
                    {docStatus?.status === 'completed' ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Completed
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Pending
                      </span>
                    )}
                  </div>
                  
                  {req.documents && req.documents.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {req.documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">{doc.name}</span>
                            {doc.localPath && (
                              <span className="text-xs text-gray-500">({doc.localPath})</span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {doc.uploaded ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <button
                                onClick={() => handleDocumentComplete(req.id, doc.name)}
                                className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                              >
                                Mark Complete
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <DocumentUploader
                    requirementId={req.id}
                    requirementName={req.name}
                    onUploadComplete={(file) => {
                      handleDocumentComplete(req.id, file.name);
                    }}
                  />
                </div>
              );
            })}
          </div>
        </SectionCard>
      ))}
    </div>
  );

  // Render licenses tab
  const renderLicenses = () => (
    <div className="space-y-6">
      {['federal', 'state', 'city'].map(level => (
        <SectionCard 
          key={level} 
          title={`${level.charAt(0).toUpperCase() + level.slice(1)} Level Licenses`}
          color={level === 'federal' ? 'blue' : level === 'state' ? 'green' : 'purple'}
        >
          <div className="space-y-4">
            {allRequirements[level].map(req => {
              const license = licenseStatus[req.id] || {};
              return (
                <div key={req.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{req.name}</h4>
                      <p className="text-sm text-gray-600">{req.agency}</p>
                    </div>
                    <select
                      value={license.status || req.status}
                      onChange={(e) => handleLicenseUpdate(req.id, { status: e.target.value })}
                      className="px-3 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="applied">Applied</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="text-xs text-gray-600">Issue Date</label>
                      <input
                        type="date"
                        value={license.issueDate || ''}
                        onChange={(e) => handleLicenseUpdate(req.id, { issueDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Expiration Date</label>
                      <input
                        type="date"
                        value={license.expirationDate || req.expirationDate || ''}
                        onChange={(e) => handleLicenseUpdate(req.id, { expirationDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm mt-1"
                      />
                    </div>
                  </div>
                  
                  {req.renewalRequired && (
                    <div className="mt-3 p-2 bg-blue-50 rounded">
                      <p className="text-xs text-blue-700">
                        <Bell className="w-3 h-3 inline mr-1" />
                        Renewal required: {req.renewalFrequency || 'As needed'}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </SectionCard>
      ))}
    </div>
  );

  // Render renewals tab
  const renderRenewals = () => {
    const upcomingRenewals = [
      ...allRequirements.federal,
      ...allRequirements.state,
      ...allRequirements.city
    ]
      .filter(req => req.renewalRequired && licenseStatus[req.id]?.expirationDate)
      .map(req => ({
        ...req,
        expirationDate: licenseStatus[req.id]?.expirationDate || req.expirationDate
      }))
      .sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate))
      .slice(0, 10);

    return (
      <div className="space-y-6">
        <SectionCard title="Upcoming Renewals" color="orange">
          <div className="space-y-3">
            {upcomingRenewals.length > 0 ? (
              upcomingRenewals.map(req => {
                const daysUntil = Math.ceil((new Date(req.expirationDate) - new Date()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={req.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-900">{req.name}</h4>
                      <p className="text-sm text-gray-600">{req.agency}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        daysUntil <= 30 ? 'text-red-600' : daysUntil <= 90 ? 'text-yellow-600' : 'text-gray-600'
                      }`}>
                        {daysUntil > 0 ? `${daysUntil} days` : 'Expired'}
                      </p>
                      <p className="text-xs text-gray-500">{new Date(req.expirationDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center py-8">No upcoming renewals</p>
            )}
          </div>
        </SectionCard>
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Zap className="w-8 h-8 mr-3 text-blue-600" />
              Open Your Restaurant
            </h1>
            <p className="text-gray-600 mt-2">
              Track documents, manage licenses, and never miss a renewal deadline
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Target },
              { id: 'documents', label: 'Documents', icon: FileText },
              { id: 'licenses', label: 'Licenses', icon: Shield },
              { id: 'renewals', label: 'Renewals', icon: RefreshCw },
              { id: 'vault', label: 'Document Vault', icon: Archive }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'documents' && renderDocuments()}
      {activeTab === 'licenses' && renderLicenses()}
      {activeTab === 'renewals' && renderRenewals()}
      {activeTab === 'vault' && <DocumentVault />}
    </div>
  );
};

export default OpenRestaurantManager;

