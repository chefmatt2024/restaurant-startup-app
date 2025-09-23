import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  Star, 
  Download, 
  Eye, 
  Filter,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import analyticsService from '../../services/analytics';

const DataCollectionDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [feedbackData, setFeedbackData] = useState([]);
  const [surveyData, setSurveyData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [dateRange, setDateRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load analytics data
    const analytics = analyticsService.getAnalyticsData();
    setAnalyticsData(analytics);

    // Load feedback data
    const feedback = JSON.parse(localStorage.getItem('user_feedback') || '[]');
    setFeedbackData(feedback);

    // Load survey data
    const surveys = JSON.parse(localStorage.getItem('survey_responses') || '[]');
    setSurveyData(surveys);

    // Combine all data
    setFilteredData([...analytics, ...feedback, ...surveys]);
  };

  const getDateRange = (range) => {
    const now = new Date();
    const days = range === '1d' ? 1 : range === '7d' ? 7 : range === '30d' ? 30 : 90;
    return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  };

  const filterData = () => {
    const cutoffDate = getDateRange(dateRange);
    const filtered = filteredData.filter(item => {
      const itemDate = new Date(item.timestamp || item.completedAt);
      return itemDate >= cutoffDate;
    });
    return filtered;
  };

  const getMetrics = () => {
    const data = filterData();
    
    return {
      totalEvents: data.length,
      uniqueUsers: new Set(data.map(item => item.userId || item.properties?.userId)).size,
      feedbackCount: feedbackData.length,
      surveyResponses: surveyData.length,
      averageRating: calculateAverageRating(),
      topFeatures: getTopFeatures(data),
      errorCount: data.filter(item => item.eventType === 'error_occurred').length,
      completionRate: calculateCompletionRate(data)
    };
  };

  const calculateAverageRating = () => {
    const ratings = feedbackData
      .filter(feedback => feedback.rating)
      .map(feedback => feedback.rating);
    
    return ratings.length > 0 
      ? (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1)
      : 0;
  };

  const getTopFeatures = (data) => {
    const featureUsage = {};
    data.forEach(item => {
      if (item.eventType === 'feature_access' && item.properties?.feature) {
        featureUsage[item.properties.feature] = (featureUsage[item.properties.feature] || 0) + 1;
      }
    });
    
    return Object.entries(featureUsage)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([feature, count]) => ({ feature, count }));
  };

  const calculateCompletionRate = (data) => {
    const started = data.filter(item => item.eventType === 'feature_access').length;
    const completed = data.filter(item => item.eventType === 'feature_completion').length;
    
    return started > 0 ? ((completed / started) * 100).toFixed(1) : 0;
  };

  const exportData = (type) => {
    let dataToExport = [];
    let filename = '';

    switch (type) {
      case 'analytics':
        dataToExport = analyticsData;
        filename = `analytics_${new Date().toISOString().split('T')[0]}.json`;
        break;
      case 'feedback':
        dataToExport = feedbackData;
        filename = `feedback_${new Date().toISOString().split('T')[0]}.json`;
        break;
      case 'surveys':
        dataToExport = surveyData;
        filename = `surveys_${new Date().toISOString().split('T')[0]}.json`;
        break;
      case 'all':
        dataToExport = filteredData;
        filename = `all_data_${new Date().toISOString().split('T')[0]}.json`;
        break;
    }

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const metrics = getMetrics();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Data Collection Dashboard</h2>
          <p className="text-gray-600">Monitor user behavior and collect valuable insights</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1d">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button
            onClick={() => exportData('all')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-4 w-4 mr-2" />
            Export All Data
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalEvents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unique Users</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.uniqueUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Feedback</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.feedbackCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.averageRating}/5</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Features */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Used Features</h3>
          <div className="space-y-3">
            {metrics.topFeatures.map((feature, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 capitalize">
                  {feature.feature.replace(/_/g, ' ')}
                </span>
                <div className="flex items-center">
                  <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(feature.count / metrics.totalEvents) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{feature.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Completion Rate</span>
              <div className="flex items-center">
                <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${metrics.completionRate}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">{metrics.completionRate}%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Error Rate</span>
              <div className="flex items-center">
                <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{ width: `${(metrics.errorCount / metrics.totalEvents) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">{metrics.errorCount}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Survey Responses</span>
              <span className="text-sm font-medium text-gray-900">{metrics.surveyResponses}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Data</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => exportData('analytics')}
            className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-sm font-medium">Analytics</span>
          </button>
          
          <button
            onClick={() => exportData('feedback')}
            className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <MessageSquare className="h-5 w-5 text-yellow-600 mr-2" />
            <span className="text-sm font-medium">Feedback</span>
          </button>
          
          <button
            onClick={() => exportData('surveys')}
            className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Star className="h-5 w-5 text-purple-600 mr-2" />
            <span className="text-sm font-medium">Surveys</span>
          </button>
          
          <button
            onClick={() => exportData('all')}
            className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-sm font-medium">All Data</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {filteredData.slice(-10).reverse().map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {item.eventType || item.type || 'Unknown Event'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(item.timestamp || item.completedAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {item.userId || item.properties?.userId || 'Anonymous'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataCollectionDashboard;
