// components/reviews/RatingSummary.tsx

import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid';

interface RatingSummaryProps {
  averageRating: number;
  reviewCount: number;
}

const RatingSummary: React.FC<RatingSummaryProps> = ({ averageRating, reviewCount }) => {
  return (
    <div className="flex items-center">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Overall Rating</h3>
        <div className="mt-1 flex items-center">
          {[0, 1, 2, 3, 4].map((rating) => (
            <StarIcon
              key={rating}
              className={`h-6 w-6 ${averageRating > rating ? 'text-yellow-400' : 'text-gray-300'}`}
              aria-hidden="true"
            />
          ))}
        </div>
        <p className="mt-1 text-sm text-gray-600">
          Based on {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
        </p>
      </div>
      <div className="ml-10">
        <p className="text-4xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
      </div>
    </div>
  );
};

export default RatingSummary;
