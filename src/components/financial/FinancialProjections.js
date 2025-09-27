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

  // Calculate daily sales projections
  const dailySalesProjections = useMemo(() => {
    const ops = data.restaurantOperations;
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    const dailyProjections = days.map(day => {
      const hours = ops.hoursOfOperation[day];
      if (hours.closed) return { day, totalRevenue: 0, covers: 0, foodSales: 0, beverageSales: 0 };
      
      // Parse hours
      const openTime = new Date(`2000-01-01 ${hours.open}`);
      const closeTime = new Date(`2000-01-01 ${hours.close}`);
      const totalHours = (closeTime - openTime) / (1000 * 60 * 60);
      
      // Determine meal periods
      const lunchHours = Math.min(totalHours, 4); // 11-3pm typically
      const dinnerHours = Math.max(0, totalHours - 4); // 3pm onwards
      const brunchHours = day === 'saturday' || day === 'sunday' ? 2 : 0; // Weekend brunch
      
      // Calculate covers per meal period
      const lunchCovers = Math.floor((ops.seats * ops.occupancyRate.lunch * ops.tableTurnover.lunch * lunchHours) / 2);
      const dinnerCovers = Math.floor((ops.seats * ops.occupancyRate.dinner * ops.tableTurnover.dinner * dinnerHours) / 2);
      const brunchCovers = Math.floor((ops.seats * ops.occupancyRate.brunch * ops.tableTurnover.brunch * brunchHours) / 2);
      
      const totalCovers = lunchCovers + dinnerCovers + brunchCovers;
      
      // Calculate revenue by meal period
      const lunchRevenue = lunchCovers * ops.averageCheck.lunch;
      const dinnerRevenue = dinnerCovers * ops.averageCheck.dinner;
      const brunchRevenue = brunchCovers * ops.averageCheck.brunch;
      const beverageRevenue = totalCovers * ops.averageCheck.beverages * 0.7; // 70% order beverages
      
      const totalRevenue = lunchRevenue + dinnerRevenue + brunchRevenue + beverageRevenue;
      const foodSales = lunchRevenue + dinnerRevenue + brunchRevenue;
      const beverageSales = beverageRevenue;
      
      return {
        day,
        totalRevenue,
        covers: totalCovers,
        foodSales,
        beverageSales,
        lunchCovers,
        dinnerCovers,
        brunchCovers,
        lunchRevenue,
        dinnerRevenue,
        brunchRevenue,
        beverageRevenue
      };
    });
    
    const weeklyTotal = dailyProjections.reduce((sum, day) => sum + day.totalRevenue, 0);
    const weeklyCovers = dailyProjections.reduce((sum, day) => sum + day.covers, 0);
    
    return {
      daily: dailyProjections,
      weekly: {
        totalRevenue: weeklyTotal,
        covers: weeklyCovers,
        foodSales: dailyProjections.reduce((sum, day) => sum + day.foodSales, 0),
        beverageSales: dailyProjections.reduce((sum, day) => sum + day.beverageSales, 0)
      },
      annual: {
        totalRevenue: weeklyTotal * 52,
        covers: weeklyCovers * 52,
        foodSales: dailyProjections.reduce((sum, day) => sum + day.foodSales, 0) * 52,
        beverageSales: dailyProjections.reduce((sum, day) => sum + day.beverageSales, 0) * 52
      }
    };
  }, [data.restaurantOperations]);

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
                     data.operatingExpenses.otherOperatingExpenses +
                     // Detailed operational expenses
                     data.operatingExpenses.linenService + data.operatingExpenses.trashCollection +
                     data.operatingExpenses.compostService + data.operatingExpenses.cleaningService +
                     data.operatingExpenses.hoodCleaning + data.operatingExpenses.greaseTrapCleaning +
                     data.operatingExpenses.internetPhone + data.operatingExpenses.securitySystem +
                     data.operatingExpenses.pestControl + data.operatingExpenses.wasteManagement +
                     data.operatingExpenses.equipmentMaintenance + data.operatingExpenses.uniformService +
                     data.operatingExpenses.dishwareReplacement + data.operatingExpenses.cleaningSupplies +
                     data.operatingExpenses.paperGoods + data.operatingExpenses.kitchenSupplies +
                     data.operatingExpenses.pointOfSale + data.operatingExpenses.creditCardProcessing +
                     data.operatingExpenses.bankFees + data.operatingExpenses.permitsLicenses +
                     data.operatingExpenses.musicLicensing + data.operatingExpenses.deliveryServiceFees +
                     data.operatingExpenses.trainingCertification + data.operatingExpenses.employeeBenefits +
                     data.operatingExpenses.workersCompensation + data.operatingExpenses.unemploymentInsurance +
                     data.operatingExpenses.healthInsurance + data.operatingExpenses.retirementBenefits +
                     data.operatingExpenses.uniformLaundry + data.operatingExpenses.parkingFees +
                     data.operatingExpenses.storageFees + data.operatingExpenses.professionalServices +
                     data.operatingExpenses.technologySupport + data.operatingExpenses.softwareSubscriptions +
                     data.operatingExpenses.inventoryManagement + data.operatingExpenses.qualityControl +
                     data.operatingExpenses.safetyTraining + data.operatingExpenses.equipmentRental +
                     data.operatingExpenses.temporaryStaffing + data.operatingExpenses.consulting +
                     data.operatingExpenses.travelEntertainment + data.operatingExpenses.charitableDonations +
                     data.operatingExpenses.localTaxes + data.operatingExpenses.propertyTaxes +
                     data.operatingExpenses.businessTaxes;

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

      {/* Restaurant Operations Configuration */}
      <SectionCard title="Restaurant Operations Configuration" color="purple">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Operations */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Basic Operations</h3>
            <div className="space-y-4">
              <FormField
                label="Total Seats"
                type="number"
                value={data.restaurantOperations.seats}
                onChange={(value) => handleFieldChange('restaurantOperations', 'seats', parseInt(value))}
                placeholder="50"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hours of Operation</label>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(data.restaurantOperations.hoursOfOperation).map(([day, hours]) => (
                    <div key={day} className="flex items-center space-x-2">
                      <div className="w-20 text-sm font-medium capitalize">{day}:</div>
                      <div className="flex items-center space-x-1">
                        <input
                          type="checkbox"
                          checked={!hours.closed}
                          onChange={(e) => handleFieldChange('restaurantOperations', `hoursOfOperation.${day}.closed`, !e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-xs text-gray-500">Open</span>
                      </div>
                      {!hours.closed && (
                        <>
                          <input
                            type="time"
                            value={hours.open}
                            onChange={(e) => handleFieldChange('restaurantOperations', `hoursOfOperation.${day}.open`, e.target.value)}
                            className="text-sm border border-gray-300 rounded px-2 py-1"
                          />
                          <span className="text-gray-500">to</span>
                          <input
                            type="time"
                            value={hours.close}
                            onChange={(e) => handleFieldChange('restaurantOperations', `hoursOfOperation.${day}.close`, e.target.value)}
                            className="text-sm border border-gray-300 rounded px-2 py-1"
                          />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Performance */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Pricing & Performance</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Average Check by Meal Period</label>
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    label="Lunch"
                    type="number"
                    value={data.restaurantOperations.averageCheck.lunch}
                    onChange={(value) => handleFieldChange('restaurantOperations', 'averageCheck.lunch', parseFloat(value))}
                    placeholder="18"
                  />
                  <FormField
                    label="Dinner"
                    type="number"
                    value={data.restaurantOperations.averageCheck.dinner}
                    onChange={(value) => handleFieldChange('restaurantOperations', 'averageCheck.dinner', parseFloat(value))}
                    placeholder="32"
                  />
                  <FormField
                    label="Brunch"
                    type="number"
                    value={data.restaurantOperations.averageCheck.brunch}
                    onChange={(value) => handleFieldChange('restaurantOperations', 'averageCheck.brunch', parseFloat(value))}
                    placeholder="24"
                  />
                  <FormField
                    label="Beverages"
                    type="number"
                    value={data.restaurantOperations.averageCheck.beverages}
                    onChange={(value) => handleFieldChange('restaurantOperations', 'averageCheck.beverages', parseFloat(value))}
                    placeholder="8"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Table Turnover (per meal period)</label>
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    label="Lunch"
                    type="number"
                    step="0.1"
                    value={data.restaurantOperations.tableTurnover.lunch}
                    onChange={(value) => handleFieldChange('restaurantOperations', 'tableTurnover.lunch', parseFloat(value))}
                    placeholder="1.5"
                  />
                  <FormField
                    label="Dinner"
                    type="number"
                    step="0.1"
                    value={data.restaurantOperations.tableTurnover.dinner}
                    onChange={(value) => handleFieldChange('restaurantOperations', 'tableTurnover.dinner', parseFloat(value))}
                    placeholder="2.0"
                  />
                  <FormField
                    label="Brunch"
                    type="number"
                    step="0.1"
                    value={data.restaurantOperations.tableTurnover.brunch}
                    onChange={(value) => handleFieldChange('restaurantOperations', 'tableTurnover.brunch', parseFloat(value))}
                    placeholder="2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Occupancy Rate (0-1)</label>
                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    label="Lunch"
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={data.restaurantOperations.occupancyRate.lunch}
                    onChange={(value) => handleFieldChange('restaurantOperations', 'occupancyRate.lunch', parseFloat(value))}
                    placeholder="0.7"
                  />
                  <FormField
                    label="Dinner"
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={data.restaurantOperations.occupancyRate.dinner}
                    onChange={(value) => handleFieldChange('restaurantOperations', 'occupancyRate.dinner', parseFloat(value))}
                    placeholder="0.9"
                  />
                  <FormField
                    label="Brunch"
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={data.restaurantOperations.occupancyRate.brunch}
                    onChange={(value) => handleFieldChange('restaurantOperations', 'occupancyRate.brunch', parseFloat(value))}
                    placeholder="0.8"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Daily Sales Projections */}
      <SectionCard title="Daily Sales Projections" color="green">
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Weekly Revenue:</span>
                <span className="text-lg font-bold text-green-600">
                  {formatCurrency(dailySalesProjections.weekly.totalRevenue)}
                </span>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Weekly Covers:</span>
                <span className="text-lg font-bold text-blue-600">
                  {dailySalesProjections.weekly.covers.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Annual Revenue:</span>
                <span className="text-lg font-bold text-purple-600">
                  {formatCurrency(dailySalesProjections.annual.totalRevenue)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Breakdown Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Revenue</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Covers</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Food Sales</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Beverage Sales</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Check</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dailySalesProjections.daily.map((day) => (
                <tr key={day.day} className={day.totalRevenue === 0 ? 'bg-gray-50' : 'hover:bg-gray-50'}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 capitalize">{day.day}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {day.totalRevenue === 0 ? 'Closed' : formatCurrency(day.totalRevenue)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">{day.covers}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {day.foodSales === 0 ? '-' : formatCurrency(day.foodSales)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {day.beverageSales === 0 ? '-' : formatCurrency(day.beverageSales)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {day.covers === 0 ? '-' : formatCurrency(day.totalRevenue / day.covers)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Meal Period Breakdown */}
        <div className="mt-6">
          <h4 className="text-md font-semibold mb-3 text-gray-700">Meal Period Breakdown</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-orange-50 p-4 rounded-lg">
              <h5 className="font-semibold text-orange-800 mb-2">Lunch</h5>
              <div className="text-sm text-orange-700 space-y-1">
                <div>Weekly Covers: {dailySalesProjections.daily.reduce((sum, day) => sum + day.lunchCovers, 0)}</div>
                <div>Weekly Revenue: {formatCurrency(dailySalesProjections.daily.reduce((sum, day) => sum + day.lunchRevenue, 0))}</div>
              </div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h5 className="font-semibold text-red-800 mb-2">Dinner</h5>
              <div className="text-sm text-red-700 space-y-1">
                <div>Weekly Covers: {dailySalesProjections.daily.reduce((sum, day) => sum + day.dinnerCovers, 0)}</div>
                <div>Weekly Revenue: {formatCurrency(dailySalesProjections.daily.reduce((sum, day) => sum + day.dinnerRevenue, 0))}</div>
              </div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h5 className="font-semibold text-yellow-800 mb-2">Brunch</h5>
              <div className="text-sm text-yellow-700 space-y-1">
                <div>Weekly Covers: {dailySalesProjections.daily.reduce((sum, day) => sum + day.brunchCovers, 0)}</div>
                <div>Weekly Revenue: {formatCurrency(dailySalesProjections.daily.reduce((sum, day) => sum + day.brunchRevenue, 0))}</div>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-semibold text-blue-800 mb-2">Beverages</h5>
              <div className="text-sm text-blue-700 space-y-1">
                <div>Weekly Revenue: {formatCurrency(dailySalesProjections.daily.reduce((sum, day) => sum + day.beverageRevenue, 0))}</div>
                <div>Avg per Cover: {formatCurrency(dailySalesProjections.daily.reduce((sum, day) => sum + day.beverageRevenue, 0) / dailySalesProjections.weekly.covers)}</div>
              </div>
            </div>
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

        {/* Detailed Operational Expenses */}
        <h3 className="text-lg font-semibold mt-8 mb-4">Detailed Operational Expenses</h3>
        
        {/* Cleaning & Maintenance Services */}
        <div className="mb-6">
          <h4 className="text-md font-semibold mb-3 text-gray-700">Cleaning & Maintenance Services</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              label="Linen Service (Tablecloths, Napkins)"
              type="number"
              value={data.operatingExpenses.linenService}
              onChange={(value) => handleFieldChange('operatingExpenses', 'linenService', value)}
              placeholder="3600"
            />
            <FormField
              label="Trash Collection"
              type="number"
              value={data.operatingExpenses.trashCollection}
              onChange={(value) => handleFieldChange('operatingExpenses', 'trashCollection', value)}
              placeholder="2400"
            />
            <FormField
              label="Compost Service"
              type="number"
              value={data.operatingExpenses.compostService}
              onChange={(value) => handleFieldChange('operatingExpenses', 'compostService', value)}
              placeholder="1800"
            />
            <FormField
              label="Professional Cleaning Service"
              type="number"
              value={data.operatingExpenses.cleaningService}
              onChange={(value) => handleFieldChange('operatingExpenses', 'cleaningService', value)}
              placeholder="12000"
            />
            <FormField
              label="Hood Cleaning (Monthly)"
              type="number"
              value={data.operatingExpenses.hoodCleaning}
              onChange={(value) => handleFieldChange('operatingExpenses', 'hoodCleaning', value)}
              placeholder="2400"
            />
            <FormField
              label="Grease Trap Cleaning"
              type="number"
              value={data.operatingExpenses.greaseTrapCleaning}
              onChange={(value) => handleFieldChange('operatingExpenses', 'greaseTrapCleaning', value)}
              placeholder="1200"
            />
          </div>
        </div>

        {/* Technology & Communications */}
        <div className="mb-6">
          <h4 className="text-md font-semibold mb-3 text-gray-700">Technology & Communications</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              label="Internet & Phone"
              type="number"
              value={data.operatingExpenses.internetPhone}
              onChange={(value) => handleFieldChange('operatingExpenses', 'internetPhone', value)}
              placeholder="3600"
            />
            <FormField
              label="Security System"
              type="number"
              value={data.operatingExpenses.securitySystem}
              onChange={(value) => handleFieldChange('operatingExpenses', 'securitySystem', value)}
              placeholder="2400"
            />
            <FormField
              label="Point of Sale System"
              type="number"
              value={data.operatingExpenses.pointOfSale}
              onChange={(value) => handleFieldChange('operatingExpenses', 'pointOfSale', value)}
              placeholder="4800"
            />
            <FormField
              label="Credit Card Processing Fees"
              type="number"
              value={data.operatingExpenses.creditCardProcessing}
              onChange={(value) => handleFieldChange('operatingExpenses', 'creditCardProcessing', value)}
              placeholder="15000"
            />
            <FormField
              label="Software Subscriptions"
              type="number"
              value={data.operatingExpenses.softwareSubscriptions}
              onChange={(value) => handleFieldChange('operatingExpenses', 'softwareSubscriptions', value)}
              placeholder="2400"
            />
            <FormField
              label="Technology Support"
              type="number"
              value={data.operatingExpenses.technologySupport}
              onChange={(value) => handleFieldChange('operatingExpenses', 'technologySupport', value)}
              placeholder="1800"
            />
          </div>
        </div>

        {/* Supplies & Equipment */}
        <div className="mb-6">
          <h4 className="text-md font-semibold mb-3 text-gray-700">Supplies & Equipment</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              label="Cleaning Supplies"
              type="number"
              value={data.operatingExpenses.cleaningSupplies}
              onChange={(value) => handleFieldChange('operatingExpenses', 'cleaningSupplies', value)}
              placeholder="4800"
            />
            <FormField
              label="Paper Goods (Napkins, Toilet Paper)"
              type="number"
              value={data.operatingExpenses.paperGoods}
              onChange={(value) => handleFieldChange('operatingExpenses', 'paperGoods', value)}
              placeholder="3600"
            />
            <FormField
              label="Kitchen Supplies"
              type="number"
              value={data.operatingExpenses.kitchenSupplies}
              onChange={(value) => handleFieldChange('operatingExpenses', 'kitchenSupplies', value)}
              placeholder="6000"
            />
            <FormField
              label="Dishware Replacement"
              type="number"
              value={data.operatingExpenses.dishwareReplacement}
              onChange={(value) => handleFieldChange('operatingExpenses', 'dishwareReplacement', value)}
              placeholder="3000"
            />
            <FormField
              label="Equipment Maintenance"
              type="number"
              value={data.operatingExpenses.equipmentMaintenance}
              onChange={(value) => handleFieldChange('operatingExpenses', 'equipmentMaintenance', value)}
              placeholder="6000"
            />
            <FormField
              label="Equipment Rental"
              type="number"
              value={data.operatingExpenses.equipmentRental}
              onChange={(value) => handleFieldChange('operatingExpenses', 'equipmentRental', value)}
              placeholder="0"
            />
          </div>
        </div>

        {/* Employee Services */}
        <div className="mb-6">
          <h4 className="text-md font-semibold mb-3 text-gray-700">Employee Services & Benefits</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              label="Uniform Service"
              type="number"
              value={data.operatingExpenses.uniformService}
              onChange={(value) => handleFieldChange('operatingExpenses', 'uniformService', value)}
              placeholder="2400"
            />
            <FormField
              label="Uniform Laundry"
              type="number"
              value={data.operatingExpenses.uniformLaundry}
              onChange={(value) => handleFieldChange('operatingExpenses', 'uniformLaundry', value)}
              placeholder="1800"
            />
            <FormField
              label="Employee Benefits"
              type="number"
              value={data.operatingExpenses.employeeBenefits}
              onChange={(value) => handleFieldChange('operatingExpenses', 'employeeBenefits', value)}
              placeholder="15000"
            />
            <FormField
              label="Workers Compensation"
              type="number"
              value={data.operatingExpenses.workersCompensation}
              onChange={(value) => handleFieldChange('operatingExpenses', 'workersCompensation', value)}
              placeholder="8000"
            />
            <FormField
              label="Unemployment Insurance"
              type="number"
              value={data.operatingExpenses.unemploymentInsurance}
              onChange={(value) => handleFieldChange('operatingExpenses', 'unemploymentInsurance', value)}
              placeholder="4000"
            />
            <FormField
              label="Health Insurance"
              type="number"
              value={data.operatingExpenses.healthInsurance}
              onChange={(value) => handleFieldChange('operatingExpenses', 'healthInsurance', value)}
              placeholder="24000"
            />
            <FormField
              label="Retirement Benefits"
              type="number"
              value={data.operatingExpenses.retirementBenefits}
              onChange={(value) => handleFieldChange('operatingExpenses', 'retirementBenefits', value)}
              placeholder="12000"
            />
            <FormField
              label="Training & Certification"
              type="number"
              value={data.operatingExpenses.trainingCertification}
              onChange={(value) => handleFieldChange('operatingExpenses', 'trainingCertification', value)}
              placeholder="3000"
            />
            <FormField
              label="Temporary Staffing"
              type="number"
              value={data.operatingExpenses.temporaryStaffing}
              onChange={(value) => handleFieldChange('operatingExpenses', 'temporaryStaffing', value)}
              placeholder="0"
            />
          </div>
        </div>

        {/* Business Operations */}
        <div className="mb-6">
          <h4 className="text-md font-semibold mb-3 text-gray-700">Business Operations</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              label="Pest Control"
              type="number"
              value={data.operatingExpenses.pestControl}
              onChange={(value) => handleFieldChange('operatingExpenses', 'pestControl', value)}
              placeholder="1800"
            />
            <FormField
              label="Waste Management"
              type="number"
              value={data.operatingExpenses.wasteManagement}
              onChange={(value) => handleFieldChange('operatingExpenses', 'wasteManagement', value)}
              placeholder="2400"
            />
            <FormField
              label="Permits & Licenses"
              type="number"
              value={data.operatingExpenses.permitsLicenses}
              onChange={(value) => handleFieldChange('operatingExpenses', 'permitsLicenses', value)}
              placeholder="3000"
            />
            <FormField
              label="Music Licensing"
              type="number"
              value={data.operatingExpenses.musicLicensing}
              onChange={(value) => handleFieldChange('operatingExpenses', 'musicLicensing', value)}
              placeholder="1200"
            />
            <FormField
              label="Delivery Service Fees"
              type="number"
              value={data.operatingExpenses.deliveryServiceFees}
              onChange={(value) => handleFieldChange('operatingExpenses', 'deliveryServiceFees', value)}
              placeholder="15000"
            />
            <FormField
              label="Bank Fees"
              type="number"
              value={data.operatingExpenses.bankFees}
              onChange={(value) => handleFieldChange('operatingExpenses', 'bankFees', value)}
              placeholder="1200"
            />
            <FormField
              label="Parking Fees"
              type="number"
              value={data.operatingExpenses.parkingFees}
              onChange={(value) => handleFieldChange('operatingExpenses', 'parkingFees', value)}
              placeholder="3600"
            />
            <FormField
              label="Storage Fees"
              type="number"
              value={data.operatingExpenses.storageFees}
              onChange={(value) => handleFieldChange('operatingExpenses', 'storageFees', value)}
              placeholder="0"
            />
            <FormField
              label="Professional Services"
              type="number"
              value={data.operatingExpenses.professionalServices}
              onChange={(value) => handleFieldChange('operatingExpenses', 'professionalServices', value)}
              placeholder="6000"
            />
          </div>
        </div>

        {/* Taxes & Compliance */}
        <div className="mb-6">
          <h4 className="text-md font-semibold mb-3 text-gray-700">Taxes & Compliance</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              label="Local Taxes"
              type="number"
              value={data.operatingExpenses.localTaxes}
              onChange={(value) => handleFieldChange('operatingExpenses', 'localTaxes', value)}
              placeholder="5000"
            />
            <FormField
              label="Property Taxes"
              type="number"
              value={data.operatingExpenses.propertyTaxes}
              onChange={(value) => handleFieldChange('operatingExpenses', 'propertyTaxes', value)}
              placeholder="8000"
            />
            <FormField
              label="Business Taxes"
              type="number"
              value={data.operatingExpenses.businessTaxes}
              onChange={(value) => handleFieldChange('operatingExpenses', 'businessTaxes', value)}
              placeholder="12000"
            />
            <FormField
              label="Safety Training"
              type="number"
              value={data.operatingExpenses.safetyTraining}
              onChange={(value) => handleFieldChange('operatingExpenses', 'safetyTraining', value)}
              placeholder="2400"
            />
            <FormField
              label="Quality Control"
              type="number"
              value={data.operatingExpenses.qualityControl}
              onChange={(value) => handleFieldChange('operatingExpenses', 'qualityControl', value)}
              placeholder="3000"
            />
            <FormField
              label="Inventory Management"
              type="number"
              value={data.operatingExpenses.inventoryManagement}
              onChange={(value) => handleFieldChange('operatingExpenses', 'inventoryManagement', value)}
              placeholder="1800"
            />
          </div>
        </div>

        {/* Miscellaneous */}
        <div className="mb-6">
          <h4 className="text-md font-semibold mb-3 text-gray-700">Miscellaneous</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              label="Consulting"
              type="number"
              value={data.operatingExpenses.consulting}
              onChange={(value) => handleFieldChange('operatingExpenses', 'consulting', value)}
              placeholder="5000"
            />
            <FormField
              label="Travel & Entertainment"
              type="number"
              value={data.operatingExpenses.travelEntertainment}
              onChange={(value) => handleFieldChange('operatingExpenses', 'travelEntertainment', value)}
              placeholder="3000"
            />
            <FormField
              label="Charitable Donations"
              type="number"
              value={data.operatingExpenses.charitableDonations}
              onChange={(value) => handleFieldChange('operatingExpenses', 'charitableDonations', value)}
              placeholder="2000"
            />
          </div>
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