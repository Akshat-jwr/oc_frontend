import React from 'react';
import { Review } from '@/types';
import ReviewCard from './ReviewCard';

interface ReviewListProps {
  reviews: Review[];
  isLoading?: boolean;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, isLoading = false }) => {
  // Handle loading state
  if (isLoading) {
    return (
      <div className="py-8 text-center text-gray-500">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
        <p className="mt-4">Loading reviews...</p>
      </div>
    );
  }

  // Handle undefined/null reviews safely
  if (!reviews || !Array.isArray(reviews)) {
    return <div className="py-8 text-center text-gray-500">Loading reviews...</div>;
  }
  
  // Handle empty reviews
  if (reviews.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p>No reviews yet.</p>
        <p className="text-sm">Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {reviews.map((review) => (
        <ReviewCard key={review._id} review={review} />
      ))}
    </div>
  );
};

export default ReviewList;
