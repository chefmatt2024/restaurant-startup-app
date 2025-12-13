import React, { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Users, TrendingUp, Plus, Trash2, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import FormField from '../ui/FormField';

const ManagementCostProjector = ({ baseAnnualRevenue }) => {
  const { state, actions } = useApp();
  const data = state.financialData;
  
  const managementPositions = data.operatingExpenses?.labor?.management || [];

  // Calculate management costs
  const managementCosts = useMemo(() => {
    const calculatePositionCost = (position) => {
      const hourlyRate = position.hourlyRate || 0;
      const hoursPerWeek = position.hoursPerWeek || 0;
      const weeklyBasePay = hourlyRate * hoursPerWeek;
      // Tips are per hour, so multiply by hours per week
      const weeklyTips = (position.tips || 0) * hoursPerWeek;
      const weeklyGrossPay = weeklyBasePay + weeklyTips;

      // Tax calculations (simplified)
      const federalTaxRate = 0.22; // 22% federal
      const stateTaxRate = 0.05; // 5% MA state
      const socialSecurityRate = 0.062; // 6.2%
      const medicareRate = 0.0145; // 1.45%
      const unemploymentRate = 0.006; // 0.6% employer
      const workersCompRate = 0.015; // 1.5% employer

      const federalTax = weeklyGrossPay * federalTaxRate;
      const stateTax = weeklyGrossPay * stateTaxRate;
      const socialSecurity = weeklyGrossPay * socialSecurityRate;
      const medicare = weeklyGrossPay * medicareRate;

      // Employer costs
      const employerSocialSecurity = weeklyGrossPay * socialSecurityRate;
      const employerMedicare = weeklyGrossPay * medicareRate;
      const employerUnemployment = weeklyGrossPay * unemploymentRate;
      const employerWorkersComp = weeklyGrossPay * workersCompRate;

      // Benefits (if applicable)
      const benefitsCost = position.benefits ? weeklyGrossPay * 0.30 : 0; // 30% for health insurance, etc.

      const totalEmployeeCost = weeklyGrossPay + 
                               employerSocialSecurity + employerMedicare + 
                               employerUnemployment + employerWorkersComp + benefitsCost;

      return {
        ...position,
        weeklyBasePay,
        weeklyTips,
        weeklyGrossPay,
        federalTax,
        stateTax,
        socialSecurity,
        medicare,
        employerSocialSecurity,
        employerMedicare,
        employerUnemployment,
        employerWorkersComp,
        benefitsCost,
        totalEmployeeCost,
        netPay: weeklyGrossPay - federalTax - stateTax - socialSecurity - medicare,
        annualCost: totalEmployeeCost * 52,
        monthlyCost: totalEmployeeCost * 52 / 12
      };
    };

    const calculatedPositions = managementPositions.map(calculatePositionCost);

    const totals = {
      basePay: calculatedPositions.reduce((sum, p) => sum + p.weeklyBasePay, 0) * 52,
      tips: calculatedPositions.reduce((sum, p) => sum + p.weeklyTips, 0) * 52,
      grossPay: calculatedPositions.reduce((sum, p) => sum + p.weeklyGrossPay, 0) * 52,
      employeeTaxes: calculatedPositions.reduce((sum, p) => sum + p.federalTax + p.stateTax + p.socialSecurity + p.medicare, 0) * 52,
      employerTaxes: calculatedPositions.reduce((sum, p) => sum + p.employerSocialSecurity + p.employerMedicare + p.employerUnemployment + p.employerWorkersComp, 0) * 52,
      benefits: calculatedPositions.reduce((sum, p) => sum + p.benefitsCost, 0) * 52,
      totalCost: calculatedPositions.reduce((sum, p) => sum + p.annualCost, 0)
    };

    return {
      positions: calculatedPositions,
      totals,
      monthlyTotal: totals.totalCost / 12,
      weeklyTotal: totals.totalCost / 52,
      count: calculatedPositions.length
    };
  }, [managementPositions]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newPosition, setNewPosition] = useState({
    name: '',
    hourlyRate: 0,
    hoursPerWeek: 0,
    tips: 0,
    benefits: true
  });

  const handleAddPosition = () => {
    const updatedPositions = [...managementPositions, {
      id: `mgmt-${Date.now()}`,
      ...newPosition,
      department: 'Management'
    }];
    
    actions.updateFinancialData('operatingExpenses', {
      labor: {
        ...data.operatingExpenses.labor,
        management: updatedPositions
      }
    });

    setNewPosition({ name: '', hourlyRate: 0, hoursPerWeek: 0, tips: 0, benefits: true });
    setShowAddForm(false);
  };

  const handleRemovePosition = (id) => {
    const updatedPositions = managementPositions.filter(p => p.id !== id);
    actions.updateFinancialData('operatingExpenses', {
      labor: {
        ...data.operatingExpenses.labor,
        management: updatedPositions
      }
    });
  };

  const handleUpdatePosition = (id, field, value) => {
    const updatedPositions = managementPositions.map(p => 
      p.id === id ? { ...p, [field]: parseFloat(value) || 0 } : p
    );
    
    actions.updateFinancialData('operatingExpenses', {
      labor: {
        ...data.operatingExpenses.labor,
        management: updatedPositions
      }
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Calculate as percentage of revenue
  const annualRevenue = baseAnnualRevenue || (() => {
    const ops = data.restaurantOperations || {};
    const seats = ops.seats || 50;
    const avgCheck = (ops.averageCheck?.dinner || 32) + (ops.averageCheck?.lunch || 18);
    const occupancy = (ops.occupancyRate?.dinner || 0.8) + (ops.occupancyRate?.lunch || 0.7);
    const turnover = (ops.tableTurnover?.dinner || 2.0) + (ops.tableTurnover?.lunch || 1.5);
    const weeklyRevenue = seats * (occupancy / 2) * (turnover / 2) * avgCheck * 7;
    return weeklyRevenue * 52;
  })();
  const managementPercentage = annualRevenue > 0 ? (managementCosts.totals.totalCost / annualRevenue) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Users className="w-6 h-6 text-purple-600 mr-2" />
            <h3 className="text-xl font-bold text-gray-900">Management Cost Projector</h3>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center text-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Position
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Calculate total management costs including salaries, taxes, benefits, and employer contributions. 
          Industry standard: Management should be 8-12% of total labor costs.
        </p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="text-xs text-gray-600 mb-1">Total Annual Cost</div>
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(managementCosts.totals.totalCost)}</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="text-xs text-gray-600 mb-1">Monthly Cost</div>
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(managementCosts.monthlyTotal)}</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="text-xs text-gray-600 mb-1">Positions</div>
            <div className="text-2xl font-bold text-green-600">{managementCosts.count}</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="text-xs text-gray-600 mb-1">% of Revenue</div>
            <div className={`text-2xl font-bold ${managementPercentage > 5 ? 'text-red-600' : 'text-gray-600'}`}>
              {managementPercentage.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Add Position Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
            <h4 className="font-semibold mb-3">Add Management Position</h4>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <FormField
                label="Position Name"
                type="text"
                value={newPosition.name}
                onChange={(value) => setNewPosition({ ...newPosition, name: value })}
                placeholder="General Manager"
              />
              <FormField
                label="Hourly Rate"
                type="number"
                value={newPosition.hourlyRate}
                onChange={(value) => setNewPosition({ ...newPosition, hourlyRate: parseFloat(value) || 0 })}
                placeholder="28"
              />
              <FormField
                label="Hours/Week"
                type="number"
                value={newPosition.hoursPerWeek}
                onChange={(value) => setNewPosition({ ...newPosition, hoursPerWeek: parseFloat(value) || 0 })}
                placeholder="50"
              />
              <FormField
                label="Tips/Hour"
                type="number"
                value={newPosition.tips}
                onChange={(value) => setNewPosition({ ...newPosition, tips: parseFloat(value) || 0 })}
                placeholder="0"
              />
              <div className="flex items-end">
                <label className="flex items-center w-full">
                  <input
                    type="checkbox"
                    checked={newPosition.benefits}
                    onChange={(e) => setNewPosition({ ...newPosition, benefits: e.target.checked })}
                    className="rounded border-gray-300 mr-2"
                  />
                  <span className="text-sm text-gray-700">Benefits</span>
                </label>
                <button
                  onClick={handleAddPosition}
                  className="ml-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cost Breakdown */}
        <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
          <h4 className="font-semibold mb-3">Annual Cost Breakdown</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-gray-600 mb-1">Base Pay</div>
              <div className="text-lg font-semibold">{formatCurrency(managementCosts.totals.basePay)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Tips</div>
              <div className="text-lg font-semibold">{formatCurrency(managementCosts.totals.tips)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Employer Taxes</div>
              <div className="text-lg font-semibold">{formatCurrency(managementCosts.totals.employerTaxes)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Benefits</div>
              <div className="text-lg font-semibold">{formatCurrency(managementCosts.totals.benefits)}</div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        {managementCosts.positions.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Cost Breakdown Pie Chart */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold mb-3 flex items-center">
                <PieChartIcon className="w-4 h-4 mr-2 text-purple-600" />
                Cost Breakdown
              </h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Base Pay', value: managementCosts.totals.basePay },
                      { name: 'Tips', value: managementCosts.totals.tips },
                      { name: 'Employer Taxes', value: managementCosts.totals.employerTaxes },
                      { name: 'Benefits', value: managementCosts.totals.benefits }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[
                      { name: 'Base Pay', value: managementCosts.totals.basePay },
                      { name: 'Tips', value: managementCosts.totals.tips },
                      { name: 'Employer Taxes', value: managementCosts.totals.employerTaxes },
                      { name: 'Benefits', value: managementCosts.totals.benefits }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'][index]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Position Cost Comparison */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold mb-3 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2 text-purple-600" />
                Position Cost Comparison
              </h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={managementCosts.positions.map(p => ({
                  name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
                  annual: p.annualCost
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#666" angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke="#666" tickFormatter={(value) => `$${value/1000}k`} />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Bar dataKey="annual" fill="#8b5cf6" name="Annual Cost" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Positions Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Position</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Rate</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Hours/Week</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Monthly</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Annual</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {managementCosts.positions.map((position) => (
                <tr key={position.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={position.name}
                      onChange={(e) => handleUpdatePosition(position.id, 'name', e.target.value)}
                      className="border-0 bg-transparent font-medium focus:ring-2 focus:ring-purple-500 rounded px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <input
                      type="number"
                      value={position.hourlyRate}
                      onChange={(e) => handleUpdatePosition(position.id, 'hourlyRate', e.target.value)}
                      className="w-20 border border-gray-300 rounded px-2 py-1 text-right focus:ring-2 focus:ring-purple-500"
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <input
                      type="number"
                      value={position.hoursPerWeek}
                      onChange={(e) => handleUpdatePosition(position.id, 'hoursPerWeek', e.target.value)}
                      className="w-20 border border-gray-300 rounded px-2 py-1 text-right focus:ring-2 focus:ring-purple-500"
                    />
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">{formatCurrency(position.monthlyCost)}</td>
                  <td className="px-4 py-3 text-right font-bold text-purple-600">{formatCurrency(position.annualCost)}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleRemovePosition(position.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50">
              <tr>
                <td className="px-4 py-3 font-bold">Total</td>
                <td colSpan="2" className="px-4 py-3 text-right font-bold">-</td>
                <td className="px-4 py-3 text-right font-bold">{formatCurrency(managementCosts.monthlyTotal)}</td>
                <td className="px-4 py-3 text-right font-bold text-purple-600">{formatCurrency(managementCosts.totals.totalCost)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {managementPercentage > 5 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mt-4">
            <div className="flex items-start">
              <TrendingUp className="w-4 h-4 text-yellow-600 mr-2 mt-0.5" />
              <span className="text-xs text-yellow-800">
                Management costs exceed 5% of revenue. Consider optimizing management structure or increasing revenue.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagementCostProjector;

