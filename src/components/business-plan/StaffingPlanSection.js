import React, { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import FormField from '../ui/FormField';
import { Calculator, AlertTriangle } from 'lucide-react';

const StaffingPlanSection = () => {
  const { state, actions } = useApp();
  const data = state.businessPlan.operationsPlan || {};
  const [staffingCalculator, setStaffingCalculator] = useState({
    seatingCapacity: 50,
    turnsPerDay: 3,
    serviceStyle: 'full-service'
  });

  const handleFieldChange = (field, value) => {
    actions.updateBusinessPlan('operationsPlan', { [field]: value });
  };

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
      default:
        staffRatios = { server: 16, kitchen: 10, support: 25, manager: 45 };
    }
    return {
      servers: Math.ceil(seatingCapacity / staffRatios.server),
      kitchen: Math.ceil(totalCovers / staffRatios.kitchen),
      support: Math.ceil(seatingCapacity / staffRatios.support),
      managers: Math.ceil(seatingCapacity / staffRatios.manager),
      totalDaily:
        Math.ceil(seatingCapacity / staffRatios.server) +
        Math.ceil(totalCovers / staffRatios.kitchen) +
        Math.ceil(seatingCapacity / staffRatios.support) +
        Math.ceil(seatingCapacity / staffRatios.manager)
    };
  }, [staffingCalculator]);

  const bostonRequirements = {
    regulations: {
      minimumWage: 15.0,
      overtime: 1.5,
      breakRequirements: '30 min for 6+ hour shifts',
      healthCertification: 'Required for all food handlers'
    }
  };

  return (
    <div className="space-y-6">
      {/* Staffing Plan summary */}
      <FormField
        label="Staffing Plan (summary)"
        type="textarea"
        value={data.staffingPlan}
        onChange={(value) => handleFieldChange('staffingPlan', value)}
        placeholder="e.g., Owner/Chef (full-time), General Manager (1 FTE), Sous Chef (1 FTE), Line Cooks (2 FTE), Servers (4–6 part-time), Bartenders (2 part-time)"
        rows={2}
      />

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
            onChange={(value) =>
              setStaffingCalculator((prev) => ({ ...prev, seatingCapacity: parseInt(value, 10) || 0 }))
            }
          />
          <FormField
            label="Turns Per Day"
            type="number"
            value={staffingCalculator.turnsPerDay}
            onChange={(value) =>
              setStaffingCalculator((prev) => ({ ...prev, turnsPerDay: parseInt(value, 10) || 0 }))
            }
          />
          <FormField
            label="Service Style"
            type="select"
            value={staffingCalculator.serviceStyle}
            onChange={(value) => setStaffingCalculator((prev) => ({ ...prev, serviceStyle: value }))}
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
};

export default StaffingPlanSection;
