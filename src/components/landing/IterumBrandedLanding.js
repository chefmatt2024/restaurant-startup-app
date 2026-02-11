import React, { useState } from 'react';
import { ArrowRight, ExternalLink, Star, Users, BarChart3, DollarSign, Target, Zap, Play, Menu, X, Check } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const IterumBrandedLanding = () => {
  const { actions } = useApp();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLaunchApp = () => {
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

  const handleBackToMainSite = () => {
    window.open('https://iterumfoods.xyz', '_blank');
  };

  // TODO: Replace these with your actual branding elements
  const branding = {
    // Colors - Update these to match your iterumfoods.xyz site
    colors: {
      primary: '#667eea',      // Main brand color
      secondary: '#764ba2',    // Secondary color
      accent: '#f093fb',       // Accent color
      text: '#2d3748',         // Text color
      textLight: '#718096',    // Light text
      background: '#ffffff',   // Background
      backgroundAlt: '#f7fafc', // Alt background
    },
    
    // Typography - Update to match your fonts
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif',
    },
    
    // Logo - Replace with your actual logo
    logo: {
      text: 'Iterum Foods',
      subtext: 'Restaurant Planning Platform',
    }
  };

  const features = [
    {
      icon: <Target className="w-8 h-8" style={{ color: branding.colors.primary }} />,
      title: "Complete Business Planning",
      description: "From concept to opening day - everything you need to plan your restaurant business."
    },
    {
      icon: <DollarSign className="w-8 h-8" style={{ color: branding.colors.secondary }} />,
      title: "Financial Projections",
      description: "Detailed financial modeling with market trends, labor costs, and 5-year projections."
    },
    {
      icon: <BarChart3 className="w-8 h-8" style={{ color: branding.colors.accent }} />,
      title: "Advanced Analytics",
      description: "Industry benchmarks, competitive analysis, and data-driven insights."
    },
    {
      icon: <Users className="w-8 h-8" style={{ color: branding.colors.primary }} />,
      title: "Team Collaboration",
      description: "Work together with your team to build the perfect restaurant concept."
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
      color: branding.colors.textLight
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
      color: branding.colors.primary
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
      color: branding.colors.secondary
    }
  ];

  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundColor: branding.colors.background,
        fontFamily: branding.fonts.body
      }}
    >
      {/* Navigation */}
      <nav 
        className="shadow-sm border-b border-gray-200"
        style={{ backgroundColor: branding.colors.background }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <img 
                  src="/logo.png" 
                  alt="Restauranteur System Logo" 
                  className="h-10 w-auto object-contain"
                />
                <div className="flex-shrink-0">
                  <h1 
                    className="text-2xl font-bold"
                    style={{ 
                      color: branding.colors.primary,
                      fontFamily: branding.fonts.heading
                    }}
                  >
                    {branding.logo.text}
                  </h1>
                  <p 
                    className="text-sm"
                    style={{ color: branding.colors.textLight }}
                  >
                    {branding.logo.subtext}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a 
                  href="#features" 
                  className="px-3 py-2 rounded-md text-sm font-medium hover:opacity-80 transition-opacity"
                  style={{ color: branding.colors.text }}
                >
                  Features
                </a>
                <a 
                  href="#pricing" 
                  className="px-3 py-2 rounded-md text-sm font-medium hover:opacity-80 transition-opacity"
                  style={{ color: branding.colors.text }}
                >
                  Pricing
                </a>
                <button
                  onClick={handleBackToMainSite}
                  className="px-3 py-2 rounded-md text-sm font-medium hover:opacity-80 transition-opacity flex items-center"
                  style={{ color: branding.colors.text }}
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Main Site
                </button>
                <button
                  onClick={handleLaunchApp}
                  className="px-4 py-2 rounded-md text-sm font-medium text-white hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: branding.colors.primary }}
                >
                  Launch App
                </button>
              </div>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="hover:opacity-80 transition-opacity"
                style={{ color: branding.colors.text }}
              >
                {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {showMobileMenu && (
          <div className="md:hidden">
            <div 
              className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200"
              style={{ backgroundColor: branding.colors.background }}
            >
              <a 
                href="#features" 
                className="block px-3 py-2 rounded-md text-base font-medium hover:opacity-80 transition-opacity"
                style={{ color: branding.colors.text }}
              >
                Features
              </a>
              <a 
                href="#pricing" 
                className="block px-3 py-2 rounded-md text-base font-medium hover:opacity-80 transition-opacity"
                style={{ color: branding.colors.text }}
              >
                Pricing
              </a>
              <button
                onClick={handleBackToMainSite}
                className="block px-3 py-2 rounded-md text-base font-medium hover:opacity-80 transition-opacity w-full text-left flex items-center"
                style={{ color: branding.colors.text }}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Main Site
              </button>
              <button
                onClick={handleLaunchApp}
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:opacity-90 transition-opacity w-full text-left"
                style={{ backgroundColor: branding.colors.primary }}
              >
                Launch App
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section 
        className="py-20"
        style={{ 
          background: `linear-gradient(135deg, ${branding.colors.backgroundAlt} 0%, ${branding.colors.primary}10 100%)`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              style={{ 
                color: branding.colors.text,
                fontFamily: branding.fonts.heading
              }}
            >
              Plan Your Restaurant
              <span style={{ color: branding.colors.primary }}> Like a Pro</span>
            </h1>
            <p 
              className="text-xl mb-8 max-w-3xl mx-auto"
              style={{ color: branding.colors.textLight }}
            >
              From concept to opening day, our comprehensive platform helps you plan, 
              analyze, and launch your restaurant business with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleLaunchApp}
                className="text-white px-8 py-4 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center"
                style={{ backgroundColor: branding.colors.primary }}
              >
                Start Planning Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button 
                className="px-8 py-4 rounded-lg text-lg font-semibold border hover:opacity-80 transition-opacity flex items-center justify-center"
                style={{ 
                  borderColor: branding.colors.primary,
                  color: branding.colors.primary
                }}
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ 
                color: branding.colors.text,
                fontFamily: branding.fonts.heading
              }}
            >
              Everything You Need to Launch
            </h2>
            <p 
              className="text-xl max-w-3xl mx-auto"
              style={{ color: branding.colors.textLight }}
            >
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
                <h3 
                  className="text-xl font-semibold mb-3"
                  style={{ 
                    color: branding.colors.text,
                    fontFamily: branding.fonts.heading
                  }}
                >
                  {feature.title}
                </h3>
                <p style={{ color: branding.colors.textLight }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section 
        id="pricing" 
        className="py-20"
        style={{ backgroundColor: branding.colors.backgroundAlt }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ 
                color: branding.colors.text,
                fontFamily: branding.fonts.heading
              }}
            >
              Simple, Transparent Pricing
            </h2>
            <p 
              className="text-xl max-w-3xl mx-auto"
              style={{ color: branding.colors.textLight }}
            >
              Choose the plan that fits your needs. All plans include a 5-day free trial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl shadow-lg overflow-hidden ${
                  plan.popular ? 'ring-2 scale-105' : ''
                }`}
                style={{ 
                  backgroundColor: branding.colors.background,
                  borderColor: plan.popular ? branding.colors.primary : 'transparent'
                }}
              >
                {plan.popular && (
                  <div 
                    className="absolute top-0 left-0 right-0 text-white text-center py-2 text-sm font-semibold"
                    style={{ backgroundColor: branding.colors.primary }}
                  >
                    <Star className="w-4 h-4 inline mr-1" />
                    Most Popular
                  </div>
                )}

                <div className="p-8">
                  <div className="text-center mb-8">
                    <h3 
                      className="text-2xl font-bold mb-2"
                      style={{ 
                        color: branding.colors.text,
                        fontFamily: branding.fonts.heading
                      }}
                    >
                      {plan.name}
                    </h3>
                    <div className="mb-4">
                      <span 
                        className="text-5xl font-bold"
                        style={{ color: branding.colors.text }}
                      >
                        {plan.price}
                      </span>
                      <span style={{ color: branding.colors.textLight }} className="ml-2">/{plan.period}</span>
                    </div>
                    <p style={{ color: branding.colors.textLight }}>
                      {plan.description}
                    </p>
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                        <span style={{ color: branding.colors.text }}>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleLaunchApp}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                      plan.popular ? 'text-white hover:opacity-90' : 'hover:opacity-80'
                    }`}
                    style={{ 
                      backgroundColor: plan.popular ? branding.colors.primary : branding.colors.backgroundAlt,
                      color: plan.popular ? 'white' : branding.colors.text
                    }}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-20 text-white"
        style={{ backgroundColor: branding.colors.primary }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: branding.fonts.heading }}
          >
            Ready to Launch Your Restaurant?
          </h2>
          <p 
            className="text-xl mb-8 max-w-3xl mx-auto opacity-90"
          >
            Join thousands of successful restaurateurs who used our platform to plan, 
            launch, and grow their businesses.
          </p>
          <button
            onClick={handleLaunchApp}
            className="bg-white px-8 py-4 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity flex items-center mx-auto"
            style={{ color: branding.colors.primary }}
          >
            <Zap className="w-5 h-5 mr-2" />
            Start Your Free Trial
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer 
        className="py-12 text-white"
        style={{ backgroundColor: branding.colors.text }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 
                className="text-xl font-bold mb-4"
                style={{ color: branding.colors.primary }}
              >
                {branding.logo.text}
              </h3>
              <p style={{ color: branding.colors.textLight }}>
                The complete restaurant planning platform for entrepreneurs.
              </p>
            </div>
            <div>
              <h4 
                className="font-semibold mb-4"
                style={{ color: branding.colors.background }}
              >
                Product
              </h4>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:opacity-80 transition-opacity" style={{ color: branding.colors.textLight }}>Features</a></li>
                <li><a href="#pricing" className="hover:opacity-80 transition-opacity" style={{ color: branding.colors.textLight }}>Pricing</a></li>
                <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ color: branding.colors.textLight }}>Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 
                className="font-semibold mb-4"
                style={{ color: branding.colors.background }}
              >
                Support
              </h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ color: branding.colors.textLight }}>Help Center</a></li>
                <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ color: branding.colors.textLight }}>Contact Us</a></li>
                <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ color: branding.colors.textLight }}>Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 
                className="font-semibold mb-4"
                style={{ color: branding.colors.background }}
              >
                Company
              </h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ color: branding.colors.textLight }}>About</a></li>
                <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ color: branding.colors.textLight }}>Blog</a></li>
                <li><a href="#" className="hover:opacity-80 transition-opacity" style={{ color: branding.colors.textLight }}>Careers</a></li>
              </ul>
            </div>
          </div>
          <div 
            className="border-t mt-8 pt-8 text-center"
            style={{ borderColor: branding.colors.textLight }}
          >
            <p style={{ color: branding.colors.textLight }}>
              &copy; 2024 {branding.logo.text}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default IterumBrandedLanding;
