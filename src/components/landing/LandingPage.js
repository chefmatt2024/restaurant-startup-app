import React, { useState } from 'react';
import { ArrowRight, Check, Star, Users, BarChart3, DollarSign, Target, Zap, Play, Menu, X } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import SignInModal from '../auth/SignInModal';

const LandingPage = () => {
  const { state, actions } = useApp();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // If user is authenticated, redirect to dashboard
  if (state.isAuthenticated && state.userId) {
    actions.setActiveTab('concept-pitch');
    return null;
  }

  const features = [
    {
      icon: <Target className="w-8 h-8 text-blue-600" />,
      title: "Complete Business Planning",
      description: "From concept to opening day - everything you need to plan your restaurant business."
    },
    {
      icon: <DollarSign className="w-8 h-8 text-green-600" />,
      title: "Financial Projections",
      description: "Detailed financial modeling with market trends, labor costs, and 5-year projections."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-purple-600" />,
      title: "Advanced Analytics",
      description: "Industry benchmarks, competitive analysis, and data-driven insights."
    },
    {
      icon: <Users className="w-8 h-8 text-orange-600" />,
      title: "Team Collaboration",
      description: "Work together with your team to build the perfect restaurant concept."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Restaurant Owner",
      content: "This platform helped me plan my restaurant from scratch. The financial projections were spot-on and saved me thousands in planning costs.",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "Chef & Entrepreneur",
      content: "The comprehensive planning tools and industry insights gave me the confidence to open my second location successfully.",
      rating: 5
    },
    {
      name: "Jennifer Kim",
      role: "Food Service Consultant",
      content: "I use this platform with all my clients. It's professional, thorough, and saves weeks of planning time.",
      rating: 5
    }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "1 restaurant plan",
        "Basic financial projections",
        "Limited equipment planning",
        "Watermarked exports",
        "Community support"
      ],
      cta: "Get Started Free",
      popular: false,
      color: "gray"
    },
    {
      name: "Professional",
      price: "$29",
      period: "per month",
      description: "For serious entrepreneurs",
      features: [
        "Unlimited restaurant plans",
        "Full financial analysis",
        "Complete equipment planning",
        "PDF/Excel exports",
        "Priority support",
        "Advanced analytics",
        "Custom templates"
      ],
      cta: "Start Free Trial",
      popular: true,
      color: "blue"
    },
    {
      name: "Business",
      price: "$99",
      period: "per month",
      description: "For growing teams",
      features: [
        "Everything in Professional",
        "Multi-user collaboration",
        "Team management",
        "Advanced reporting",
        "White-label options",
        "Priority phone support",
        "Custom integrations"
      ],
      cta: "Start Free Trial",
      popular: false,
      color: "purple"
    }
  ];

  const handleGetStarted = () => {
    // Track conversion event
    if (window.gtag) {
      window.gtag('event', 'click', {
        event_category: 'CTA',
        event_label: 'Start Free Trial',
        value: 1
      });
    }
    
    // Always redirect to root URL - ProtectedRoute will show signup flow automatically
    // If on external landing page, use full URL
    // If already in app, navigate to root route
    if (window.location.hostname.includes('restaurant-startup-app.web.app') || 
        window.location.hostname.includes('localhost')) {
      // Already in app - navigate to root route (ProtectedRoute will show signup)
      window.location.href = '/';
    } else {
      // External landing page - redirect to app root
      window.location.href = 'https://restaurant-startup-app.web.app/';
    }
  };

  const handleSignIn = () => {
    actions.setActiveTab('sign-in');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-blue-600">Iterum Foods</h1>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#features" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Features
                </a>
                <a href="#pricing" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Pricing
                </a>
                <a href="#testimonials" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Testimonials
                </a>
                <button
                  onClick={handleSignIn}
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </button>
                <button
                  onClick={handleGetStarted}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Get Started
                </button>
              </div>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="text-gray-600 hover:text-gray-900"
              >
                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {showMobileMenu && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              <a href="#features" className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">
                Features
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">
                Pricing
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium">
                Testimonials
              </a>
              <button
                onClick={handleSignIn}
                className="text-gray-600 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                Sign In
              </button>
              <button
                onClick={handleGetStarted}
                className="bg-blue-600 text-white block px-3 py-2 rounded-md text-base font-medium w-full text-left hover:bg-blue-700"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Plan Your Restaurant
              <span className="text-blue-600"> Like a Pro</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              From concept to opening day, our comprehensive platform helps you plan, 
              analyze, and launch your restaurant business with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGetStarted}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
              >
                Start Planning Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
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
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your needs. All plans include a 5-day free trial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl shadow-lg overflow-hidden ${
                  plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white text-center py-2 text-sm font-semibold">
                    <Star className="w-4 h-4 inline mr-1" />
                    Most Popular
                  </div>
                )}

                <div className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <div className="mb-4">
                      <span className="text-5xl font-bold text-gray-900">
                        {plan.price}
                      </span>
                      <span className="text-gray-500 ml-2">/{plan.period}</span>
                    </div>
                    <p className="text-gray-600">
                      {plan.description}
                    </p>
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleGetStarted}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                      plan.popular
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Restaurant Entrepreneurs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what our customers have to say about their success with our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Launch Your Restaurant?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of successful restaurateurs who used our platform to plan, 
            launch, and grow their businesses.
          </p>
          <button
            onClick={handleGetStarted}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center mx-auto"
          >
            <Zap className="w-5 h-5 mr-2" />
            Start Your Free Trial
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-blue-400 mb-4">Iterum Foods</h3>
              <p className="text-gray-400">
                The complete restaurant planning platform for entrepreneurs.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Iterum Foods. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
