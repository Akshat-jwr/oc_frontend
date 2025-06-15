'use client';

import React from 'react';
import Link from 'next/link';
import { Recommendation } from '@/types'; // ✅ Import Recommendation type
import ProductCard from '@/components/product/ProductCard';

interface PersonalizedSectionProps {
  recommendations: Recommendation[]; // ✅ Changed to Recommendation[]
  isLoading?: boolean;
  userName?: string;
}

const PersonalizedSection: React.FC<PersonalizedSectionProps> = ({
  recommendations,
  isLoading = false,
  userName = 'User'
}) => {
  const PersonalizedSkeleton = () => (
    <div className="bg-white/10 rounded-lg animate-pulse">
      <div className="aspect-square bg-white/20 rounded-t-lg"></div>
      <div className="p-3 space-y-2">
        <div className="h-3 bg-white/20 rounded w-3/4"></div>
        <div className="h-4 bg-white/20 rounded w-1/2"></div>
      </div>
    </div>
  );

  if (!isLoading && (!recommendations || recommendations.length === 0)) {
    return null; // Don't show section if no recommendations
  }

  return (
    <section className="bg-gradient-to-r from-purple-600 to-blue-600 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Just for you, {userName}! 
              </h2>
              <p className="text-white/80 text-sm">Handpicked based on your preferences</p>
            </div>
          </div>

          <Link
            href="/recommendations"
            className="text-white hover:text-purple-100 font-medium flex items-center group"
          >
            See all
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <PersonalizedSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {recommendations.map((recommendation, index) => (
              <div key={recommendation.product._id} className="relative">
                {/* Personalization Badge with Reason */}
                <div className="absolute top-2 right-2 z-10 bg-white/90 text-purple-600 px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                  {index === 0 ? '⭐ Top Pick' : 
                   recommendation.type === 'collaborative' ? '👥 Others liked' :
                   recommendation.type === 'content' ? '🎯 Similar items' :
                   recommendation.type === 'trending' ? '🔥 Trending' :
                   '👀 Recently viewed'}
                </div>

                {/* Score Badge (optional) */}
                {recommendation.score > 0.8 && (
                  <div className="absolute top-2 left-2 z-10 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    {Math.round(recommendation.score * 100)}% match
                  </div>
                )}

                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* ✅ Pass the product from recommendation */}
                  <ProductCard product={recommendation.product} variant="compact" />
                </div>

                {/* Recommendation Reason (optional tooltip) */}
                {recommendation.reason && (
                  <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white text-xs p-2 rounded opacity-0 hover:opacity-100 transition-opacity">
                    {recommendation.reason}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Personalization Note */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span className="text-white/90 text-sm">
              Powered by AI recommendations based on your activity
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PersonalizedSection;
