import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { 
  Plus, 
  Trash2, 
  Copy, 
  Edit2, 
  Check, 
  X, 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  Save,
  Download,
  Upload,
  Eye,
  EyeOff,
  GitBranch
} from 'lucide-react';
import SectionCard from '../ui/SectionCard';
import FormField from '../ui/FormField';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';

const ScenarioManager = () => {
  const { state, actions } = useApp();
  const data = state.financialData;
  
  // Get scenarios from financial data or initialize
  const [scenarios, setScenarios] = useState(() => {
    const savedScenarios = data.scenarios || {};
    // If no scenarios exist, create default ones
    if (Object.keys(savedScenarios).length === 0) {
      return {
        base: {
          id: 'base',
          name: 'Base Scenario',
          description: 'Current financial projections',
          isDefault: true,
          createdAt: new Date().toISOString(),
          data: { ...data }
        }
      };
    }
    return savedScenarios;
  });
  
  const [activeScenarioId, setActiveScenarioId] = useState(() => {
    // Find default scenario or first scenario
    const defaultScenario = Object.values(scenarios).find(s => s.isDefault);
    return defaultScenario?.id || Object.keys(scenarios)[0] || 'base';
  });
  
  const [editingScenario, setEditingScenario] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState([]);
  const [newScenarioName, setNewScenarioName] = useState('');
  const [newScenarioDescription, setNewScenarioDescription] = useState('');

  // Get active scenario
  const activeScenario = scenarios[activeScenarioId] || scenarios.base;

  // Load active scenario data on initial mount only
  useEffect(() => {
    // Only load on initial mount if we have a scenario with data
    if (activeScenario && activeScenario.data && Object.keys(activeScenario.data).length > 0) {
      // Check if current data matches scenario data (to avoid unnecessary updates)
      const needsLoad = Object.keys(activeScenario.data).some(section => {
        return JSON.stringify(activeScenario.data[section]) !== JSON.stringify(data[section]);
      });
      
      if (needsLoad) {
        Object.keys(activeScenario.data).forEach(section => {
          if (activeScenario.data[section]) {
            actions.updateFinancialData(section, activeScenario.data[section]);
          }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Save scenarios to financial data
  const saveScenarios = (updatedScenarios) => {
    setScenarios(updatedScenarios);
    actions.updateFinancialData('scenarios', updatedScenarios);
  };

  // Create new scenario from current data
  const createScenario = () => {
    if (!newScenarioName.trim()) return;
    
    const newId = `scenario_${Date.now()}`;
    const newScenario = {
      id: newId,
      name: newScenarioName,
      description: newScenarioDescription || '',
      isDefault: false,
      createdAt: new Date().toISOString(),
      data: JSON.parse(JSON.stringify(data)) // Deep copy current financial data
    };
    
    const updatedScenarios = { ...scenarios, [newId]: newScenario };
    saveScenarios(updatedScenarios);
    setNewScenarioName('');
    setNewScenarioDescription('');
  };

  // Duplicate scenario
  const duplicateScenario = (scenarioId) => {
    const scenario = scenarios[scenarioId];
    if (!scenario) return;
    
    const newId = `scenario_${Date.now()}`;
    const newScenario = {
      ...scenario,
      id: newId,
      name: `${scenario.name} (Copy)`,
      isDefault: false,
      createdAt: new Date().toISOString()
    };
    
    const updatedScenarios = { ...scenarios, [newId]: newScenario };
    saveScenarios(updatedScenarios);
  };

  // Delete scenario
  const deleteScenario = (scenarioId) => {
    if (scenarios[scenarioId]?.isDefault) {
      alert('Cannot delete the default scenario');
      return;
    }
    
    if (Object.keys(scenarios).length <= 1) {
      alert('Must have at least one scenario');
      return;
    }
    
    if (window.confirm(`Delete scenario "${scenarios[scenarioId]?.name}"?`)) {
      const updatedScenarios = { ...scenarios };
      delete updatedScenarios[scenarioId];
      saveScenarios(updatedScenarios);
      
      // Switch to default if deleted scenario was active
      if (scenarioId === activeScenarioId) {
        const defaultScenario = Object.values(updatedScenarios).find(s => s.isDefault);
        setActiveScenarioId(defaultScenario?.id || Object.keys(updatedScenarios)[0]);
      }
    }
  };

  // Switch to scenario
  const switchToScenario = (scenarioId) => {
    const scenario = scenarios[scenarioId];
    if (!scenario) return;
    
    // Save current data to active scenario before switching
    if (activeScenarioId && scenarios[activeScenarioId]) {
      const updatedScenarios = { ...scenarios };
      updatedScenarios[activeScenarioId] = {
        ...updatedScenarios[activeScenarioId],
        data: JSON.parse(JSON.stringify(data))
      };
      saveScenarios(updatedScenarios);
    }
    
    // Load scenario data
    setActiveScenarioId(scenarioId);
    
    // Apply scenario data to financial data
    Object.keys(scenario.data).forEach(section => {
      if (scenario.data[section]) {
        actions.updateFinancialData(section, scenario.data[section]);
      }
    });
  };

  // Update scenario name/description
  const updateScenarioMeta = (scenarioId, updates) => {
    const updatedScenarios = { ...scenarios };
    updatedScenarios[scenarioId] = {
      ...updatedScenarios[scenarioId],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveScenarios(updatedScenarios);
    setEditingScenario(null);
  };

  // Calculate key metrics for a scenario
  const calculateScenarioMetrics = (scenarioData) => {
    const ops = scenarioData.restaurantOperations || {};
    const revenue = scenarioData.revenue || {};
    const expenses = scenarioData.operatingExpenses || {};
    const startup = scenarioData.startupCosts || {};
    
    // Calculate annual revenue
    const seats = ops.seats || 50;
    const avgCheck = ((ops.averageCheck?.lunch || 18) + (ops.averageCheck?.dinner || 32)) / 2;
    const occupancy = (ops.occupancyRate?.average || 0.8);
    const turnover = (ops.tableTurnover?.average || 2.0);
    const dailyRevenue = seats * occupancy * turnover * avgCheck;
    const annualRevenue = dailyRevenue * 365;
    
    // Calculate COGS
    const foodCogs = (revenue.foodSales || annualRevenue * 0.7) * (scenarioData.cogs?.foodCogsPercent || 0.28);
    const beverageCogs = (revenue.beverageSales || annualRevenue * 0.25) * (scenarioData.cogs?.beverageCogsPercent || 0.22);
    const totalCogs = foodCogs + beverageCogs;
    
    // Calculate operating expenses
    const totalOperatingExpenses = Object.values(expenses).reduce((sum, val) => {
      return sum + (typeof val === 'number' ? val : 0);
    }, 0);
    
    // Calculate startup costs
    const totalStartupCosts = Object.values(startup).reduce((sum, val) => {
      return sum + (typeof val === 'number' ? val : 0);
    }, 0);
    
    // Calculate profit
    const grossProfit = annualRevenue - totalCogs;
    const netProfit = grossProfit - totalOperatingExpenses;
    const profitMargin = annualRevenue > 0 ? (netProfit / annualRevenue) * 100 : 0;
    
    return {
      annualRevenue,
      totalCogs,
      grossProfit,
      totalOperatingExpenses,
      netProfit,
      profitMargin,
      totalStartupCosts,
      seats,
      avgCheck,
      revenuePerSeat: annualRevenue / seats
    };
  };

  // Calculate metrics for all scenarios
  const scenarioMetrics = useMemo(() => {
    const metrics = {};
    Object.keys(scenarios).forEach(scenarioId => {
      metrics[scenarioId] = calculateScenarioMetrics(scenarios[scenarioId].data);
    });
    return metrics;
  }, [scenarios]);

  // Comparison data for charts
  const comparisonData = useMemo(() => {
    if (!showComparison || selectedForComparison.length === 0) return [];
    
    return selectedForComparison.map(scenarioId => {
      const scenario = scenarios[scenarioId];
      const metrics = scenarioMetrics[scenarioId];
      return {
        name: scenario.name,
        revenue: metrics.annualRevenue,
        cogs: metrics.totalCogs,
        expenses: metrics.totalOperatingExpenses,
        profit: metrics.netProfit,
        margin: metrics.profitMargin
      };
    });
  }, [showComparison, selectedForComparison, scenarios, scenarioMetrics]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercent = (value) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      <SectionCard
        title="Financial Scenarios"
        icon={<GitBranch className="w-5 h-5" />}
        description="Create and compare multiple financial scenarios to plan for different outcomes"
      >
        {/* Scenario List */}
        <div className="space-y-4">
          {/* Create New Scenario */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Create New Scenario
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField
                label="Scenario Name"
                type="text"
                value={newScenarioName}
                onChange={(e) => setNewScenarioName(e.target.value)}
                placeholder="e.g., Optimistic, Conservative, Best Case"
              />
              <FormField
                label="Description (Optional)"
                type="text"
                value={newScenarioDescription}
                onChange={(e) => setNewScenarioDescription(e.target.value)}
                placeholder="Brief description of this scenario"
              />
            </div>
            <button
              onClick={createScenario}
              disabled={!newScenarioName.trim()}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Scenario
            </button>
          </div>

          {/* Scenario Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(scenarios).map((scenario) => {
              const metrics = scenarioMetrics[scenario.id];
              const isActive = scenario.id === activeScenarioId;
              const isEditing = editingScenario === scenario.id;
              
              return (
                <div
                  key={scenario.id}
                  className={`rounded-lg border-2 p-4 transition-all ${
                    isActive
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  {/* Scenario Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      {isEditing ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={scenario.name}
                            onChange={(e) => {
                              const updated = { ...scenarios };
                              updated[scenario.id] = { ...updated[scenario.id], name: e.target.value };
                              setScenarios(updated);
                            }}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm font-semibold"
                            autoFocus
                          />
                          <input
                            type="text"
                            value={scenario.description || ''}
                            onChange={(e) => {
                              const updated = { ...scenarios };
                              updated[scenario.id] = { ...updated[scenario.id], description: e.target.value };
                              setScenarios(updated);
                            }}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                            placeholder="Description"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateScenarioMeta(scenario.id, scenarios[scenario.id])}
                              className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => setEditingScenario(null)}
                              className="px-2 py-1 bg-gray-400 text-white rounded text-xs hover:bg-gray-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h5 className="font-semibold text-gray-900 flex items-center">
                            {scenario.name}
                            {scenario.isDefault && (
                              <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                                Default
                              </span>
                            )}
                          </h5>
                          {scenario.description && (
                            <p className="text-xs text-gray-600 mt-1">{scenario.description}</p>
                          )}
                        </div>
                      )}
                    </div>
                    {!isEditing && (
                      <div className="flex gap-1 ml-2">
                        <button
                          onClick={() => setEditingScenario(scenario.id)}
                          className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => duplicateScenario(scenario.id)}
                          className="p-1 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded"
                          title="Duplicate"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        {!scenario.isDefault && (
                          <button
                            onClick={() => deleteScenario(scenario.id)}
                            className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Key Metrics */}
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Annual Revenue:</span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(metrics.annualRevenue)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Net Profit:</span>
                      <span className={`font-semibold ${
                        metrics.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(metrics.netProfit)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Profit Margin:</span>
                      <span className={`font-semibold ${
                        metrics.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatPercent(metrics.profitMargin)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => switchToScenario(scenario.id)}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {isActive ? 'Active' : 'Switch To'}
                    </button>
                    <button
                      onClick={() => {
                        if (selectedForComparison.includes(scenario.id)) {
                          setSelectedForComparison(selectedForComparison.filter(id => id !== scenario.id));
                        } else {
                          setSelectedForComparison([...selectedForComparison, scenario.id]);
                        }
                        if (!showComparison) setShowComparison(true);
                      }}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedForComparison.includes(scenario.id)
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                      title="Compare"
                    >
                      {selectedForComparison.includes(scenario.id) ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </SectionCard>

      {/* Comparison View */}
      {showComparison && selectedForComparison.length > 0 && (
        <SectionCard
          title="Scenario Comparison"
          icon={<BarChart3 className="w-5 h-5" />}
          description="Compare key metrics across selected scenarios"
        >
          <div className="space-y-6">
            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Metric
                    </th>
                    {selectedForComparison.map(scenarioId => (
                      <th
                        key={scenarioId}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {scenarios[scenarioId].name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Annual Revenue</td>
                    {selectedForComparison.map(scenarioId => (
                      <td key={scenarioId} className="px-4 py-3 text-sm text-gray-900">
                        {formatCurrency(scenarioMetrics[scenarioId].annualRevenue)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Total COGS</td>
                    {selectedForComparison.map(scenarioId => (
                      <td key={scenarioId} className="px-4 py-3 text-sm text-gray-900">
                        {formatCurrency(scenarioMetrics[scenarioId].totalCogs)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Gross Profit</td>
                    {selectedForComparison.map(scenarioId => (
                      <td key={scenarioId} className="px-4 py-3 text-sm text-gray-900">
                        {formatCurrency(scenarioMetrics[scenarioId].grossProfit)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Operating Expenses</td>
                    {selectedForComparison.map(scenarioId => (
                      <td key={scenarioId} className="px-4 py-3 text-sm text-gray-900">
                        {formatCurrency(scenarioMetrics[scenarioId].totalOperatingExpenses)}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">Net Profit</td>
                    {selectedForComparison.map(scenarioId => (
                      <td
                        key={scenarioId}
                        className={`px-4 py-3 text-sm font-semibold ${
                          scenarioMetrics[scenarioId].netProfit >= 0
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {formatCurrency(scenarioMetrics[scenarioId].netProfit)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Profit Margin</td>
                    {selectedForComparison.map(scenarioId => (
                      <td
                        key={scenarioId}
                        className={`px-4 py-3 text-sm ${
                          scenarioMetrics[scenarioId].profitMargin >= 0
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {formatPercent(scenarioMetrics[scenarioId].profitMargin)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Revenue per Seat</td>
                    {selectedForComparison.map(scenarioId => (
                      <td key={scenarioId} className="px-4 py-3 text-sm text-gray-900">
                        {formatCurrency(scenarioMetrics[scenarioId].revenuePerSeat)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Startup Costs</td>
                    {selectedForComparison.map(scenarioId => (
                      <td key={scenarioId} className="px-4 py-3 text-sm text-gray-900">
                        {formatCurrency(scenarioMetrics[scenarioId].totalStartupCosts)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Comparison Charts */}
            {comparisonData.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Comparison */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">Annual Revenue Comparison</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend />
                      <Bar dataKey="revenue" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Profit Comparison */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">Net Profit Comparison</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend />
                      <Bar dataKey="profit" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Profit Margin Comparison */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">Profit Margin Comparison</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatPercent(value)} />
                      <Legend />
                      <Bar dataKey="margin" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Comprehensive Comparison */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">Revenue vs Expenses</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <ComposedChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend />
                      <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                      <Bar dataKey="cogs" fill="#ef4444" name="COGS" />
                      <Bar dataKey="expenses" fill="#f59e0b" name="Operating Expenses" />
                      <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} name="Net Profit" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowComparison(false);
                  setSelectedForComparison([]);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </SectionCard>
      )}
    </div>
  );
};

export default ScenarioManager;
