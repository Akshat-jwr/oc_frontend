import React from 'react';
import Link from 'next/link';
import { Product, Review } from '@/types';
import { StarIcon } from '@heroicons/react/20/solid';

interface ProductInfoProps {
  product: Product;
  currentReviews?: Review[];
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product, currentReviews = [] }) => {
  const displayPrice = product.currentPrice ?? product.price;
  
  // ✅ DEFINITIVE FIX: Always use currentReviews if provided, otherwise fall back to product data
  const reviewCount = currentReviews.length > 0 ? currentReviews.length : (product.reviewCount || 0);
  
  // ✅ DEFINITIVE FIX: Calculate average from current reviews if available
  const averageRating = currentReviews.length > 0 
    ? currentReviews.reduce((sum, review) => sum + review.rating, 0) / currentReviews.length
    : (product.averageRating || 0);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{product.name}</h1>
      
      <div className="flex items-center">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <StarIcon
              key={i}
              className={`h-5 w-5 ${averageRating > i ? 'text-yellow-400' : 'text-gray-300'}`}
              aria-hidden="true"
            />
          ))}
        </div>
        <a href="#reviews" className="ml-3 text-sm font-medium text-amazon-600 hover:text-amazon-700">
          {reviewCount > 0 
            ? `${reviewCount} ${reviewCount === 1 ? 'review' : 'reviews'}`
            : 'No reviews yet'
          }
        </a>
      </div>

      <div className="flex items-baseline space-x-3">
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

      <div className="text-sm">
        <span className="font-medium text-gray-700">Category:</span>
        {product.category?.slug ? (
          <Link href={`/category/${product.category.slug}`} className="ml-2 text-amazon-600 hover:underline">
            {product.category.name}
          </Link>
        ) : (
          <span className="ml-2 text-gray-600">{product.category?.name || 'N/A'}</span>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
