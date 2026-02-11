import React, { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import FormField from '../ui/FormField';
import SectionCard from '../ui/SectionCard';
import { Calendar, DollarSign, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, FileText, Plus, Edit2 } from 'lucide-react';

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
  
  // Get forecasted monthly expenses from projections
  const getForecastedExpenses = useMemo(() => {
    // Calculate monthly breakdown from annual projections
    const calculations = calculateMonthlyForecast();
    
    return {
      revenue: calculations.monthlyRevenue,
      foodSales: calculations.monthlyFoodSales,
      beverageSales: calculations.monthlyBeverageSales,
      foodCogs: calculations.monthlyFoodCogs,
      beverageCogs: calculations.monthlyBeverageCogs,
      totalCogs: calculations.monthlyCogs,
      grossProfit: calculations.monthlyGrossProfit,
      rent: (data.operatingExpenses?.rent || 0) / 12,
      utilities: (data.operatingExpenses?.utilities || 0) / 12,
      insurance: (data.operatingExpenses?.insurance || 0) / 12,
      marketing: (data.operatingExpenses?.marketing || 0) / 12,
      legalAccounting: (data.operatingExpenses?.legalAccounting || 0) / 12,
      repairsMaintenance: (data.operatingExpenses?.repairsMaintenance || 0) / 12,
      supplies: (data.operatingExpenses?.supplies || 0) / 12,
      adminOffice: (data.operatingExpenses?.adminOffice || 0) / 12,
      payroll: (data.operatingExpenses?.labor?.totalAnnualCost || 0) / 12,
      totalOperatingExpenses: calculations.monthlyOpEx,
      totalExpenses: calculations.monthlyTotalExpenses,
      netIncome: calculations.monthlyNetIncome
    };
  }, [data]);
  
  // Calculate monthly forecast from annual projections
  const calculateMonthlyForecast = () => {
    // Get annual revenue from daily sales projections
    const ops = data.restaurantOperations || {};
    const seats = ops.seats || 50;
    const avgCheckLunch = ops.averageCheck?.lunch || 18;
    const avgCheckDinner = ops.averageCheck?.dinner || 32;
    const avgCheck = (avgCheckLunch + avgCheckDinner) / 2;
    const occupancy = ops.occupancyRate?.average || 0.8;
    const turnover = ops.tableTurnover?.average || 2.0;
    
    // Calculate daily revenue
    const dailyRevenue = seats * occupancy * turnover * avgCheck;
    const weeklyRevenue = dailyRevenue * 7;
    const annualRevenue = weeklyRevenue * 52;
    const monthlyRevenue = annualRevenue / 12;
    
    // Split revenue (70% food, 25% beverage, 5% other)
    const monthlyFoodSales = monthlyRevenue * 0.70;
    const monthlyBeverageSales = monthlyRevenue * 0.25;
    
    // Calculate COGS
    const foodCogsPercent = data.cogs?.foodCogsPercent || 0.28;
    const beverageCogsPercent = data.cogs?.beverageCogsPercent || 0.22;
    const monthlyFoodCogs = monthlyFoodSales * foodCogsPercent;
    const monthlyBeverageCogs = monthlyBeverageSales * beverageCogsPercent;
    const monthlyCogs = monthlyFoodCogs + monthlyBeverageCogs;
    
    // Calculate gross profit
    const monthlyGrossProfit = monthlyRevenue - monthlyCogs;
    
    // Calculate operating expenses (monthly)
    const opEx = data.operatingExpenses || {};
    const monthlyOpEx = (
      (opEx.rent || 0) +
      (opEx.utilities || 0) +
      (opEx.insurance || 0) +
      (opEx.marketing || 0) +
      (opEx.legalAccounting || 0) +
      (opEx.repairsMaintenance || 0) +
      (opEx.supplies || 0) +
      (opEx.adminOffice || 0) +
      (opEx.otherOperatingExpenses || 0)
    ) / 12;
    
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
  
  // Get actual expenses for selected month
  const monthKey = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;
  const actualExpenses = monthlyActuals[monthKey] || {};
  
  // Calculate variances
  const variances = useMemo(() => {
    const forecasted = getForecastedExpenses;
    const actual = actualExpenses;
    
    const calculateVariance = (forecast, actual) => {
      const variance = (actual || 0) - (forecast || 0);
      const variancePercent = forecast > 0 ? (variance / forecast) * 100 : 0;
      return { variance, variancePercent, isFavorable: variance <= 0 };
    };
    
    return {
      revenue: calculateVariance(forecasted.revenue, actual.revenue),
      foodSales: calculateVariance(forecasted.foodSales, actual.foodSales),
      beverageSales: calculateVariance(forecasted.beverageSales, actual.beverageSales),
      foodCogs: calculateVariance(forecasted.foodCogs, actual.foodCogs),
      beverageCogs: calculateVariance(forecasted.beverageCogs, actual.beverageCogs),
      totalCogs: calculateVariance(forecasted.totalCogs, actual.totalCogs),
      grossProfit: calculateVariance(forecasted.grossProfit, actual.grossProfit),
      rent: calculateVariance(forecasted.rent, actual.rent),
      utilities: calculateVariance(forecasted.utilities, actual.utilities),
      insurance: calculateVariance(forecasted.insurance, actual.insurance),
      marketing: calculateVariance(forecasted.marketing, actual.marketing),
      legalAccounting: calculateVariance(forecasted.legalAccounting, actual.legalAccounting),
      repairsMaintenance: calculateVariance(forecasted.repairsMaintenance, actual.repairsMaintenance),
      supplies: calculateVariance(forecasted.supplies, actual.supplies),
      adminOffice: calculateVariance(forecasted.adminOffice, actual.adminOffice),
      payroll: calculateVariance(forecasted.payroll, actual.payroll),
      totalOperatingExpenses: calculateVariance(forecasted.totalOperatingExpenses, actual.totalOperatingExpenses),
      totalExpenses: calculateVariance(forecasted.totalExpenses, actual.totalExpenses),
      netIncome: calculateVariance(forecasted.netIncome, actual.netIncome)
    };
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
  
  // Expense categories for input
  const expenseCategories = [
    { key: 'revenue', label: 'Total Revenue', section: 'revenue' },
    { key: 'foodSales', label: 'Food Sales', section: 'revenue' },
    { key: 'beverageSales', label: 'Beverage Sales', section: 'revenue' },
    { key: 'foodCogs', label: 'Food COGS', section: 'cogs' },
    { key: 'beverageCogs', label: 'Beverage COGS', section: 'cogs' },
    { key: 'totalCogs', label: 'Total COGS', section: 'cogs' },
    { key: 'grossProfit', label: 'Gross Profit', section: 'profit' },
    { key: 'rent', label: 'Rent', section: 'expenses' },
    { key: 'utilities', label: 'Utilities', section: 'expenses' },
    { key: 'insurance', label: 'Insurance', section: 'expenses' },
    { key: 'marketing', label: 'Marketing', section: 'expenses' },
    { key: 'legalAccounting', label: 'Legal & Accounting', section: 'expenses' },
    { key: 'repairsMaintenance', label: 'Repairs & Maintenance', section: 'expenses' },
    { key: 'supplies', label: 'Supplies', section: 'expenses' },
    { key: 'adminOffice', label: 'Admin & Office', section: 'expenses' },
    { key: 'payroll', label: 'Payroll', section: 'expenses' },
    { key: 'totalOperatingExpenses', label: 'Total Operating Expenses', section: 'expenses' },
    { key: 'totalExpenses', label: 'Total Expenses', section: 'expenses' },
    { key: 'netIncome', label: 'Net Income', section: 'profit' }
  ];
  
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
      </div>
      
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
      
      {/* Operating Expenses Section */}
      <SectionCard title="Operating Expenses" icon={AlertTriangle}>
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
              {expenseCategoriesList.map(category => {
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
    </div>
  );
};

export default MonthlyStatement;


