// components/reviews/ReviewList.tsx

import React from 'react';
import { Review } from '@/types';
import ReviewCard from './ReviewCard';

interface ReviewListProps {
  reviews: Review[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
  // --- PERFECTLY CORRECTED GUARD CLAUSE ---
  // This is the most critical fix. We first check if the 'reviews' prop has been provided.
  // If it's undefined or null, we do not proceed, thus preventing the crash.
  if (!reviews) {
    // This can be a loading indicator or null, but it must handle the undefined case.
    return <div className="py-8 text-center text-gray-500">Loading reviews...</div>;
  }
  
  // Now that we know 'reviews' is a valid array, we can safely check its length.
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
