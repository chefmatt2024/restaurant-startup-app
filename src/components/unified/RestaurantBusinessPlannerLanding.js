import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  ArrowRight, 
  Star, 
  ExternalLink,
  Menu,
  X,
  Users,
  DollarSign,
  Target,
  Zap,
  CheckCircle,
  Clock,
  TrendingUp,
  Shield,
  Award,
  Phone,
  Mail,
  Play,
  MapPin,
  Calendar,
  Building,
  ChefHat,
  Utensils
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const RestaurantBusinessPlannerLanding = () => {
  const { state, actions } = useApp();
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [email, setEmail] = useState('');
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  // Track scroll position for sticky CTA
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLaunchRestaurantPlanner = () => {
    // Track conversion event
    if (window.gtag) {
      window.gtag('event', 'click', {
        event_category: 'CTA',
        event_label: 'Start Free Trial',
        value: 1
      });
    }
    
    // Trigger trial signup flow
    actions.setActiveTab('trial-signup');
  };

  const handleJoinWaitlist = (appName) => {
    setShowWaitlist(true);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    console.log('Email submitted:', email);
    setShowWaitlist(false);
    setEmail('');
    actions.showMessage('Success', 'You\'ve been added to the waitlist! We\'ll notify you when this app launches.', 'success');
  };

  // Real success stories with specific results
  const successStories = [
    {
      name: "Maria Santos",
      restaurant: "Bella Vista Italian",
      location: "Boston, MA",
      image: "👩‍🍳",
      result: "Secured $180K in funding",
      quote: "The financial projections were so detailed that my investors said it was the most professional business plan they'd ever seen from a first-time restaurateur.",
      timeframe: "Opened in 6 months"
    },
    {
      name: "David Kim",
      restaurant: "K-Town BBQ",
      location: "Austin, TX", 
      image: "👨‍🍳",
      result: "$320K Series A funding",
      quote: "The market analysis helped me identify the perfect location and pricing strategy. We're already profitable in month 3.",
      timeframe: "Profitable in 3 months"
    },
    {
      name: "Sarah Johnson",
      restaurant: "The Green Table",
      location: "Portland, OR",
      image: "👩‍💼",
      result: "Sold for $2.1M",
      quote: "Used the platform to plan my farm-to-table concept. The operational guides saved me thousands in consulting fees.",
      timeframe: "Sold after 2 years"
    }
  ];

  const stats = [
    { number: "500+", label: "Restaurants Planned", icon: <BarChart3 className="w-6 h-6" /> },
    { number: "$2.1M+", label: "Average Funding Raised", icon: <DollarSign className="w-6 h-6" /> },
    { number: "94%", label: "Success Rate", icon: <TrendingUp className="w-6 h-6" /> },
    { number: "6", label: "Months Avg to Open", icon: <Clock className="w-6 h-6" /> }
  ];

  const features = [
    {
      icon: <BarChart3 className="w-8 h-8 text-green-600" />,
      title: "Investor-Ready Financial Models",
      description: "Detailed 3-year projections with industry-specific metrics that investors trust and understand.",
      benefit: "Secure funding faster"
    },
    {
      icon: <MapPin className="w-8 h-8 text-blue-600" />,
      title: "Market Research & Location Analysis",
      description: "Comprehensive competitive analysis, demographic research, and location scoring algorithms.",
      benefit: "Choose the perfect location"
    },
    {
      icon: <ChefHat className="w-8 h-8 text-purple-600" />,
      title: "Menu Engineering & Pricing",
      description: "Food cost analysis, menu optimization, and pricing strategies that maximize profitability.",
      benefit: "Increase profit margins by 25%"
    },
    {
      icon: <Building className="w-8 h-8 text-orange-600" />,
      title: "Operations & Compliance Guide",
      description: "Step-by-step permit tracking, health department requirements, and operational procedures.",
      benefit: "Avoid costly mistakes"
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Business Concept",
      description: "Define your vision, target market, and unique value proposition",
      time: "1-2 weeks",
      icon: <Target className="w-6 h-6" />
    },
    {
      step: "02", 
      title: "Market Research",
      description: "Analyze competition, demographics, and market opportunity",
      time: "2-3 weeks",
      icon: <MapPin className="w-6 h-6" />
    },
    {
      step: "03",
      title: "Financial Planning",
      description: "Create detailed projections and funding strategy",
      time: "2-3 weeks", 
      icon: <BarChart3 className="w-6 h-6" />
    },
    {
      step: "04",
      title: "Operations Setup",
      description: "Equipment, staffing, permits, and launch preparation",
      time: "4-6 weeks",
      icon: <Utensils className="w-6 h-6" />
    }
  ];

  const pricingPlans = [
    {
      name: "Free Trial",
      price: "$0",
      period: "14 days",
      description: "Full access to test the platform",
      features: [
        "Complete Restaurant Business Planner",
        "All financial modeling tools", 
        "Market research templates",
        "Equipment planning guides",
        "Email support"
      ],
      cta: "Start Free Trial",
      popular: false,
      color: "gray",
      savings: null
    },
    {
      name: "Professional",
      price: "$29",
      period: "per month",
      description: "For serious entrepreneurs",
      features: [
        "Everything in Free Trial",
        "Advanced analytics & reports",
        "Priority support",
        "PDF/Excel exports", 
        "Team collaboration (up to 5 users)",
        "Custom templates",
        "Investment pitch deck builder",
        "Monthly expert consultations"
      ],
      cta: "Start Free Trial",
      popular: true,
      color: "green",
      savings: "Save $348/year"
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "per month",
      description: "For teams & organizations",
      features: [
        "Everything in Professional",
        "Unlimited team members",
        "White-label options",
        "API access",
        "Dedicated account manager", 
        "Custom integrations",
        "Phone & video support",
        "Custom training sessions"
      ],
      cta: "Contact Sales",
      popular: false,
      color: "blue",
      savings: "Save $1,188/year"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-blue-50">
      {/* Sticky Header with CTA */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollY > 100 ? 'bg-white shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-green-600">🌿 ITERUM FOODS</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowVideoModal(true)}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <Play className="w-4 h-4 mr-2" />
                Watch Demo
              </button>
              <button
                onClick={handleLaunchRestaurantPlanner}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 shadow-lg"
              >
                Start Free Trial
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="pt-20 pb-16 bg-gradient-to-r from-green-600 via-green-700 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Award className="w-4 h-4 mr-2" />
              Trusted by 500+ Restaurant Entrepreneurs
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Launch Your Restaurant
              <span className="block text-green-200">Like a Pro</span>
            </h1>
            
            <p className="text-xl text-green-100 mb-8 max-w-4xl mx-auto">
              The only restaurant planning platform built by chefs who actually opened restaurants. 
              Get investor-ready business plans, financial projections, and step-by-step guidance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={handleLaunchRestaurantPlanner}
                className="bg-white text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center shadow-xl"
              >
                <Zap className="w-5 h-5 mr-2" />
                Start Your Free 14-Day Trial
              </button>
              <button
                onClick={() => setShowVideoModal(true)}
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-green-600 transition-colors duration-200 flex items-center justify-center"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch 2-Min Demo
              </button>
            </div>
            
            <div className="flex items-center justify-center space-x-6 text-green-200 text-sm">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Cancel anytime
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Full access during trial
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof Stats */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Problem/Solution Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why 78% of Restaurants Fail in the First Year
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <X className="w-6 h-6 text-red-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Poor financial planning</h3>
                    <p className="text-gray-600">Unrealistic projections lead to cash flow problems</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <X className="w-6 h-6 text-red-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Wrong location choice</h3>
                    <p className="text-gray-600">Inadequate market research leads to poor foot traffic</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <X className="w-6 h-6 text-red-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Operational chaos</h3>
                    <p className="text-gray-600">Lack of systems and procedures causes daily problems</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                The Iterum Foods Advantage
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Restaurant-Specific Planning</h4>
                    <p className="text-gray-600">Built by chefs who actually opened restaurants</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Investor-Ready Financials</h4>
                    <p className="text-gray-600">Detailed projections that investors trust and understand</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Complete Operational Guide</h4>
                    <p className="text-gray-600">Everything from permits to equipment to staff training</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Launch Successfully
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools and insights you need 
              to plan, fund, and launch your restaurant business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div className="ml-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {feature.description}
                    </p>
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <Target className="w-4 h-4 mr-1" />
                      {feature.benefit}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Your Path to Restaurant Success
            </h2>
            <p className="text-xl text-gray-600">
              Follow our proven 4-step process to launch your restaurant
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative">
                  <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                    {step.step}
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-green-300 transform translate-x-8"></div>
                  )}
                </div>
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {step.description}
                </p>
                <div className="text-sm font-medium text-green-600">
                  <Clock className="w-4 h-4 inline mr-1" />
                  {step.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Success Stories Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Real Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              See how our platform helped these entrepreneurs achieve their dreams
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <div key={index} className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-4">{story.image}</div>
                  <h3 className="text-xl font-semibold text-gray-900">{story.name}</h3>
                  <p className="text-green-600 font-medium">{story.restaurant}</p>
                  <p className="text-gray-500 text-sm">{story.location}</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 mb-4">
                  <p className="text-gray-600 italic mb-4">
                    "{story.quote}"
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Result:</span>
                    <span className="text-sm font-semibold text-green-600">{story.result}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Timeline:</span>
                    <span className="text-sm font-semibold text-blue-600">{story.timeframe}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Start with a free trial. No hidden fees, no surprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative rounded-2xl shadow-lg overflow-hidden ${
                  plan.popular ? 'ring-2 ring-green-500 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-center py-2 text-sm font-semibold">
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
                    <p className="text-gray-600 mb-2">
                      {plan.description}
                    </p>
                    {plan.savings && (
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <Zap className="w-4 h-4 mr-1" />
                        {plan.savings}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleLaunchRestaurantPlanner}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                      plan.popular
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              <Shield className="w-4 h-4 inline mr-2 text-green-500" />
              Secure payment processing • Cancel anytime • 14-day free trial
            </p>
          </div>
        </div>
      </div>

      {/* Urgency/Scarcity Section */}
      <div className="py-16 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Limited Time: Early Bird Pricing
          </h2>
          <p className="text-xl mb-6">
            Join the first 100 restaurant entrepreneurs and get lifetime access to our Professional plan for just $29/month.
          </p>
          <div className="flex items-center justify-center mb-8">
            <Clock className="w-6 h-6 mr-2" />
            <span className="text-lg font-semibold">
              Only 47 spots remaining
            </span>
          </div>
          <button
            onClick={handleLaunchRestaurantPlanner}
            className="bg-white text-orange-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-xl"
          >
            Claim Your Spot Now
          </button>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Launch Your Restaurant Dream?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join hundreds of successful restaurateurs who used our platform to turn their vision into reality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleLaunchRestaurantPlanner}
              className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
            >
              <Zap className="w-5 h-5 mr-2" />
              Start Your Free Trial
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors duration-200 flex items-center justify-center">
              <Phone className="w-5 h-5 mr-2" />
              Schedule Demo Call
            </button>
          </div>
          <p className="text-gray-400 mt-6 text-sm">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Restaurant Business Planner Demo</h3>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Demo video would be embedded here</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Waitlist Modal */}
      {showWaitlist && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Join the Waitlist</h3>
            <p className="text-gray-600 mb-6">
              Be the first to know when this app launches. Get early access and special pricing.
            </p>
            <form onSubmit={handleEmailSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                required
              />
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Join Waitlist
                </button>
                <button
                  type="button"
                  onClick={() => setShowWaitlist(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantBusinessPlannerLanding;
