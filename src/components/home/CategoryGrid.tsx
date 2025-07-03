import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

interface CategoryGridProps {
  categories: Category[];
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  if (categories.length === 0) return null;

  const displayCategories = categories.slice(0, 6);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600">
              Discover our wide range of handcrafted products
            </p>
          </div>
          <Link
            href="/categories"
            className="group flex items-center gap-2 text-amazon-600 hover:text-amazon-700 font-semibold text-lg transition-colors"
          >
            All Categories
            <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {displayCategories.map((category) => (
            <Link
              key={category._id}
              href={`/category/${category.slug || category._id}`}
              className="group block"
            >
              <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                <div className="aspect-square relative mb-4 rounded-xl overflow-hidden bg-gray-100">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amazon-100 to-amazon-200">
                      <span className="text-4xl font-bold text-amazon-600">
                        {category.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 text-center group-hover:text-amazon-600 transition-colors">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
