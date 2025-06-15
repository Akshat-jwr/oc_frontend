'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';

interface DealsOfTheDayProps {
  products: Product[];
  isLoading?: boolean;
}

const DealsOfTheDay: React.FC<DealsOfTheDayProps> = ({ products, isLoading = false }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Calculate time left until end of day
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      
      const timeDiff = endOfDay.getTime() - now.getTime();
      
      if (timeDiff > 0) {
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        
        setTimeLeft({ hours, minutes, seconds });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const DealSkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm animate-pulse">
      <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
      <div className="p-4 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="flex space-x-2">
          <div className="h-5 bg-red-200 rounded w-1/3"></div>
          <div className="h-5 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );

  if (!isLoading && (!products || products.length === 0)) {
    return null; // Don't show section if no deals
  }

  return (
    <section className="bg-gradient-to-r from-red-500 to-pink-600 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="bg-white/20 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Deals of the Day</h2>
                <p className="text-white/80 text-sm">Limited time offers!</p>
              </div>
            </div>
            
            {/* Countdown Timer */}
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-white">
              <div className="text-xs font-medium mb-1">Ends in:</div>
              <div className="flex space-x-2 text-lg font-bold">
                <div className="text-center">
                  <span className="block">{timeLeft.hours.toString().padStart(2, '0')}</span>
                  <span className="text-xs font-normal">hrs</span>
                </div>
                <span>:</span>
                <div className="text-center">
                  <span className="block">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                  <span className="text-xs font-normal">min</span>
                </div>
                <span>:</span>
                <div className="text-center">
                  <span className="block">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                  <span className="text-xs font-normal">sec</span>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/deals"
            className="bg-white text-red-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            View All Deals
          </Link>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <DealSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {products.map((product) => (
              <div key={product._id} className="relative">
                {/* Deal Badge */}
                {product.discountPercentage > 0 && (
                  <div className="absolute top-2 left-2 z-10 bg-yellow-400 text-red-800 px-2 py-1 rounded-md text-xs font-bold shadow-lg">
                    🔥 {Math.round(product.discountPercentage)}% OFF
                  </div>
                )}
                <ProductCard product={product} variant="compact" />
              </div>
            ))}
          </div>
        )}

        {/* Flash Sale Banner */}
        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20">
          <h3 className="text-xl font-bold text-white mb-2">⚡ Flash Sale Alert!</h3>
          <p className="text-white/90 mb-4">Get extra 10% off on orders above ₹1999. Use code: <span className="font-bold bg-white/20 px-2 py-1 rounded">FLASH10</span></p>
          <Link
            href="/flash-sale"
            className="inline-block bg-yellow-400 text-red-800 px-6 py-2 rounded-lg font-bold hover:bg-yellow-300 transition-colors"
          >
            Shop Flash Sale
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DealsOfTheDay;
