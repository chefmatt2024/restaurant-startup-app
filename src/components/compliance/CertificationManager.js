import React, { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import SectionCard from '../ui/SectionCard';
import DocumentUploader from './DocumentUploader';
import {
  Award,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Upload,
  Download,
  ExternalLink,
  Users,
  Shield,
  Heart,
  Users2,
  AlertTriangle,
  FileText,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Bell,
  X
} from 'lucide-react';

const CertificationManager = () => {
  const { state, actions } = useApp();
  const [filter, setFilter] = useState('all'); // all, required, completed, expired, expiring-soon
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCert, setSelectedCert] = useState(null);
  const [showAddCert, setShowAddCert] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // list, calendar, team

  // Required certifications for restaurant operations
  const requiredCertifications = [
    {
      id: 'servsafe-manager',
      name: 'ServSafe Manager Certification',
      category: 'Food Safety',
      requiredFor: ['Manager', 'Kitchen Manager', 'Owner'],
      description: 'Required for managers who oversee food safety operations. Covers foodborne illness prevention, HACCP principles, and food safety management.',
      provider: 'National Restaurant Association',
      validity: 5, // years
      cost: '$152',
      duration: '8 hours',
      format: 'Online or In-Person',
      website: 'https://www.servsafe.com/ServSafe-Manager',
      examRequired: true,
      renewalRequired: true,
      stateRequirement: true,
      priority: 'high',
      icon: Shield,
      color: 'red'
    },
    {
      id: 'servsafe-food-handler',
      name: 'ServSafe Food Handler',
      category: 'Food Safety',
      requiredFor: ['All Food Service Staff'],
      description: 'Basic food safety certification for all employees who handle food. Covers personal hygiene, cross-contamination, time and temperature control.',
      provider: 'National Restaurant Association',
      validity: 3, // years
      cost: '$15',
      duration: '2-3 hours',
      format: 'Online',
      website: 'https://www.servsafe.com/ServSafe-Foodhandler',
      examRequired: true,
      renewalRequired: true,
      stateRequirement: true,
      priority: 'high',
      icon: Shield,
      color: 'orange'
    },
    {
      id: 'cpr',
      name: 'CPR/AED Certification',
      category: 'Safety',
      requiredFor: ['Manager', 'Owner', 'At least 2 staff members'],
      description: 'Cardiopulmonary Resuscitation and Automated External Defibrillator training. Essential for emergency response in the workplace.',
      provider: 'American Red Cross, American Heart Association',
      validity: 2, // years
      cost: '$60-90',
      duration: '4-6 hours',
      format: 'In-Person',
      website: 'https://www.redcross.org/take-a-class/cpr',
      examRequired: true,
      renewalRequired: true,
      stateRequirement: false,
      priority: 'high',
      icon: Heart,
      color: 'red'
    },
    {
      id: 'first-aid',
      name: 'First Aid Certification',
      category: 'Safety',
      requiredFor: ['Manager', 'Owner', 'At least 2 staff members'],
      description: 'Basic first aid training for treating injuries and medical emergencies. Often combined with CPR certification.',
      provider: 'American Red Cross, American Heart Association',
      validity: 2, // years
      cost: '$60-90',
      duration: '4-6 hours',
      format: 'In-Person',
      website: 'https://www.redcross.org/take-a-class/first-aid',
      examRequired: true,
      renewalRequired: true,
      stateRequirement: false,
      priority: 'high',
      icon: Heart,
      color: 'red'
    },
    {
      id: 'crowd-control',
      name: 'Crowd Control Management',
      category: 'Safety',
      requiredFor: ['Manager', 'Security Staff', 'Event Staff'],
      description: 'Training for managing large crowds, preventing overcrowding, and ensuring safe evacuation procedures. Required for venues with capacity over 100.',
      provider: 'Various (Local Fire Department, Private Training)',
      validity: 3, // years
      cost: '$100-200',
      duration: '4-8 hours',
      format: 'In-Person or Online',
      website: 'https://www.osha.gov/',
      examRequired: true,
      renewalRequired: true,
      stateRequirement: true, // Varies by city
      priority: 'medium',
      icon: Users2,
      color: 'blue'
    },
    {
      id: 'allergen-awareness',
      name: 'Allergen Awareness Training',
      category: 'Food Safety',
      requiredFor: ['All Kitchen Staff', 'Servers'],
      description: 'Training on identifying allergens, preventing cross-contact, and communicating allergen information to customers.',
      provider: 'ServSafe, AllerTrain',
      validity: 3, // years
      cost: '$30-50',
      duration: '2-3 hours',
      format: 'Online',
      website: 'https://www.servsafe.com/ServSafe-Allergens',
      examRequired: true,
      renewalRequired: true,
      stateRequirement: false,
      priority: 'high',
      icon: AlertTriangle,
      color: 'yellow'
    },
    {
      id: 'alcohol-serving',
      name: 'Alcohol Server Training (TIPS/ServSafe Alcohol)',
      category: 'Legal Compliance',
      requiredFor: ['All Staff Serving Alcohol'],
      description: 'Training on responsible alcohol service, checking IDs, recognizing intoxication, and preventing over-service.',
      provider: 'TIPS, ServSafe Alcohol',
      validity: 3, // years
      cost: '$20-40',
      duration: '2-4 hours',
      format: 'Online',
      website: 'https://www.gettips.com/',
      examRequired: true,
      renewalRequired: true,
      stateRequirement: true, // Required in MA
      priority: 'high',
      icon: Shield,
      color: 'purple'
    },
    {
      id: 'fire-safety',
      name: 'Fire Safety & Evacuation Training',
      category: 'Safety',
      requiredFor: ['Manager', 'All Staff'],
      description: 'Training on fire prevention, use of fire extinguishers, and evacuation procedures. Required for all employees.',
      provider: 'Local Fire Department, OSHA',
      validity: 1, // years
      cost: 'Free-$50',
      duration: '1-2 hours',
      format: 'In-Person',
      website: 'https://www.osha.gov/fire-safety',
      examRequired: false,
      renewalRequired: true,
      stateRequirement: true,
      priority: 'high',
      icon: AlertCircle,
      color: 'red'
    },
    {
      id: 'hazmat',
      name: 'Hazardous Materials (HAZMAT) Training',
      category: 'Safety',
      requiredFor: ['Kitchen Manager', 'Maintenance Staff'],
      description: 'Training on handling and storing hazardous materials safely, including cleaning chemicals and compressed gases.',
      provider: 'OSHA, Private Training',
      validity: 3, // years
      cost: '$50-100',
      duration: '2-4 hours',
      format: 'Online or In-Person',
      website: 'https://www.osha.gov/hazcom',
      examRequired: true,
      renewalRequired: true,
      stateRequirement: false,
      priority: 'medium',
      icon: AlertTriangle,
      color: 'orange'
    },
    {
      id: 'sexual-harassment',
      name: 'Sexual Harassment Prevention Training',
      category: 'Legal Compliance',
      requiredFor: ['All Staff', 'Managers (separate training)'],
      description: 'Required training on preventing and responding to sexual harassment in the workplace. Managers require additional training.',
      provider: 'Various (State-approved providers)',
      validity: 1, // years
      cost: '$25-50',
      duration: '1-2 hours',
      format: 'Online',
      website: 'https://www.mass.gov/sexual-harassment-training',
      examRequired: false,
      renewalRequired: true,
      stateRequirement: true, // Required in MA
      priority: 'high',
      icon: Shield,
      color: 'blue'
    }
  ];

  // Get user's certifications from state (or initialize empty)
  const userCertifications = state.certifications || [];

  // Add new certification to state
  const handleAddCertification = (certData) => {
    const newCert = {
      id: `cert-${Date.now()}`,
      certId: certData.certId,
      personName: certData.personName,
      personRole: certData.personRole,
      issueDate: certData.issueDate,
      expirationDate: certData.expirationDate,
      certificateNumber: certData.certificateNumber,
      provider: certData.provider,
      notes: certData.notes,
      documentUrl: certData.documentUrl,
      createdAt: new Date().toISOString()
    };

    actions.updateCertifications([...userCertifications, newCert]);
    setShowAddCert(false);
  };

  // Update certification
  const handleUpdateCertification = (certId, updates) => {
    const updated = userCertifications.map(cert =>
      cert.id === certId ? { ...cert, ...updates } : cert
    );
    actions.updateCertifications(updated);
    setEditingCert(null);
  };

  // Delete certification
  const handleDeleteCertification = (certId) => {
    const filtered = userCertifications.filter(cert => cert.id !== certId);
    actions.updateCertifications(filtered);
  };

  // Get certification details
  const getCertDetails = (certId) => {
    return requiredCertifications.find(c => c.id === certId);
  };

  // Calculate days until expiration
  const getDaysUntilExpiration = (expirationDate) => {
    if (!expirationDate) return null;
    const exp = new Date(expirationDate);
    const today = new Date();
    const diffTime = exp - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get status for certification
  const getCertStatus = (cert) => {
    if (!cert.expirationDate) return 'unknown';
    const daysLeft = getDaysUntilExpiration(cert.expirationDate);
    if (daysLeft < 0) return 'expired';
    if (daysLeft <= 30) return 'expiring-soon';
    if (daysLeft <= 90) return 'expiring';
    return 'valid';
  };

  // Filter certifications
  const filteredCerts = useMemo(() => {
    let filtered = userCertifications;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(cert => {
        const details = getCertDetails(cert.certId);
        const searchLower = searchTerm.toLowerCase();
        return (
          cert.personName?.toLowerCase().includes(searchLower) ||
          cert.personRole?.toLowerCase().includes(searchLower) ||
          details?.name.toLowerCase().includes(searchLower) ||
          cert.certificateNumber?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(cert => {
        const status = getCertStatus(cert);
        if (filter === 'required') {
          const details = getCertDetails(cert.certId);
          return details?.priority === 'high';
        }
        if (filter === 'completed') return status === 'valid';
        if (filter === 'expired') return status === 'expired';
        if (filter === 'expiring-soon') return status === 'expiring-soon' || status === 'expiring';
        return true;
      });
    }

    return filtered;
  }, [userCertifications, filter, searchTerm]);

  // Get expiring soon certifications
  const expiringSoon = useMemo(() => {
    return userCertifications.filter(cert => {
      const status = getCertStatus(cert);
      return status === 'expiring-soon' || status === 'expiring';
    });
  }, [userCertifications]);

  // Get expired certifications
  const expiredCerts = useMemo(() => {
    return userCertifications.filter(cert => getCertStatus(cert) === 'expired');
  }, [userCertifications]);

  // Statistics
  const stats = useMemo(() => {
    const total = userCertifications.length;
    const valid = userCertifications.filter(c => getCertStatus(c) === 'valid').length;
    const expiring = expiringSoon.length;
    const expired = expiredCerts.length;
    const requiredCount = requiredCertifications.filter(c => c.priority === 'high').length;
    const completedRequired = userCertifications.filter(cert => {
      const details = getCertDetails(cert.certId);
      return details?.priority === 'high' && getCertStatus(cert) === 'valid';
    }).length;

    return {
      total,
      valid,
      expiring,
      expired,
      requiredCount,
      completedRequired,
      completionRate: requiredCount > 0 ? Math.round((completedRequired / requiredCount) * 100) : 0
    };
  }, [userCertifications, expiringSoon, expiredCerts]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Certification Manager</h1>
        <p className="text-gray-600">
          Track and manage required certifications for your restaurant staff
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SectionCard className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Certifications</p>
              <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <Award className="w-12 h-12 text-blue-500" />
          </div>
        </SectionCard>

        <SectionCard className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Valid Certifications</p>
              <p className="text-3xl font-bold text-green-900">{stats.valid}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </SectionCard>

        <SectionCard className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Expiring Soon</p>
              <p className="text-3xl font-bold text-yellow-900">{stats.expiring}</p>
            </div>
            <Clock className="w-12 h-12 text-yellow-500" />
          </div>
        </SectionCard>

        <SectionCard className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Expired</p>
              <p className="text-3xl font-bold text-red-900">{stats.expired}</p>
            </div>
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
        </SectionCard>
      </div>

      {/* Required Certifications Progress */}
      <SectionCard className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Required Certifications Progress</h2>
            <p className="text-sm text-gray-600">
              {stats.completedRequired} of {stats.requiredCount} high-priority certifications completed
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">{stats.completionRate}%</p>
            <p className="text-xs text-gray-500">Complete</p>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${stats.completionRate}%` }}
          />
        </div>
      </SectionCard>

      {/* Alerts */}
      {expiredCerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-900 mb-1">
                {expiredCerts.length} Expired Certification{expiredCerts.length !== 1 ? 's' : ''}
              </h3>
              <p className="text-sm text-red-700">
                The following certifications have expired and need to be renewed immediately:
              </p>
              <ul className="mt-2 space-y-1">
                {expiredCerts.slice(0, 5).map(cert => {
                  const details = getCertDetails(cert.certId);
                  return (
                    <li key={cert.id} className="text-sm text-red-600">
                      • {details?.name} - {cert.personName} (Expired {new Date(cert.expirationDate).toLocaleDateString()})
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}

      {expiringSoon.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <Bell className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-yellow-900 mb-1">
                {expiringSoon.length} Certification{expiringSoon.length !== 1 ? 's' : ''} Expiring Soon
              </h3>
              <p className="text-sm text-yellow-700">
                Renew these certifications before they expire:
              </p>
              <ul className="mt-2 space-y-1">
                {expiringSoon.slice(0, 5).map(cert => {
                  const details = getCertDetails(cert.certId);
                  const daysLeft = getDaysUntilExpiration(cert.expirationDate);
                  return (
                    <li key={cert.id} className="text-sm text-yellow-600">
                      • {details?.name} - {cert.personName} ({daysLeft} days left)
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search certifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Certifications</option>
            <option value="required">Required</option>
            <option value="completed">Valid</option>
            <option value="expiring-soon">Expiring Soon</option>
            <option value="expired">Expired</option>
          </select>
          <button
            onClick={() => setShowAddCert(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Certification</span>
          </button>
        </div>
      </div>

      {/* Required Certifications List */}
      <SectionCard className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Required Certifications</h2>
        <div className="space-y-4">
          {requiredCertifications.map(cert => {
            const Icon = cert.icon;
            const userCerts = userCertifications.filter(c => c.certId === cert.id);
            const validCerts = userCerts.filter(c => getCertStatus(c) === 'valid');
            const hasValid = validCerts.length > 0;

            return (
              <div
                key={cert.id}
                className={`border rounded-lg p-4 ${
                  hasValid
                    ? 'border-green-200 bg-green-50'
                    : cert.priority === 'high'
                    ? 'border-red-200 bg-red-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Icon className={`w-6 h-6 ${cert.color === 'red' ? 'text-red-600' : cert.color === 'orange' ? 'text-orange-600' : cert.color === 'blue' ? 'text-blue-600' : cert.color === 'yellow' ? 'text-yellow-600' : 'text-purple-600'}`} />
                      <h3 className="text-lg font-semibold text-gray-900">{cert.name}</h3>
                      {cert.stateRequirement && (
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                          State Required
                        </span>
                      )}
                      {cert.priority === 'high' && (
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                          High Priority
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{cert.description}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Required For:</span>
                        <p className="font-medium text-gray-900">{cert.requiredFor.join(', ')}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Validity:</span>
                        <p className="font-medium text-gray-900">{cert.validity} years</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Cost:</span>
                        <p className="font-medium text-gray-900">{cert.cost}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Format:</span>
                        <p className="font-medium text-gray-900">{cert.format}</p>
                      </div>
                    </div>
                    {validCerts.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm font-medium text-green-700 mb-2">
                          ✓ {validCerts.length} valid certification{validCerts.length !== 1 ? 's' : ''} on file
                        </p>
                        <div className="space-y-1">
                          {validCerts.map(c => (
                            <div key={c.id} className="text-sm text-gray-600">
                              • {c.personName} ({c.personRole}) - Expires {new Date(c.expirationDate).toLocaleDateString()}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex flex-col space-y-2">
                    <a
                      href={cert.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Get Certified</span>
                    </a>
                    <button
                      onClick={() => {
                        setSelectedCert(cert);
                        setShowAddCert(true);
                      }}
                      className="px-3 py-2 border border-gray-300 text-sm rounded hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Record</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Your Certifications List */}
      <SectionCard>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Certifications</h2>
        {filteredCerts.length === 0 ? (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No certifications found</p>
            <p className="text-sm text-gray-500">Add a certification to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCerts.map(cert => {
              const details = getCertDetails(cert.certId);
              const status = getCertStatus(cert);
              const daysLeft = getDaysUntilExpiration(cert.expirationDate);
              const Icon = details?.icon || Award;

              return (
                <div
                  key={cert.id}
                  className={`border rounded-lg p-4 ${
                    status === 'expired'
                      ? 'border-red-200 bg-red-50'
                      : status === 'expiring-soon'
                      ? 'border-yellow-200 bg-yellow-50'
                      : status === 'expiring'
                      ? 'border-orange-200 bg-orange-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Icon className="w-6 h-6 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          {details?.name || 'Unknown Certification'}
                        </h3>
                        {status === 'expired' && (
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                            Expired
                          </span>
                        )}
                        {status === 'expiring-soon' && (
                          <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                            Expiring Soon
                          </span>
                        )}
                        {status === 'valid' && (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                            Valid
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-500">Person:</span>
                          <p className="font-medium text-gray-900">{cert.personName}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Role:</span>
                          <p className="font-medium text-gray-900">{cert.personRole}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Issue Date:</span>
                          <p className="font-medium text-gray-900">
                            {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Expiration:</span>
                          <p className={`font-medium ${status === 'expired' ? 'text-red-600' : status === 'expiring-soon' ? 'text-yellow-600' : 'text-gray-900'}`}>
                            {cert.expirationDate ? (
                              <>
                                {new Date(cert.expirationDate).toLocaleDateString()}
                                {daysLeft !== null && (
                                  <span className="ml-2 text-xs">
                                    ({daysLeft > 0 ? `${daysLeft} days left` : `${Math.abs(daysLeft)} days ago`})
                                  </span>
                                )}
                              </>
                            ) : (
                              'N/A'
                            )}
                          </p>
                        </div>
                      </div>
                      {cert.certificateNumber && (
                        <div className="text-sm mb-2">
                          <span className="text-gray-500">Certificate #:</span>
                          <span className="font-mono ml-2 text-gray-900">{cert.certificateNumber}</span>
                        </div>
                      )}
                      {cert.notes && (
                        <div className="text-sm text-gray-600 mt-2">
                          <span className="font-medium">Notes:</span> {cert.notes}
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex flex-col space-y-2">
                      <button
                        onClick={() => setEditingCert(cert)}
                        className="px-3 py-2 border border-gray-300 text-sm rounded hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteCertification(cert.id)}
                        className="px-3 py-2 border border-red-300 text-red-600 text-sm rounded hover:bg-red-50 flex items-center space-x-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      {/* Add/Edit Certification Modal */}
      {(showAddCert || editingCert) && (
        <CertificationForm
          certification={editingCert || selectedCert}
          existingCert={editingCert}
          onClose={() => {
            setShowAddCert(false);
            setEditingCert(null);
            setSelectedCert(null);
          }}
          onSave={editingCert ? handleUpdateCertification : handleAddCertification}
          requiredCertifications={requiredCertifications}
        />
      )}
    </div>
  );
};

// Certification Form Component
const CertificationForm = ({ certification, existingCert, onClose, onSave, requiredCertifications }) => {
  const [formData, setFormData] = useState({
    certId: existingCert?.certId || certification?.id || '',
    personName: existingCert?.personName || '',
    personRole: existingCert?.personRole || '',
    issueDate: existingCert?.issueDate || '',
    expirationDate: existingCert?.expirationDate || '',
    certificateNumber: existingCert?.certificateNumber || '',
    provider: existingCert?.provider || certification?.provider || '',
    notes: existingCert?.notes || '',
    documentUrl: existingCert?.documentUrl || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (existingCert) {
      onSave(existingCert.id, formData);
    } else {
      onSave(formData);
    }
  };

  const selectedCertDetails = requiredCertifications.find(c => c.id === formData.certId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {existingCert ? 'Edit Certification' : 'Add Certification'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Certification Type *
            </label>
            <select
              value={formData.certId}
              onChange={(e) => setFormData({ ...formData, certId: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select certification...</option>
              {requiredCertifications.map(cert => (
                <option key={cert.id} value={cert.id}>
                  {cert.name}
                </option>
              ))}
            </select>
          </div>

          {selectedCertDetails && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Validity:</strong> {selectedCertDetails.validity} years | 
                <strong> Cost:</strong> {selectedCertDetails.cost} | 
                <strong> Format:</strong> {selectedCertDetails.format}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Person Name *
              </label>
              <input
                type="text"
                value={formData.personName}
                onChange={(e) => setFormData({ ...formData, personName: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role *
              </label>
              <input
                type="text"
                value={formData.personRole}
                onChange={(e) => setFormData({ ...formData, personRole: e.target.value })}
                required
                placeholder="e.g., Manager, Server, Chef"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issue Date *
              </label>
              <input
                type="date"
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiration Date *
              </label>
              <input
                type="date"
                value={formData.expirationDate}
                onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Certificate Number
              </label>
              <input
                type="text"
                value={formData.certificateNumber}
                onChange={(e) => setFormData({ ...formData, certificateNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Provider
              </label>
              <input
                type="text"
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                placeholder="e.g., ServSafe, Red Cross"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Certificate Document URL
            </label>
            <input
              type="url"
              value={formData.documentUrl}
              onChange={(e) => setFormData({ ...formData, documentUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {existingCert ? 'Update' : 'Add'} Certification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CertificationManager;


