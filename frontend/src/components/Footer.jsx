import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaTwitter, FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const linkSections = [
    {
      title: 'Product',
      links: ['Features', 'Pricing', 'Integrations', 'Changelog'],
    },
    {
      title: 'Company',
      links: ['About', 'Blog', 'Careers', 'Contact'],
    },
    {
      title: 'Resources',
      links: ['Documentation', 'API Reference', 'Case Studies', 'Whitepapers'],
    },
    {
      title: 'Support',
      links: ['Help Center', 'Status', 'Terms of Service', 'Privacy Policy'],
    },
  ];

  const socialLinks = [
    { icon: <FaTwitter />, href: '#' },
    { icon: <FaGithub />, href: '#' },
    { icon: <FaLinkedin />, href: '#' },
    { icon: <FaInstagram />, href: '#' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="col-span-2 md:col-span-1 mb-8 md:mb-0">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-purple-600 rounded-lg">
                <FaSearch className="text-white h-5 w-5" />
              </div>
              <span className="text-2xl font-bold text-white">Searchify</span>
            </Link>
            <p className="text-gray-400">
              Powerful, AI-driven search for your documents.
            </p>
          </div>

          {/* Link Sections */}
          {linkSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-semibold mb-4 tracking-wider uppercase">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white hover:underline transition">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 sm:mb-0">
            © {new Date().getFullYear()} Searchify. All rights reserved.
          </p>
          <div className="flex items-center space-x-5">
            {socialLinks.map((social, index) => (
              <a key={index} href={social.href} className="text-gray-500 hover:text-white transition">
                {React.cloneElement(social.icon, { className: 'w-5 h-5' })}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 