import React from 'react';
import { ShoppingBagIcon, UserGroupIcon, StarIcon, TruckIcon } from '@heroicons/react/24/outline';

const stats = [
  {
    id: 1,
    name: 'Happy Customers',
    stat: '10,000+',
    icon: UserGroupIcon,
    color: 'text-blue-600 bg-blue-100'
  },
  {
    id: 2,
    name: 'Products Sold',
    stat: '50,000+',
    icon: ShoppingBagIcon,
    color: 'text-green-600 bg-green-100'
  },
  {
    id: 3,
    name: 'Average Rating',
    stat: '4.8/5',
    icon: StarIcon,
    color: 'text-yellow-600 bg-yellow-100'
  },
  {
    id: 4,
    name: 'Fast Delivery',
    stat: '24-48h',
    icon: TruckIcon,
    color: 'text-purple-600 bg-purple-100'
  },
];

const StatsSection: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-amazon-600 to-amazon-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Choose Om Creations?
          </h2>
          <p className="text-xl text-amazon-100 max-w-3xl mx-auto">
            Join thousands of satisfied customers who trust us for quality handcrafted products
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((item) => (
            <div key={item.id} className="text-center">
              <div className={`w-16 h-16 ${item.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <item.icon className="h-8 w-8" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{item.stat}</div>
              <div className="text-amazon-100 font-medium">{item.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
