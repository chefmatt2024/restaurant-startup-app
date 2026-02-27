import React, { useState } from 'react';
import Footer from '../layout/Footer';
import { 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Target,
  Zap,
  Shield,
  Award,
  Globe,
  Building,
  CheckCircle,
  ArrowRight,
  Mail,
  Phone,
  FileText,
  PieChart,
  Rocket,
  Lightbulb,
  MapPin,
  X
} from 'lucide-react';

const InvestorLanding = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const marketOpportunity = {
    totalMarket: '$863B',
    addressableMarket: '$12.5B',
    targetMarket: '$2.1B',
    growthRate: '8.2%',
    description: 'The restaurant planning and management software market is rapidly growing as entrepreneurs seek professional tools to reduce failure rates.'
  };

  const traction = [
    { metric: '500+', label: 'Restaurants Planned', icon: <Building className="w-6 h-6" /> },
    { metric: '94%', label: 'Success Rate', icon: <Award className="w-6 h-6" /> },
    { metric: '$2.1M+', label: 'Avg Funding Raised', icon: <DollarSign className="w-6 h-6" /> },
    { metric: '6 months', label: 'Avg Time to Open', icon: <Rocket className="w-6 h-6" /> }
  ];

  const businessModel = {
    revenueStreams: [
      {
        name: 'SaaS Subscriptions',
        description: 'Monthly/annual subscriptions for restaurant planning tools',
        percentage: '70%',
        pricing: '$29-99/month'
      },
      {
        name: 'Enterprise Licenses',
        description: 'White-label and custom solutions for restaurant groups',
        percentage: '20%',
        pricing: 'Custom pricing'
      },
      {
        name: 'Professional Services',
        description: 'Consulting, training, and implementation services',
        percentage: '10%',
        pricing: 'Project-based'
      }
    ],
    unitEconomics: {
      cac: '$45',
      ltv: '$1,200',
      ltvCacRatio: '26.7x',
      paybackPeriod: '1.5 months',
      grossMargin: '85%'
    }
  };

  const competitiveAdvantages = [
    {
      title: 'Chef-Built Platform',
      description: 'Built by restaurant operators who understand the industry from the inside out',
      icon: <Award className="w-8 h-8" />
    },
    {
      title: 'Restaurant-Specific',
      description: 'Not generic business planning - every feature is designed for restaurants',
      icon: <Target className="w-8 h-8" />
    },
    {
      title: 'AI-Powered Insights',
      description: 'Advanced AI provides market analysis, financial projections, and strategic recommendations',
      icon: <Zap className="w-8 h-8" />
    },
    {
      title: 'Proven Track Record',
      description: '94% success rate with restaurants that complete the planning process',
      icon: <TrendingUp className="w-8 h-8" />
    }
  ];

  const roadmap = [
    {
      quarter: 'Q1 2025',
      milestones: [
        'Launch AI-powered market analysis',
        'Expand to 10 major markets',
        'Reach 1,000 active users'
      ]
    },
    {
      quarter: 'Q2 2025',
      milestones: [
        'Enterprise features launch',
        'API integrations with POS systems',
        'Mobile app release'
      ]
    },
    {
      quarter: 'Q3 2025',
      milestones: [
        'International expansion',
        'Franchise planning tools',
        'Partnership with restaurant associations'
      ]
    },
    {
      quarter: 'Q4 2025',
      milestones: [
        'Series A funding target',
        'Team expansion to 15',
        '10,000+ restaurants planned'
      ]
    },
    {
      quarter: 'Q1 2026',
      milestones: [
        'Advanced AI features rollout',
        'Multi-language support',
        '15,000+ restaurants planned'
      ]
    }
  ];

  const team = [
    {
      name: 'Chef Matt McPherson',
      role: 'Founder & CEO',
      background: 'Founder of Cafe Iterum. 20+ years in restaurant industry, opened multiple successful restaurants. Built this platform based on real-world experience operating restaurants.',
      linkedin: 'https://www.linkedin.com/in/chefmattmcpherson/',
      website: 'https://iterumfoods.xyz'
    },
    {
      name: 'Development Team',
      role: 'Full-Stack Engineers',
      background: 'Experienced in SaaS platforms, React, Firebase, AI integration'
    }
  ];

  const useOfFunds = [
    { category: 'Product Development', percentage: 40, amount: '$400K' },
    { category: 'Sales & Marketing', percentage: 30, amount: '$300K' },
    { category: 'Team Expansion', percentage: 20, amount: '$200K' },
    { category: 'Operations & Infrastructure', percentage: 10, amount: '$100K' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-green-600">🌿 ITERUM FOODS</h1>
            </div>
            <div className="flex items-center space-x-6">
              <a href="#overview" className="text-gray-600 hover:text-gray-900">Overview</a>
              <a href="#market" className="text-gray-600 hover:text-gray-900">Market</a>
              <a href="#traction" className="text-gray-600 hover:text-gray-900">Traction</a>
              <a href="#business-model" className="text-gray-600 hover:text-gray-900">Business Model</a>
              <a href="#team" className="text-gray-600 hover:text-gray-900">Team</a>
              <a href="#investment" className="text-gray-600 hover:text-gray-900">Investment</a>
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700">
                Request Deck
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="overview" className="pt-32 pb-20 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Rocket className="w-4 h-4 mr-2" />
              Seeking Seed/Series A Investment
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              The Restaurant Planning Platform
              <span className="block text-green-600">That Reduces Failure Rates</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Iterum Foods is a comprehensive SaaS platform that helps restaurant entrepreneurs 
              create investor-ready business plans, financial projections, and operational guides. 
              Built by Chef Matt McPherson, founder of Cafe Iterum, based on real-world experience 
              opening and operating successful restaurants.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center">
                <FileText className="w-5 h-5 mr-2" />
                Download Pitch Deck
              </button>
              <button className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-50 transition-colors flex items-center justify-center">
                <Mail className="w-5 h-5 mr-2" />
                Schedule Meeting
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                The Problem: 78% of Restaurants Fail
              </h2>
              <div className="space-y-4 text-gray-600">
                <p className="text-lg">
                  Restaurant entrepreneurs face massive challenges when starting a business:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <X className="w-6 h-6 text-red-500 mr-3 mt-1 flex-shrink-0" />
                    <span><strong>Poor Financial Planning:</strong> Unrealistic projections lead to cash flow problems</span>
                  </li>
                  <li className="flex items-start">
                    <X className="w-6 h-6 text-red-500 mr-3 mt-1 flex-shrink-0" />
                    <span><strong>Inadequate Market Research:</strong> Wrong location choices cost millions</span>
                  </li>
                  <li className="flex items-start">
                    <X className="w-6 h-6 text-red-500 mr-3 mt-1 flex-shrink-0" />
                    <span><strong>Lack of Operational Systems:</strong> No standardized processes or guides</span>
                  </li>
                  <li className="flex items-start">
                    <X className="w-6 h-6 text-red-500 mr-3 mt-1 flex-shrink-0" />
                    <span><strong>Expensive Consultants:</strong> Professional planning services cost $10K-$50K</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Solution</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Comprehensive Planning Platform</h4>
                    <p className="text-gray-600">All-in-one tool for business planning, financials, and operations</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">AI-Powered Market Analysis</h4>
                    <p className="text-gray-600">Intelligent insights for any market, any city</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Affordable SaaS Model</h4>
                    <p className="text-gray-600">$29-99/month vs. $10K+ for consultants</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Proven Results</h4>
                    <p className="text-gray-600">94% success rate for restaurants that complete planning. Built by Chef Matt McPherson, founder of Cafe Iterum.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Market Opportunity */}
      <section id="market" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Market Opportunity</h2>
            <p className="text-xl text-gray-600">A massive and growing market with clear demand</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <Globe className="w-8 h-8 text-blue-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-2">{marketOpportunity.totalMarket}</div>
              <div className="text-gray-600">Total Addressable Market</div>
              <div className="text-sm text-gray-500 mt-2">Global Restaurant Industry</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-2">{marketOpportunity.addressableMarket}</div>
              <div className="text-gray-600">Serviceable Addressable Market</div>
              <div className="text-sm text-gray-500 mt-2">Restaurant Planning Software</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <MapPin className="w-8 h-8 text-purple-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-2">{marketOpportunity.targetMarket}</div>
              <div className="text-gray-600">Serviceable Obtainable Market</div>
              <div className="text-sm text-gray-500 mt-2">5-Year Target</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-gray-900 mb-2">{marketOpportunity.growthRate}</div>
              <div className="text-gray-600">Annual Growth Rate</div>
              <div className="text-sm text-gray-500 mt-2">Market CAGR</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <p className="text-lg text-gray-700">{marketOpportunity.description}</p>
          </div>
        </div>
      </section>

      {/* Traction */}
      <section id="traction" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Proven Traction</h2>
            <p className="text-xl text-gray-600">Real results from real restaurants</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {traction.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
                  {item.icon}
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{item.metric}</div>
                <div className="text-gray-600">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Model */}
      <section id="business-model" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Business Model</h2>
            <p className="text-xl text-gray-600">Scalable SaaS with strong unit economics</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Revenue Streams</h3>
              <div className="space-y-6">
                {businessModel.revenueStreams.map((stream, index) => (
                  <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{stream.name}</h4>
                      <span className="text-green-600 font-bold">{stream.percentage}</span>
                    </div>
                    <p className="text-gray-600 mb-2">{stream.description}</p>
                    <p className="text-sm text-gray-500">Pricing: {stream.pricing}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Unit Economics</h3>
              <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer Acquisition Cost (CAC)</span>
                  <span className="font-bold text-gray-900">${businessModel.unitEconomics.cac}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lifetime Value (LTV)</span>
                  <span className="font-bold text-gray-900">${businessModel.unitEconomics.ltv}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">LTV:CAC Ratio</span>
                  <span className="font-bold text-green-600">{businessModel.unitEconomics.ltvCacRatio}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payback Period</span>
                  <span className="font-bold text-gray-900">{businessModel.unitEconomics.paybackPeriod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gross Margin</span>
                  <span className="font-bold text-green-600">{businessModel.unitEconomics.grossMargin}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Competitive Advantages */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Competitive Advantages</h2>
            <p className="text-xl text-gray-600">What sets us apart</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {competitiveAdvantages.map((advantage, index) => (
              <div key={index} className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6">
                <div className="text-green-600 mb-4">{advantage.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{advantage.title}</h3>
                <p className="text-gray-600">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Product Roadmap</h2>
            <p className="text-xl text-gray-600">Clear path to growth and expansion</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {roadmap.map((quarter, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-green-600 font-bold mb-4">{quarter.quarter}</div>
                <ul className="space-y-2">
                  {quarter.milestones.map((milestone, mIndex) => (
                    <li key={mIndex} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{milestone}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Team</h2>
            <p className="text-xl text-gray-600">Built by industry experts</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <div className="text-green-600 font-semibold mb-3">{member.role}</div>
                <p className="text-gray-600 mb-4">{member.background}</p>
                {member.linkedin && (
                  <div className="flex space-x-4">
                    <a 
                      href={member.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      LinkedIn
                    </a>
                    {member.website && (
                      <a 
                        href={member.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800 flex items-center"
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        Website
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Opportunity */}
      <section id="investment" className="py-20 bg-gradient-to-br from-green-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Investment Opportunity</h2>
            <p className="text-xl text-green-100">Join us in transforming restaurant entrepreneurship</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">Use of Funds</h3>
              <div className="space-y-4 mb-8">
                {useOfFunds.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">{item.category}</span>
                      <span>{item.amount}</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-white rounded-full h-2" 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="bg-white/10 rounded-lg p-6">
                <h4 className="font-bold mb-4">Investment Terms</h4>
                <ul className="space-y-2 text-green-100">
                  <li>• Seeking $1M Seed / $3M Series A</li>
                  <li>• Valuation: TBD (open to discussion)</li>
                  <li>• Use of funds: Product, Sales, Team</li>
                  <li>• Timeline: 12-18 months to Series A</li>
                </ul>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-6">Why Invest Now</h3>
              <div className="space-y-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-bold mb-2">Proven Product-Market Fit</h4>
                  <p className="text-green-100">94% success rate demonstrates clear value</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-bold mb-2">Strong Unit Economics</h4>
                  <p className="text-green-100">26.7x LTV:CAC ratio with 85% gross margins</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-bold mb-2">Large Addressable Market</h4>
                  <p className="text-green-100">$12.5B SAM with 8.2% annual growth</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-bold mb-2">Experienced Team</h4>
                  <p className="text-green-100">Founded by Chef Matt McPherson of Cafe Iterum, with 20+ years of real restaurant operating experience</p>
                </div>
              </div>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Request Pitch Deck
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors flex items-center justify-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Schedule Meeting
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Let's Talk</h2>
          <p className="text-xl text-gray-600 mb-8">Interested in learning more? We'd love to connect.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <a href="mailto:hello@iterumfoods.com" className="flex items-center justify-center text-gray-700 hover:text-green-600">
              <Mail className="w-5 h-5 mr-2" />
              hello@iterumfoods.com
            </a>
            <span className="hidden sm:inline text-gray-400">|</span>
            <a href="https://iterumfoods.xyz" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center text-gray-700 hover:text-green-600">
              <Globe className="w-5 h-5 mr-2" />
              iterumfoods.xyz
            </a>
            <span className="hidden sm:inline text-gray-400">|</span>
            <a href="https://www.linkedin.com/in/chefmattmcpherson/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center text-gray-700 hover:text-green-600">
              <Users className="w-5 h-5 mr-2" />
              Chef McPherson
            </a>
          </div>
          <div className="text-center">
            <p className="text-gray-600 mb-2">Learn more about our founder's restaurant:</p>
            <a href="https://iterumfoods.xyz" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 font-semibold">
              Cafe Iterum → iterumfoods.xyz
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

    </div>
  );
};

export default InvestorLanding;

