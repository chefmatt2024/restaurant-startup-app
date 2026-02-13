import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import FormField from '../ui/FormField';
import SectionCard from '../ui/SectionCard';
import { Clock, MapPin, Truck, Calendar } from 'lucide-react';

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
  const restaurantDetails = financialData?.restaurantDetails || {};
  const hoursOfOperation = restaurantOps.hoursOfOperation || {};
  const [activeTab, setActiveTab] = useState('facility');

  const handleFieldChange = (field, value) => {
    actions.updateBusinessPlan('operationsPlan', { [field]: value });
  };

  // Linked to Financials: single source of truth is financialData; sync to business plan for docs
  const linkedSeats = restaurantOps.seats ?? data.seatingCapacity ?? 50;
  const linkedSquareFootage = restaurantDetails.squareFootage ?? data.totalSquareFootage ?? 2000;
  const location = restaurantDetails.location || 'Boston';

  const handleLocationChange = (value) => {
    actions.updateFinancialData('restaurantDetails', { ...restaurantDetails, location: value });
  };

  const handleLinkedSeatsChange = (value) => {
    const num = parseInt(value, 10) || 0;
    actions.updateFinancialData('restaurantOperations', { seats: num });
    actions.updateBusinessPlan('operationsPlan', { seatingCapacity: num });
  };

  const handleLinkedSquareFootageChange = (value) => {
    const num = parseInt(value, 10) || 0;
    actions.updateFinancialData('restaurantDetails', { squareFootage: num });
    actions.updateBusinessPlan('operationsPlan', { totalSquareFootage: num });
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

  const tabs = [
    { id: 'facility', label: 'Facility & Layout', icon: MapPin },
    { id: 'operations', label: 'Daily Operations', icon: Clock },
    { id: 'supply', label: 'Supply Chain', icon: Truck },
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
            <h4 className="font-semibold text-gray-900 mb-3">{location} Zoning Requirements</h4>
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

      <div className="mb-2 rounded-lg bg-indigo-50 border border-indigo-200 px-3 py-2 text-sm text-indigo-800">
        Square footage and seating capacity are linked with <strong>Financial Projections</strong>. Changes here update revenue, rent, and capacity calculations there.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Total Square Footage"
          type="number"
          value={linkedSquareFootage}
          onChange={(value) => handleLinkedSquareFootageChange(value)}
          placeholder="e.g., 2500"
        />
        
        <FormField
          label="Seating Capacity"
          type="number"
          value={linkedSeats}
          onChange={(value) => handleLinkedSeatsChange(value)}
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
        {activeTab === 'supply' && renderSupplyChain()}
        {activeTab === 'compliance' && renderCompliance()}
        {activeTab === 'schedule' && renderSchedule()}
      </SectionCard>
    </div>
  );
};

export default OperationsPlan; 