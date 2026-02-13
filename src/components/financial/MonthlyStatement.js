import React, { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import FormField from '../ui/FormField';
import SectionCard from '../ui/SectionCard';
import { Calendar, DollarSign, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, FileText, Plus, Edit2, BarChart3, List } from 'lucide-react';
import { OPERATING_EXPENSE_KEYS, OPERATING_EXPENSE_LABELS, sumOperatingExpenses } from '../../config/pnlLineItems';
import { MONTHLY_PL_SECTIONS, getInitialMonthlyPL } from '../../config/monthlyPLAccounts';

const MonthlyStatement = () => {
  const { state, actions } = useApp();
  const data = state.financialData;
  
  // Get restaurant open date or default to current month
  const restaurantOpenDate = data.restaurantOpenDate || null;
  const monthlyActuals = data.monthlyActuals || {};
  
  // Get current month/year for default selection
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // 1-12
  
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [editingCategory, setEditingCategory] = useState(null);
  // 'simple' = calculated forecast vs flat actuals; 'openingPL' = chart-of-accounts projection vs actuals
  const [viewMode, setViewMode] = useState('openingPL');
  const [editingPL, setEditingPL] = useState(null); // { sectionId, code } when editing a cell in opening P&L view
  
  // Generate list of years (from open date to current year + 1)
  const years = useMemo(() => {
    const startYear = restaurantOpenDate ? new Date(restaurantOpenDate).getFullYear() : currentYear;
    const endYear = currentYear + 1;
    const yearList = [];
    for (let y = startYear; y <= endYear; y++) {
      yearList.push(y);
    }
    return yearList;
  }, [restaurantOpenDate, currentYear]);
  
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  // Calculate monthly forecast from annual projections (must be defined before getForecastedExpenses)
  const calculateMonthlyForecast = () => {
    const ops = data.restaurantOperations || {};
    const seats = ops.seats || 50;
    const avgCheckLunch = ops.averageCheck?.lunch || 18;
    const avgCheckDinner = ops.averageCheck?.dinner || 32;
    const avgCheck = (avgCheckLunch + avgCheckDinner) / 2;
    const occupancy = ops.occupancyRate?.average || 0.8;
    const turnover = ops.tableTurnover?.average || 2.0;

    const dailyRevenue = seats * occupancy * turnover * avgCheck;
    const weeklyRevenue = dailyRevenue * 7;
    const annualRevenue = weeklyRevenue * 52;
    const monthlyRevenue = annualRevenue / 12;

    const monthlyFoodSales = monthlyRevenue * 0.70;
    const monthlyBeverageSales = monthlyRevenue * 0.25;

    const foodCogsPercent = data.cogs?.foodCogsPercent || 0.28;
    const beverageCogsPercent = data.cogs?.beverageCogsPercent || 0.22;
    const monthlyFoodCogs = monthlyFoodSales * foodCogsPercent;
    const monthlyBeverageCogs = monthlyBeverageSales * beverageCogsPercent;
    const monthlyCogs = monthlyFoodCogs + monthlyBeverageCogs;
    const monthlyGrossProfit = monthlyRevenue - monthlyCogs;

    const opEx = data.operatingExpenses || {};
    const monthlyOpEx = sumOperatingExpenses(opEx) / 12;
    const monthlyPayroll = (opEx.labor?.totalAnnualCost || 0) / 12;
    const monthlyTotalExpenses = monthlyOpEx + monthlyPayroll + monthlyCogs;
    const monthlyNetIncome = monthlyGrossProfit - (monthlyOpEx + monthlyPayroll);

    return {
      monthlyRevenue,
      monthlyFoodSales,
      monthlyBeverageSales,
      monthlyFoodCogs,
      monthlyBeverageCogs,
      monthlyCogs,
      monthlyGrossProfit,
      monthlyOpEx,
      monthlyPayroll,
      monthlyTotalExpenses,
      monthlyNetIncome
    };
  };

  // Get forecasted monthly expenses from projections (full P&L list, parsed monthly)
  const getForecastedExpenses = useMemo(() => {
    const calculations = calculateMonthlyForecast();
    const opEx = data.operatingExpenses || {};
    const monthlyByKey = {};
    OPERATING_EXPENSE_KEYS.forEach(key => {
      monthlyByKey[key] = (Number(opEx[key]) || 0) / 12;
    });
    return {
      revenue: calculations.monthlyRevenue,
      foodSales: calculations.monthlyFoodSales,
      beverageSales: calculations.monthlyBeverageSales,
      foodCogs: calculations.monthlyFoodCogs,
      beverageCogs: calculations.monthlyBeverageCogs,
      totalCogs: calculations.monthlyCogs,
      grossProfit: calculations.monthlyGrossProfit,
      ...monthlyByKey,
      payroll: (opEx.labor?.totalAnnualCost || 0) / 12,
      totalOperatingExpenses: calculations.monthlyOpEx,
      totalExpenses: calculations.monthlyTotalExpenses,
      netIncome: calculations.monthlyNetIncome
    };
  }, [data]);

  // Get actual expenses for selected month
  const monthKey = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
  const actualExpenses = monthlyActuals[monthKey] || {};
  
  // Opening P&L: projection (monthlyPL) and actuals (monthlyActuals[monthKey].pl) merged with defaults
  const openingProjection = useMemo(() => {
    const defaults = getInitialMonthlyPL();
    const saved = data.monthlyPL || {};
    const merged = {};
    MONTHLY_PL_SECTIONS.forEach(({ id }) => {
      merged[id] = { ...(defaults[id] || {}), ...(saved[id] || {}) };
    });
    return merged;
  }, [data.monthlyPL]);
  
  const actualsPL = useMemo(() => {
    const defaults = getInitialMonthlyPL();
    const monthData = monthlyActuals[monthKey]?.pl || {};
    const merged = {};
    MONTHLY_PL_SECTIONS.forEach(({ id }) => {
      merged[id] = { ...(defaults[id] || {}), ...(monthData[id] || {}) };
    });
    return merged;
  }, [monthlyActuals, monthKey]);
  
  const handleActualPLChange = (sectionId, code, value) => {
    const num = value === '' ? 0 : parseFloat(value) || 0;
    const monthData = monthlyActuals[monthKey] || {};
    const pl = monthData.pl || {};
    const sectionData = pl[sectionId] || {};
    const updatedPl = {
      ...pl,
      [sectionId]: { ...sectionData, [code]: num }
    };
    const updatedActuals = {
      ...monthlyActuals,
      [monthKey]: { ...monthData, pl: updatedPl }
    };
    actions.updateFinancialData('monthlyActuals', updatedActuals);
  };
  
  // Calculate variances (all P&L keys)
  const variances = useMemo(() => {
    const forecasted = getForecastedExpenses;
    const actual = actualExpenses;
    const calculateVariance = (forecast, actualVal) => {
      const variance = (actualVal || 0) - (forecast || 0);
      const variancePercent = forecast > 0 ? (variance / forecast) * 100 : 0;
      return { variance, variancePercent, isFavorable: variance <= 0 };
    };
    const result = {};
    Object.keys(forecasted).forEach(key => {
      result[key] = calculateVariance(forecasted[key], actual[key]);
    });
    return result;
  }, [getForecastedExpenses, actualExpenses]);
  
  // Update actual expense
  const handleActualExpenseChange = (category, value) => {
    const numValue = value === '' ? 0 : parseFloat(value) || 0;
    const updatedActuals = {
      ...monthlyActuals,
      [monthKey]: {
        ...actualExpenses,
        [category]: numValue
      }
    };
    
    actions.updateFinancialData('monthlyActuals', updatedActuals);
  };
  
  // Set restaurant open date
  const handleOpenDateChange = (date) => {
    actions.updateFinancialData('restaurantOpenDate', date);
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };
  
  const formatPercent = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };
  
  // Expense categories for input (full P&L list; operating from config)
  const expenseCategories = useMemo(() => {
    const rev = [
      { key: 'revenue', label: 'Total Revenue', section: 'revenue' },
      { key: 'foodSales', label: 'Food Sales', section: 'revenue' },
      { key: 'beverageSales', label: 'Beverage Sales', section: 'revenue' }
    ];
    const cogs = [
      { key: 'foodCogs', label: 'Food COGS', section: 'cogs' },
      { key: 'beverageCogs', label: 'Beverage COGS', section: 'cogs' },
      { key: 'totalCogs', label: 'Total COGS', section: 'cogs' }
    ];
    const profitMid = [{ key: 'grossProfit', label: 'Gross Profit', section: 'profit' }];
    const opExRows = OPERATING_EXPENSE_KEYS.map(key => ({
      key,
      label: OPERATING_EXPENSE_LABELS[key] || key,
      section: 'expenses'
    }));
    const totals = [
      { key: 'payroll', label: 'Payroll', section: 'expenses' },
      { key: 'totalOperatingExpenses', label: 'Total Operating Expenses', section: 'expenses' },
      { key: 'totalExpenses', label: 'Total Expenses', section: 'expenses' },
      { key: 'netIncome', label: 'Net Income', section: 'profit' }
    ];
    return [...rev, ...cogs, ...profitMid, ...opExRows, ...totals];
  }, []);

  const expenseVendors = data.expenseVendors || { operating: {}, startup: {} };
  const vendorsById = useMemo(() => {
    const map = {};
    (state.vendors || []).forEach(v => { map[String(v.id)] = v; });
    return map;
  }, [state.vendors]);
  
  const revenueCategories = expenseCategories.filter(c => c.section === 'revenue');
  const cogsCategories = expenseCategories.filter(c => c.section === 'cogs');
  const expenseCategoriesList = expenseCategories.filter(c => c.section === 'expenses');
  const profitCategories = expenseCategories.filter(c => c.section === 'profit');
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Monthly Financial Statement</h2>
          </div>
        </div>
        
        {/* Month/Year Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {months.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Open Date</label>
            <input
              type="date"
              value={restaurantOpenDate || ''}
              onChange={(e) => handleOpenDateChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        {/* View mode: Opening P&L (compare to plan) vs Simple (calculated forecast) */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-gray-200">
          <span className="text-sm font-medium text-gray-700">Compare:</span>
          <div className="inline-flex p-1 bg-gray-100 rounded-lg border border-gray-200">
            <button
              type="button"
              onClick={() => setViewMode('openingPL')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 ${
                viewMode === 'openingPL' ? 'bg-teal-600 text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Opening P&L (vs plan)
            </button>
            <button
              type="button"
              onClick={() => setViewMode('simple')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 ${
                viewMode === 'simple' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-4 h-4" />
              Simple (calculated)
            </button>
          </div>
          <p className="text-xs text-gray-500">
            {viewMode === 'openingPL' ? 'Projection = your opening estimates from Financial Projections. Enter actuals below.' : 'Forecast = derived from annual revenue & expenses.'}
          </p>
        </div>
      </div>
      
      {viewMode === 'openingPL' && (
        <>
          <SectionCard title="Actual vs opening plan (by account)" icon={BarChart3}>
            <p className="text-sm text-gray-500 mb-4">Select month above. Projection = opening estimates; edit Actual to enter real numbers.</p>
            <div className="space-y-4">
              {MONTHLY_PL_SECTIONS.map((section) => {
                const projSection = openingProjection[section.id] || {};
                const actualSection = actualsPL[section.id] || {};
                const sectionProjTotal = section.lines.reduce((sum, { code }) => sum + (Number(projSection[code]) || 0), 0);
                const sectionActualTotal = section.lines.reduce((sum, { code }) => sum + (Number(actualSection[code]) || 0), 0);
                const sectionVariance = sectionActualTotal - sectionProjTotal;
                return (
                  <div key={section.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50/50">
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">{section.title}</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 px-2 font-semibold text-gray-700">Line</th>
                            <th className="text-right py-2 px-2 font-semibold text-gray-700">Projection</th>
                            <th className="text-right py-2 px-2 font-semibold text-gray-700">Actual</th>
                            <th className="text-right py-2 px-2 font-semibold text-gray-700">Variance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {section.lines.map(({ code, label }) => {
                            const proj = Number(projSection[code]) || 0;
                            const actual = Number(actualSection[code]) || 0;
                            const variance = actual - proj;
                            const isEditing = editingPL?.sectionId === section.id && editingPL?.code === code;
                            return (
                              <tr key={code} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-1.5 px-2 font-medium text-gray-900">{code} {label}</td>
                                <td className="py-1.5 px-2 text-right text-gray-700">{formatCurrency(proj)}</td>
                                <td className="py-1.5 px-2 text-right">
                                  {isEditing ? (
                                    <input
                                      type="number"
                                      value={actual || ''}
                                      onChange={(e) => handleActualPLChange(section.id, code, e.target.value)}
                                      onBlur={() => setEditingPL(null)}
                                      className="w-28 px-2 py-1 border border-teal-500 rounded text-right text-sm"
                                      autoFocus
                                    />
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => setEditingPL({ sectionId: section.id, code })}
                                      className="text-teal-600 hover:text-teal-800 hover:underline"
                                    >
                                      {formatCurrency(actual)}
                                    </button>
                                  )}
                                </td>
                                <td className={`py-1.5 px-2 text-right font-medium ${variance >= 0 && section.id !== 'revenue' && section.id !== 'otherIncome' ? 'text-red-600' : variance <= 0 && section.id !== 'revenue' && section.id !== 'otherIncome' ? 'text-green-600' : variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {formatCurrency(variance)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot>
                          <tr className="bg-gray-100 font-medium">
                            <td className="py-1.5 px-2">{section.totalLabel}</td>
                            <td className="py-1.5 px-2 text-right">{formatCurrency(sectionProjTotal)}</td>
                            <td className="py-1.5 px-2 text-right">{formatCurrency(sectionActualTotal)}</td>
                            <td className={`py-1.5 px-2 text-right ${sectionVariance >= 0 && !['revenue', 'otherIncome'].includes(section.id) ? 'text-red-600' : sectionVariance <= 0 && !['revenue', 'otherIncome'].includes(section.id) ? 'text-green-600' : sectionVariance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatCurrency(sectionVariance)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
            {(() => {
              const totalRevenue = Object.values(openingProjection.revenue || {}).reduce((s, v) => s + (Number(v) || 0), 0);
              const totalCOGS = Object.values(openingProjection.cogs || {}).reduce((s, v) => s + (Number(v) || 0), 0);
              const expenseIds = ['labor', 'directOperating', 'transaction', 'marketing', 'generalAdmin', 'travelMeals', 'repairsMaintenance', 'property'];
              const totalExpensesProj = expenseIds.reduce((sum, id) => sum + (openingProjection[id] ? Object.values(openingProjection[id]).reduce((s, v) => s + (Number(v) || 0), 0) : 0), 0);
              const totalOtherInc = (openingProjection.otherIncome && Object.values(openingProjection.otherIncome).reduce((s, v) => s + (Number(v) || 0), 0)) || 0;
              const totalOtherExp = (openingProjection.otherExpenses && Object.values(openingProjection.otherExpenses).reduce((s, v) => s + (Number(v) || 0), 0)) || 0;
              const revActual = Object.values(actualsPL.revenue || {}).reduce((s, v) => s + (Number(v) || 0), 0);
              const cogsActual = Object.values(actualsPL.cogs || {}).reduce((s, v) => s + (Number(v) || 0), 0);
              const expensesActual = expenseIds.reduce((sum, id) => sum + (actualsPL[id] ? Object.values(actualsPL[id]).reduce((s, v) => s + (Number(v) || 0), 0) : 0), 0);
              const otherIncActual = (actualsPL.otherIncome && Object.values(actualsPL.otherIncome).reduce((s, v) => s + (Number(v) || 0), 0)) || 0;
              const otherExpActual = (actualsPL.otherExpenses && Object.values(actualsPL.otherExpenses).reduce((s, v) => s + (Number(v) || 0), 0)) || 0;
              const netProj = totalRevenue - totalCOGS - totalExpensesProj + totalOtherInc - totalOtherExp;
              const netActual = revActual - cogsActual - expensesActual + otherIncActual - otherExpActual;
              const netVariance = netActual - netProj;
              const fmt = (n) => formatCurrency(n);
              return (
                <div className="border-2 border-teal-200 rounded-lg p-4 bg-teal-50/50 mt-4 space-y-1 text-sm">
                  <div className="font-semibold text-gray-800">Summary for {monthKey}</div>
                  <div>Total Revenue: Proj {fmt(totalRevenue)} → Actual {fmt(revActual)}</div>
                  <div>Total COGS: Proj {fmt(totalCOGS)} → Actual {fmt(cogsActual)}</div>
                  <div>Total Expenses: Proj {fmt(totalExpensesProj)} → Actual {fmt(expensesActual)}</div>
                  <div className="font-medium">Net Income: Proj {fmt(netProj)} → Actual {fmt(netActual)} ({netVariance >= 0 ? '+' : ''}{fmt(netVariance)})</div>
                </div>
              );
            })()}
          </SectionCard>
        </>
      )}
      
      {viewMode === 'simple' && (
        <>
      {/* Revenue Section */}
      <SectionCard title="Revenue" icon={TrendingUp}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Forecasted</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Actual</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Variance</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">%</th>
              </tr>
            </thead>
            <tbody>
              {revenueCategories.map(category => {
                const forecasted = getForecastedExpenses[category.key] || 0;
                const actual = actualExpenses[category.key] || 0;
                const variance = variances[category.key];
                
                return (
                  <tr key={category.key} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{category.label}</td>
                    <td className="py-3 px-4 text-right text-gray-700">{formatCurrency(forecasted)}</td>
                    <td className="py-3 px-4 text-right">
                      {editingCategory === category.key ? (
                        <input
                          type="number"
                          value={actual || ''}
                          onChange={(e) => handleActualExpenseChange(category.key, e.target.value)}
                          onBlur={() => setEditingCategory(null)}
                          className="w-32 px-2 py-1 border border-blue-500 rounded text-right"
                          autoFocus
                        />
                      ) : (
                        <button
                          onClick={() => setEditingCategory(category.key)}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {formatCurrency(actual)}
                        </button>
                      )}
                    </td>
                    <td className={`py-3 px-4 text-right font-medium ${
                      variance.isFavorable ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(variance.variance)}
                    </td>
                    <td className={`py-3 px-4 text-right ${
                      variance.isFavorable ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatPercent(variance.variancePercent)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>
      
      {/* COGS Section */}
      <SectionCard title="Cost of Goods Sold (COGS)" icon={DollarSign}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Forecasted</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Actual</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Variance</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">%</th>
              </tr>
            </thead>
            <tbody>
              {cogsCategories.map(category => {
                const forecasted = getForecastedExpenses[category.key] || 0;
                const actual = actualExpenses[category.key] || 0;
                const variance = variances[category.key];
                
                return (
                  <tr key={category.key} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{category.label}</td>
                    <td className="py-3 px-4 text-right text-gray-700">{formatCurrency(forecasted)}</td>
                    <td className="py-3 px-4 text-right">
                      {editingCategory === category.key ? (
                        <input
                          type="number"
                          value={actual || ''}
                          onChange={(e) => handleActualExpenseChange(category.key, e.target.value)}
                          onBlur={() => setEditingCategory(null)}
                          className="w-32 px-2 py-1 border border-blue-500 rounded text-right"
                          autoFocus
                        />
                      ) : (
                        <button
                          onClick={() => setEditingCategory(category.key)}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {formatCurrency(actual)}
                        </button>
                      )}
                    </td>
                    <td className={`py-3 px-4 text-right font-medium ${
                      variance.isFavorable ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(variance.variance)}
                    </td>
                    <td className={`py-3 px-4 text-right ${
                      variance.isFavorable ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatPercent(variance.variancePercent)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>
      
      {/* Operating Expenses Section – full P&L list, parsed monthly, with vendor */}
      <SectionCard title="Operating Expenses (monthly from annual)" icon={AlertTriangle}>
        <p className="text-sm text-gray-500 mb-2">Forecasted = annual projection ÷ 12. Link vendors in Financial Projections → P&L line items.</p>
        <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 font-semibold text-gray-700">Category</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-700">Vendor</th>
                <th className="text-right py-2 px-3 font-semibold text-gray-700">Forecasted</th>
                <th className="text-right py-2 px-3 font-semibold text-gray-700">Actual</th>
                <th className="text-right py-2 px-3 font-semibold text-gray-700">Variance</th>
                <th className="text-right py-2 px-3 font-semibold text-gray-700">%</th>
              </tr>
            </thead>
            <tbody>
              {expenseCategoriesList.map(category => {
                const forecasted = getForecastedExpenses[category.key] ?? 0;
                const actual = actualExpenses[category.key] ?? 0;
                const variance = variances[category.key] || { variance: 0, variancePercent: 0, isFavorable: true };
                const vendorId = expenseVendors.operating[category.key];
                const vendor = vendorId ? vendorsById[vendorId] : null;
                return (
                  <tr key={category.key} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-3 font-medium text-gray-900">{category.label}</td>
                    <td className="py-2 px-3 text-sm text-gray-600">{vendor ? (vendor.company || vendor.name) : '—'}</td>
                    <td className="py-2 px-3 text-right text-gray-700">{formatCurrency(forecasted)}</td>
                    <td className="py-2 px-3 text-right">
                      {editingCategory === category.key ? (
                        <input
                          type="number"
                          value={actual || ''}
                          onChange={(e) => handleActualExpenseChange(category.key, e.target.value)}
                          onBlur={() => setEditingCategory(null)}
                          className="w-28 px-2 py-1 border border-blue-500 rounded text-right text-sm"
                          autoFocus
                        />
                      ) : (
                        <button
                          onClick={() => setEditingCategory(category.key)}
                          className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                        >
                          {formatCurrency(actual)}
                        </button>
                      )}
                    </td>
                    <td className={`py-2 px-3 text-right font-medium text-sm ${
                      variance.isFavorable ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(variance.variance)}
                    </td>
                    <td className={`py-2 px-3 text-right text-sm ${
                      variance.isFavorable ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatPercent(variance.variancePercent)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>
      
      {/* Profit Section */}
      <SectionCard title="Profit & Loss Summary" icon={CheckCircle}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Forecasted</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Actual</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Variance</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">%</th>
              </tr>
            </thead>
            <tbody>
              {profitCategories.map(category => {
                const forecasted = getForecastedExpenses[category.key] || 0;
                const actual = actualExpenses[category.key] || 0;
                const variance = variances[category.key];
                
                return (
                  <tr key={category.key} className={`border-b border-gray-100 hover:bg-gray-50 ${
                    category.key === 'netIncome' ? 'bg-gray-50 font-bold' : ''
                  }`}>
                    <td className="py-3 px-4 font-medium text-gray-900">{category.label}</td>
                    <td className="py-3 px-4 text-right text-gray-700">{formatCurrency(forecasted)}</td>
                    <td className="py-3 px-4 text-right">
                      {editingCategory === category.key ? (
                        <input
                          type="number"
                          value={actual || ''}
                          onChange={(e) => handleActualExpenseChange(category.key, e.target.value)}
                          onBlur={() => setEditingCategory(null)}
                          className="w-32 px-2 py-1 border border-blue-500 rounded text-right"
                          autoFocus
                        />
                      ) : (
                        <button
                          onClick={() => setEditingCategory(category.key)}
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {formatCurrency(actual)}
                        </button>
                      )}
                    </td>
                    <td className={`py-3 px-4 text-right font-medium ${
                      variance.isFavorable ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(variance.variance)}
                    </td>
                    <td className={`py-3 px-4 text-right ${
                      variance.isFavorable ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatPercent(variance.variancePercent)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>
      
      {/* Summary Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Forecasted Net Income</div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(getForecastedExpenses.netIncome)}
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Actual Net Income</div>
            <div className={`text-2xl font-bold ${
              (actualExpenses.netIncome || 0) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(actualExpenses.netIncome || 0)}
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Variance</div>
            <div className={`text-2xl font-bold ${
              variances.netIncome.isFavorable ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(variances.netIncome.variance)}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {formatPercent(variances.netIncome.variancePercent)}
            </div>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
};

export default MonthlyStatement;


