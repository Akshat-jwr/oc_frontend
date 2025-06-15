'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types';

interface CategoryGridProps {
  categories: Category[];
  isLoading?: boolean;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories, isLoading = false }) => {
  const CategorySkeleton = () => (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 animate-pulse">
      <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {[...Array(8)].map((_, i) => (
          <CategorySkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!categories.length) {
    return (
      <div className="text-center py-12 bg-white rounded-lg">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No categories available</h3>
        <p className="text-gray-600">Categories will appear here once they're created.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
      {categories.map((category) => (
        <Link
          key={category._id}
          href={`/category/${category._id}`}
          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-4 group"
        >
          <div className="aspect-square relative mb-3 overflow-hidden rounded-lg bg-gray-100">
            {category.image ? (
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 12.5vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amazon-100 to-amazon-200">
                <svg className="w-8 h-8 text-amazon-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            )}
          </div>
          
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-amazon-600 transition-colors line-clamp-2">
              {category.name}
            </h3>
            {category.productCount > 0 && (
              <p className="text-xs text-gray-600">
                {category.productCount} {category.productCount === 1 ? 'item' : 'items'}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryGrid;
