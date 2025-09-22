import React, { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import SectionCard from '../ui/SectionCard';
import DocumentUploader from './DocumentUploader';
import MonthlyHealthChecklist from './MonthlyHealthChecklist';
import HealthInspectionTracker from './HealthInspectionTracker';
import { 
  FileText, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Upload, 
  Download,
  Building2,
  Shield,
  Utensils,
  DollarSign,
  Users,
  Truck,
  Filter,
  Search,
  Plus,
  Eye,
  Trash2,
  Bell,
  Calculator,
  Link,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  FileCheck,
  AlertTriangle,
  Target,
  BarChart3
} from 'lucide-react';

const DocumentsCompliance = () => {
  const { state, actions } = useApp();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDocument, setShowAddDocument] = useState(false);
  const [viewMode, setViewMode] = useState('detailed'); // detailed, checklist, timeline, health-checklist, inspection-tracker
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState({});

  // Enhanced Boston-specific restaurant requirements with more details
  const bostonRequirements = [
    // Federal Requirements
    {
      id: 'ein',
      title: 'Federal Employer Identification Number (EIN)',
      category: 'Federal',
      agency: 'IRS',
      description: 'Required for tax purposes and opening business bank accounts',
      deadline: 'Before opening',
      daysFromStart: 0,
      estimatedCost: 0,
      processingTime: '1-2 weeks',
      status: 'not-started',
      priority: 'high',
      website: 'https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online',
      documents: ['Application Form SS-4'],
      icon: DollarSign,
      contactInfo: {
        phone: '1-800-829-4933',
        hours: 'Mon-Fri 7am-7pm ET',
        address: 'Internal Revenue Service, Cincinnati, OH 45999'
      },
      templates: [
        { name: 'Form SS-4', type: 'PDF', url: '#' },
        { name: 'EIN Application Guide', type: 'PDF', url: '#' }
      ],
      steps: [
        'Determine your business structure',
        'Gather required information',
        'Complete Form SS-4 online',
        'Submit application',
        'Receive EIN confirmation'
      ],
      notes: 'Can be completed online instantly for most businesses. Free to apply directly with IRS.',
      dependencies: [],
      compliance: {
        renewal: 'Not required',
        penalties: 'No penalty for delay, but needed for other permits'
      }
    },
    {
      id: 'i9-forms',
      title: 'Form I-9 Employee Verification',
      category: 'Federal',
      agency: 'Department of Homeland Security',
      description: 'Verify employee eligibility to work in the United States',
      deadline: 'Within 3 days of hire',
      daysFromStart: 180,
      estimatedCost: 0,
      processingTime: 'Immediate',
      status: 'not-started',
      priority: 'high',
      website: 'https://www.uscis.gov/i-9',
      documents: ['Form I-9', 'Employee documentation'],
      icon: Users,
      contactInfo: {
        phone: '1-888-464-4218',
        hours: 'Mon-Fri 8am-6pm ET',
        email: 'I-9CentralOffice@uscis.dhs.gov'
      },
      templates: [
        { name: 'Form I-9', type: 'PDF', url: '#' },
        { name: 'Acceptable Documents List', type: 'PDF', url: '#' }
      ],
      steps: [
        'Download current Form I-9',
        'Employee completes Section 1',
        'Review acceptable documents',
        'Complete Section 2 within 3 days',
        'Store forms securely'
      ],
      notes: 'Required for ALL employees. Keep forms for 3 years after hire or 1 year after termination.',
      dependencies: ['ein'],
      compliance: {
        renewal: 'Re-verify expiring documents',
        penalties: '$252 - $2,500+ per violation'
      }
    },

    // Massachusetts State Requirements
    {
      id: 'ma-business-registration',
      title: 'Massachusetts Business Registration',
      category: 'State',
      agency: 'MA Secretary of State',
      description: 'Register your business entity with Massachusetts',
      deadline: 'Before opening',
      daysFromStart: 30,
      estimatedCost: 520,
      processingTime: '1-2 weeks',
      status: 'not-started',
      priority: 'high',
      website: 'https://corp.sec.state.ma.us/',
      documents: ['Articles of Organization', 'Operating Agreement'],
      icon: Building2,
      contactInfo: {
        phone: '617-727-9640',
        hours: 'Mon-Fri 9am-5pm',
        address: 'One Ashburton Place, 17th Floor, Boston, MA 02108'
      },
      templates: [
        { name: 'Articles of Organization (LLC)', type: 'PDF', url: '#' },
        { name: 'Operating Agreement Template', type: 'DOCX', url: '#' }
      ],
      steps: [
        'Choose business structure (LLC recommended)',
        'Select unique business name',
        'Complete Articles of Organization',
        'Pay filing fee ($520)',
        'Receive Certificate of Organization'
      ],
      notes: 'LLC filing fee is $520. Name must be available - check online first.',
      dependencies: [],
      compliance: {
        renewal: 'Annual report required',
        penalties: '$500+ for late annual reports'
      }
    },
    {
      id: 'ma-tax-registration',
      title: 'Massachusetts Tax Registration',
      category: 'State',
      agency: 'MA Department of Revenue',
      description: 'Register for state taxes including sales tax',
      deadline: 'Before opening',
      daysFromStart: 45,
      estimatedCost: 0,
      processingTime: '2-3 weeks',
      status: 'not-started',
      priority: 'high',
      website: 'https://www.mass.gov/how-to/register-your-business-for-taxes',
      documents: ['Business Registration Application'],
      icon: DollarSign,
      contactInfo: {
        phone: '617-887-6367',
        hours: 'Mon-Fri 8:30am-4:30pm',
        address: '100 Cambridge Street, Boston, MA 02114'
      },
      templates: [
        { name: 'Business Registration Form', type: 'PDF', url: '#' },
        { name: 'Tax Calendar', type: 'PDF', url: '#' }
      ],
      steps: [
        'Complete business registration application',
        'Submit online or by mail',
        'Receive tax ID numbers',
        'Set up tax payment accounts',
        'Understand filing requirements'
      ],
      notes: 'Register for sales tax, meals tax, and employer withholding if applicable.',
      dependencies: ['ma-business-registration'],
      compliance: {
        renewal: 'Monthly/quarterly filings',
        penalties: 'Interest and penalties for late payments'
      }
    },
    {
      id: 'workers-comp',
      title: 'Workers\' Compensation Insurance',
      category: 'State',
      agency: 'MA Department of Industrial Accidents',
      description: 'Required for all businesses with employees in Massachusetts',
      deadline: 'Before hiring employees',
      daysFromStart: 150,
      estimatedCost: 2500,
      processingTime: '1-2 weeks',
      status: 'not-started',
      priority: 'high',
      website: 'https://www.mass.gov/orgs/department-of-industrial-accidents',
      documents: ['Insurance Certificate', 'Policy Documentation'],
      icon: Shield,
      contactInfo: {
        phone: '617-727-4900',
        hours: 'Mon-Fri 8:45am-5pm',
        address: '1 Congress Street, Boston, MA 02114'
      },
      templates: [
        { name: 'Certificate of Insurance', type: 'PDF', url: '#' },
        { name: 'Coverage Requirements', type: 'PDF', url: '#' }
      ],
      steps: [
        'Get quotes from licensed carriers',
        'Choose appropriate coverage',
        'Purchase policy',
        'File certificate with state',
        'Display workplace poster'
      ],
      notes: 'Required even for part-time employees. Shop around for best rates.',
      dependencies: ['ma-business-registration'],
      compliance: {
        renewal: 'Annual policy renewal',
        penalties: 'Stop work order, fines up to $1,500/day'
      }
    },

    // Boston City Requirements
    {
      id: 'food-service-license',
      title: 'Food Service Establishment License',
      category: 'Local',
      agency: 'Boston Public Health Commission',
      description: 'Required to serve food to the public in Boston',
      deadline: 'Before opening',
      daysFromStart: 90,
      estimatedCost: 315,
      processingTime: '4-6 weeks',
      status: 'not-started',
      priority: 'high',
      website: 'https://www.boston.gov/departments/public-health-commission',
      documents: ['Application', 'Floor plans', 'Menu', 'HACCP plan'],
      icon: Utensils,
      contactInfo: {
        phone: '617-534-5395',
        hours: 'Mon-Fri 9am-5pm',
        address: '1010 Massachusetts Ave, Boston, MA 02118'
      },
      templates: [
        { name: 'Food Service License Application', type: 'PDF', url: '#' },
        { name: 'HACCP Plan Template', type: 'DOCX', url: '#' },
        { name: 'Menu Approval Form', type: 'PDF', url: '#' }
      ],
      steps: [
        'Complete application form',
        'Submit floor plans',
        'Develop HACCP plan',
        'Schedule pre-inspection',
        'Pass final inspection'
      ],
      notes: 'Manager must have ServSafe certification. Plan review required before construction.',
      dependencies: ['building-permit'],
      compliance: {
        renewal: 'Annual renewal required',
        penalties: '$300 fine for operating without license'
      }
    },
    {
      id: 'liquor-license',
      title: 'Liquor License',
      category: 'Local',
      agency: 'Boston Licensing Board',
      description: 'Required to serve alcoholic beverages',
      deadline: '6 months before opening',
      daysFromStart: 60,
      estimatedCost: 15000,
      processingTime: '3-6 months',
      status: 'not-started',
      priority: 'high',
      website: 'https://www.boston.gov/departments/licensing-board',
      documents: ['Application', 'Floor plans', 'Fingerprints', 'Background check'],
      icon: Shield,
      contactInfo: {
        phone: '617-635-4165',
        hours: 'Mon-Fri 9am-5pm',
        address: 'Boston City Hall, Room 809, Boston, MA 02201'
      },
      templates: [
        { name: 'Liquor License Application', type: 'PDF', url: '#' },
        { name: 'Floor Plan Requirements', type: 'PDF', url: '#' },
        { name: 'Public Notice Form', type: 'PDF', url: '#' }
      ],
      steps: [
        'Determine license type needed',
        'Complete application packet',
        'Submit fingerprints and background check',
        'Post public notice',
        'Attend public hearing'
      ],
      notes: 'Very limited availability. Consider purchasing existing license. Requires community approval.',
      dependencies: ['ma-business-registration'],
      compliance: {
        renewal: 'Annual renewal by December 31st',
        penalties: 'License suspension/revocation for violations'
      }
    },
    {
      id: 'building-permit',
      title: 'Building/Renovation Permit',
      category: 'Local',
      agency: 'Boston Inspectional Services',
      description: 'Required for construction or major renovations',
      deadline: 'Before construction',
      daysFromStart: 75,
      estimatedCost: 2500,
      processingTime: '2-4 weeks',
      status: 'not-started',
      priority: 'high',
      website: 'https://www.boston.gov/departments/inspectional-services',
      documents: ['Permit application', 'Construction plans', 'Engineer approval'],
      icon: Building2,
      contactInfo: {
        phone: '617-635-5322',
        hours: 'Mon-Fri 8:30am-5pm',
        address: '1010 Massachusetts Ave, Boston, MA 02118'
      },
      templates: [
        { name: 'Building Permit Application', type: 'PDF', url: '#' },
        { name: 'Plan Submission Requirements', type: 'PDF', url: '#' }
      ],
      steps: [
        'Hire licensed architect/engineer',
        'Submit construction plans',
        'Pay permit fees',
        'Schedule inspections',
        'Obtain certificate of occupancy'
      ],
      notes: 'Plans must be prepared by licensed professionals. Multiple inspections required during construction.',
      dependencies: [],
      compliance: {
        renewal: 'Permit expires if work not started within 6 months',
        penalties: 'Stop work order for unpermitted work'
      }
    },
    {
      id: 'fire-permit',
      title: 'Fire Department Permit',
      category: 'Local',
      agency: 'Boston Fire Department',
      description: 'Comprehensive fire safety inspection and permit for restaurant operations',
      deadline: 'Before opening',
      daysFromStart: 120,
      estimatedCost: 350,
      processingTime: '3-4 weeks',
      status: 'not-started',
      priority: 'high',
      website: 'https://www.boston.gov/departments/fire-department',
      documents: [
        'Fire permit application', 
        'Building plans with fire safety features', 
        'Equipment specifications',
        'Fire suppression system plans',
        'Occupancy certificate'
      ],
      icon: Shield,
      contactInfo: {
        phone: '617-343-3550',
        email: 'fire.prevention@boston.gov',
        hours: 'Mon-Fri 8am-4pm',
        address: '115 Southampton St, Boston, MA 02118',
        inspector: 'Fire Prevention Unit'
      },
      templates: [
        { name: 'Fire Permit Application', type: 'PDF', url: '#' },
        { name: 'Fire Safety Checklist for Restaurants', type: 'PDF', url: '#' },
        { name: 'Kitchen Suppression System Requirements', type: 'PDF', url: '#' }
      ],
      steps: [
        'Submit permit application with plans',
        'Install required fire suppression systems',
        'Install fire alarm systems',
        'Install emergency lighting and exit signs',
        'Schedule preliminary inspection',
        'Address any violations found',
        'Schedule final inspection',
        'Pass final safety inspection',
        'Receive permit certificate'
      ],
      requirements: [
        'Type K wet chemical suppression system for cooking equipment',
        'Automatic fire sprinkler system (if required by occupancy)',
        'Fire alarm system with smoke and heat detectors',
        'Emergency lighting with 90-minute battery backup',
        'Illuminated exit signs',
        'Fire extinguishers (Class ABC and K)',
        'Maximum occupancy calculations and posting',
        'Two exits minimum (based on occupancy load)',
        'Proper exit door hardware (panic bars if required)',
        'Clear exit pathways (36" minimum width)',
        'Fire-rated construction between kitchen and dining areas',
        'Proper ventilation and exhaust systems'
      ],
      inspectionItems: [
        'Kitchen suppression system functionality',
        'Fire alarm system operation',
        'Emergency lighting operation',
        'Exit sign illumination',
        'Fire extinguisher placement and maintenance',
        'Exit door operation and hardware',
        'Clear egress pathways',
        'Maximum occupancy compliance',
        'Fire-rated wall penetrations sealed',
        'Electrical panel access clear'
      ],
      notes: 'Critical for restaurant safety. Kitchen suppression systems require annual maintenance. Fire alarm systems require quarterly testing. Updated guidelines as of September 2024.',
      dependencies: ['building-permit', 'electrical-permit'],
      compliance: {
        renewal: 'Annual inspection required',
        maintenance: 'Quarterly fire alarm testing, annual suppression system service',
        penalties: 'Immediate closure for serious fire code violations, fines $300-$5000 per violation'
      }
    },
    {
      id: 'fire-alarm-permit',
      title: 'Fire Alarm System Permit',
      category: 'Local',
      agency: 'Boston Fire Department - Fire Alarm Division',
      description: 'Installation permit for fire detection and alarm systems (Updated Sept 2024)',
      deadline: 'Before alarm installation',
      daysFromStart: 100,
      estimatedCost: 150,
      processingTime: '1-2 weeks',
      status: 'not-started',
      priority: 'high',
      website: 'https://www.boston.gov/departments/fire-department',
      documents: [
        'Fire alarm permit application',
        'System design plans',
        'Equipment specifications',
        'Contractor license verification'
      ],
      icon: Shield,
      contactInfo: {
        phone: '617-343-3550',
        email: 'fire.alarm@boston.gov',
        hours: 'Mon-Fri 8am-4pm',
        address: '115 Southampton St, Boston, MA 02118',
        department: 'Fire Alarm Division'
      },
      templates: [
        { name: 'Fire Alarm Permit Application (2024)', type: 'PDF', url: '#' },
        { name: 'Fire Alarm Guidelines Sept 2024', type: 'PDF', url: '#' },
        { name: 'Approved Device List', type: 'PDF', url: '#' }
      ],
      steps: [
        'Submit application with system plans',
        'Obtain electrical permit if required',
        'Install system per approved plans',
        'Schedule acceptance test',
        'Pass system acceptance test',
        'Submit as-built drawings',
        'Receive final approval'
      ],
      requirements: [
        'UL listed fire alarm control panel',
        'Smoke detectors in all required locations',
        'Heat detectors in kitchen areas',
        'Manual pull stations at exits',
        'Audible and visual notification devices',
        'Central station monitoring connection',
        'Battery backup for 24-hour operation',
        'Annual testing and maintenance contract'
      ],
      notes: 'Must be installed by licensed fire alarm contractor. System requires connection to central monitoring station. Updated requirements per September 2024 guidelines.',
      dependencies: ['building-permit'],
      compliance: {
        renewal: 'Annual testing certificate required',
        maintenance: 'Quarterly testing, annual full inspection',
        penalties: 'System disconnection order for non-compliance'
      }
    },
    {
      id: 'signage-permit',
      title: 'Signage Permit',
      category: 'Local',
      agency: 'Boston Public Works',
      description: 'Required for exterior business signage',
      deadline: 'Before installing signs',
      daysFromStart: 140,
      estimatedCost: 75,
      processingTime: '2-3 weeks',
      status: 'not-started',
      priority: 'low',
      website: 'https://www.boston.gov/departments/public-works',
      documents: ['Sign permit application', 'Sign designs'],
      icon: Building2,
      contactInfo: {
        phone: '617-635-4900',
        hours: 'Mon-Fri 8:30am-5pm',
        address: '1 City Hall Square, Boston, MA 02201'
      },
      templates: [
        { name: 'Sign Permit Application', type: 'PDF', url: '#' },
        { name: 'Sign Requirements Guide', type: 'PDF', url: '#' }
      ],
      steps: [
        'Design sign within size limits',
        'Submit permit application',
        'Pay permit fee',
        'Schedule installation',
        'Pass final inspection'
      ],
      notes: 'Size and placement restrictions vary by district. Historic districts have additional requirements.',
      dependencies: ['building-permit'],
      compliance: {
        renewal: 'Not required unless sign is modified',
        penalties: 'Fines for unpermitted signs'
      }
    },

    // Additional Requirements
    {
      id: 'health-permit',
      title: 'Health Department Permit (Food Service)',
      category: 'Local',
      agency: 'Boston Public Health Commission',
      description: 'Required for all food service businesses before serving food to the public. Includes certified food manager requirement.',
      deadline: 'Before opening',
      daysFromStart: 100,
      estimatedCost: 100,
      processingTime: '3-4 weeks',
      status: 'not-started',
      priority: 'high',
      website: 'https://www.boston.gov/departments/inspectional-services/how-get-food-service-permit',
      documents: [
        'Completed food service permit application',
        'Payment for permit fees',
        'Four sets of site plans',
        'Equipment specifications from manufacturer',
        'Food Plan Review Worksheet',
        'Menu with consumer advisories (if applicable)',
        'Building permit signed by inspectors',
        'Certified Food Manager certificate (ServSafe)',
        'Allergen certification',
        'Proof of Commissary with licensed kitchen (for food trucks)',
        'Use of Premises Permit (if selling on private site)'
      ],
      icon: Utensils,
      contactInfo: {
        phone: '617-534-5965',
        hours: 'Mon-Fri 9am-5pm',
        address: '1010 Massachusetts Avenue, Boston, MA 02218',
        email: 'ehpermits@bphc.org'
      },
      templates: [
        { name: 'Food Service Permit Application', type: 'PDF', url: 'https://www.boston.gov/departments/inspectional-services/how-get-food-service-permit' },
        { name: 'Food Plan Review Worksheet', type: 'PDF', url: '#' },
        { name: 'ServSafe Study Guide', type: 'PDF', url: '#' },
        { name: 'Allergen Certification Guide', type: 'PDF', url: '#' }
      ],
      steps: [
        'Obtain Certified Food Manager certification (ServSafe)',
        'Complete food service permit application',
        'Prepare four sets of site plans',
        'Gather equipment specifications from manufacturer',
        'Complete Food Plan Review Worksheet',
        'Prepare menu with consumer advisories if applicable',
        'Obtain building permit signed by inspectors',
        'Submit application with all required documents',
        'Schedule pre-opening inspection',
        'Pass health inspection',
        'Display permit in restaurant'
      ],
      notes: 'Annual fee: $100 for food trucks. Manager must renew ServSafe every 5 years. Separate from food service license. Required for all food establishments including restaurants, food trucks, and push carts.',
      dependencies: ['food-service-license'],
      compliance: {
        renewal: 'Annual permit renewal required',
        penalties: 'Closure for critical violations, fines for operating without permit'
      }
    },
    {
      id: 'music-license',
      title: 'Music/Entertainment License',
      category: 'Local',
      agency: 'Boston Licensing Board',
      description: 'Required for live music or entertainment',
      deadline: 'Before offering entertainment',
      daysFromStart: 160,
      estimatedCost: 350,
      processingTime: '4-6 weeks',
      status: 'not-started',
      priority: 'low',
      website: 'https://www.boston.gov/departments/licensing-board',
      documents: ['Entertainment license application'],
      icon: Users,
      contactInfo: {
        phone: '617-635-4165',
        hours: 'Mon-Fri 9am-5pm',
        address: 'Boston City Hall, Room 809, Boston, MA 02201'
      },
      templates: [
        { name: 'Entertainment License Application', type: 'PDF', url: '#' },
        { name: 'Sound Level Requirements', type: 'PDF', url: '#' }
      ],
      steps: [
        'Determine type of entertainment',
        'Complete application',
        'Submit floor plans',
        'Schedule inspection',
        'Receive license approval'
      ],
      notes: 'Required for live music, DJs, karaoke, or dancing. Sound restrictions apply.',
      dependencies: ['liquor-license'],
      compliance: {
        renewal: 'Annual renewal required',
        penalties: 'Fines for operating without license'
      }
    },
    {
      id: 'outdoor-seating',
      title: 'Outdoor Dining Permit',
      category: 'Local',
      agency: 'Boston Public Works',
      description: 'Required for sidewalk or patio dining',
      deadline: 'Before setting up outdoor seating',
      daysFromStart: 170,
      estimatedCost: 2000,
      processingTime: '6-8 weeks',
      status: 'not-started',
      priority: 'medium',
      website: 'https://www.boston.gov/departments/public-works',
      documents: ['Outdoor dining application', 'Insurance certificate'],
      icon: Utensils,
      contactInfo: {
        phone: '617-635-4900',
        hours: 'Mon-Fri 8:30am-5pm',
        address: '1 City Hall Square, Boston, MA 02201'
      },
      templates: [
        { name: 'Outdoor Dining Application', type: 'PDF', url: '#' },
        { name: 'Insurance Requirements', type: 'PDF', url: '#' }
      ],
      steps: [
        'Check if location allows outdoor dining',
        'Design seating layout',
        'Obtain additional insurance',
        'Submit application with plans',
        'Pass safety inspection'
      ],
      notes: 'Seasonal permits (April-November). Additional insurance required. ADA compliance necessary.',
      dependencies: ['food-service-license'],
      compliance: {
        renewal: 'Annual permit renewal',
        penalties: 'Immediate closure for safety violations'
      }
    },
    {
      id: 'delivery-permit',
      title: 'Delivery Vehicle Permit',
      category: 'Local',
      agency: 'Boston Transportation Department',
      description: 'Required for delivery vehicles in certain zones',
      deadline: 'Before delivery operations',
      daysFromStart: 180,
      estimatedCost: 125,
      processingTime: '2-3 weeks',
      status: 'not-started',
      priority: 'low',
      website: 'https://www.boston.gov/departments/transportation',
      documents: ['Vehicle registration', 'Insurance certificate'],
      icon: Truck,
      contactInfo: {
        phone: '617-635-4680',
        hours: 'Mon-Fri 8:30am-5pm',
        address: '1 City Hall Square, Boston, MA 02201'
      },
      templates: [
        { name: 'Delivery Permit Application', type: 'PDF', url: '#' },
        { name: 'Parking Restrictions Map', type: 'PDF', url: '#' }
      ],
      steps: [
        'Register delivery vehicles',
        'Obtain commercial insurance',
        'Apply for delivery permits',
        'Install required vehicle signage',
        'Train drivers on city regulations'
      ],
      notes: 'Required for loading zones and commercial parking. Third-party delivery may not need this.',
      dependencies: ['food-service-license'],
      compliance: {
        renewal: 'Annual permit renewal',
        penalties: 'Parking tickets and towing'
      }
    },
    {
      id: 'site-cleanliness-license',
      title: 'Site Cleanliness License',
      category: 'Local',
      agency: 'Boston Inspectional Services',
      description: 'Required for all food establishments and businesses using bulk refuse containers',
      deadline: 'Before opening',
      daysFromStart: 30,
      estimatedCost: 50,
      processingTime: '2-3 weeks',
      status: 'not-started',
      priority: 'high',
      website: 'https://www.boston.gov/departments/inspectional-services/site-cleanliness',
      documents: [
        'Site Cleanliness Application',
        'Site plan with dumpster location',
        'Maintenance plan and schedule',
        'Solid waste disposal contract',
        'Pest control contract',
        'Public Works license (if dumpster on public way)'
      ],
      icon: Shield,
      contactInfo: {
        phone: '617-635-5300',
        hours: 'Mon-Fri 9am-5pm',
        address: 'Boston Inspectional Services, Boston, MA'
      },
      templates: [
        { name: 'Site Cleanliness Application', type: 'PDF', url: 'https://www.boston.gov/departments/inspectional-services/site-cleanliness' },
        { name: 'Site Plan Template', type: 'PDF', url: '#' },
        { name: 'Maintenance Schedule Template', type: 'PDF', url: '#' }
      ],
      steps: [
        'Complete Site Cleanliness Application',
        'Create site plan showing dumpster location',
        'Develop maintenance plan and schedule',
        'Obtain solid waste disposal contract',
        'Secure pest control contract',
        'Apply for Public Works license if needed',
        'Submit application with $50 fee'
      ],
      notes: 'Regulates dumpster overflow, wind-blown litter, and rodent activity. Required for all food establishments.',
      dependencies: ['food-service-license'],
      compliance: {
        renewal: 'Annual renewal required',
        penalties: 'Up to $1000 per day fine after third offense'
      }
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'not-started': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'overdue': return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'submitted': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-yellow-600" />;
      default: return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const filteredRequirements = useMemo(() => {
    let filtered = bostonRequirements;

    if (filter !== 'all') {
      filtered = filtered.filter(req => req.status === filter);
    }

    if (searchTerm) {
      filtered = filtered.filter(req => 
        req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.agency.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [filter, searchTerm]);

  const stats = useMemo(() => {
    const total = bostonRequirements.length;
    const notStarted = bostonRequirements.filter(req => req.status === 'not-started').length;
    const inProgress = bostonRequirements.filter(req => req.status === 'in-progress').length;
    const submitted = bostonRequirements.filter(req => req.status === 'submitted').length;
    const approved = bostonRequirements.filter(req => req.status === 'approved').length;
    const high = bostonRequirements.filter(req => req.priority === 'high').length;
    const completionRate = Math.round((approved / total) * 100);
    const totalCost = bostonRequirements.reduce((sum, req) => sum + req.estimatedCost, 0);

    return { total, notStarted, inProgress, submitted, approved, high, completionRate, totalCost };
  }, []);

  const upcomingDeadlines = useMemo(() => {
    return bostonRequirements
      .filter(req => req.status !== 'approved' && req.daysFromStart <= 90)
      .sort((a, b) => a.daysFromStart - b.daysFromStart)
      .slice(0, 5);
  }, []);

  const handleStatusUpdate = (documentId, newStatus) => {
    console.log(`Update document ${documentId} to status: ${newStatus}`);
    actions.showMessage('Status Updated', `Document status updated to ${newStatus}`, 'success');
  };

  const handleFileUpload = (documentId, file) => {
    setUploadedFiles(prev => ({
      ...prev,
      [documentId]: [...(prev[documentId] || []), file]
    }));
    actions.showMessage('File Uploaded', `File "${file.name}" uploaded successfully`, 'success');
  };

  const downloadTemplate = (template) => {
    actions.showMessage('Template Downloaded', `${template.name} template downloaded`, 'info');
  };

  const renderDetailedView = () => (
    <div className="space-y-4">
      {filteredRequirements.map((requirement) => {
        const IconComponent = requirement.icon;
        const files = uploadedFiles[requirement.id] || [];
        
        return (
          <div
            key={requirement.id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {requirement.title}
                    </h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(requirement.status)}`}>
                      {getStatusIcon(requirement.status)}
                      <span className="ml-1 capitalize">{requirement.status.replace('-', ' ')}</span>
                    </span>
                    <span className={`text-sm font-medium ${getPriorityColor(requirement.priority)}`}>
                      {requirement.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{requirement.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <span className="font-medium text-gray-700">Agency:</span>
                      <p className="text-gray-600">{requirement.agency}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Cost:</span>
                      <p className="text-gray-600">${requirement.estimatedCost.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Processing Time:</span>
                      <p className="text-gray-600">{requirement.processingTime}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Deadline:</span>
                      <p className="text-gray-600">{requirement.deadline}</p>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-700 mb-2">Contact Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{requirement.contactInfo.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>{requirement.contactInfo.hours}</span>
                      </div>
                      {requirement.contactInfo.email && (
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span>{requirement.contactInfo.email}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-start space-x-2 mt-2">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                      <span className="text-sm">{requirement.contactInfo.address}</span>
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">Process Steps</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                      {requirement.steps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  {/* Dependencies */}
                  {requirement.dependencies.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">Dependencies</h4>
                      <div className="flex flex-wrap gap-2">
                        {requirement.dependencies.map(depId => {
                          const dep = bostonRequirements.find(req => req.id === depId);
                          return dep ? (
                            <span key={depId} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {dep.title}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}

                  {/* Templates */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">Templates & Forms</h4>
                    <div className="flex flex-wrap gap-2">
                      {requirement.templates.map((template, idx) => (
                        <button
                          key={idx}
                          onClick={() => downloadTemplate(template)}
                          className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 text-xs rounded hover:bg-green-200 transition-colors"
                        >
                          <Download className="w-3 h-3" />
                          <span>{template.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Required Documents */}
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">Required Documents</h4>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {requirement.documents.map((doc, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700"
                        >
                          {doc}
                        </span>
                      ))}
                    </div>
                    
                    {/* Document Uploader */}
                    <div className="mt-4">
                      <DocumentUploader
                        documentId={requirement.id}
                        requiredDocuments={requirement.documents}
                        onUpload={handleFileUpload}
                        existingFiles={files}
                        documentType={requirement.id === 'health-permit' ? 'health-permit' : 'general'}
                      />
                    </div>
                  </div>

                  {/* Uploaded Files */}
                  {files.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">Uploaded Files</h4>
                      <div className="space-y-2">
                        {files.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-green-50 rounded">
                            <span className="text-sm text-green-800">{file.name}</span>
                            <button className="text-green-600 hover:text-green-800">
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {requirement.notes && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                      <p className="text-sm text-blue-800">{requirement.notes}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col space-y-2 ml-4">
                <select
                  value={requirement.status}
                  onChange={(e) => handleStatusUpdate(requirement.id, e.target.value)}
                  className="text-sm border border-gray-300 rounded px-3 py-1 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="not-started">Not Started</option>
                  <option value="in-progress">In Progress</option>
                  <option value="submitted">Submitted</option>
                  <option value="approved">Approved</option>
                </select>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => window.open(requirement.website, '_blank')}
                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    title="Visit official website"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <label className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer" title="Upload documents">
                    <Upload className="w-4 h-4" />
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) handleFileUpload(requirement.id, file);
                      }}
                    />
                  </label>
                  <button
                    onClick={() => setSelectedDocument(requirement)}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderChecklistView = () => (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Restaurant Launch Checklist</h3>
        <div className="space-y-3">
          {bostonRequirements
            .sort((a, b) => a.daysFromStart - b.daysFromStart)
            .map((requirement) => (
              <div key={requirement.id} className="flex items-center space-x-3 p-3 border border-gray-100 rounded">
                <input
                  type="checkbox"
                  checked={requirement.status === 'approved'}
                  onChange={() => handleStatusUpdate(requirement.id, requirement.status === 'approved' ? 'not-started' : 'approved')}
                  className="h-5 w-5 text-purple-600 rounded"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{requirement.title}</span>
                    <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(requirement.priority)} bg-opacity-10`}>
                      {requirement.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{requirement.agency} • ${requirement.estimatedCost.toLocaleString()}</p>
                </div>
                <span className="text-sm text-gray-500">{requirement.processingTime}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Health Permit Special Checklist */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Utensils className="w-6 h-6 text-green-600" />
          <h3 className="text-lg font-semibold text-green-800">Health Permit Document Checklist</h3>
        </div>
        <p className="text-sm text-green-700 mb-4">
          Complete checklist for Boston Health Department Permit application. All documents must be submitted together.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium text-green-800">Application Documents</h4>
            {[
              'Completed food service permit application',
              'Payment for permit fees ($100)',
              'Food Plan Review Worksheet'
            ].map((doc, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <input type="checkbox" className="h-4 w-4 text-green-600 rounded" />
                <span className="text-sm text-green-700">{doc}</span>
              </div>
            ))}
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-green-800">Plans & Specifications</h4>
            {[
              'Four sets of site plans',
              'Equipment specifications from manufacturer',
              'Building permit signed by inspectors'
            ].map((doc, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <input type="checkbox" className="h-4 w-4 text-green-600 rounded" />
                <span className="text-sm text-green-700">{doc}</span>
              </div>
            ))}
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-green-800">Certifications</h4>
            {[
              'Certified Food Manager certificate (ServSafe)',
              'Allergen certification',
              'Proof of Commissary (food trucks only)'
            ].map((doc, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <input type="checkbox" className="h-4 w-4 text-green-600 rounded" />
                <span className="text-sm text-green-700">{doc}</span>
              </div>
            ))}
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-green-800">Additional Documents</h4>
            {[
              'Menu with consumer advisories (if applicable)',
              'Use of Premises Permit (private sites)',
              'Any other required permits'
            ].map((doc, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <input type="checkbox" className="h-4 w-4 text-green-600 rounded" />
                <span className="text-sm text-green-700">{doc}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-100 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Important:</p>
              <p>Submit all documents together to Boston Public Health Commission at 1010 Massachusetts Avenue, Boston, MA 02218. Contact: 617-534-5965 or ehpermits@bphc.org</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <SectionCard
      title="Documents & Compliance"
      description="Track all required permits, licenses, and forms for your Boston restaurant"
      icon={FileText}
      color="purple"
    >
      <div className="space-y-6">
        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Requirements</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.high}</div>
            <div className="text-sm text-red-600">High Priority</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completionRate}%</div>
            <div className="text-sm text-green-600">Complete</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.submitted}</div>
            <div className="text-sm text-blue-600">Submitted</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">${(stats.totalCost / 1000).toFixed(0)}K</div>
            <div className="text-sm text-purple-600">Total Cost</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{upcomingDeadlines.length}</div>
            <div className="text-sm text-yellow-600">Upcoming</div>
          </div>
        </div>

        {/* Upcoming Deadlines Alert */}
        {upcomingDeadlines.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Bell className="w-5 h-5 text-yellow-600" />
              <h3 className="font-semibold text-yellow-900">Upcoming Deadlines</h3>
            </div>
            <div className="space-y-2">
              {upcomingDeadlines.map(req => (
                <div key={req.id} className="flex items-center justify-between text-sm">
                  <span className="text-yellow-800">{req.title}</span>
                  <span className="text-yellow-600">Day {req.daysFromStart}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div className="relative">
              <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="submitted">Submitted</option>
                <option value="approved">Approved</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('detailed')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'detailed' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                Detailed
              </button>
              <button
                onClick={() => setViewMode('checklist')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'checklist' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                Checklist
              </button>
              <button
                onClick={() => setViewMode('health-checklist')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'health-checklist' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                Health Code
              </button>
              <button
                onClick={() => setViewMode('inspection-tracker')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'inspection-tracker' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                Inspections
              </button>
            </div>
            
            <button
              onClick={() => setShowAddDocument(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom</span>
            </button>
          </div>
        </div>

        {/* Requirements List */}
        {viewMode === 'detailed' ? renderDetailedView() : 
         viewMode === 'checklist' ? renderChecklistView() : 
         viewMode === 'health-checklist' ? <MonthlyHealthChecklist /> : 
         viewMode === 'inspection-tracker' ? <HealthInspectionTracker /> : 
         renderDetailedView()}

        {filteredRequirements.length === 0 && viewMode === 'detailed' && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600">No documents found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms</p>
          </div>
        )}

        {/* Cost Summary */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Calculator className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-indigo-900">Cost Summary</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-indigo-600 mb-1">Federal Costs</p>
              <p className="text-xl font-bold text-indigo-900">
                ${bostonRequirements.filter(r => r.category === 'Federal').reduce((sum, r) => sum + r.estimatedCost, 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-indigo-600 mb-1">State Costs</p>
              <p className="text-xl font-bold text-indigo-900">
                ${bostonRequirements.filter(r => r.category === 'State').reduce((sum, r) => sum + r.estimatedCost, 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-indigo-600 mb-1">Local Costs</p>
              <p className="text-xl font-bold text-indigo-900">
                ${bostonRequirements.filter(r => r.category === 'Local').reduce((sum, r) => sum + r.estimatedCost, 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-indigo-600 mb-1">Total Cost</p>
              <p className="text-2xl font-bold text-indigo-900">${stats.totalCost.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Boston-Specific Notes */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
            <Building2 className="w-5 h-5 mr-2" />
            Boston Restaurant Requirements - Important Notes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Critical Timeline Items</h4>
              <ul className="space-y-1 text-blue-700 text-sm">
                <li>• <strong>Liquor License:</strong> Start 6+ months early - limited availability</li>
                <li>• <strong>Building Permits:</strong> Required before any construction begins</li>
                <li>• <strong>Food Service License:</strong> Plan review required early in process</li>
                <li>• <strong>Community Input:</strong> Some locations require neighborhood meetings</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Boston-Specific Requirements</h4>
              <ul className="space-y-1 text-blue-700 text-sm">
                <li>• <strong>Manager Certification:</strong> ServSafe required for food operations</li>
                <li>• <strong>Outdoor Dining:</strong> Seasonal permits with insurance requirements</li>
                <li>• <strong>Historic Districts:</strong> Additional design review for signage</li>
                <li>• <strong>Noise Ordinances:</strong> Restrictions on music and operating hours</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Integration Ready Notice */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Link className="w-5 h-5 text-green-600" />
            <p className="text-green-800">
              <strong>Integration Ready:</strong> This system is prepared to connect with Boston government APIs for direct form submission and status tracking.
            </p>
          </div>
        </div>
      </div>
    </SectionCard>
  );
};

export default DocumentsCompliance; 