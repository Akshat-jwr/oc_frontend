'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';

interface ProductSectionProps {
  title: string;
  icon?: string;
  products: Product[];
  isLoading?: boolean;
  viewAllLink?: string;
  showViewAll?: boolean;
  variant?: 'default' | 'compact' | 'featured';
}

const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  icon,
  products,
  isLoading = false,
  viewAllLink,
  showViewAll = true,
  variant = 'default'
}) => {
  const ProductSkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm animate-pulse">
      <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
      <div className="p-4 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        <div className="h-5 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          {icon && <span className="text-2xl">{icon}</span>}
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
        
        {showViewAll && viewAllLink && !isLoading && products.length > 0 && (
          <Link
            href={viewAllLink}
            className="text-amazon-600 hover:text-amazon-700 font-medium flex items-center group"
          >
            View All
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {products.map((product) => (
            <ProductCard 
              key={product._id} 
              product={product} 
              variant={variant}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No products available</h3>
          <p className="text-gray-600">Check back later for amazing deals!</p>
        </div>
      )}
    </div>
  );
};

export default ProductSection;
