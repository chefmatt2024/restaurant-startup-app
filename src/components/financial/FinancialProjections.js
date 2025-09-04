import React, { useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import FormField from '../ui/FormField';
import SectionCard from '../ui/SectionCard';
import { Calculator, TrendingUp, DollarSign, AlertTriangle, BarChart3, Download, CheckCircle } from 'lucide-react';

const FinancialProjections = () => {
  const { state, actions } = useApp();
  const data = state.financialData;

  const handleFieldChange = (section, field, value) => {
    const numValue = value === '' ? 0 : parseFloat(value) || 0;
    actions.updateFinancialData(section, { [field]: numValue });
  };

  // Boston Restaurant Industry Benchmarks
  const bostonBenchmarks = {
    avgRentPerSqFt: 45, // $45/sq ft annually in Boston
    avgUtilitiesPerSqFt: 8, // $8/sq ft annually
    avgSeatPrice: 40, // Average check per person
    avgTurnovers: 2.5, // Table turnovers per day
    avgFoodCostPercent: 0.28, // 28% food costs
    avgLaborPercent: 0.32, // 32% labor costs
    avgRevPerSeat: 75000, // Annual revenue per seat
    avgStartupCostPerSeat: 1500, // Average startup cost per seat
  };

  // Calculate key metrics
  const calculations = useMemo(() => {
    const totalRevenue = data.revenue.foodSales + data.revenue.beverageSales + 
                        data.revenue.merchandiseSales + data.revenue.cateringSales + 
                        data.revenue.otherRevenue;

    const totalCogs = (data.revenue.foodSales * data.cogs.foodCogsPercent) +
                     (data.revenue.beverageSales * data.cogs.beverageCogsPercent) +
                     (data.revenue.merchandiseSales * data.cogs.merchandiseCogsPercent) +
                     (data.revenue.cateringSales * data.cogs.cateringCogsPercent) +
                     (data.revenue.otherRevenue * data.cogs.otherCogsPercent);

    const grossProfit = totalRevenue - totalCogs;
    const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

    const totalOpEx = data.operatingExpenses.rent + data.operatingExpenses.utilities +
                     data.operatingExpenses.insurance + data.operatingExpenses.marketing +
                     data.operatingExpenses.legalAccounting + data.operatingExpenses.repairsMaintenance +
                     data.operatingExpenses.supplies + data.operatingExpenses.adminOffice +
                     data.operatingExpenses.otherOperatingExpenses;

    const totalPayroll = (data.operatingExpenses.salaryOwners + data.operatingExpenses.salaryFullTime +
                         data.operatingExpenses.salaryPartTime) * (1 + data.operatingExpenses.payrollTaxRate);

    const totalExpenses = totalOpEx + totalPayroll;
    const netIncome = grossProfit - totalExpenses;
    const netMargin = totalRevenue > 0 ? (netIncome / totalRevenue) * 100 : 0;

    const totalStartupCosts = data.startupCosts.leaseholdImprovements + data.startupCosts.kitchenEquipment +
                             data.startupCosts.furnitureFixtures + data.startupCosts.initialInventory +
                             data.startupCosts.preOpeningSalaries + data.startupCosts.depositsLicenses +
                             data.startupCosts.initialMarketing + data.startupCosts.contingency;

    const totalFunding = data.fundingSources.ownersEquity + data.fundingSources.investorFunds +
                        data.fundingSources.bankLoans + data.fundingSources.otherFunding;

    const breakEvenRevenue = totalExpenses / (grossMargin / 100);

    const monthlyBurnRate = totalExpenses / 12;
    const runwayMonths = totalFunding > 0 ? totalFunding / monthlyBurnRate : 0;
    const monthsToBreakEven = totalFunding > 0 ? totalExpenses / (grossMargin / 100) / 12 : 0;

    return {
      totalRevenue,
      totalCogs,
      grossProfit,
      grossMargin,
      totalOpEx,
      totalPayroll,
      totalExpenses,
      netIncome,
      netMargin,
      totalStartupCosts,
      totalFunding,
      breakEvenRevenue,
      fundingGap: totalStartupCosts - totalFunding,
      monthlyBurnRate,
      runwayMonths,
      monthsToBreakEven,
    };
  }, [data]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getHealthStatus = (actual, benchmark, higher = false) => {
    const ratio = actual / benchmark;
    if (higher) {
      return ratio >= 1.1 ? 'excellent' : ratio >= 0.9 ? 'good' : 'needs-attention';
    } else {
      return ratio <= 0.9 ? 'excellent' : ratio <= 1.1 ? 'good' : 'needs-attention';
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header with Boston Context */}
      <SectionCard 
        title="Boston Restaurant Financial Projections" 
        description="Comprehensive financial modeling tailored for Boston's restaurant market with local benchmarks and regulations."
        color="blue"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-100 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Boston Market Context</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Avg rent: ${bostonBenchmarks.avgRentPerSqFt}/sq ft/year</li>
              <li>• Target food cost: {(bostonBenchmarks.avgFoodCostPercent * 100).toFixed(0)}%</li>
              <li>• Target labor: {(bostonBenchmarks.avgLaborPercent * 100).toFixed(0)}%</li>
            </ul>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-2">Revenue Targets</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Avg check: ${bostonBenchmarks.avgSeatPrice}</li>
              <li>• Table turns: {bostonBenchmarks.avgTurnovers}/day</li>
              <li>• Revenue/seat: ${(bostonBenchmarks.avgRevPerSeat / 1000).toFixed(0)}k/year</li>
            </ul>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2">Your Performance</h4>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• Gross margin: {calculations.grossMargin.toFixed(1)}%</li>
              <li>• Net margin: {calculations.netMargin.toFixed(1)}%</li>
              <li>• Break-even: {formatCurrency(calculations.breakEvenRevenue)}</li>
            </ul>
          </div>
        </div>
      </SectionCard>

      {/* Revenue Projections */}
      <SectionCard title="Revenue Projections (Year 1)" color="green">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Food Sales (Annual)"
            type="number"
            value={data.revenue.foodSales}
            onChange={(value) => handleFieldChange('revenue', 'foodSales', value)}
            placeholder="500000"
          />
          <FormField
            label="Beverage Sales (Annual)"
            type="number"
            value={data.revenue.beverageSales}
            onChange={(value) => handleFieldChange('revenue', 'beverageSales', value)}
            placeholder="150000"
          />
          <FormField
            label="Catering Sales (Annual)"
            type="number"
            value={data.revenue.cateringSales}
            onChange={(value) => handleFieldChange('revenue', 'cateringSales', value)}
            placeholder="25000"
          />
          <FormField
            label="Other Revenue (Annual)"
            type="number"
            value={data.revenue.otherRevenue}
            onChange={(value) => handleFieldChange('revenue', 'otherRevenue', value)}
            placeholder="10000"
          />
        </div>
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Total Annual Revenue:</span>
            <span className="text-2xl font-bold text-green-600">
              {formatCurrency(calculations.totalRevenue)}
            </span>
          </div>
        </div>
      </SectionCard>

      {/* Cost of Goods Sold */}
      <SectionCard title="Cost of Goods Sold (COGS)" color="orange">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Food COGS % (Boston avg: 28%)"
            type="number"
            value={data.cogs.foodCogsPercent}
            onChange={(value) => handleFieldChange('cogs', 'foodCogsPercent', value / 100)}
            placeholder="28"
            step="0.1"
          />
          <FormField
            label="Beverage COGS % (Target: 20-25%)"
            type="number"
            value={data.cogs.beverageCogsPercent * 100}
            onChange={(value) => handleFieldChange('cogs', 'beverageCogsPercent', value / 100)}
            placeholder="22"
            step="0.1"
          />
          <FormField
            label="Catering COGS % (Target: 30-35%)"
            type="number"
            value={data.cogs.cateringCogsPercent * 100}
            onChange={(value) => handleFieldChange('cogs', 'cateringCogsPercent', value / 100)}
            placeholder="32"
            step="0.1"
          />
          <FormField
            label="Other COGS % (Target: 10-15%)"
            type="number"
            value={data.cogs.otherCogsPercent * 100}
            onChange={(value) => handleFieldChange('cogs', 'otherCogsPercent', value / 100)}
            placeholder="12"
            step="0.1"
          />
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Total COGS:</span>
              <span className="text-xl font-bold text-orange-600">
                {formatCurrency(calculations.totalCogs)}
              </span>
            </div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Gross Profit:</span>
              <span className="text-xl font-bold text-green-600">
                {formatCurrency(calculations.grossProfit)}
              </span>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Operating Expenses */}
      <SectionCard title="Boston Operating Expenses (Annual)" color="red">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Rent (Boston avg: $45/sq ft)"
            type="number"
            value={data.operatingExpenses.rent}
            onChange={(value) => handleFieldChange('operatingExpenses', 'rent', value)}
            placeholder="120000"
          />
          <FormField
            label="Utilities (Boston avg: $8/sq ft)"
            type="number"
            value={data.operatingExpenses.utilities}
            onChange={(value) => handleFieldChange('operatingExpenses', 'utilities', value)}
            placeholder="18000"
          />
          <FormField
            label="Insurance (Required in MA)"
            type="number"
            value={data.operatingExpenses.insurance}
            onChange={(value) => handleFieldChange('operatingExpenses', 'insurance', value)}
            placeholder="15000"
          />
          <FormField
            label="Marketing & Advertising"
            type="number"
            value={data.operatingExpenses.marketing}
            onChange={(value) => handleFieldChange('operatingExpenses', 'marketing', value)}
            placeholder="25000"
          />
          <FormField
            label="Legal & Accounting"
            type="number"
            value={data.operatingExpenses.legalAccounting}
            onChange={(value) => handleFieldChange('operatingExpenses', 'legalAccounting', value)}
            placeholder="8000"
          />
          <FormField
            label="Repairs & Maintenance"
            type="number"
            value={data.operatingExpenses.repairsMaintenance}
            onChange={(value) => handleFieldChange('operatingExpenses', 'repairsMaintenance', value)}
            placeholder="12000"
          />
        </div>

        <h3 className="text-lg font-semibold mt-8 mb-4">Boston Payroll (MA min wage: $15/hr)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Owner/Manager Salary"
            type="number"
            value={data.operatingExpenses.salaryOwners}
            onChange={(value) => handleFieldChange('operatingExpenses', 'salaryOwners', value)}
            placeholder="75000"
          />
          <FormField
            label="Full-Time Staff (Annual)"
            type="number"
            value={data.operatingExpenses.salaryFullTime}
            onChange={(value) => handleFieldChange('operatingExpenses', 'salaryFullTime', value)}
            placeholder="180000"
          />
          <FormField
            label="Part-Time Staff (Annual)"
            type="number"
            value={data.operatingExpenses.salaryPartTime}
            onChange={(value) => handleFieldChange('operatingExpenses', 'salaryPartTime', value)}
            placeholder="120000"
          />
          <FormField
            label="Payroll Tax Rate (MA: ~12%)"
            type="number"
            value={data.operatingExpenses.payrollTaxRate * 100}
            onChange={(value) => handleFieldChange('operatingExpenses', 'payrollTaxRate', value / 100)}
            placeholder="12"
            step="0.1"
          />
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-red-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Operating Expenses:</span>
              <span className="text-lg font-bold text-red-600">
                {formatCurrency(calculations.totalOpEx)}
              </span>
            </div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Total Payroll:</span>
              <span className="text-lg font-bold text-purple-600">
                {formatCurrency(calculations.totalPayroll)}
              </span>
            </div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Net Income:</span>
              <span className={`text-lg font-bold ${calculations.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(calculations.netIncome)}
              </span>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Boston Startup Costs */}
      <SectionCard title="Boston Restaurant Startup Costs" color="purple">
        <div className="mb-4 p-4 bg-purple-50 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-2">Boston-Specific Requirements:</h4>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• Boston business license & food service permit</li>
            <li>• MA alcoholic beverage license (if applicable)</li>
            <li>• Fire department approval & sprinkler system</li>
            <li>• Board of Health inspection & certification</li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Leasehold Improvements"
            type="number"
            value={data.startupCosts.leaseholdImprovements}
            onChange={(value) => handleFieldChange('startupCosts', 'leaseholdImprovements', value)}
            placeholder="200000"
          />
          <FormField
            label="Kitchen Equipment"
            type="number"
            value={data.startupCosts.kitchenEquipment}
            onChange={(value) => handleFieldChange('startupCosts', 'kitchenEquipment', value)}
            placeholder="125000"
          />
          <FormField
            label="Furniture & Fixtures"
            type="number"
            value={data.startupCosts.furnitureFixtures}
            onChange={(value) => handleFieldChange('startupCosts', 'furnitureFixtures', value)}
            placeholder="40000"
          />
          <FormField
            label="Initial Inventory"
            type="number"
            value={data.startupCosts.initialInventory}
            onChange={(value) => handleFieldChange('startupCosts', 'initialInventory', value)}
            placeholder="15000"
          />
          <FormField
            label="Boston Permits & Licenses"
            type="number"
            value={data.startupCosts.depositsLicenses}
            onChange={(value) => handleFieldChange('startupCosts', 'depositsLicenses', value)}
            placeholder="25000"
          />
          <FormField
            label="Pre-Opening Marketing"
            type="number"
            value={data.startupCosts.initialMarketing}
            onChange={(value) => handleFieldChange('startupCosts', 'initialMarketing', value)}
            placeholder="15000"
          />
        </div>

        <div className="mt-6 p-4 bg-purple-100 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Total Startup Investment:</span>
            <span className="text-2xl font-bold text-purple-600">
              {formatCurrency(calculations.totalStartupCosts)}
            </span>
          </div>
        </div>
      </SectionCard>

      {/* Financial Health Dashboard */}
      <SectionCard title="Financial Health Dashboard" color="gray">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`p-4 rounded-lg ${calculations.grossMargin >= 65 ? 'bg-green-100' : calculations.grossMargin >= 60 ? 'bg-yellow-100' : 'bg-red-100'}`}>
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="font-semibold">Gross Margin</span>
            </div>
            <div className="text-2xl font-bold">{calculations.grossMargin.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Target: 65%+</div>
          </div>

          <div className={`p-4 rounded-lg ${calculations.netMargin >= 10 ? 'bg-green-100' : calculations.netMargin >= 5 ? 'bg-yellow-100' : 'bg-red-100'}`}>
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="w-5 h-5" />
              <span className="font-semibold">Net Margin</span>
            </div>
            <div className="text-2xl font-bold">{calculations.netMargin.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Target: 10%+</div>
          </div>

          <div className={`p-4 rounded-lg ${calculations.fundingGap <= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
            <div className="flex items-center space-x-2 mb-2">
              <Calculator className="w-5 h-5" />
              <span className="font-semibold">Funding Gap</span>
            </div>
            <div className="text-2xl font-bold">{formatCurrency(Math.abs(calculations.fundingGap))}</div>
            <div className="text-sm text-gray-600">
              {calculations.fundingGap <= 0 ? 'Fully Funded' : 'Additional Needed'}
            </div>
          </div>

          <div className="p-4 bg-blue-100 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-semibold">Break-Even</span>
            </div>
            <div className="text-2xl font-bold">{formatCurrency(calculations.breakEvenRevenue)}</div>
            <div className="text-sm text-gray-600">Monthly Revenue Needed</div>
          </div>
        </div>
      </SectionCard>

      {/* Financial Insights & Export */}
      <SectionCard title="Financial Insights & Export" color="emerald">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Financial Insights */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-emerald-600" />
              Key Financial Insights
            </h3>
            
            <div className="space-y-4">
              {/* Profitability Analysis */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Profitability Analysis</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gross Profit:</span>
                    <span className="font-medium">{formatCurrency(calculations.grossProfit)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Net Income:</span>
                    <span className={`font-medium ${calculations.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(calculations.netIncome)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Break-even Revenue:</span>
                    <span className="font-medium">{formatCurrency(calculations.breakEvenRevenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revenue vs Break-even:</span>
                    <span className={`font-medium ${calculations.totalRevenue >= calculations.breakEvenRevenue ? 'text-green-600' : 'text-red-600'}`}>
                      {calculations.totalRevenue >= calculations.breakEvenRevenue ? 'Above' : 'Below'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cash Flow Analysis */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Cash Flow Analysis</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Burn Rate:</span>
                    <span className="font-medium">{formatCurrency(calculations.monthlyBurnRate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cash Runway:</span>
                    <span className="font-medium">{calculations.runwayMonths.toFixed(1)} months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time to Break-even:</span>
                    <span className="font-medium">{Math.ceil(calculations.monthsToBreakEven)} months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Funding Status:</span>
                    <span className={`font-medium ${calculations.fundingGap <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {calculations.fundingGap <= 0 ? 'Fully Funded' : 'Funding Gap'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Boston Market Comparison */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Boston Market Comparison</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Food Cost %:</span>
                    <span className={`font-medium ${getHealthStatus(data.cogs.foodCogsPercent, bostonBenchmarks.avgFoodCostPercent, false) === 'excellent' ? 'text-green-600' : 'text-red-600'}`}>
                      {(data.cogs.foodCogsPercent * 100).toFixed(1)}% vs {bostonBenchmarks.avgFoodCostPercent * 100}% avg
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Labor Cost %:</span>
                    <span className={`font-medium ${getHealthStatus((data.operatingExpenses.salaryFullTime + data.operatingExpenses.salaryPartTime) / calculations.totalRevenue, bostonBenchmarks.avgLaborPercent, false) === 'excellent' ? 'text-green-600' : 'text-red-600'}`}>
                      {((data.operatingExpenses.salaryFullTime + data.operatingExpenses.salaryPartTime) / calculations.totalRevenue * 100).toFixed(1)}% vs {bostonBenchmarks.avgLaborPercent * 100}% avg
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Startup Cost per Seat:</span>
                    <span className="font-medium">
                      {formatCurrency(calculations.totalStartupCosts / (data.restaurantDetails?.seats || 50))} vs {formatCurrency(bostonBenchmarks.avgStartupCostPerSeat)} avg
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Export & Actions */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Download className="h-5 w-5 mr-2 text-emerald-600" />
              Export & Financial Reports
            </h3>
            
            <div className="space-y-4">
              {/* Export Options */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Export Financial Data</h4>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      const csvContent = [
                        ['Category', 'Value', 'Notes'],
                        ['Total Revenue', formatCurrency(calculations.totalRevenue), 'Annual projected revenue'],
                        ['Gross Profit', formatCurrency(calculations.grossProfit), `Gross margin: ${calculations.grossMargin.toFixed(1)}%`],
                        ['Net Income', formatCurrency(calculations.netIncome), `Net margin: ${calculations.netMargin.toFixed(1)}%`],
                        ['Total Startup Costs', formatCurrency(calculations.totalStartupCosts), 'One-time startup investment'],
                        ['Total Funding', formatCurrency(calculations.totalFunding), 'Available capital'],
                        ['Funding Gap', formatCurrency(calculations.fundingGap), calculations.fundingGap > 0 ? 'Additional funding needed' : 'Fully funded'],
                        ['Break-even Revenue', formatCurrency(calculations.breakEvenRevenue), 'Monthly revenue needed to break even'],
                        ['Monthly Burn Rate', formatCurrency(calculations.monthlyBurnRate), 'Monthly cash outflow'],
                        ['Cash Runway', `${calculations.runwayMonths.toFixed(1)} months`, 'How long funding will last'],
                        ['Time to Break-even', `${Math.ceil(calculations.monthsToBreakEven)} months`, 'When restaurant becomes profitable']
                      ].map(row => row.join(',')).join('\n');

                      const blob = new Blob([csvContent], { type: 'text/csv' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'restaurant-financial-summary.csv';
                      a.click();
                      window.URL.revokeObjectURL(url);
                    }}
                    className="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Financial Summary (CSV)
                  </button>
                  
                  <button
                    onClick={() => {
                      const report = `
RESTAURANT FINANCIAL PROJECTION REPORT
Generated: ${new Date().toLocaleDateString()}

FINANCIAL OVERVIEW
==================
Total Annual Revenue: ${formatCurrency(calculations.totalRevenue)}
Gross Profit: ${formatCurrency(calculations.grossProfit)} (${calculations.grossMargin.toFixed(1)}%)
Net Income: ${formatCurrency(calculations.netIncome)} (${calculations.netMargin.toFixed(1)}%)

STARTUP COSTS
=============
Total Startup Investment: ${formatCurrency(calculations.totalStartupCosts)}
Funding Available: ${formatCurrency(calculations.totalFunding)}
Funding Gap: ${formatCurrency(calculations.fundingGap)}

CASH FLOW ANALYSIS
==================
Monthly Burn Rate: ${formatCurrency(calculations.monthlyBurnRate)}
Cash Runway: ${calculations.runwayMonths.toFixed(1)} months
Break-even Revenue: ${formatCurrency(calculations.breakEvenRevenue)}
Time to Break-even: ${Math.ceil(calculations.monthsToBreakEven)} months

BOSTON MARKET BENCHMARKS
========================
Target Food Cost: ${(bostonBenchmarks.avgFoodCostPercent * 100).toFixed(0)}%
Target Labor Cost: ${(bostonBenchmarks.avgLaborPercent * 100).toFixed(0)}%
Average Startup Cost per Seat: ${formatCurrency(bostonBenchmarks.avgStartupCostPerSeat)}

RECOMMENDATIONS
===============
${calculations.fundingGap > 0 ? `• Secure additional funding of ${formatCurrency(calculations.fundingGap)}` : '• Funding requirements met'}
• Target monthly revenue: ${formatCurrency(calculations.totalRevenue / 12)}
• Monitor cash flow closely during first ${Math.ceil(calculations.monthsToBreakEven)} months
• Maintain food costs below ${(bostonBenchmarks.avgFoodCostPercent * 100).toFixed(0)}%
• Keep labor costs under ${(bostonBenchmarks.avgLaborPercent * 100).toFixed(0)}% of revenue
                      `;

                      const blob = new Blob([report], { type: 'text/plain' });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'restaurant-financial-report.txt';
                      a.click();
                      window.URL.revokeObjectURL(url);
                    }}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Detailed Report (TXT)
                  </button>
                </div>
              </div>

              {/* Financial Health Score */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Financial Health Score</h4>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600 mb-2">
                    {(() => {
                      let score = 100;
                      if (calculations.fundingGap > 0) score -= 20;
                      if (calculations.grossMargin < 60) score -= 15;
                      if (calculations.netMargin < 5) score -= 15;
                      if (calculations.runwayMonths < 6) score -= 20;
                      if (data.cogs.foodCogsPercent > 0.35) score -= 10;
                      return Math.max(0, score);
                    })()}/100
                  </div>
                  <div className="text-sm text-gray-600">
                    {(() => {
                      const score = (() => {
                        let s = 100;
                        if (calculations.fundingGap > 0) s -= 20;
                        if (calculations.grossMargin < 60) s -= 15;
                        if (calculations.netMargin < 5) s -= 15;
                        if (calculations.runwayMonths < 6) s -= 20;
                        if (data.cogs.foodCogsPercent > 0.35) s -= 10;
                        return Math.max(0, s);
                      })();
                      
                      if (score >= 80) return 'Excellent - Strong financial foundation';
                      if (score >= 60) return 'Good - Some areas need attention';
                      if (score >= 40) return 'Fair - Several improvements needed';
                      return 'Needs Work - Significant financial challenges';
                    })()}
                  </div>
                </div>
              </div>

              {/* Action Items */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Recommended Actions</h4>
                <div className="space-y-2 text-sm">
                  {calculations.fundingGap > 0 && (
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-yellow-700">Secure additional funding of {formatCurrency(calculations.fundingGap)}</span>
                    </div>
                  )}
                  {calculations.grossMargin < 60 && (
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-yellow-700">Improve gross margin - target 60%+</span>
                    </div>
                  )}
                  {calculations.runwayMonths < 6 && (
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-red-700">Increase cash runway - target 6+ months</span>
                    </div>
                  )}
                  {data.cogs.foodCogsPercent > 0.35 && (
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-yellow-700">Reduce food costs - target 28-32%</span>
                    </div>
                  )}
                  {calculations.netMargin < 5 && (
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-yellow-700">Improve net margin - target 5%+</span>
                    </div>
                  )}
                  {calculations.fundingGap <= 0 && calculations.grossMargin >= 60 && calculations.runwayMonths >= 6 && (
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-green-700">Strong financial foundation - ready to proceed</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

export default FinancialProjections; 