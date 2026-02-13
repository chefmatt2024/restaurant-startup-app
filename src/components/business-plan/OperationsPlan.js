import React, { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import FormField from '../ui/FormField';
import SectionCard from '../ui/SectionCard';
import { Clock, Users, MapPin, CheckCircle, AlertTriangle, Settings, Truck, Shield, Calendar, Calculator } from 'lucide-react';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DEFAULT_DAY_HOURS = { closed: false, open: '11:00', close: '22:00' };

// Build human-readable hours summary from financialData.restaurantOperations.hoursOfOperation
const formatHoursSummary = (hoursOfOperation) => {
  if (!hoursOfOperation) return '';
  const parts = DAYS.map((day) => {
    const h = hoursOfOperation[day] || DEFAULT_DAY_HOURS;
    const label = day.charAt(0).toUpperCase() + day.slice(1);
    if (h.closed) return `${label}: Closed`;
    const open = (h.open || '11:00').replace(/^(\d{1,2}):(\d{2})$/, (_, hr, min) => {
      const hh = parseInt(hr, 10);
      if (hh === 0) return '12:' + min + ' AM';
      if (hh < 12) return hr + ':' + min + ' AM';
      if (hh === 12) return '12:' + min + ' PM';
      return (hh - 12) + ':' + min + ' PM';
    });
    const close = (h.close || '22:00').replace(/^(\d{1,2}):(\d{2})$/, (_, hr, min) => {
      const hh = parseInt(hr, 10);
      if (hh === 0) return '12:' + min + ' AM';
      if (hh < 12) return hr + ':' + min + ' AM';
      if (hh === 12) return '12:' + min + ' PM';
      return (hh - 12) + ':' + min + ' PM';
    });
    return `${label}: ${open}-${close}`;
  });
  return parts.join(', ');
};

const OperationsPlan = () => {
  const { state, actions } = useApp();
  const data = state.businessPlan.operationsPlan;
  const financialData = state.financialData;
  const restaurantOps = financialData?.restaurantOperations || {};
  const hoursOfOperation = restaurantOps.hoursOfOperation || {};
  const [activeTab, setActiveTab] = useState('facility');
  const [staffingCalculator, setStaffingCalculator] = useState({
    seatingCapacity: 50,
    turnsPerDay: 3,
    serviceStyle: 'full-service'
  });

  const handleFieldChange = (field, value) => {
    actions.updateBusinessPlan('operationsPlan', { [field]: value });
  };

  // Update hours in financials (single source of truth) and sync summary to business plan for docs
  const handleHoursChange = (day, updates) => {
    const current = restaurantOps.hoursOfOperation || {};
    const dayHours = { ...DEFAULT_DAY_HOURS, ...current[day], ...updates };
    const newHours = { ...current, [day]: dayHours };
    actions.updateFinancialData('restaurantOperations', {
      ...restaurantOps,
      hoursOfOperation: newHours
    });
    const summary = formatHoursSummary({ ...current, [day]: dayHours });
    if (summary) actions.updateBusinessPlan('operationsPlan', { hoursOfOperation: summary });
  };

  // Boston restaurant operational requirements
  const bostonRequirements = {
    permits: [
      { name: 'Food Service License', agency: 'Boston Public Health Commission', timeline: '4-6 weeks', cost: 240 },
      { name: 'Business License', agency: 'City of Boston', timeline: '2-3 weeks', cost: 75 },
      { name: 'Building Permit', agency: 'Boston Inspectional Services', timeline: '6-8 weeks', cost: 'Varies' },
      { name: 'Sign Permit', agency: 'Boston Planning Department', timeline: '2-4 weeks', cost: 150 },
      { name: 'Fire Dept Permit', agency: 'Boston Fire Department', timeline: '1-2 weeks', cost: 100 },
      { name: 'Site Cleanliness License', agency: 'Boston Inspectional Services', timeline: '2-3 weeks', cost: 50, website: 'https://www.boston.gov/departments/inspectional-services/site-cleanliness' }
    ],
    inspections: [
      { type: 'Health Inspection', frequency: 'Annual', agency: 'BPHC', criticality: 'High' },
      { type: 'Fire Safety', frequency: 'Annual', agency: 'BFD', criticality: 'High' },
      { type: 'Building Code', frequency: 'As needed', agency: 'ISD', criticality: 'Medium' },
      { type: 'Liquor Compliance', frequency: 'Quarterly', agency: 'BLB', criticality: 'High' },
      { type: 'Site Cleanliness', frequency: 'Annual', agency: 'ISD', criticality: 'High' }
    ],
    regulations: {
      minimumWage: 15.00, // MA minimum wage for tipped workers
      overtime: 1.5,
      breakRequirements: '30 min for 6+ hour shifts',
      healthCertification: 'Required for all food handlers',
      maxOccupancy: 'Based on sq ft and layout'
    }
  };

  // Staffing calculator
  const staffingNeeds = useMemo(() => {
    const { seatingCapacity, turnsPerDay, serviceStyle } = staffingCalculator;
    const totalCovers = seatingCapacity * turnsPerDay;
    
    let staffRatios;
    switch (serviceStyle) {
      case 'fine-dining':
        staffRatios = { server: 12, kitchen: 8, support: 20, manager: 40 };
        break;
      case 'casual':
        staffRatios = { server: 20, kitchen: 12, support: 30, manager: 50 };
        break;
      case 'fast-casual':
        staffRatios = { server: 30, kitchen: 15, support: 40, manager: 60 };
        break;
      default: // full-service
        staffRatios = { server: 16, kitchen: 10, support: 25, manager: 45 };
    }

    return {
      servers: Math.ceil(seatingCapacity / staffRatios.server),
      kitchen: Math.ceil(totalCovers / staffRatios.kitchen),
      support: Math.ceil(seatingCapacity / staffRatios.support),
      managers: Math.ceil(seatingCapacity / staffRatios.manager),
      totalDaily: Math.ceil(seatingCapacity / staffRatios.server) + Math.ceil(totalCovers / staffRatios.kitchen) + 
                 Math.ceil(seatingCapacity / staffRatios.support) + Math.ceil(seatingCapacity / staffRatios.manager)
    };
  }, [staffingCalculator]);

  const tabs = [
    { id: 'facility', label: 'Facility & Layout', icon: MapPin },
    { id: 'operations', label: 'Daily Operations', icon: Clock },
    { id: 'staffing', label: 'Staffing Plan', icon: Users },
    { id: 'supply', label: 'Supply Chain', icon: Truck },
    { id: 'compliance', label: 'Compliance & Safety', icon: Shield },
    { id: 'schedule', label: 'Operating Schedule', icon: Calendar }
  ];

  const renderFacility = () => (
    <div className="space-y-6">
      {/* Facility Overview */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <MapPin className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-blue-900">Restaurant Layout Planning</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Space Allocation Guidelines</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Dining Area:</span>
                <span className="font-medium">60-70% of total space</span>
              </div>
              <div className="flex justify-between">
                <span>Kitchen:</span>
                <span className="font-medium">25-30% of total space</span>
              </div>
              <div className="flex justify-between">
                <span>Storage/Other:</span>
                <span className="font-medium">5-10% of total space</span>
              </div>
              <div className="flex justify-between">
                <span>Seating per sq ft:</span>
                <span className="font-medium">12-15 sq ft per seat</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Boston Zoning Requirements</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Commercial kitchen ventilation must meet MA Building Code</p>
              <p>• ADA compliance required for all areas</p>
              <p>• Minimum 2 exits for occupancy >50 people</p>
              <p>• Grease trap installation required</p>
              <p>• Parking requirements vary by neighborhood</p>
            </div>
          </div>
        </div>
      </div>

      <FormField
        label="Location & Address"
        type="text"
        value={data.location}
        onChange={(value) => handleFieldChange('location', value)}
        placeholder="e.g., 123 Main Street, Back Bay, Boston, MA 02116"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Total Square Footage"
          type="number"
          value={data.totalSquareFootage}
          onChange={(value) => handleFieldChange('totalSquareFootage', value)}
          placeholder="e.g., 2500"
        />
        
        <FormField
          label="Seating Capacity"
          type="number"
          value={data.seatingCapacity}
          onChange={(value) => handleFieldChange('seatingCapacity', value)}
          placeholder="e.g., 80"
        />
      </div>

      <FormField
        label="Layout Description"
        type="textarea"
        value={data.layoutDescription}
        onChange={(value) => handleFieldChange('layoutDescription', value)}
        placeholder="Describe your restaurant layout: dining room configuration, kitchen design, bar area, private dining, restrooms, storage areas, etc."
        rows={4}
      />

      <FormField
        label="Equipment & Fixtures"
        type="textarea"
        value={data.equipmentFixtures}
        onChange={(value) => handleFieldChange('equipmentFixtures', value)}
        placeholder="List major equipment: commercial kitchen appliances, POS systems, furniture, lighting, sound system, etc."
        rows={4}
      />

      <FormField
        label="Renovation Requirements"
        type="textarea"
        value={data.renovationRequirements}
        onChange={(value) => handleFieldChange('renovationRequirements', value)}
        placeholder="Describe any renovations needed: electrical work, plumbing, HVAC, flooring, permits required, estimated costs"
        rows={3}
      />
    </div>
  );

  const renderOperations = () => (
    <div className="space-y-6">
      {/* Daily Operations Workflow */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Clock className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-green-900">Daily Operations Workflow</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <h4 className="font-semibold text-blue-900 mb-2">Pre-Service (2-3 hours)</h4>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• Food prep & mise en place</li>
              <li>• Equipment checks</li>
              <li>• Staff briefing</li>
              <li>• Inventory verification</li>
              <li>• Dining room setup</li>
              <li>• Daily specials review</li>
            </ul>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <h4 className="font-semibold text-green-900 mb-2">Service Period</h4>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• Order taking & delivery</li>
              <li>• Kitchen coordination</li>
              <li>• Table management</li>
              <li>• Quality control</li>
              <li>• Customer service</li>
              <li>• Cash handling</li>
            </ul>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <h4 className="font-semibold text-purple-900 mb-2">Post-Service (1-2 hours)</h4>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• Closing procedures</li>
              <li>• Cleaning & sanitization</li>
              <li>• Inventory count</li>
              <li>• Cash reconciliation</li>
              <li>• Equipment shutdown</li>
              <li>• Next day prep</li>
            </ul>
          </div>
        </div>
      </div>

      <FormField
        label="Service Flow Description"
        type="textarea"
        value={data.serviceFlow}
        onChange={(value) => handleFieldChange('serviceFlow', value)}
        placeholder="Describe your service flow: how customers are seated, order taking process, kitchen communication, food delivery, payment processing"
        rows={4}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Average Turn Time (minutes)"
          type="number"
          value={data.averageTurnTime}
          onChange={(value) => handleFieldChange('averageTurnTime', value)}
          placeholder="e.g., 90"
        />
        
        <FormField
          label="Expected Daily Covers"
          type="number"
          value={data.expectedDailyCovers}
          onChange={(value) => handleFieldChange('expectedDailyCovers', value)}
          placeholder="e.g., 150"
        />
      </div>

      <FormField
        label="Technology Systems"
        type="textarea"
        value={data.technologySystems}
        onChange={(value) => handleFieldChange('technologySystems', value)}
        placeholder="POS system, kitchen display systems, reservation management, inventory tracking, employee scheduling software"
        rows={3}
      />

      <FormField
        label="Quality Control Procedures"
        type="textarea"
        value={data.qualityControl}
        onChange={(value) => handleFieldChange('qualityControl', value)}
        placeholder="Food quality standards, temperature monitoring, presentation standards, customer feedback system, staff training protocols"
        rows={4}
      />
    </div>
  );

  const renderStaffing = () => (
    <div className="space-y-6">
      {/* Staffing Calculator */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Calculator className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-purple-900">Staffing Calculator</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <FormField
            label="Seating Capacity"
            type="number"
            value={staffingCalculator.seatingCapacity}
            onChange={(value) => setStaffingCalculator(prev => ({...prev, seatingCapacity: parseInt(value) || 0}))}
          />
          
          <FormField
            label="Turns Per Day"
            type="number"
            value={staffingCalculator.turnsPerDay}
            onChange={(value) => setStaffingCalculator(prev => ({...prev, turnsPerDay: parseInt(value) || 0}))}
          />
          
          <FormField
            label="Service Style"
            type="select"
            value={staffingCalculator.serviceStyle}
            onChange={(value) => setStaffingCalculator(prev => ({...prev, serviceStyle: value}))}
            options={[
              { value: 'fine-dining', label: 'Fine Dining' },
              { value: 'full-service', label: 'Full Service' },
              { value: 'casual', label: 'Casual Dining' },
              { value: 'fast-casual', label: 'Fast Casual' }
            ]}
          />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-sm font-medium text-gray-600">Servers</p>
            <p className="text-2xl font-bold text-blue-900">{staffingNeeds.servers}</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-sm font-medium text-gray-600">Kitchen Staff</p>
            <p className="text-2xl font-bold text-green-900">{staffingNeeds.kitchen}</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-sm font-medium text-gray-600">Support Staff</p>
            <p className="text-2xl font-bold text-purple-900">{staffingNeeds.support}</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-sm font-medium text-gray-600">Managers</p>
            <p className="text-2xl font-bold text-orange-900">{staffingNeeds.managers}</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <p className="text-sm font-medium text-gray-600">Total Daily</p>
            <p className="text-2xl font-bold text-gray-900">{staffingNeeds.totalDaily}</p>
          </div>
        </div>
      </div>

      {/* Massachusetts Labor Requirements */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <h3 className="text-lg font-semibold text-yellow-900">Massachusetts Labor Requirements</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Wage Requirements</h4>
            <ul className="text-sm space-y-1">
              <li>• Minimum wage: ${bostonRequirements.regulations.minimumWage}/hour</li>
              <li>• Overtime: {bostonRequirements.regulations.overtime}x after 40 hours</li>
              <li>• Break requirements: {bostonRequirements.regulations.breakRequirements}</li>
              <li>• Health certification: {bostonRequirements.regulations.healthCertification}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Required Training</h4>
            <ul className="text-sm space-y-1">
              <li>• Food handler certification (ServSafe)</li>
              <li>• Alcohol service training (TIPS/RBS)</li>
              <li>• Sexual harassment prevention</li>
              <li>• Emergency procedures</li>
            </ul>
          </div>
        </div>
      </div>

      <FormField
        label="Organizational Structure"
        type="textarea"
        value={data.organizationalStructure}
        onChange={(value) => handleFieldChange('organizationalStructure', value)}
        placeholder="Describe your management hierarchy: General Manager, Assistant Manager, Head Chef, Sous Chef, Server positions, etc."
        rows={3}
      />

      <FormField
        label="Hiring & Training Plan"
        type="textarea"
        value={data.hiringTrainingPlan}
        onChange={(value) => handleFieldChange('hiringTrainingPlan', value)}
        placeholder="Recruitment strategy, interview process, onboarding procedures, training programs, certification requirements"
        rows={4}
      />

      <FormField
        label="Employee Scheduling"
        type="textarea"
        value={data.employeeScheduling}
        onChange={(value) => handleFieldChange('employeeScheduling', value)}
        placeholder="Scheduling system, shift patterns, coverage requirements, time-off policies, peak period staffing"
        rows={3}
      />

      <FormField
        label="Performance Management"
        type="textarea"
        value={data.performanceManagement}
        onChange={(value) => handleFieldChange('performanceManagement', value)}
        placeholder="Performance standards, review processes, incentive programs, disciplinary procedures, career advancement paths"
        rows={3}
      />
    </div>
  );

  const renderSupplyChain = () => (
    <div className="space-y-6">
      <FormField
        label="Primary Food Suppliers"
        type="textarea"
        value={data.primarySuppliers}
        onChange={(value) => handleFieldChange('primarySuppliers', value)}
        placeholder="List your main food distributors, local farms, specialty suppliers. Include contact information and delivery schedules."
        rows={4}
      />

      <FormField
        label="Inventory Management System"
        type="textarea"
        value={data.inventoryManagement}
        onChange={(value) => handleFieldChange('inventoryManagement', value)}
        placeholder="Describe your inventory tracking system: ordering procedures, stock rotation (FIFO), waste tracking, automated reordering"
        rows={3}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Delivery Schedule"
          type="textarea"
          value={data.deliverySchedule}
          onChange={(value) => handleFieldChange('deliverySchedule', value)}
          placeholder="When do deliveries arrive? How often? Storage procedures?"
          rows={3}
        />
        
        <FormField
          label="Food Safety Protocols"
          type="textarea"
          value={data.foodSafetyProtocols}
          onChange={(value) => handleFieldChange('foodSafetyProtocols', value)}
          placeholder="Temperature monitoring, storage requirements, HACCP procedures"
          rows={3}
        />
      </div>

      <FormField
        label="Menu Item Procurement"
        type="textarea"
        value={data.menuProcurement}
        onChange={(value) => handleFieldChange('menuProcurement', value)}
        placeholder="How do you source ingredients for each menu category? Local vs. national suppliers, seasonal adjustments, cost management"
        rows={4}
      />
    </div>
  );

  const renderCompliance = () => (
    <div className="space-y-6">
      {/* Required Permits */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="h-5 w-5 text-red-600" />
          <h3 className="text-lg font-semibold text-red-900">Boston Restaurant Permits & Licenses</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 font-semibold text-gray-900">Permit</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-900">Agency</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-900">Timeline</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-900">Cost</th>
              </tr>
            </thead>
            <tbody>
              {bostonRequirements.permits.map((permit, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-2 px-3 font-medium text-gray-900">{permit.name}</td>
                  <td className="py-2 px-3 text-gray-700">{permit.agency}</td>
                  <td className="py-2 px-3 text-gray-700">{permit.timeline}</td>
                  <td className="py-2 px-3 text-gray-700">${permit.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspection Schedule */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Inspection Schedule</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bostonRequirements.inspections.map((inspection, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{inspection.type}</h4>
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  inspection.criticality === 'High' ? 'bg-red-100 text-red-800' :
                  inspection.criticality === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {inspection.criticality}
                </span>
              </div>
              <p className="text-sm text-gray-600">Frequency: {inspection.frequency}</p>
              <p className="text-sm text-gray-600">Agency: {inspection.agency}</p>
            </div>
          ))}
        </div>
      </div>

      <FormField
        label="Health & Safety Procedures"
        type="textarea"
        value={data.healthSafetyProcedures}
        onChange={(value) => handleFieldChange('healthSafetyProcedures', value)}
        placeholder="Food safety protocols, cleaning schedules, employee health policies, accident reporting procedures"
        rows={4}
      />

      <FormField
        label="Emergency Procedures"
        type="textarea"
        value={data.emergencyProcedures}
        onChange={(value) => handleFieldChange('emergencyProcedures', value)}
        placeholder="Fire evacuation plan, medical emergency response, power outage procedures, security protocols"
        rows={3}
      />

      <FormField
        label="Insurance Coverage"
        type="textarea"
        value={data.insuranceCoverage}
        onChange={(value) => handleFieldChange('insuranceCoverage', value)}
        placeholder="General liability, property insurance, workers' compensation, liquor liability, cyber liability"
        rows={3}
      />
    </div>
  );

  const formatTimeForInput = (time) => {
    if (!time) return '11:00';
    if (typeof time === 'string' && /^\d{1,2}:\d{2}$/.test(time)) return time.length === 4 ? '0' + time : time;
    return time || '11:00';
  };

  const renderSchedule = () => (
    <div className="space-y-6">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-600 mb-3">
          These hours are shared with <strong>Financial Projections</strong>. Changes here update revenue and staffing calculations there.
        </p>
        <label className="block text-sm font-medium text-gray-700 mb-2">Hours of Operation (by day)</label>
        <div className="grid grid-cols-1 gap-2">
          {DAYS.map((day) => {
            const hours = hoursOfOperation[day] || DEFAULT_DAY_HOURS;
            const closed = hours.closed === true;
            const openVal = formatTimeForInput(hours.open);
            const closeVal = formatTimeForInput(hours.close);
            return (
              <div key={day} className="flex flex-wrap items-center gap-2 p-2 hover:bg-white/60 rounded">
                <span className="w-24 text-sm font-medium capitalize">{day}</span>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!closed}
                    onChange={(e) => handleHoursChange(day, { closed: !e.target.checked, open: hours.open, close: hours.close })}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 w-4 h-4"
                  />
                  <span className="text-xs text-gray-600">Open</span>
                </label>
                {!closed && (
                  <>
                    <input
                      type="time"
                      value={openVal}
                      onChange={(e) => handleHoursChange(day, { open: e.target.value, close: hours.close, closed: false })}
                      className="text-sm border border-gray-300 rounded px-2 py-1 w-24"
                    />
                    <span className="text-gray-500 text-sm">to</span>
                    <input
                      type="time"
                      value={closeVal}
                      onChange={(e) => handleHoursChange(day, { close: e.target.value, open: hours.open, closed: false })}
                      className="text-sm border border-gray-300 rounded px-2 py-1 w-24"
                    />
                  </>
                )}
                {closed && <span className="text-sm text-gray-500 italic">Closed</span>}
              </div>
            );
          })}
        </div>
      </div>

      <FormField
        label="Seasonal Variations"
        type="textarea"
        value={data.seasonalVariations}
        onChange={(value) => handleFieldChange('seasonalVariations', value)}
        placeholder="Summer hours, holiday schedules, special events, Boston Marathon, tourist season adjustments"
        rows={3}
      />

      <FormField
        label="Special Events & Catering"
        type="textarea"
        value={data.specialEvents}
        onChange={(value) => handleFieldChange('specialEvents', value)}
        placeholder="Private parties, holiday events, catering services, special menus, extended hours"
        rows={3}
      />

      <FormField
        label="Maintenance Schedule"
        type="textarea"
        value={data.maintenanceSchedule}
        onChange={(value) => handleFieldChange('maintenanceSchedule', value)}
        placeholder="Equipment maintenance, deep cleaning, HVAC service, equipment replacement schedule"
        rows={3}
      />
    </div>
  );

  return (
    <div className="animate-fade-in">
      <SectionCard 
        title="Restaurant Operations Plan" 
        description="Comprehensive operational planning for your Boston restaurant with local compliance requirements."
        color="purple"
      >
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'facility' && renderFacility()}
        {activeTab === 'operations' && renderOperations()}
        {activeTab === 'staffing' && renderStaffing()}
        {activeTab === 'supply' && renderSupplyChain()}
        {activeTab === 'compliance' && renderCompliance()}
        {activeTab === 'schedule' && renderSchedule()}
      </SectionCard>
    </div>
  );
};

export default OperationsPlan; 