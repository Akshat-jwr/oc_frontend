import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllLink?: string;
  backgroundColor?: 'white' | 'gray';
  showViewAll?: boolean;
}

const ProductSection: React.FC<ProductSectionProps> = ({ 
  title, 
  subtitle,
  products, 
  viewAllLink = '/products',
  backgroundColor = 'white',
  showViewAll = true 
}) => {
  if (products.length === 0) return null;

  return (
    <section className={`py-16 ${backgroundColor === 'gray' ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-lg text-gray-600">{subtitle}</p>
            )}
          </div>
          {showViewAll && (
            <Link
              href={viewAllLink}
              className="group flex items-center gap-2 text-amazon-600 hover:text-amazon-700 font-semibold text-lg transition-colors"
            >
              View All
              <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.slice(0, 8).map((product) => (
            <div key={product._id} className="group">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Mobile View All Button */}
        {showViewAll && (
          <div className="mt-12 text-center lg:hidden">
            <Link
              href={viewAllLink}
              className="inline-flex items-center gap-2 bg-amazon-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amazon-700 transition-colors"
            >
              View All {title}
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductSection;
