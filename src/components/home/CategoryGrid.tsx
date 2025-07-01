// components/home/CategoryGrid.tsx

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types';
import { TagIcon } from '@heroicons/react/24/solid';

interface CategoryGridProps {
  categories: Category[];
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <Link
            key={category._id}
            href={`/category/${category.slug}`}
            className="group text-center"
          >
            <div className="aspect-square relative mb-2 overflow-hidden rounded-lg bg-gray-100 group-hover:shadow-md transition-shadow">
              {category.image ? (
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amazon-100 to-amazon-200">
                  <TagIcon className="w-8 h-8 text-amazon-500" />
                </div>
              )}
            </div>
            <h3 className="font-semibold text-gray-800 text-sm group-hover:text-amazon-600 transition-colors">
              {category.name}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
