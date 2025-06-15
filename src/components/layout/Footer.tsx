'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCategories } from '@/hooks/useProducts';

const Footer: React.FC = () => {
  const { categories } = useCategories();

  const footerSections = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Story', href: '/story' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'Sustainability', href: '/sustainability' },
    ],
    customer: [
      { name: 'Contact Us', href: '/contact' },
      { name: 'Help Center', href: '/help' },
      { name: 'Track Your Order', href: '/track-order' },
      { name: 'Shipping Info', href: '/shipping' },
      { name: 'Returns & Exchanges', href: '/returns' },
      { name: 'Size Guide', href: '/size-guide' },
    ],
    policies: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Return Policy', href: '/return-policy' },
      { name: 'Refund Policy', href: '/refund-policy' },
      { name: 'Bulk Orders', href: '/bulk-orders' },
    ],
    connect: [
      { name: 'Facebook', href: 'https://facebook.com/omcreations', external: true },
      { name: 'Instagram', href: 'https://instagram.com/omcreations', external: true },
      { name: 'Twitter', href: 'https://twitter.com/omcreations', external: true },
      { name: 'YouTube', href: 'https://youtube.com/omcreations', external: true },
      { name: 'Pinterest', href: 'https://pinterest.com/omcreations', external: true },
    ],
  };

  const paymentMethods = [
    { name: 'Visa', icon: '💳' },
    { name: 'Mastercard', icon: '💳' },
    { name: 'UPI', icon: '📱' },
    { name: 'Razorpay', icon: '💰' },
    { name: 'Cash on Delivery', icon: '💵' },
  ];

  return (
    <footer className="bg-amazon-800 text-white">
      {/* Newsletter Subscription */}
      <div className="border-b border-amazon-700">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2">Stay Updated with Om Creations</h3>
              <p className="text-amazon-200">Get exclusive deals and new product updates delivered to your inbox.</p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-80 px-4 py-3 text-gray-900 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-amazon-500"
              />
              <button className="bg-amazon-600 hover:bg-amazon-500 px-6 py-3 rounded-r-lg font-semibold transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-amazon-600 text-white px-3 py-2 rounded-lg font-bold text-xl">
                OC
              </div>
              <div>
                <h2 className="text-lg font-bold">Om Creations</h2>
                <p className="text-sm text-amazon-200">Customized Gifts</p>
              </div>
            </Link>
            <p className="text-amazon-200 mb-4 text-sm leading-relaxed">
              Creating personalized gifts that tell your unique story. Quality craftsmanship, 
              fast delivery, and 100% satisfaction guaranteed.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <span>📍</span>
                <span className="text-amazon-200">Kolkata, West Bengal, India</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>📞</span>
                <span className="text-amazon-200">+91-9876543210</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>✉️</span>
                <span className="text-amazon-200">info@omcreations.com</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-lg mb-4">Shop Categories</h3>
            <ul className="space-y-2">
              {categories.slice(0, 6).map((category) => (
                <li key={category._id}>
                  <Link
                    href={`/category/${category._id}`}
                    className="text-amazon-200 hover:text-white transition-colors text-sm"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              {categories.length > 6 && (
                <li>
                  <Link
                    href="/categories"
                    className="text-amazon-400 hover:text-amazon-300 transition-colors text-sm font-medium"
                  >
                    View All Categories →
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              {footerSections.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-amazon-200 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-bold text-lg mb-4">Customer Service</h3>
            <ul className="space-y-2">
              {footerSections.customer.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-amazon-200 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies & Connect */}
          <div>
            <h3 className="font-bold text-lg mb-4">Legal & Connect</h3>
            <ul className="space-y-2 mb-6">
              {footerSections.policies.slice(0, 4).map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-amazon-200 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="font-semibold mb-3">Follow Us</h4>
            <div className="flex space-x-3">
              {footerSections.connect.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-amazon-700 hover:bg-amazon-600 rounded-full flex items-center justify-center transition-colors"
                  title={social.name}
                >
                  <span className="text-sm">
                    {social.name.charAt(0)}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-amazon-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            {/* Copyright */}
            <div className="text-center lg:text-left">
              <p className="text-amazon-200 text-sm">
                © {new Date().getFullYear()} Om Creations. All rights reserved.
              </p>
              <p className="text-amazon-300 text-xs mt-1">
                Made with ❤️ in India | GST: 19XXXXX1234X1XX
              </p>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-4">
              <span className="text-amazon-200 text-sm font-medium">We Accept:</span>
              <div className="flex space-x-2">
                {paymentMethods.map((method) => (
                  <div
                    key={method.name}
                    className="bg-white rounded px-2 py-1 flex items-center space-x-1"
                    title={method.name}
                  >
                    <span className="text-xs">{method.icon}</span>
                    <span className="text-xs text-gray-800 font-medium">
                      {method.name === 'Cash on Delivery' ? 'COD' : method.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Badges */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-600 px-3 py-1 rounded-full">
                <span className="text-xs">🔒</span>
                <span className="text-xs font-medium">SSL Secured</span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-600 px-3 py-1 rounded-full">
                <span className="text-xs">✓</span>
                <span className="text-xs font-medium">100% Safe</span>
              </div>
            </div>
          </div>

          {/* Mobile App Download Links */}
          <div className="mt-6 pt-6 border-t border-amazon-700 text-center">
            <p className="text-amazon-200 text-sm mb-3">Download our mobile app for exclusive deals</p>
            <div className="flex justify-center space-x-4">
              <a
                href="#"
                className="bg-black text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors"
              >
                <span className="text-lg">📱</span>
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </a>
              <a
                href="#"
                className="bg-black text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-gray-800 transition-colors"
              >
                <span className="text-lg">🤖</span>
                <div className="text-left">
                  <div className="text-xs">Get it on</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
