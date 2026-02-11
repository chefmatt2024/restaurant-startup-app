import React from 'react';
import { 
  Code, 
  Database, 
  Cloud, 
  Shield, 
  Zap, 
  Globe,
  Smartphone,
  Server,
  Lock,
  CheckCircle
} from 'lucide-react';
import Footer from '../components/layout/Footer';

const TechPage = () => {
  const techStack = [
    {
      category: 'Frontend',
      icon: <Code className="w-8 h-8" />,
      technologies: [
        'React.js 18+',
        'Tailwind CSS',
        'Lucide React Icons',
        'Responsive Design',
        'Progressive Web App (PWA)'
      ]
    },
    {
      category: 'Backend & Infrastructure',
      icon: <Server className="w-8 h-8" />,
      technologies: [
        'Firebase Cloud Functions',
        'Firebase Authentication',
        'Firestore Database',
        'Firebase Hosting',
        'Firebase Analytics'
      ]
    },
    {
      category: 'Payment Processing',
      icon: <Lock className="w-8 h-8" />,
      technologies: [
        'Stripe API Integration',
        'Secure Payment Processing',
        'Subscription Management',
        'Customer Portal'
      ]
    },
    {
      category: 'AI & Analytics',
      icon: <Zap className="w-8 h-8" />,
      technologies: [
        'OpenAI API Integration',
        'Google Analytics 4',
        'Firebase Analytics',
        'Custom Event Tracking'
      ]
    },
    {
      category: 'Security & Compliance',
      icon: <Shield className="w-8 h-8" />,
      technologies: [
        'Firebase Security Rules',
        'HTTPS Encryption',
        'GDPR Compliant',
        'Data Privacy Protection'
      ]
    },
    {
      category: 'Mobile & Cross-Platform',
      icon: <Smartphone className="w-8 h-8" />,
      technologies: [
        'Responsive Mobile Design',
        'Touch-Optimized UI',
        'Cross-Browser Compatible',
        'iOS & Android Ready'
      ]
    }
  ];

  const features = [
    {
      title: 'Scalable Architecture',
      description: 'Built to handle growth from startup to enterprise scale',
      icon: <Cloud className="w-6 h-6" />
    },
    {
      title: 'Real-Time Updates',
      description: 'Live data synchronization across all devices',
      icon: <Zap className="w-6 h-6" />
    },
    {
      title: 'Global CDN',
      description: 'Fast loading times worldwide via Firebase CDN',
      icon: <Globe className="w-6 h-6" />
    },
    {
      title: '99.9% Uptime',
      description: 'Reliable infrastructure with automatic failover',
      icon: <CheckCircle className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/logo.png" 
                alt="Restauranteur System Logo" 
                className="h-10 w-auto object-contain"
              />
              <h1 className="text-2xl font-bold text-green-600">ITERUM FOODS</h1>
            </div>
            <a 
              href="/landing" 
              className="text-gray-600 hover:text-green-600 transition-colors"
            >
              Back to Landing
            </a>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Technology Stack
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Built with modern, scalable technologies to deliver a fast, secure, and reliable experience
            </p>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {techStack.map((stack, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="text-green-600 mr-3">
                  {stack.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {stack.category}
                </h3>
              </div>
              <ul className="space-y-2">
                {stack.technologies.map((tech, techIndex) => (
                  <li key={techIndex} className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">{tech}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Platform Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <div className="text-green-600">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-green-100 mb-6">
            Experience our technology firsthand with a free 5-day trial
          </p>
          <a
            href="/landing"
            className="inline-block bg-white text-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Start Free Trial
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TechPage;


