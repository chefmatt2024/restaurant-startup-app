import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  Users, 
  FileText, 
  Shield, 
  Code,
  Map
} from 'lucide-react';
import Footer from '../components/layout/Footer';

const SitemapPage = () => {
  const siteMap = [
    {
      category: 'Main Pages',
      icon: <Home className="w-5 h-5" />,
      links: [
        { path: '/', label: 'Dashboard', description: 'Main application dashboard' },
        { path: '/landing', label: 'Main Landing', description: 'Customer landing page' },
        { path: '/dashboard', label: 'Dashboard (Alt)', description: 'Alternative dashboard route' }
      ]
    },
    {
      category: 'Investor & Business',
      icon: <Users className="w-5 h-5" />,
      links: [
        { path: '/investors', label: 'Investors', description: 'Investor pitch and information' },
        { path: '/restaurant-startup-app', label: 'Restaurant Startup App', description: 'Investor landing page' }
      ]
    },
    {
      category: 'Technology',
      icon: <Code className="w-5 h-5" />,
      links: [
        { path: '/tech', label: 'Tech Page', description: 'Technology stack and platform details' }
      ]
    },
    {
      category: 'Legal & Privacy',
      icon: <Shield className="w-5 h-5" />,
      links: [
        { path: '/terms', label: 'Terms of Service', description: 'Terms and conditions' },
        { path: '/privacy', label: 'Privacy Policy', description: 'Privacy and data protection policy' }
      ]
    },
    {
      category: 'Resources',
      icon: <FileText className="w-5 h-5" />,
      links: [
        { path: '/sitemap', label: 'Site Map', description: 'Complete site navigation' },
        { path: '/sitemap.xml', label: 'XML Sitemap', description: 'Search engine sitemap', external: true }
      ]
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
            <Map className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Site Map
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              Navigate through all pages and resources on our platform
            </p>
          </div>
        </div>
      </div>

      {/* Site Map Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {siteMap.map((section, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 border border-gray-200"
            >
              <div className="flex items-center mb-4">
                <div className="text-green-600 mr-3">
                  {section.icon}
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {section.category}
                </h2>
              </div>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link.external ? (
                      <a
                        href={link.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-green-600 hover:text-green-700 font-medium transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.path}
                        className="block text-green-600 hover:text-green-700 font-medium transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      {link.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
            Quick Links
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/landing"
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Main Landing
            </Link>
            <Link
              to="/investors"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Investors
            </Link>
            <Link
              to="/tech"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Tech Page
            </Link>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              XML Sitemap
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SitemapPage;


