import React, { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';
import SectionCard from '../ui/SectionCard';
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, Users, Target, 
  BarChart3, Activity, AlertCircle, Calendar, MapPin, 
  Clock, Star, Award, Zap, Lightbulb
} from 'lucide-react';

const BusinessAnalytics = () => {
  const { state } = useApp();
  const [selectedTimeframe, setSelectedTimeframe] = useState('12months');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const financialData = state.businessPlan.financialProjections;

  // Generate financial projections data for charts
  const projectionData = useMemo(() => {
    if (!financialData) return [];
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const baseRevenue = parseInt(financialData.projectedRevenue) || 300000;
    const baseCosts = parseInt(financialData.operatingExpenses) || 180000;
    
    return months.map((month, index) => {
      // Add seasonal variation for restaurants
      const seasonalMultiplier = month === 'Dec' ? 1.3 : 
                                month === 'Nov' ? 1.2 :
                                month === 'Jan' ? 0.8 :
                                month === 'Feb' ? 0.9 : 1.0;
      
      const monthlyRevenue = Math.round((baseRevenue / 12) * seasonalMultiplier);
      const monthlyCosts = Math.round((baseCosts / 12) * (0.9 + Math.random() * 0.2));
      const profit = monthlyRevenue - monthlyCosts;
      
      return {
        month,
        revenue: monthlyRevenue,
        costs: monthlyCosts,
        profit: profit,
        grossMargin: Math.round((profit / monthlyRevenue) * 100),
        customers: Math.round((monthlyRevenue / 45) * seasonalMultiplier), // Avg $45 per customer
        avgOrderValue: Math.round(monthlyRevenue / (monthlyRevenue / 45))
      };
    });
  }, [financialData]);

  // Key performance indicators
  const kpis = useMemo(() => {
    if (!projectionData.length) return {};
    
    const totalRevenue = projectionData.reduce((sum, month) => sum + month.revenue, 0);
    const totalCosts = projectionData.reduce((sum, month) => sum + month.costs, 0);
    const totalProfit = totalRevenue - totalCosts;
    const avgMargin = Math.round((totalProfit / totalRevenue) * 100);
    const totalCustomers = projectionData.reduce((sum, month) => sum + month.customers, 0);
    const avgOrderValue = Math.round(totalRevenue / totalCustomers);
    
    // Compare to Boston restaurant benchmarks
    const benchmarks = {
      grossMargin: 28, // Industry average for restaurants
      customerGrowth: 15, // Annual growth rate
      avgOrderValue: 45 // Boston restaurant average
    };
    
    return {
      totalRevenue,
      totalCosts,
      totalProfit,
      avgMargin,
      totalCustomers,
      avgOrderValue,
      benchmarks,
      performance: {
        marginVsBenchmark: avgMargin - benchmarks.grossMargin,
        aovVsBenchmark: avgOrderValue - benchmarks.avgOrderValue
      }
    };
  }, [projectionData]);

  // Market position data
  const marketData = [
    { category: 'Fine Dining', share: 15, competitors: 120, avgPrice: 85, color: '#8884d8' },
    { category: 'Casual Dining', share: 35, competitors: 280, avgPrice: 45, color: '#82ca9d' },
    { category: 'Fast Casual', share: 25, competitors: 200, avgPrice: 25, color: '#ffc658' },
    { category: 'Quick Service', share: 20, competitors: 150, avgPrice: 15, color: '#ff7300' },
    { category: 'Specialty', share: 5, competitors: 50, avgPrice: 35, color: '#00ff88' }
  ];

  // Cost breakdown data
  const costBreakdown = [
    { category: 'Food Cost', amount: parseInt(financialData?.foodCosts) || 90000, percentage: 30, color: '#8884d8' },
    { category: 'Labor', amount: parseInt(financialData?.salaries) || 72000, percentage: 24, color: '#82ca9d' },
    { category: 'Rent', amount: parseInt(financialData?.rent) || 48000, percentage: 16, color: '#ffc658' },
    { category: 'Utilities', amount: parseInt(financialData?.utilities) || 18000, percentage: 6, color: '#ff7300' },
    { category: 'Marketing', amount: parseInt(financialData?.marketing) || 15000, percentage: 5, color: '#00ff88' },
    { category: 'Other', amount: parseInt(financialData?.otherExpenses) || 27000, percentage: 9, color: '#ff8088' }
  ];

  const timeframes = [
    { id: '3months', label: '3 Months', icon: Calendar },
    { id: '6months', label: '6 Months', icon: Clock },
    { id: '12months', label: '12 Months', icon: Star },
    { id: '24months', label: '2 Years', icon: Award }
  ];

  const metricOptions = [
    { id: 'revenue', label: 'Revenue', icon: DollarSign, color: 'green', description: 'Monthly revenue projections' },
    { id: 'profit', label: 'Profit', icon: TrendingUp, color: 'blue', description: 'Profitability trends' },
    { id: 'customers', label: 'Customers', icon: Users, color: 'purple', description: 'Customer volume analysis' },
    { id: 'margin', label: 'Gross Margin', icon: BarChart3, color: 'orange', description: 'Margin performance' }
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  // Enhanced tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="animate-fade-in space-y-6">
      {/* Enhanced KPI Dashboard */}
      <SectionCard 
        title="Key Performance Indicators" 
        description="Essential metrics for your restaurant's financial health and performance."
        color="blue"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Annual Revenue</p>
                <p className="text-2xl font-bold text-green-900">{formatCurrency(kpis.totalRevenue)}</p>
                <p className="text-xs text-green-600 mt-1">Projected for Year 1</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Net Profit</p>
                <p className="text-2xl font-bold text-blue-900">{formatCurrency(kpis.totalProfit)}</p>
                <div className="flex items-center mt-1">
                  {kpis.performance?.marginVsBenchmark > 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <p className="text-xs text-blue-600">
                    {Math.abs(kpis.performance?.marginVsBenchmark)}% vs benchmark
                  </p>
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <BarChart3 className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Expected Customers</p>
                <p className="text-2xl font-bold text-purple-900">{formatNumber(kpis.totalCustomers)}</p>
                <p className="text-xs text-purple-600 mt-1">Annual visits</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Avg Order Value</p>
                <p className="text-2xl font-bold text-orange-900">{formatCurrency(kpis.avgOrderValue)}</p>
                <div className="flex items-center mt-1">
                  {kpis.performance?.aovVsBenchmark > 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <p className="text-xs text-orange-600">
                    {formatCurrency(Math.abs(kpis.performance?.aovVsBenchmark))} vs benchmark
                  </p>
                </div>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <Target className="h-8 w-8 text-orange-500" />
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Interactive Chart Controls */}
      <SectionCard 
        title="Performance Analytics" 
        description="Interactive charts and analysis tools for deeper insights."
        color="purple"
      >
        <div className="space-y-6">
          {/* Chart Controls */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              {timeframes.map((timeframe) => (
                <button
                  key={timeframe.id}
                  onClick={() => setSelectedTimeframe(timeframe.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                    selectedTimeframe === timeframe.id
                      ? 'bg-blue-500 text-white border-blue-500 shadow-lg'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <timeframe.icon className="h-4 w-4" />
                  {timeframe.label}
                </button>
              ))}
            </div>
            
            <div className="flex gap-2">
              {metricOptions.map((metric) => (
                <button
                  key={metric.id}
                  onClick={() => setSelectedMetric(metric.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                    selectedMetric === metric.id
                      ? `bg-${metric.color}-500 text-white border-${metric.color}-500 shadow-lg`
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                  title={metric.description}
                >
                  <metric.icon className="h-4 w-4" />
                  {metric.label}
                </button>
              ))}
            </div>
          </div>

          {/* Enhanced Revenue Trend Chart */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
              Revenue & Profit Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stackId="1" 
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.6}
                  name="Revenue"
                />
                <Area 
                  type="monotone" 
                  dataKey="profit" 
                  stackId="2" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.6}
                  name="Profit"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Market Position Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-purple-500" />
                Market Position Analysis
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={marketData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" stroke="#666" />
                  <YAxis dataKey="category" type="category" stroke="#666" width={80} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="share" fill="#8884d8" name="Market Share %" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-orange-500" />
                Cost Structure Breakdown
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={costBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percentage }) => `${category}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {costBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Performance Insights */}
      <SectionCard 
        title="Performance Insights & Recommendations" 
        description="AI-powered insights and actionable recommendations for your restaurant."
        color="green"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <Lightbulb className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-blue-900">Revenue Optimization</h4>
            </div>
            <p className="text-blue-800 text-sm">
              {kpis.performance?.marginVsBenchmark > 0 
                ? `Your margin is ${Math.abs(kpis.performance.marginVsBenchmark)}% above industry average. Consider expanding operations.`
                : `Focus on reducing costs to improve your ${Math.abs(kpis.performance?.marginVsBenchmark)}% below-average margin.`
              }
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-green-900">Customer Strategy</h4>
            </div>
            <p className="text-green-800 text-sm">
              Target {Math.round(kpis.totalCustomers / 12)} customers per month. 
              Focus on repeat business and increasing average order value.
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-purple-900">Seasonal Planning</h4>
            </div>
            <p className="text-purple-800 text-sm">
              December shows 30% higher revenue. Plan marketing campaigns and staffing for peak seasons.
            </p>
          </div>
        </div>
      </SectionCard>
    </div>
  );
};

export default BusinessAnalytics; 