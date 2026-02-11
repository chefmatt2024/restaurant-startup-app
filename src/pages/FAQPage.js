import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  Shield,
  CreditCard,
  Download,
  FileText,
  Users,
  Zap,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Mail
} from 'lucide-react';
import Footer from '../components/layout/Footer';

// FAQ Item Component
const FAQItem = ({ question, answer, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-200 hover:border-green-400 hover:shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-inset"
      >
        <div className="flex items-start space-x-4 flex-1">
          {Icon && (
            <div className="flex-shrink-0 mt-1">
              <Icon className="w-5 h-5 text-green-600" />
            </div>
          )}
          <h3 className="text-lg font-semibold text-gray-900 pr-4">
            {question}
          </h3>
        </div>
        <div className="flex-shrink-0">
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-green-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>
      {isOpen && (
        <div className="px-6 pb-5 pt-0 border-t border-gray-100">
          <div className="pt-4 text-gray-600 leading-relaxed whitespace-pre-line">
            {answer}
          </div>
        </div>
      )}
    </div>
  );
};

const FAQPage = () => {
  const faqCategories = [
    {
      title: 'Getting Started',
      icon: Zap,
      questions: [
        {
          question: 'What is Restaurant Business Planner?',
          answer: 'Restaurant Business Planner is a comprehensive platform that helps aspiring restaurateurs plan, budget, and launch their restaurant business. It includes:\n\n• Financial projections and scenario planning\n• Market analysis and competitive research\n• Compliance tracking (permits, licenses, inspections)\n• Document management and vendor contracts\n• AI-powered insights and recommendations\n• Business plan generation\n• Menu planning and cost analysis',
          icon: HelpCircle
        },
        {
          question: 'Do I need experience to use this platform?',
          answer: 'No! Our platform is designed for both first-time restaurateurs and experienced operators. We provide:\n\n• Step-by-step guidance throughout the process\n• Pre-filled templates for different restaurant types\n• AI assistance for business planning\n• Comprehensive tutorials and help resources\n• Real-world examples and benchmarks',
          icon: Users
        },
        {
          question: 'How do I get started?',
          answer: 'Getting started is easy:\n\n1. Sign up for a free 5-day trial (no credit card required)\n2. Choose a restaurant template or start from scratch\n3. Follow the guided onboarding process\n4. Begin building your business plan\n5. Use our tools to create financial projections\n6. Track permits and compliance requirements\n\nYou can explore all features during your free trial!',
          icon: Zap
        }
      ]
    },
    {
      title: 'Free Trial & Pricing',
      icon: DollarSign,
      questions: [
        {
          question: 'How does the free trial work?',
          answer: 'Our free trial gives you full access to all features for 5 days:\n\n• No credit card required to start\n• Access to all premium features\n• Create unlimited business plans\n• Export your documents\n• Use AI-powered tools\n• Track compliance and permits\n\nAt the end of your trial, you can choose to subscribe to continue using the platform.',
          icon: Clock
        },
        {
          question: 'What happens after my trial ends?',
          answer: 'When your 5-day trial ends:\n\n• Your data is safely stored\n• You\'ll receive a reminder before the trial expires\n• You can upgrade to a paid plan to continue\n• If you don\'t upgrade, your account will be paused\n• You can reactivate anytime by subscribing\n• All your work remains accessible once you subscribe',
          icon: XCircle
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit and debit cards:\n\n• Visa\n• Mastercard\n• American Express\n• Discover\n\nPayments are processed securely through Stripe. We do not store your payment information on our servers.',
          icon: CreditCard
        },
        {
          question: 'Can I cancel anytime?',
          answer: 'Yes! You can cancel your subscription at any time:\n\n• No long-term contracts\n• Cancel from your account settings\n• Your subscription will remain active until the end of your billing period\n• You\'ll continue to have access until the period ends\n• No cancellation fees\n• You can resubscribe anytime',
          icon: CheckCircle
        },
        {
          question: 'Are there different pricing plans?',
          answer: 'Yes! We offer flexible pricing plans to suit different needs:\n\n• Starter Plan: Perfect for solo entrepreneurs\n• Professional Plan: For growing businesses\n• Enterprise Plan: For multiple locations or teams\n\nAll plans include the core features. Higher tiers offer more advanced analytics, priority support, and additional collaboration tools.',
          icon: DollarSign
        }
      ]
    },
    {
      title: 'Features & Usage',
      icon: FileText,
      questions: [
        {
          question: 'Can I export my business plan?',
          answer: 'Absolutely! You can export your work in multiple formats:\n\n• PDF export for business plans\n• Word document export\n• Excel spreadsheets for financial data\n• CSV files for data analysis\n• Print-ready formats\n\nPerfect for sharing with investors, lenders, partners, or for your own records.',
          icon: Download
        },
        {
          question: 'How do I track permits and licenses?',
          answer: 'Our compliance tracking system helps you:\n\n• See all required permits by government level (Federal, State, City)\n• Track application status (submitted, approved, pending)\n• Store submitted applications and official copies\n• Set expiration dates and renewal reminders\n• Upload and organize compliance documents\n• Never miss a renewal deadline',
          icon: Shield
        },
        {
          question: 'Can I manage vendor contracts?',
          answer: 'Yes! Our vendor management system includes:\n\n• Store vendor contact information\n• Upload contracts and terms of service\n• AI-powered contract summarization\n• Track payment terms and agreements\n• Organize by category and priority\n• Link official contracts to applications',
          icon: FileText
        },
        {
          question: 'What financial projections can I create?',
          answer: 'You can create comprehensive financial projections:\n\n• Sales projections by service type (lunch, dinner, brunch)\n• Operating cost estimates\n• Startup cost planning\n• Break-even analysis\n• Multiple scenario planning\n• Monthly financial statements\n• Compare actual vs. forecasted expenses\n• Funding gap analysis',
          icon: DollarSign
        },
        {
          question: 'Can I use restaurant templates?',
          answer: 'Yes! We offer pre-filled templates for:\n\n• Italian restaurants\n• Fast casual concepts\n• Fine dining establishments\n• Food trucks\n• Coffee shops and cafes\n• BBQ and smokehouses\n• And more!\n\nTemplates include initial financial data, menu ideas, and business plan sections to get you started quickly.',
          icon: Users
        }
      ]
    },
    {
      title: 'Security & Data',
      icon: Shield,
      questions: [
        {
          question: 'Is my data secure?',
          answer: 'Yes, we take data security seriously:\n\n• All data is encrypted in transit and at rest\n• Secure authentication with Firebase\n• Regular security audits\n• GDPR and privacy compliant\n• Your data is never shared with third parties\n• You own all your data\n• Regular backups ensure your work is safe',
          icon: Shield
        },
        {
          question: 'Can I delete my account?',
          answer: 'Yes, you can delete your account at any time:\n\n• Go to your account settings\n• Request account deletion\n• All your data will be permanently removed\n• This action cannot be undone\n• You can export your data before deletion\n• Contact support if you need assistance',
          icon: XCircle
        },
        {
          question: 'Where is my data stored?',
          answer: 'Your data is stored securely:\n\n• Hosted on Google Cloud Platform (Firebase)\n• Data centers in the United States\n• Compliant with industry security standards\n• Regular backups and redundancy\n• Your data is accessible only to you\n• We never access your data without permission',
          icon: Shield
        }
      ]
    },
    {
      title: 'Support & Help',
      icon: HelpCircle,
      questions: [
        {
          question: 'How do I get help or support?',
          answer: 'We offer multiple ways to get help:\n\n• Email: hello@iterumfoods.com\n• In-app help center (coming soon)\n• Video tutorials\n• FAQ section (this page!)\n• User guides and documentation\n\nWe typically respond to support requests within 24 hours.',
          icon: HelpCircle
        },
        {
          question: 'Do you offer training or onboarding?',
          answer: 'Yes! We provide:\n\n• Interactive welcome tour for new users\n• Getting started checklist\n• Quick-start templates\n• Step-by-step guidance throughout the app\n• Video tutorials (coming soon)\n• Comprehensive help documentation',
          icon: Users
        },
        {
          question: 'Can I request new features?',
          answer: 'Absolutely! We love feedback:\n\n• Use the feedback button in the app\n• Email us with feature requests\n• We regularly review and implement user suggestions\n• Your input helps us improve the platform\n• Join our community to discuss ideas',
          icon: Zap
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 rounded-full p-4">
                <HelpCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to know about Restaurant Business Planner. Can't find what you're looking for? 
              <a href="mailto:hello@iterumfoods.com" className="text-green-600 hover:text-green-700 font-medium ml-1">
                Contact us
              </a>.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {faqCategories.map((category, categoryIndex) => {
          const CategoryIcon = category.icon;
          return (
            <div key={categoryIndex} className="mb-12">
              <div className="flex items-center space-x-3 mb-6">
                <CategoryIcon className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  {category.title}
                </h2>
              </div>
              <div className="space-y-4">
                {category.questions.map((faq, index) => (
                  <FAQItem
                    key={index}
                    question={faq.question}
                    answer={faq.answer}
                    icon={faq.icon}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {/* Still Have Questions */}
        <div className="mt-16 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 border border-green-200">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6">
              We're here to help! Reach out to our support team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:hello@iterumfoods.com"
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center justify-center"
              >
                <Mail className="w-5 h-5 mr-2" />
                Email Support
              </a>
              <a
                href="/landing"
                className="px-6 py-3 bg-white text-green-600 rounded-lg font-semibold border-2 border-green-600 hover:bg-green-50 transition-colors inline-flex items-center justify-center"
              >
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FAQPage;

