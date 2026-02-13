import React from 'react';
import { ArrowRight, ExternalLink, Star, Users, BarChart3, DollarSign } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const AppLanding = () => {
  const { actions } = useApp();

  const handleLaunchApp = () => {
    actions.setActiveTab('concept-pitch');
  };

  const handleBackToMainSite = () => {
    window.open('https://iterumfoods.xyz', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-blue-600">Iterum Foods</h1>
                <p className="text-sm text-gray-500">Restaurant Planning Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToMainSite}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Main Site
              </button>
              <button
                onClick={handleLaunchApp}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center"
              >
                Launch App
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to the
            <span className="text-blue-600"> Restaurant Planner</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The comprehensive platform for planning, analyzing, and launching your restaurant business. 
            From concept to opening day, we've got you covered.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={handleLaunchApp}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
            >
              Start Planning Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button
              onClick={handleBackToMainSite}
              className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Back to Main Site
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex justify-center mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">1000+</h3>
              <p className="text-gray-600">Restaurant Plans Created</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex justify-center mb-4">
                <BarChart3 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">95%</h3>
              <p className="text-gray-600">Success Rate</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex justify-center mb-4">
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">$2M+</h3>
              <p className="text-gray-600">Funding Raised</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Preview */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Launch
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools and insights you need 
              to plan and launch a successful restaurant business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Business Planning
              </h3>
              <p className="text-gray-600">
                Complete business plan development with market analysis and competitive research.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Financial Modeling
              </h3>
              <p className="text-gray-600">
                Detailed financial projections with market trends and labor cost analysis.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Advanced Analytics
              </h3>
              <p className="text-gray-600">
                Industry benchmarks, competitive analysis, and data-driven insights.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Team Collaboration
              </h3>
              <p className="text-gray-600">
                Work together with your team to build the perfect restaurant concept.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Plan Your Restaurant?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of successful restaurateurs who used our platform to plan, 
            launch, and grow their businesses.
          </p>
          <button
            onClick={handleLaunchApp}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center mx-auto"
          >
            Launch Restaurant Planner
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-xl font-bold text-blue-400 mb-4">Iterum Foods</h3>
            <p className="text-gray-400 mb-4">
              The complete restaurant planning platform for entrepreneurs.
            </p>
            <div className="flex justify-center space-x-6">
              <button
                onClick={handleBackToMainSite}
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                Main Site
              </button>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                Help Center
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                Privacy Policy
              </a>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-gray-400">
              <p>&copy; 2024 Iterum Foods. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLanding;
