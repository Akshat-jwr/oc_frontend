// components/reviews/ProductReviews.tsx

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Product, Review } from '@/types';
import { useApp } from '@/context/AppContext';
import RatingSummary from './RatingSummary';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';

interface ProductReviewsProps {
  product: Product;
  initialReviews: Review[];
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ product, initialReviews }) => {
  const { isAuthenticated } = useApp();
  const router = useRouter();

  // In a real app, you would check if the user has purchased this product.
  const canSubmitReview = isAuthenticated;

  // This function will be called by the form upon successful submission.
  const handleReviewSubmitted = () => {
    // This is the correct Next.js 13+ way to refetch server component data.
    // It refreshes the page, re-running the server-side getProduct() call.
    router.refresh(); 
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
      
      {product.reviewCount > 0 && (
        <RatingSummary averageRating={product.averageRating} reviewCount={product.reviewCount} />
      )}
      
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <ReviewList reviews={initialReviews} />
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
