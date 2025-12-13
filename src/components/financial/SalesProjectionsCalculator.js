import React, { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import { TrendingUp, BarChart3, DollarSign, Calendar, Target, LineChart as LineChartIcon } from 'lucide-react';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Line } from 'recharts';
import FormField from '../ui/FormField';

const SalesProjectionsCalculator = ({ baseAnnualRevenue }) => {
  const { state, actions } = useApp();
  const data = state.financialData;
  
  // Get current operations data or use defaults
  const [scenario, setScenario] = useState('moderate'); // conservative, moderate, optimistic
  const [growthRate, setGrowthRate] = useState(5); // annual growth percentage
  const [seasonalAdjustment, setSeasonalAdjustment] = useState(true);

  // Seasonal multipliers by month (constant, no need for useMemo)
  const seasonalMultipliers = {
    january: 0.85,
    february: 0.80,
    march: 0.90,
    april: 0.95,
    may: 1.00,
    june: 1.05,
    july: 1.10,
    august: 1.05,
    september: 1.00,
    october: 1.05,
    november: 1.15,
    december: 1.30
  };

  // Scenario multipliers (constant)
  const scenarioMultipliers = {
    conservative: 0.75, // 25% below base
    moderate: 1.00,      // Base projections
    optimistic: 1.25     // 25% above base
  };

  // Calculate projections
  const projections = useMemo(() => {
    const ops = data.restaurantOperations || {};
    // Use provided base revenue or calculate from operations
    const baseAnnual = baseAnnualRevenue || (() => {
      const seats = ops.seats || 50;
      const avgCheck = (ops.averageCheck?.dinner || 32) + (ops.averageCheck?.lunch || 18);
      const occupancy = (ops.occupancyRate?.dinner || 0.8) + (ops.occupancyRate?.lunch || 0.7);
      const turnover = (ops.tableTurnover?.dinner || 2.0) + (ops.tableTurnover?.lunch || 1.5);
      const baseWeekly = seats * (occupancy / 2) * (turnover / 2) * avgCheck * 7;
      return baseWeekly * 52;
    })();

    // Apply scenario multiplier
    const scenarioBase = baseAnnual * scenarioMultipliers[scenario];

    // Calculate year-by-year with growth
    const yearlyProjections = [];
    for (let year = 1; year <= 5; year++) {
      const yearRevenue = scenarioBase * Math.pow(1 + growthRate / 100, year - 1);
      yearlyProjections.push({
        year,
        revenue: yearRevenue,
        monthly: yearRevenue / 12,
        weekly: yearRevenue / 52,
        daily: yearRevenue / 365
      });
    }

    // Monthly breakdown for Year 1
    const monthlyBreakdown = Object.entries(seasonalMultipliers).map(([month, multiplier]) => {
      const baseMonthly = scenarioBase / 12;
      const adjustedMonthly = seasonalAdjustment ? baseMonthly * multiplier : baseMonthly;
      return {
        month: month.charAt(0).toUpperCase() + month.slice(1),
        multiplier,
        revenue: adjustedMonthly
      };
    });

    const totalYear1 = monthlyBreakdown.reduce((sum, m) => sum + m.revenue, 0);

    // Calculate key metrics
    const avgCheck = ops.averageCheck?.dinner || 32;
    const seats = ops.seats || 50;
    const coversPerDay = scenarioBase / 365 / avgCheck;
    const revenuePerSeat = scenarioBase / seats;

    // Industry benchmarks
    const industryAvgPerSeat = 75000;
    const vsIndustry = ((revenuePerSeat / industryAvgPerSeat) - 1) * 100;

    return {
      baseAnnual,
      scenarioBase,
      yearlyProjections,
      monthlyBreakdown,
      totalYear1,
      avgCheck,
      coversPerDay,
      revenuePerSeat,
      vsIndustry,
      weeklyBase: scenarioBase / 52,
      dailyBase: scenarioBase / 365
    };
  }, [data, scenario, growthRate, seasonalAdjustment, baseAnnualRevenue]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleApplyToFinancials = () => {
    actions.updateFinancialData('revenue', {
      foodSales: projections.scenarioBase * 0.70, // 70% food
      beverageSales: projections.scenarioBase * 0.25, // 25% beverages
      otherRevenue: projections.scenarioBase * 0.05, // 5% other
      annualGrowthRate: growthRate / 100
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
        <div className="flex items-center mb-4">
          <TrendingUp className="w-6 h-6 text-green-600 mr-2" />
          <h3 className="text-xl font-bold text-gray-900">Sales Projections Calculator</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Generate detailed sales projections with multiple scenarios, growth rates, and seasonal adjustments.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Target className="w-4 h-4 inline mr-1" />
                Scenario
              </label>
              <select
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="conservative">Conservative (75% of base)</option>
                <option value="moderate">Moderate (100% of base)</option>
                <option value="optimistic">Optimistic (125% of base)</option>
              </select>
            </div>

            <FormField
              label="Annual Growth Rate (%)"
              type="number"
              step="0.1"
              value={growthRate}
              onChange={(value) => setGrowthRate(parseFloat(value) || 0)}
              placeholder="5"
            />

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={seasonalAdjustment}
                onChange={(e) => setSeasonalAdjustment(e.target.checked)}
                className="rounded border-gray-300 mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Apply Seasonal Adjustments</span>
            </label>

            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <div className="text-xs text-blue-800">
                <strong>Base Projections:</strong> {formatCurrency(projections.baseAnnual)}/year
                <br />
                <strong>Scenario Projections:</strong> {formatCurrency(projections.scenarioBase)}/year
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3">Year 1 Projections</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Annual Revenue:</span>
                  <span className="text-lg font-bold text-green-600">{formatCurrency(projections.scenarioBase)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Monthly Average:</span>
                  <span className="font-semibold">{formatCurrency(projections.scenarioBase / 12)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Weekly Average:</span>
                  <span className="font-semibold">{formatCurrency(projections.weeklyBase)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Daily Average:</span>
                  <span className="font-semibold">{formatCurrency(projections.dailyBase)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3">Performance Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Revenue per Seat:</span>
                  <span className="font-semibold">{formatCurrency(projections.revenuePerSeat)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">vs Industry Avg:</span>
                  <span className={`font-semibold ${projections.vsIndustry > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {projections.vsIndustry > 0 ? '+' : ''}{projections.vsIndustry.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Avg Covers/Day:</span>
                  <span className="font-semibold">{Math.round(projections.coversPerDay)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleApplyToFinancials}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Apply to Financial Projections
            </button>
          </div>
        </div>

        {/* Charts Section */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 5-Year Growth Chart */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <LineChartIcon className="w-4 h-4 mr-2 text-green-600" />
              5-Year Revenue Growth
            </h4>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={projections.yearlyProjections}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="year" stroke="#666" />
                <YAxis stroke="#666" tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="#10b981" fillOpacity={0.6} name="Annual Revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Scenario Comparison */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <BarChart3 className="w-4 h-4 mr-2 text-green-600" />
              Scenario Comparison (Year 1)
            </h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={[
                {
                  scenario: 'Conservative',
                  revenue: projections.baseAnnual * 0.75
                },
                {
                  scenario: 'Moderate',
                  revenue: projections.baseAnnual * 1.00
                },
                {
                  scenario: 'Optimistic',
                  revenue: projections.baseAnnual * 1.25
                }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="scenario" stroke="#666" />
                <YAxis stroke="#666" tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Seasonal Chart */}
        {seasonalAdjustment && (
          <div className="mt-6 bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-green-600" />
              Monthly Revenue Trends (Year 1)
            </h4>
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={projections.monthlyBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="revenue" fill="#10b981" name="Monthly Revenue" />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="Trend" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* 5-Year Projections */}
        <div className="mt-6">
          <h4 className="font-semibold text-gray-900 mb-3">5-Year Revenue Projections</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Annual Revenue</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Monthly</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Weekly</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Daily</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {projections.yearlyProjections.map((year, index) => (
                  <tr key={year.year} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm font-medium">Year {year.year}</td>
                    <td className="px-4 py-2 text-sm font-semibold text-right">{formatCurrency(year.revenue)}</td>
                    <td className="px-4 py-2 text-sm text-right">{formatCurrency(year.monthly)}</td>
                    <td className="px-4 py-2 text-sm text-right">{formatCurrency(year.weekly)}</td>
                    <td className="px-4 py-2 text-sm text-right">{formatCurrency(year.daily)}</td>
                    <td className="px-4 py-2 text-sm text-right text-green-600">
                      {index > 0 ? `+${growthRate}%` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly Breakdown */}
        {seasonalAdjustment && (
          <div className="mt-6">
            <h4 className="font-semibold text-gray-900 mb-3">Monthly Breakdown (Year 1)</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {projections.monthlyBreakdown.map((month) => (
                <div key={month.month} className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="text-xs font-medium text-gray-600 mb-1">{month.month}</div>
                  <div className="text-sm font-bold text-green-600">{formatCurrency(month.revenue)}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {month.multiplier < 1 ? '↓' : month.multiplier > 1.1 ? '↑↑' : '→'} {(month.multiplier * 100).toFixed(0)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesProjectionsCalculator;

