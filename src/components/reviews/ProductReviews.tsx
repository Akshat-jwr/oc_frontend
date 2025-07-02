'use client';

import React from 'react';
import useSWR from 'swr';
import { Product, Review } from '@/types';
import { useApp } from '@/context/AppContext';
import { userService } from '@/lib/api';
import RatingSummary from './RatingSummary';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';

interface ProductReviewsProps {
  product: Product;
  initialReviews: Review[];
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ product, initialReviews }) => {
  const { isAuthenticated } = useApp();

  // SWR key for fetching product reviews
  const reviewsKey = ['product-reviews', product._id];

  // ✅ FIXED: Handle the correct API response structure
  const { data: reviewsData, error, isLoading, mutate } = useSWR(
    reviewsKey,
    async () => {
      try {
        const response = await userService.getProductReviews(product._id);
        // ✅ CORRECTLY ACCESS: response.data.reviews (not just response.reviews)
        console.log('Fetched reviews:', response.reviews);
        return response.reviews || [];
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
        throw error; // Let SWR handle the error
      }
    },
    {
      fallbackData: initialReviews,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      // ✅ FORCE REFRESH: Don't use stale data
      dedupingInterval: 0,
    }
  );

  const canSubmitReview = isAuthenticated;

  const handleReviewSubmitted = async () => {
    // ✅ FORCE REVALIDATION: Clear cache and refetch
    await mutate();
  };

  const reviews = reviewsData || initialReviews || [];

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
      
      {product.reviewCount > 0 && (
        <RatingSummary averageRating={product.averageRating} reviewCount={product.reviewCount} />
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
