import React, { useState } from 'react';
import { 
  BarChart3, 
  Beaker, 
  GraduationCap, 
  Calculator, 
  BookOpen, 
  Wrench, 
  ArrowRight, 
  Star, 
  ExternalLink,
  Menu,
  X,
  Users,
  DollarSign,
  Target,
  Zap
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const UnifiedPlatform = () => {
  const { state, actions } = useApp();
  const [activeApp, setActiveApp] = useState(null);

  // All your existing projects/apps
  const apps = [
    {
      id: 'restaurant-planner',
      name: 'Restaurant Business Planner',
      description: 'Complete business planning platform with real-world insights from experienced restaurant entrepreneurs.',
      icon: <BarChart3 className="w-8 h-8" />,
      status: 'active',
      pricing: '$10/month',
      trial: '14-day free trial',
      features: [
        'Business plan templates',
        'Financial projections',
        'Equipment planning',
        'Opening timeline',
        'Market analysis',
        'Competitive research'
      ],
      color: 'green',
      isPremium: true,
      link: 'https://restaurant-startup-app.web.app'
    },
    {
      id: 'culinary-rd',
      name: 'Culinary R&D App',
      description: 'Professional recipe development and culinary research platform for chefs and food service professionals.',
      icon: <Beaker className="w-8 h-8" />,
      status: 'active',
      pricing: 'Free',
      trial: 'Full access',
      features: [
        'Recipe development',
        'Ingredient database',
        'Project management',
        'Menu planning',
        'Cost analysis',
        'Nutritional tracking'
      ],
      color: 'blue',
      isPremium: false,
      link: 'https://iterumfoods.xyz'
    },
    {
      id: 'skills-app',
      name: 'Skills Development App',
      description: 'Professional development and skills tracking platform for culinary professionals and restaurant staff.',
      icon: <GraduationCap className="w-8 h-8" />,
      status: 'coming-soon',
      pricing: 'Coming Soon',
      trial: 'In development',
      features: [
        'Skill tracking',
        'Training modules',
        'Progress monitoring',
        'Certification tracking',
        'Performance analytics',
        'Team development'
      ],
      color: 'purple',
      isPremium: false
    },
    {
      id: 'payroll-app',
      name: 'Restaurant Payroll App',
      description: 'Simple payroll and staff management system designed for restaurant operations with tip tracking and scheduling.',
      icon: <Calculator className="w-8 h-8" />,
      status: 'coming-soon',
      pricing: 'Coming Soon',
      trial: 'In development',
      features: [
        'Payroll processing',
        'Tip tracking',
        'Schedule management',
        'Tax compliance',
        'Employee management',
        'Reporting tools'
      ],
      color: 'orange',
      isPremium: true
    },
    {
      id: 'recipe-library',
      name: 'Recipe Library',
      description: 'Comprehensive recipe organization and management system for culinary professionals and home cooks.',
      icon: <BookOpen className="w-8 h-8" />,
      status: 'coming-soon',
      pricing: 'Coming Soon',
      trial: 'In development',
      features: [
        'Recipe organization',
        'Search & filtering',
        'Nutritional analysis',
        'Scaling tools',
        'Menu integration',
        'Collaboration features'
      ],
      color: 'red',
      isPremium: false
    },
    {
      id: 'professional-tools',
      name: 'Professional Tools',
      description: 'Additional utilities and tools for culinary professionals including prep lists, inventory management, and more.',
      icon: <Wrench className="w-8 h-8" />,
      status: 'coming-soon',
      pricing: 'Premium',
      trial: 'In development',
      features: [
        'Prep list generator',
        'Inventory tracking',
        'Cost calculators',
        'Menu analysis',
        'Waste tracking',
        'Efficiency tools'
      ],
      color: 'indigo',
      isPremium: true
    }
  ];

  const handleLaunchApp = (app) => {
    if (app.status === 'active') {
      if (app.id === 'restaurant-planner') {
        // Launch the restaurant planning app
        actions.setActiveTab('idea-formation');
      } else if (app.id === 'culinary-rd') {
        // Launch culinary R&D app
        window.open(app.link, '_blank');
      }
    } else {
      // Show coming soon modal or redirect to waitlist
      actions.showMessage('Coming Soon', `${app.name} is currently in development. Stay tuned for updates!`, 'info');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>;
      case 'coming-soon':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Coming Soon</span>;
      default:
        return null;
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      green: 'bg-green-100 text-green-600 border-green-200',
      blue: 'bg-blue-100 text-blue-600 border-blue-200',
      purple: 'bg-purple-100 text-purple-600 border-purple-200',
      orange: 'bg-orange-100 text-orange-600 border-orange-200',
      red: 'bg-red-100 text-red-600 border-red-200',
      indigo: 'bg-indigo-100 text-indigo-600 border-indigo-200'
    };
    return colors[color] || colors.green;
  };

  const getButtonClasses = (color, status) => {
    const baseClasses = "w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center";
    
    if (status === 'coming-soon') {
      return `${baseClasses} bg-gray-100 text-gray-400 cursor-not-allowed`;
    }
    
    const colors = {
      green: 'bg-green-600 text-white hover:bg-green-700',
      blue: 'bg-blue-600 text-white hover:bg-blue-700',
      purple: 'bg-purple-600 text-white hover:bg-purple-700',
      orange: 'bg-orange-600 text-white hover:bg-orange-700',
      red: 'bg-red-600 text-white hover:bg-red-700',
      indigo: 'bg-indigo-600 text-white hover:bg-indigo-700'
    };
    
    return `${baseClasses} ${colors[color] || colors.green}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-green-600">🌿 ITERUM FOODS</h1>
                <p className="text-sm text-gray-500">Unified Culinary Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome back, {state.user?.displayName || 'Chef'}
              </span>
              <button
                onClick={() => actions.signOut()}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Culinary Excellence
              <span className="block text-green-200">Made Simple</span>
            </h1>
            <p className="text-xl text-green-100 mb-8 max-w-4xl mx-auto">
              Professional tools for culinary professionals and restaurant entrepreneurs. 
              All your apps in one unified platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setActiveApp('restaurant-planner')}
                className="bg-white text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Launch Restaurant Planner
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-green-600 transition-colors duration-200 flex items-center justify-center">
                <ExternalLink className="w-5 h-5 mr-2" />
                View All Apps
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Apps Grid */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your Culinary Toolkit
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to succeed in the culinary industry, all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {apps.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${getColorClasses(app.color)}`}>
                      {app.icon}
                    </div>
                    {getStatusBadge(app.status)}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {app.name}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    {app.description}
                  </p>

                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-500">Pricing</span>
                      <span className="text-sm font-semibold text-gray-900">{app.pricing}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-500">Trial</span>
                      <span className="text-sm text-gray-600">{app.trial}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    {app.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <Star className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                    {app.features.length > 3 && (
                      <div className="text-sm text-gray-500">
                        +{app.features.length - 3} more features
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleLaunchApp(app)}
                    disabled={app.status === 'coming-soon'}
                    className={getButtonClasses(app.color, app.status)}
                  >
                    {app.status === 'coming-soon' ? (
                      'Coming Soon'
                    ) : (
                      <>
                        Launch App
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">500+</h3>
              <p className="text-gray-600">Active Users</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">6</h3>
              <p className="text-gray-600">Integrated Apps</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">95%</h3>
              <p className="text-gray-600">Success Rate</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">$2M+</h3>
              <p className="text-gray-600">Funding Raised</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Culinary Operations?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join hundreds of culinary professionals who are already using Iterum Foods 
            to streamline their operations and grow their businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setActiveApp('restaurant-planner')}
              className="bg-white text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
            >
              <Zap className="w-5 h-5 mr-2" />
              Start Your Free Trial
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-green-600 transition-colors duration-200">
              Contact Sales
            </button>
          </div>
          <p className="text-green-200 mt-6 text-sm">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnifiedPlatform;
