import React, { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import SectionCard from '../ui/SectionCard';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  FileText, 
  Clock,
  Shield,
  Utensils,
  Thermometer,
  Droplets,
  Trash2,
  Bug,
  Eye,
  Download
} from 'lucide-react';

const HealthInspectionTracker = () => {
  const { state, actions } = useApp();
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [showViolationDetails, setShowViolationDetails] = useState(false);

  // Sample inspection data - in real app, this would come from API
  const [inspections, setInspections] = useState([
    {
      id: 1,
      date: '2024-01-15',
      inspector: 'John Smith',
      score: 95,
      status: 'Pass',
      violations: [
        {
          code: 'M-1',
          description: 'Person In Charge (PIC) Assigned',
          type: 'Risk Factor Critical',
          status: 'Corrected',
          notes: 'PIC was present and properly designated'
        },
        {
          code: '3-4',
          description: 'Hot and Cold Holding',
          type: 'Risk Factor Critical',
          status: 'Corrected',
          notes: 'Temperature logs were properly maintained'
        }
      ],
      nextInspection: '2024-04-15',
      documents: ['Inspection Report', 'Corrective Action Plan']
    },
    {
      id: 2,
      date: '2023-10-20',
      inspector: 'Sarah Johnson',
      score: 88,
      status: 'Pass',
      violations: [
        {
          code: '22-1',
          description: 'Food Contact Surfaces Clean',
          type: 'Critical',
          status: 'Corrected',
          notes: 'Cutting boards were properly cleaned and sanitized'
        }
      ],
      nextInspection: '2024-01-20',
      documents: ['Inspection Report']
    }
  ]);

  // Violation code reference based on Boston Mayor's Food Court
  const violationCodes = {
    'M-1': { category: 'Food Protection Management', severity: 'Critical', description: 'Person In Charge (PIC) Assigned' },
    'M-2': { category: 'Food Protection Management', severity: 'Critical', description: 'Person In Charge Knowledgeable' },
    'M-3': { category: 'Food Protection Management', severity: 'Critical', description: 'Person In Charge Performing Duties' },
    'M-7': { category: 'Food Protection Management', severity: 'Critical', description: 'Consumer Advisories' },
    '1-1': { category: 'Food Safety', severity: 'Critical', description: 'Approved Source' },
    '1-2': { category: 'Food Safety', severity: 'Critical', description: 'No Spoilage' },
    '3-1': { category: 'Temperature Controls', severity: 'Critical', description: 'Cooking Temperatures' },
    '3-4': { category: 'Temperature Controls', severity: 'Critical', description: 'Hot and Cold Holding' },
    '7-1': { category: 'Food Protection', severity: 'Critical', description: 'No Reservice of Potentially Hazardous Food' },
    '8-2': { category: 'Food Protection', severity: 'Critical', description: 'Separation, Segregation, No Cross Contamination' },
    '22-1': { category: 'Equipment', severity: 'Critical', description: 'Food Contact Surfaces Clean' },
    '27-1': { category: 'Water', severity: 'Critical', description: 'Water Safe, Approved System' },
    '31-1': { category: 'Handwashing', severity: 'Critical', description: 'Number, Convenient' },
    '35-1': { category: 'Pest Control', severity: 'Critical', description: 'Insects, Rodents, Animals, Outer Openings' }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pass': return 'text-green-600 bg-green-100';
      case 'Fail': return 'text-red-600 bg-red-100';
      case 'Corrected': return 'text-blue-600 bg-blue-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'text-red-600 bg-red-100';
      case 'Risk Factor Critical': return 'text-orange-600 bg-orange-100';
      case 'Non-Critical': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const upcomingInspections = useMemo(() => {
    const today = new Date();
    return inspections
      .filter(inspection => new Date(inspection.nextInspection) > today)
      .sort((a, b) => new Date(a.nextInspection) - new Date(b.nextInspection));
  }, [inspections]);

  const recentViolations = useMemo(() => {
    return inspections
      .flatMap(inspection => inspection.violations)
      .filter(violation => violation.status !== 'Corrected')
      .slice(0, 5);
  }, [inspections]);

  const inspectionStats = useMemo(() => {
    const total = inspections.length;
    const passed = inspections.filter(i => i.status === 'Pass').length;
    const avgScore = inspections.reduce((sum, i) => sum + i.score, 0) / total;
    const criticalViolations = inspections.flatMap(i => i.violations).filter(v => v.type.includes('Critical')).length;
    
    return { total, passed, avgScore: Math.round(avgScore), criticalViolations };
  }, [inspections]);

  return (
    <SectionCard
      title="Health Inspection Tracker"
      description="Monitor health inspection results and track violation corrections"
    >
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Total Inspections</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{inspectionStats.total}</div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Pass Rate</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {Math.round((inspectionStats.passed / inspectionStats.total) * 100)}%
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">Avg Score</span>
            </div>
            <div className={`text-2xl font-bold mt-1 ${getScoreColor(inspectionStats.avgScore)}`}>
              {inspectionStats.avgScore}
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-gray-600">Critical Violations</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{inspectionStats.criticalViolations}</div>
          </div>
        </div>

        {/* Upcoming Inspections */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Inspections</h3>
          </div>
          
          {upcomingInspections.length > 0 ? (
            <div className="space-y-3">
              {upcomingInspections.map((inspection) => (
                <div key={inspection.id} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="font-medium text-gray-900">
                        Next Inspection: {new Date(inspection.nextInspection).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        Last inspection: {new Date(inspection.date).toLocaleDateString()} (Score: {inspection.score})
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(inspection.status)}`}>
                      {inspection.status}
                    </span>
                    <button
                      onClick={() => setSelectedInspection(inspection)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No upcoming inspections scheduled</p>
            </div>
          )}
        </div>

        {/* Recent Violations */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">Recent Violations</h3>
          </div>
          
          {recentViolations.length > 0 ? (
            <div className="space-y-3">
              {recentViolations.map((violation, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(violation.type)}`}>
                        {violation.code}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{violation.description}</div>
                      <div className="text-sm text-gray-600">{violation.type}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(violation.status)}`}>
                      {violation.status}
                    </span>
                    <button
                      onClick={() => setShowViolationDetails(true)}
                      className="p-1 text-gray-600 hover:text-gray-800"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-400" />
              <p>No recent violations - Great job!</p>
            </div>
          )}
        </div>

        {/* Inspection History */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Inspection History</h3>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1">
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inspector</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Violations</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inspections.map((inspection) => (
                  <tr key={inspection.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(inspection.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {inspection.inspector}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getScoreColor(inspection.score)}`}>
                        {inspection.score}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(inspection.status)}`}>
                        {inspection.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {inspection.violations.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedInspection(inspection)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Violation Code Reference */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900">Violation Code Reference</h3>
          </div>
          <p className="text-sm text-blue-800 mb-4">
            Based on <a href="https://www.boston.gov/health-and-human-services/mayors-food-court" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Boston Mayor's Food Court</a> violation codes
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(violationCodes).slice(0, 9).map(([code, info]) => (
              <div key={code} className="bg-white border border-blue-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm font-bold text-blue-900">{code}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(info.severity)}`}>
                    {info.severity}
                  </span>
                </div>
                <div className="text-sm text-gray-700 mb-1">{info.description}</div>
                <div className="text-xs text-gray-500">{info.category}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View All Violation Codes →
            </button>
          </div>
        </div>
      </div>
    </SectionCard>
  );
};

export default HealthInspectionTracker;
