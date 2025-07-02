'use client';

import React from 'react';
import { Product, Review } from '@/types';
import { useApp } from '@/context/AppContext';
import { useProductReviews } from '@/hooks/useProductReviews';
import RatingSummary from './RatingSummary';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';

interface ProductReviewsProps {
  product: Product;
  initialReviews: Review[];
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ product, initialReviews }) => {
  const { isAuthenticated } = useApp();
  
  // ✅ FIXED: Use the shared hook
  const { reviews, reviewCount, averageRating, isLoading, error, mutate } = useProductReviews(
    product._id, 
    initialReviews
  );

  const canSubmitReview = isAuthenticated;

  const handleReviewSubmitted = async () => {
    await mutate();
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
      
      {reviewCount > 0 && (
        <RatingSummary averageRating={averageRating} reviewCount={reviewCount} />
      )}
      
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          {error ? (
            <div className="py-8 text-center text-red-500">
              Failed to load reviews. Please try again.
            </div>
          ) : (
            <ReviewList reviews={reviews} isLoading={isLoading} />
          )}
        </div>
        <div className="lg:col-span-5">
          {canSubmitReview ? (
            <ReviewForm productId={product._id} onReviewSubmitted={handleReviewSubmitted} />
          ) : (
            <div className="p-6 bg-gray-100 rounded-lg text-center">
              <p className="font-medium text-gray-800">Want to share your thoughts?</p>
              <p className="text-sm text-gray-600 mt-1">Please sign in to write a review.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
