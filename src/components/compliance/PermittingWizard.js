import React, { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import SectionCard from '../ui/SectionCard';
import DocumentUploader from './DocumentUploader';
import {
  CheckCircle,
  Circle,
  ArrowRight,
  ArrowLeft,
  Clock,
  DollarSign,
  FileText,
  Building2,
  Shield,
  Utensils,
  AlertCircle,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Info,
  Download,
  Upload
} from 'lucide-react';

const PermittingWizard = () => {
  const { state } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [expandedSections, setExpandedSections] = useState(new Set([0]));

  // Step-by-step permitting process organized by phase
  const permittingSteps = [
    {
      id: 'phase-1',
      title: 'Phase 1: Business Foundation',
      description: 'Essential business setup and registration',
      icon: Building2,
      color: 'blue',
      estimatedDays: 14,
      estimatedCost: 0,
      requirements: [
        {
          id: 'ein',
          title: 'Federal Employer Identification Number (EIN)',
          agency: 'IRS',
          description: 'Required for tax purposes and opening business bank accounts',
          deadline: 'Before opening',
          processingTime: '1-2 weeks (or instant online)',
          estimatedCost: 0,
          priority: 'high',
          website: 'https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online',
          documents: ['Application Form SS-4'],
          contactInfo: {
            phone: '1-800-829-4933',
            hours: 'Mon-Fri 7am-7pm ET'
          },
          steps: [
            'Determine your business structure (LLC, Corporation, etc.)',
            'Gather required information (SSN, business name, address)',
            'Complete Form SS-4 online at IRS.gov',
            'Submit application (instant approval for most businesses)',
            'Save your EIN confirmation letter'
          ],
          notes: 'Can be completed online instantly for most businesses. Free to apply directly with IRS.',
          dependencies: []
        },
        {
          id: 'business-license',
          title: 'Massachusetts Business Registration',
          agency: 'Massachusetts Secretary of State',
          description: 'Register your business entity with the state',
          deadline: 'Before operations begin',
          processingTime: '1-2 weeks',
          estimatedCost: 500,
          priority: 'high',
          website: 'https://www.sec.state.ma.us/',
          documents: ['Articles of Organization/Incorporation', 'Business name reservation'],
          contactInfo: {
            phone: '617-727-9640',
            hours: 'Mon-Fri 8:45am-5pm ET'
          },
          steps: [
            'Reserve your business name (if needed)',
            'Choose business structure (LLC recommended)',
            'File Articles of Organization',
            'Pay filing fee ($500 for LLC)',
            'Receive Certificate of Organization'
          ],
          notes: 'LLC is recommended for restaurants. Consider consulting with a business attorney.',
          dependencies: ['ein']
        },
        {
          id: 'dba',
          title: 'Doing Business As (DBA) Registration',
          agency: 'City of Boston',
          description: 'Register your trade name if different from legal name',
          deadline: 'Before opening',
          processingTime: '1-2 weeks',
          estimatedCost: 50,
          priority: 'medium',
          website: 'https://www.boston.gov/departments/assessing',
          documents: ['DBA Application', 'Proof of business registration'],
          contactInfo: {
            phone: '617-635-4287',
            hours: 'Mon-Fri 9am-5pm ET'
          },
          steps: [
            'Check name availability',
            'Complete DBA application',
            'Submit with filing fee ($50)',
            'Receive DBA certificate'
          ],
          notes: 'Only required if your restaurant name differs from your legal business name.',
          dependencies: ['business-license']
        }
      ]
    },
    {
      id: 'phase-2',
      title: 'Phase 2: Location & Building',
      description: 'Property permits and building compliance',
      icon: MapPin,
      color: 'green',
      estimatedDays: 60,
      estimatedCost: 5000,
      requirements: [
        {
          id: 'zoning',
          title: 'Zoning Verification & Variance (if needed)',
          agency: 'Boston Zoning Board of Appeal',
          description: 'Verify property is zoned for restaurant use',
          deadline: 'Before lease signing (ideally)',
          processingTime: '2-4 weeks',
          estimatedCost: 500,
          priority: 'high',
          website: 'https://www.boston.gov/departments/inspectional-services/zoning-board-appeal',
          documents: ['Zoning application', 'Site plan', 'Property deed or lease'],
          contactInfo: {
            phone: '617-635-4775',
            hours: 'Mon-Fri 9am-5pm ET'
          },
          steps: [
            'Check current zoning designation',
            'Verify restaurant use is allowed',
            'Apply for variance if needed',
            'Attend zoning hearing',
            'Receive approval'
          ],
          notes: 'Critical step - do not sign lease until zoning is confirmed. Variance process can take 2-3 months.',
          dependencies: []
        },
        {
          id: 'building-permit',
          title: 'Building Permits',
          agency: 'Boston Inspectional Services Department',
          description: 'Required for any construction, renovation, or changes to the building',
          deadline: 'Before construction begins',
          processingTime: '2-6 weeks',
          estimatedCost: 2000,
          priority: 'high',
          website: 'https://www.boston.gov/departments/inspectional-services',
          documents: ['Building permit application', 'Architectural plans', 'Structural plans', 'Electrical plans', 'Plumbing plans'],
          contactInfo: {
            phone: '617-635-5300',
            hours: 'Mon-Fri 8am-4pm ET'
          },
          steps: [
            'Hire licensed architect/engineer',
            'Prepare detailed construction plans',
            'Submit permit application',
            'Pay permit fees',
            'Schedule plan review',
            'Receive permit approval',
            'Begin construction (with inspections)'
          ],
          notes: 'All plans must be stamped by licensed professionals. Multiple inspections required during construction.',
          dependencies: ['zoning']
        },
        {
          id: 'occupancy-permit',
          title: 'Certificate of Occupancy',
          agency: 'Boston Inspectional Services Department',
          description: 'Required before opening to the public',
          deadline: 'Before opening',
          processingTime: '1-2 weeks',
          estimatedCost: 200,
          priority: 'high',
          website: 'https://www.boston.gov/departments/inspectional-services',
          documents: ['Occupancy permit application', 'Final building inspection report', 'When to Apply for CO Guide'],
          templates: [
            { name: 'When to Apply for Certificate of Occupancy Guide', type: 'PDF', url: '#', description: 'Official Boston guide on when and how to apply for CO', localPath: 'C:\\Users\\chefm\\Downloads\\WHEN TO APPLY FOR A CO_tcm3-36230.pdf' }
          ],
          contactInfo: {
            phone: '617-635-5300',
            hours: 'Mon-Fri 8am-4pm ET'
          },
          steps: [
            'Review "When to Apply for CO" guide',
            'Complete all construction',
            'Pass final building inspection',
            'Submit occupancy application',
            'Receive Certificate of Occupancy'
          ],
          notes: 'Cannot open without this certificate. Schedule final inspection well in advance. Review the official guide for timing requirements.',
          dependencies: ['building-permit']
        }
      ]
    },
    {
      id: 'phase-3',
      title: 'Phase 3: Health & Safety',
      description: 'Health permits and safety compliance',
      icon: Shield,
      color: 'red',
      estimatedDays: 30,
      estimatedCost: 1000,
      requirements: [
        {
          id: 'health-permit',
          title: 'Food Service Establishment Permit',
          agency: 'Boston Public Health Commission',
          description: 'Required to serve food to the public',
          deadline: 'Before opening',
          processingTime: '2-4 weeks',
          estimatedCost: 300,
          priority: 'critical',
          website: 'https://www.bphc.org/whatwedo/environmental-health/food-safety/Pages/Home.aspx',
          documents: [
            'Food service permit application',
            'Menu with consumer advisories',
            'Site plan showing kitchen layout',
            'Equipment list',
            'Food safety manager certification',
            'Plumbing and electrical approvals'
          ],
          contactInfo: {
            phone: '617-534-5961',
            hours: 'Mon-Fri 8am-4pm ET',
            email: 'foodsafety@bphc.org'
          },
          steps: [
            'Complete ServSafe or equivalent certification',
            'Prepare detailed kitchen layout plans',
            'Submit permit application with all documents',
            'Schedule pre-opening inspection',
            'Address any violations',
            'Pass final inspection',
            'Receive food service permit'
          ],
          notes: 'This is the most critical permit. Plan for multiple inspections. All kitchen staff must be food safety certified.',
          dependencies: ['occupancy-permit']
        },
        {
          id: 'alcohol-license',
          title: 'Alcoholic Beverages License',
          agency: 'Boston Licensing Board',
          description: 'Required to serve alcohol (if applicable)',
          deadline: 'Before opening',
          processingTime: '3-6 months',
          estimatedCost: 5000,
          priority: 'high',
          website: 'https://www.boston.gov/departments/consumer-affairs-and-licensing',
          documents: [
            'Alcohol license application',
            'Business registration',
            'Lease agreement',
            'Background checks for all owners',
            'Financial statements',
            'Community support letters'
          ],
          contactInfo: {
            phone: '617-635-4169',
            hours: 'Mon-Fri 9am-5pm ET'
          },
          steps: [
            'Determine license type (beer/wine vs. full liquor)',
            'Check license availability in your area',
            'Complete application with all required documents',
            'Submit to Licensing Board',
            'Attend public hearing',
            'Receive license approval',
            'Pay annual license fee'
          ],
          notes: 'This process is lengthy and competitive. Start early. Full liquor licenses are limited and expensive.',
          dependencies: ['health-permit']
        },
        {
          id: 'fire-permit',
          title: 'Fire Department Permit',
          agency: 'Boston Fire Department',
          description: 'Required for commercial kitchen operations',
          deadline: 'Before opening',
          processingTime: '1-2 weeks',
          estimatedCost: 200,
          priority: 'high',
          website: 'https://www.boston.gov/departments/fire',
          documents: ['Fire permit application', 'Kitchen hood system certification', 'Fire suppression system certification'],
          contactInfo: {
            phone: '617-343-3630',
            hours: 'Mon-Fri 8am-4pm ET'
          },
          steps: [
            'Install commercial kitchen hood system',
            'Install fire suppression system',
            'Schedule fire inspection',
            'Pass inspection',
            'Receive fire permit'
          ],
          notes: 'Commercial kitchens require specialized fire suppression systems. Work with certified installers.',
          dependencies: ['building-permit']
        }
      ]
    },
    {
      id: 'phase-4',
      title: 'Phase 4: Operations & Employment',
      description: 'Final operational permits and employee requirements',
      icon: Utensils,
      color: 'purple',
      estimatedDays: 14,
      estimatedCost: 500,
      requirements: [
        {
          id: 'sign-permit',
          title: 'Sign Permit',
          agency: 'Boston Inspectional Services Department',
          description: 'Required for exterior signage',
          deadline: 'Before installing signs',
          processingTime: '2-4 weeks',
          estimatedCost: 100,
          priority: 'medium',
          website: 'https://www.boston.gov/departments/inspectional-services',
          documents: ['Sign permit application', 'Sign design plans', 'Property owner approval'],
          contactInfo: {
            phone: '617-635-5300',
            hours: 'Mon-Fri 8am-4pm ET'
          },
          steps: [
            'Design signage (must comply with zoning)',
            'Get property owner approval',
            'Submit sign permit application',
            'Receive approval',
            'Install signs'
          ],
          notes: 'Signage must comply with size and placement restrictions. Historical districts have additional requirements.',
          dependencies: ['occupancy-permit']
        },
        {
          id: 'i9-forms',
          title: 'Form I-9 Employee Verification',
          agency: 'Department of Homeland Security',
          description: 'Verify employee eligibility to work',
          deadline: 'Within 3 days of hire',
          processingTime: 'Immediate',
          estimatedCost: 0,
          priority: 'high',
          website: 'https://www.uscis.gov/i-9',
          documents: ['Form I-9', 'Employee identification documents'],
          contactInfo: {
            phone: '1-800-375-5283',
            hours: 'Mon-Fri 8am-8pm ET'
          },
          steps: [
            'Obtain Form I-9 from USCIS website',
            'Have employee complete Section 1',
            'Review employee identification documents',
            'Complete Section 2',
            'Retain forms for 3 years after employment ends'
          ],
          notes: 'Required for all employees. Keep forms secure and accessible for audits.',
          dependencies: []
        },
        {
          id: 'workers-comp',
          title: 'Workers\' Compensation Insurance',
          agency: 'Massachusetts Department of Industrial Accidents',
          description: 'Required for all employees',
          deadline: 'Before hiring employees',
          processingTime: '1-2 weeks',
          estimatedCost: 2000,
          priority: 'high',
          website: 'https://www.mass.gov/orgs/department-of-industrial-accidents',
          documents: ['Insurance application', 'Employee roster', 'Payroll information'],
          contactInfo: {
            phone: '617-727-4900',
            hours: 'Mon-Fri 8:45am-5pm ET'
          },
          steps: [
            'Contact insurance provider',
            'Provide employee information',
            'Get quote and purchase policy',
            'Receive certificate of insurance',
            'Post notice in workplace'
          ],
          notes: 'Required by law. Rates vary by industry and payroll. Shop around for best rates.',
          dependencies: []
        }
      ]
    }
  ];

  const totalSteps = permittingSteps.reduce((sum, phase) => sum + phase.requirements.length, 0);
  const completedCount = completedSteps.size;
  const progress = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;

  const toggleStepCompletion = (phaseId, requirementId) => {
    const stepKey = `${phaseId}-${requirementId}`;
    setCompletedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepKey)) {
        newSet.delete(stepKey);
      } else {
        newSet.add(stepKey);
      }
      return newSet;
    });
  };

  const toggleSection = (index) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const isStepCompleted = (phaseId, requirementId) => {
    return completedSteps.has(`${phaseId}-${requirementId}`);
  };

  const getNextIncompleteStep = () => {
    for (let phaseIndex = 0; phaseIndex < permittingSteps.length; phaseIndex++) {
      const phase = permittingSteps[phaseIndex];
      for (let reqIndex = 0; reqIndex < phase.requirements.length; reqIndex++) {
        const req = phase.requirements[reqIndex];
        if (!isStepCompleted(phase.id, req.id)) {
          return { phaseIndex, reqIndex };
        }
      }
    }
    return null;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <SectionCard
        title="Permitting Process Overview"
        description="Step-by-step guide through all required permits and licenses"
        color="blue"
        icon={FileText}
      >
        <div className="space-y-4">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Overall Progress
              </span>
              <span className="text-sm text-gray-600">
                {completedCount} of {totalSteps} steps completed
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {permittingSteps.map((phase) => {
              const phaseCompleted = phase.requirements.filter(req => 
                isStepCompleted(phase.id, req.id)
              ).length;
              const Icon = phase.icon;
              return (
                <div
                  key={phase.id}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    {phase.color === 'blue' && <Icon className="w-5 h-5 text-blue-600" />}
                    {phase.color === 'green' && <Icon className="w-5 h-5 text-green-600" />}
                    {phase.color === 'red' && <Icon className="w-5 h-5 text-red-600" />}
                    {phase.color === 'purple' && <Icon className="w-5 h-5 text-purple-600" />}
                    <span className="text-sm font-medium text-gray-700">
                      {phase.title.split(':')[0]}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {phaseCompleted}/{phase.requirements.length}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatCurrency(phase.estimatedCost)} • {phase.estimatedDays} days
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </SectionCard>

      {/* Step-by-Step Phases */}
      {permittingSteps.map((phase, phaseIndex) => {
        const Icon = phase.icon;
        const isExpanded = expandedSections.has(phaseIndex);
        const phaseCompletedCount = phase.requirements.filter(req => 
          isStepCompleted(phase.id, req.id)
        ).length;

        return (
          <SectionCard
            key={phase.id}
            title={phase.title}
            description={phase.description}
            color={phase.color}
            icon={Icon}
          >
            <div className="space-y-4">
              {/* Phase Header */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    phase.color === 'blue' ? 'bg-blue-100' :
                    phase.color === 'green' ? 'bg-green-100' :
                    phase.color === 'red' ? 'bg-red-100' :
                    'bg-purple-100'
                  }`}>
                    {phase.color === 'blue' && <Icon className="w-6 h-6 text-blue-600" />}
                    {phase.color === 'green' && <Icon className="w-6 h-6 text-green-600" />}
                    {phase.color === 'red' && <Icon className="w-6 h-6 text-red-600" />}
                    {phase.color === 'purple' && <Icon className="w-6 h-6 text-purple-600" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{phase.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {phase.estimatedDays} days
                      </span>
                      <span className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {formatCurrency(phase.estimatedCost)}
                      </span>
                      <span className="flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        {phaseCompletedCount}/{phase.requirements.length} completed
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleSection(phaseIndex)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {isExpanded ? 'Collapse' : 'Expand'}
                </button>
              </div>

              {/* Requirements List */}
              {isExpanded && (
                <div className="space-y-4">
                  {phase.requirements.map((requirement, reqIndex) => {
                    const stepKey = `${phase.id}-${requirement.id}`;
                    const isCompleted = isStepCompleted(phase.id, requirement.id);
                    const isExpanded = expandedSections.has(stepKey);

                    return (
                      <div
                        key={requirement.id}
                        className={`border rounded-lg overflow-hidden ${
                          isCompleted ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'
                        }`}
                      >
                        {/* Requirement Header */}
                        <div className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1">
                              <button
                                onClick={() => toggleStepCompletion(phase.id, requirement.id)}
                                className="mt-1 flex-shrink-0"
                              >
                                {isCompleted ? (
                                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                                ) : (
                                  <Circle className="w-6 h-6 text-gray-400" />
                                )}
                              </button>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4 className="font-semibold text-gray-900">
                                    {requirement.title}
                                  </h4>
                                  {requirement.priority === 'critical' && (
                                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">
                                      Critical
                                    </span>
                                  )}
                                  {requirement.priority === 'high' && (
                                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                                      High Priority
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                  {requirement.description}
                                </p>
                                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                                  <span className="flex items-center">
                                    <Building2 className="w-3 h-3 mr-1" />
                                    {requirement.agency}
                                  </span>
                                  <span className="flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {requirement.processingTime}
                                  </span>
                                  <span className="flex items-center">
                                    <DollarSign className="w-3 h-3 mr-1" />
                                    {formatCurrency(requirement.estimatedCost)}
                                  </span>
                                  <span className="flex items-center">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {requirement.deadline}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                const newSet = new Set(expandedSections);
                                if (newSet.has(stepKey)) {
                                  newSet.delete(stepKey);
                                } else {
                                  newSet.add(stepKey);
                                }
                                setExpandedSections(newSet);
                              }}
                              className="ml-4 text-gray-400 hover:text-gray-600"
                            >
                              {isExpanded ? (
                                <ArrowRight className="w-5 h-5 rotate-90" />
                              ) : (
                                <ArrowRight className="w-5 h-5 -rotate-90" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <div className="border-t border-gray-200 bg-white p-4 space-y-4">
                            {/* Step-by-Step Instructions */}
                            <div>
                              <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                                <ArrowRight className="w-4 h-4 mr-2 text-blue-600" />
                                Step-by-Step Process
                              </h5>
                              <ol className="space-y-2">
                                {requirement.steps.map((step, stepIndex) => (
                                  <li key={stepIndex} className="flex items-start space-x-2">
                                    <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-medium">
                                      {stepIndex + 1}
                                    </span>
                                    <span className="text-sm text-gray-700 pt-0.5">{step}</span>
                                  </li>
                                ))}
                              </ol>
                            </div>

                            {/* Required Documents */}
                            <div>
                              <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                                <FileText className="w-4 h-4 mr-2 text-blue-600" />
                                Required Documents
                              </h5>
                              <div className="flex flex-wrap gap-2">
                                {requirement.documents.map((doc, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-flex items-center px-3 py-1 rounded-md text-xs bg-blue-50 text-blue-700 border border-blue-200"
                                  >
                                    {doc}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Contact Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                                  <Phone className="w-4 h-4 mr-2 text-blue-600" />
                                  Contact Information
                                </h5>
                                <div className="space-y-1 text-sm text-gray-600">
                                  {requirement.contactInfo.phone && (
                                    <div className="flex items-center">
                                      <Phone className="w-3 h-3 mr-2" />
                                      <a href={`tel:${requirement.contactInfo.phone}`} className="hover:text-blue-600">
                                        {requirement.contactInfo.phone}
                                      </a>
                                    </div>
                                  )}
                                  {requirement.contactInfo.hours && (
                                    <div className="flex items-center">
                                      <Clock className="w-3 h-3 mr-2" />
                                      {requirement.contactInfo.hours}
                                    </div>
                                  )}
                                  {requirement.contactInfo.email && (
                                    <div className="flex items-center">
                                      <Mail className="w-3 h-3 mr-2" />
                                      <a href={`mailto:${requirement.contactInfo.email}`} className="hover:text-blue-600">
                                        {requirement.contactInfo.email}
                                      </a>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                                  <ExternalLink className="w-4 h-4 mr-2 text-blue-600" />
                                  Resources
                                </h5>
                                <div className="space-y-2">
                                  {requirement.website && (
                                    <a
                                      href={requirement.website}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                                    >
                                      <ExternalLink className="w-3 h-3 mr-2" />
                                      Visit Official Website
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Important Notes */}
                            {requirement.notes && (
                              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-start space-x-2">
                                  <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                                  <p className="text-sm text-blue-800">{requirement.notes}</p>
                                </div>
                              </div>
                            )}

                            {/* Dependencies */}
                            {requirement.dependencies && requirement.dependencies.length > 0 && (
                              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div className="flex items-start space-x-2">
                                  <AlertCircle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium text-yellow-800 mb-1">
                                      Prerequisites Required:
                                    </p>
                                    <ul className="text-sm text-yellow-700 list-disc list-inside">
                                      {requirement.dependencies.map((dep, idx) => (
                                        <li key={idx}>{dep}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Document Upload */}
                            <div className="border-t border-gray-200 pt-4">
                              <DocumentUploader
                                documentId={requirement.id}
                                requiredDocuments={requirement.documents}
                                onUpload={(files) => {
                                  // Handle file upload
                                  console.log('Files uploaded:', files);
                                }}
                                existingFiles={[]}
                                documentType="general"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </SectionCard>
        );
      })}
    </div>
  );
};

export default PermittingWizard;

