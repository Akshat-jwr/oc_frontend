// components/layout/Footer.tsx

import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  const footerLinks = {
    'Get to Know Us': [
      { name: 'About Us', href: '/about' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Careers', href: '/careers' },
    ],
    'Let Us Help You': [
      { name: 'Your Account', href: '/profile' },
      { name: 'Your Orders', href: '/orders' },
      { name: 'Shipping Policy', href: '/shipping' },
      { name: 'Returns & Replacements', href: '/returns' },
    ],
    'Policies': [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cancellation Policy', href: '/cancellation' },
    ],
  };

  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">{title}</h3>
              <ul className="mt-4 space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-base text-gray-400 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {/* Newsletter Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Stay Connected</h3>
            <p className="mt-4 text-base text-gray-400">Get exclusive deals and updates delivered to your inbox.</p>
            <form className="mt-4 flex sm:flex-col lg:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-md bg-gray-700 border-transparent focus:ring-2 focus:ring-amazon-500 text-white placeholder-gray-500"
              />
              <button
                type="submit"
                className="bg-amazon-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-amazon-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-base text-gray-400">&copy; {new Date().getFullYear()} Om Creations. All Rights Reserved.</p>
          {/* Social Media Icons would go here */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
