import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Mail, Twitter, Linkedin, Heart, Code2, Sparkles } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Developers', path: '/developers' },
    { name: 'Contact', path: '/contact' },
    { name: 'Documentation', path: '/docs' }
  ];

  const features = [
    { name: 'Problem Generator', path: '/features/generator' },
    { name: 'Testcase Creator', path: '/features/testcase' },
    { name: 'Contest Hosting', path: '/features/contest' },
    { name: 'API Access', path: '/features/api' }
  ];

  const socialLinks = [
    { name: 'GitHub', icon: Github, url: 'https://github.com' },
    { name: 'Twitter', icon: Twitter, url: 'https://twitter.com' },
    { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com' },
    { name: 'Email', icon: Mail, url: 'mailto:support@autocp.com' }
  ];

  return (
    <footer className="bg-[#002029] text-gray-300 border-t border-[#004052]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Code2 className="text-[#005066]" size={28} />
              <h3 className="text-white text-xl font-bold">AutoCP</h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              AI-powered automated platform for generating competitive programming problems and testcases. Making CP accessible to all.
            </p>
            <div className="flex items-center space-x-2 text-[#005066]">
              <Sparkles size={16} />
              <span className="text-xs font-medium">Powered by AI</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-[#005066] transition-colors duration-200 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Features</h4>
            <ul className="space-y-2">
              {features.map((feature) => (
                <li key={feature.name}>
                  <Link
                    to={feature.path}
                    className="text-sm text-gray-400 hover:text-[#005066] transition-colors duration-200 inline-block"
                  >
                    {feature.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Connect With Us</h4>
            <div className="flex space-x-4 mb-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-[#00303d] rounded-lg text-[#005066] hover:bg-[#004052] hover:text-white transition-all duration-200"
                  aria-label={social.name}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
            <p className="text-sm text-gray-400">
              <span className="font-medium text-white">Support:</span>
              <br />
              <a href="mailto:support@autocp.com" className="hover:text-[#005066] transition-colors">
                support@autocp.com
              </a>
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#004052] pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-gray-400 text-center md:text-left">
              <p>© {currentYear} AutoCP. All rights reserved.</p>
            </div>

            {/* Made with Love */}
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Made with</span>
              <Heart size={16} className="text-red-500 fill-red-500" />
              <span>for Competitive Programmers</span>
            </div>

            {/* Legal Links */}
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-[#005066] transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-[#005066] transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
