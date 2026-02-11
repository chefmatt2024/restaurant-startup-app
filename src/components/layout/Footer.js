import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/logo.png" 
                alt="Restauranteur System Logo" 
                className="h-8 w-auto object-contain"
              />
              <h3 className="text-xl font-bold text-white">ITERUM FOODS</h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Empowering restaurant entrepreneurs with the tools they need to plan, launch, and grow successful businesses.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/landing" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
                  Main Landing
                </Link>
              </li>
              <li>
                <Link to="/investors" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
                  Investors
                </Link>
              </li>
              <li>
                <Link to="/tech" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
                  Tech Page
                </Link>
              </li>
              <li>
                <Link to="/sitemap" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
                  Site Map
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <a href="https://iterumfoods.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
                  About Iterum Foods
                </a>
              </li>
              <li>
                <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
                  XML Sitemap
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="w-4 h-4 mr-2 mt-1 flex-shrink-0 text-green-400" />
                <a href="mailto:hello@iterumfoods.com" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
                  hello@iterumfoods.com
                </a>
              </li>
              <li className="flex items-start">
                <Phone className="w-4 h-4 mr-2 mt-1 flex-shrink-0 text-green-400" />
                <a href="tel:+1-555-000-0000" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
                  (555) 000-0000
                </a>
              </li>
              <li className="flex items-start">
                <MapPin className="w-4 h-4 mr-2 mt-1 flex-shrink-0 text-green-400" />
                <span className="text-gray-400 text-sm">
                  Boston, MA
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © {currentYear} Iterum Foods. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/faq" className="text-sm text-gray-400 hover:text-green-400 transition-colors">
                FAQ
              </Link>
              <Link to="/terms" className="text-sm text-gray-400 hover:text-green-400 transition-colors">
                Terms
              </Link>
              <Link to="/privacy" className="text-sm text-gray-400 hover:text-green-400 transition-colors">
                Privacy
              </Link>
              <Link to="/sitemap" className="text-sm text-gray-400 hover:text-green-400 transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

