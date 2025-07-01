// components/product/ProductInfo.tsx

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { StarIcon } from '@heroicons/react/20/solid';

interface ProductInfoProps {
  product: Product;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  // --- Defensive Price Calculation ---
  const displayPrice = product.currentPrice ?? product.price;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{product.name}</h1>
      
      <div className="flex items-center">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={`h-5 w-5 ${product.averageRating > i ? 'text-yellow-400' : 'text-gray-300'}`}
              aria-hidden="true"
            />
          ))}
        </div>
        <a href="#reviews" className="ml-3 text-sm font-medium text-amazon-600 hover:text-amazon-700">
          {product.reviewCount} reviews
        </a>
      </div>

      <div className="flex items-baseline space-x-3">
        {/* --- PERFECTLY CORRECTED PRICE DISPLAY --- */}
        <span className="text-3xl font-bold text-gray-900">
          ₹{(displayPrice || 0).toFixed(2)}
        </span>
        {product.discountPercentage > 0 && (
          <>
            <span className="text-xl text-gray-500 line-through">
              M.R.P: ₹{(product.price || 0).toFixed(2)}
            </span>
            <span className="px-2 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-md">
              {Math.round(product.discountPercentage)}% OFF
            </span>
          </>
        )}
      </div>

      <p className="text-gray-600 text-base">{product.shortDescription}</p>

      {/* <div className="text-sm">
        <span className="font-medium text-gray-700">Brand:</span>
        <span className="ml-2 text-gray-600">{product.brand || 'Unbranded'}</span>
      </div> */}

      <div className="text-sm">
        <span className="font-medium text-gray-700">Category:</span>
        <Link href={`/category/${product.category.name.toLowerCase()}`} className="ml-2 text-amazon-600 hover:underline">
            {product.category.name}
        </Link>
      </div>
    </div>
  );
};

export default ProductInfo;
