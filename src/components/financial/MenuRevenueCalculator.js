import React from 'react';
import { useApp } from '../../contexts/AppContext';
import { TrendingUp, DollarSign, Calculator, BarChart3 } from 'lucide-react';

const MenuRevenueCalculator = () => {
  const { state } = useApp();
  
  // Get menu data from financial data context
  const menuData = state.financialData?.menu;
  
  if (!menuData || !menuData.items || menuData.items.length === 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
          <div>
            <h4 className="text-sm font-medium text-blue-800">Menu Revenue Calculator</h4>
            <p className="text-sm text-blue-700">
              No menu data available. Use the Menu Builder to create your menu and calculate revenue projections.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { items, summary, categoryBreakdown } = menuData;

  // Calculate revenue projections based on different scenarios
  const calculateProjections = () => {
    const baseRevenue = summary.totalRevenue; // Base: 100 orders per item
    
    return {
      conservative: {
        daily: baseRevenue * 0.3, // 30% of base
        weekly: baseRevenue * 0.3 * 7,
        monthly: baseRevenue * 0.3 * 30,
        yearly: baseRevenue * 0.3 * 365
      },
      moderate: {
        daily: baseRevenue * 0.5, // 50% of base
        weekly: baseRevenue * 0.5 * 7,
        monthly: baseRevenue * 0.5 * 30,
        yearly: baseRevenue * 0.5 * 365
      },
      optimistic: {
        daily: baseRevenue * 0.8, // 80% of base
        weekly: baseRevenue * 0.8 * 7,
        monthly: baseRevenue * 0.8 * 30,
        yearly: baseRevenue * 0.8 * 365
      }
    };
  };

  const projections = calculateProjections();

  // Find top performing items
  const topItems = [...items]
    .sort((a, b) => parseFloat(b.margin) - parseFloat(a.margin))
    .slice(0, 5);

  // Find most profitable categories
  const topCategories = Object.entries(categoryBreakdown)
    .filter(([_, data]) => data.count > 0)
    .sort(([_, a], [__, b]) => b.profit - a.profit)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <BarChart3 className="w-6 h-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold text-blue-900">Menu Revenue Projections</h3>
        </div>
        <p className="text-blue-700 mb-4">
          Revenue projections based on your menu pricing and estimated order volumes.
        </p>
        
        {/* Revenue Projection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h4 className="font-medium text-gray-900 mb-2">Conservative</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Daily:</span>
                <span className="font-medium">${projections.conservative.daily.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Monthly:</span>
                <span className="font-medium">${projections.conservative.monthly.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Yearly:</span>
                <span className="font-medium">${projections.conservative.yearly.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h4 className="font-medium text-gray-900 mb-2">Moderate</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Daily:</span>
                <span className="font-medium">${projections.moderate.daily.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Monthly:</span>
                <span className="font-medium">${projections.moderate.monthly.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Yearly:</span>
                <span className="font-medium">${projections.moderate.yearly.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <h4 className="font-medium text-gray-900 mb-2">Optimistic</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Daily:</span>
                <span className="font-medium">${projections.optimistic.daily.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Monthly:</span>
                <span className="font-medium">${projections.optimistic.monthly.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Yearly:</span>
                <span className="font-medium">${projections.optimistic.yearly.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 text-green-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-lg font-semibold text-gray-900">${summary.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="flex items-center">
              <Calculator className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Total Cost</p>
                <p className="text-lg font-semibold text-gray-900">${summary.totalCost.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="flex items-center">
              <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Total Profit</p>
                <p className="text-lg font-semibold text-gray-900">${summary.totalProfit.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="flex items-center">
              <BarChart3 className="w-5 h-5 text-purple-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Avg Margin</p>
                <p className="text-lg font-semibold text-gray-900">{summary.averageMargin}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Items */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Menu Items</h3>
        <div className="space-y-3">
          {topItems.map((item, index) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <span className="w-6 h-6 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex items-center justify-center mr-3">
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-green-600">{item.margin}% margin</p>
                <p className="text-sm text-gray-600">${item.profit} profit</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Most Profitable Categories */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Profitable Categories</h3>
        <div className="space-y-3">
          {topCategories.map(([category, data], index) => (
            <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <span className="w-6 h-6 bg-purple-100 text-purple-800 text-xs font-medium rounded-full flex items-center justify-center mr-3">
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium text-gray-900">{category}</p>
                  <p className="text-sm text-gray-600">{data.count} items</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-purple-600">${data.profit.toLocaleString()}</p>
                <p className="text-sm text-gray-600">${data.revenue.toLocaleString()} revenue</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-900 mb-4">💡 Menu Optimization Tips</h3>
        <div className="space-y-3 text-yellow-800">
          <div className="flex items-start">
            <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <p className="text-sm">
              <strong>High-Margin Focus:</strong> Promote items with margins above 60% to increase profitability
            </p>
          </div>
          <div className="flex items-start">
            <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <p className="text-sm">
              <strong>Category Balance:</strong> Ensure profitable categories have adequate representation
            </p>
          </div>
          <div className="flex items-start">
            <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <p className="text-sm">
              <strong>Pricing Strategy:</strong> Consider price increases for items with margins below 40%
            </p>
          </div>
          <div className="flex items-start">
            <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
            <p className="text-sm">
              <strong>Cost Management:</strong> Review ingredient costs for low-margin items
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuRevenueCalculator;
