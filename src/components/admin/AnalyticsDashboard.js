import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Eye,
  MousePointer,
  Mail,
  Phone,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Clock,
  CheckCircle
} from 'lucide-react';

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('conversions');

  // Mock data - replace with real data from your analytics service
  const analyticsData = {
    overview: {
      totalUsers: 1247,
      activeUsers: 892,
      newSignups: 156,
      revenue: 28450,
      conversionRate: 12.4,
      avgSessionDuration: '4m 32s',
      bounceRate: 34.2
    },
    funnel: [
      { stage: 'Landing Page Views', count: 5420, percentage: 100 },
      { stage: 'Trial Signups', count: 1247, percentage: 23.0 },
      { stage: 'Trial Activations', count: 892, percentage: 16.5 },
      { stage: 'Paid Conversions', count: 156, percentage: 2.9 }
    ],
    userGrowth: [
      { month: 'Jan', users: 120, revenue: 2400 },
      { month: 'Feb', users: 190, revenue: 3800 },
      { month: 'Mar', users: 300, revenue: 6000 },
      { month: 'Apr', users: 450, revenue: 9000 },
      { month: 'May', users: 620, revenue: 12400 },
      { month: 'Jun', users: 780, revenue: 15600 },
      { month: 'Jul', users: 892, revenue: 17840 }
    ],
    topSources: [
      { source: 'Google Ads', users: 456, conversion: 15.2, cost: 2300 },
      { source: 'Organic Search', users: 234, conversion: 8.7, cost: 0 },
      { source: 'Social Media', users: 189, conversion: 6.3, cost: 800 },
      { source: 'Referrals', users: 156, conversion: 12.1, cost: 0 },
      { source: 'Email', users: 98, conversion: 4.1, cost: 200 }
    ],
    userEngagement: [
      { feature: 'Financial Projections', usage: 89, satisfaction: 4.7 },
      { feature: 'Market Research', usage: 76, satisfaction: 4.5 },
      { feature: 'Equipment Planning', usage: 65, satisfaction: 4.3 },
      { feature: 'Compliance Tracking', usage: 58, satisfaction: 4.6 },
      { feature: 'Menu Builder', usage: 45, satisfaction: 4.2 }
    ],
    recentActivity: [
      { user: 'Maria Santos', action: 'Completed financial projections', time: '2 hours ago', value: '$0' },
      { user: 'David Kim', action: 'Upgraded to Professional plan', time: '4 hours ago', value: '$348' },
      { user: 'Sarah Johnson', action: 'Started trial signup', time: '6 hours ago', value: '$0' },
      { user: 'Michael Rodriguez', action: 'Downloaded business plan PDF', time: '8 hours ago', value: '$0' },
      { user: 'Jennifer Martinez', action: 'Scheduled demo call', time: '12 hours ago', value: '$0' }
    ]
  };

  const getMetricIcon = (metric) => {
    const icons = {
      users: Users,
      revenue: DollarSign,
      conversions: Target,
      engagement: Activity
    };
    return icons[metric] || TrendingUp;
  };

  const getMetricColor = (metric) => {
    const colors = {
      users: 'text-blue-600 bg-blue-100',
      revenue: 'text-green-600 bg-green-100',
      conversions: 'text-purple-600 bg-purple-100',
      engagement: 'text-orange-600 bg-orange-100'
    };
    return colors[metric] || 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Track performance and user engagement</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <BarChart3 className="w-4 h-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.totalUsers.toLocaleString()}</p>
              <p className="text-sm text-green-600">+12% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${analyticsData.overview.revenue.toLocaleString()}</p>
              <p className="text-sm text-green-600">+8% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.conversionRate}%</p>
              <p className="text-sm text-green-600">+2.1% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.activeUsers.toLocaleString()}</p>
              <p className="text-sm text-green-600">+15% from last month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Conversion Funnel</h3>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">Funnel View</button>
            <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-full">Table View</button>
          </div>
        </div>
        
        <div className="space-y-4">
          {analyticsData.funnel.map((stage, index) => (
            <div key={stage.stage} className="flex items-center">
              <div className="w-32 text-sm font-medium text-gray-700">{stage.stage}</div>
              <div className="flex-1 mx-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${stage.percentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-20 text-sm text-gray-600 text-right">{stage.count.toLocaleString()}</div>
              <div className="w-16 text-sm text-gray-500 text-right">{stage.percentage}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">User Growth & Revenue</h3>
          <div className="h-64 flex items-end space-x-2">
            {analyticsData.userGrowth.map((data, index) => (
              <div key={data.month} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-blue-200 rounded-t" style={{ height: `${(data.users / 1000) * 200}px` }}></div>
                <div className="w-full bg-green-200 rounded-t mt-1" style={{ height: `${(data.revenue / 20000) * 100}px` }}></div>
                <div className="text-xs text-gray-500 mt-2">{data.month}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center mt-4 space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-200 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Users</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-200 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Revenue</span>
            </div>
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Traffic Sources</h3>
          <div className="space-y-4">
            {analyticsData.topSources.map((source, index) => (
              <div key={source.source} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-medium text-gray-600">{index + 1}</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{source.source}</div>
                    <div className="text-xs text-gray-500">{source.users} users</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{source.conversion}%</div>
                  <div className="text-xs text-gray-500">conversion</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Usage & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature Usage */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Feature Usage & Satisfaction</h3>
          <div className="space-y-4">
            {analyticsData.userEngagement.map((feature, index) => (
              <div key={feature.feature} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{feature.feature}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${feature.usage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <div className="text-sm font-medium text-gray-900">{feature.usage}%</div>
                  <div className="text-xs text-gray-500">usage</div>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-yellow-600">★</span>
                    <span className="text-xs text-gray-600 ml-1">{feature.satisfaction}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {analyticsData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-xs font-medium text-gray-600">
                    {activity.user.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-900">{activity.action}</div>
                  <div className="text-xs text-gray-500">{activity.user} • {activity.time}</div>
                </div>
                <div className="text-sm font-medium text-gray-900">{activity.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
