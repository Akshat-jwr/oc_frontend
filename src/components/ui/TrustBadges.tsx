// components/ui/TrustBadges.tsx

import React from 'react';
import { TruckIcon, ShieldCheckIcon, LockClosedIcon, SparklesIcon } from '@heroicons/react/24/outline';

const badges = [
  {
    icon: <TruckIcon className="w-8 h-8 text-green-600" />,
    title: 'Free Shipping',
    description: 'On all orders above ₹999',
  },
  {
    icon: <ShieldCheckIcon className="w-8 h-8 text-blue-600" />,
    title: 'Quality Assured',
    description: '100% authentic, high-quality products',
  },
  {
    icon: <LockClosedIcon className="w-8 h-8 text-purple-600" />,
    title: 'Secure Payments',
    description: 'Safe & secure online transactions',
  },
  {
    icon: <SparklesIcon className="w-8 h-8 text-red-600" />,
    title: 'Perfectly Custom',
    description: 'Personalized by you, crafted by us',
  },
];

const TrustBadges: React.FC = () => {
  return (
    <section className="bg-white py-6 border rounded-lg shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center md:text-left">
          {badges.map((badge, index) => (
            <div key={index} className="flex flex-col md:flex-row items-center gap-3 p-2">
              <div className="flex-shrink-0">{badge.icon}</div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">{badge.title}</h4>
                <p className="text-xs text-gray-600">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
