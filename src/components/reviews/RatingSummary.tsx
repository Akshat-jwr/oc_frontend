import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid';

interface RatingSummaryProps {
  averageRating: number;
  reviewCount: number;
}

const RatingSummary: React.FC<RatingSummaryProps> = ({ averageRating, reviewCount }) => {
  return (
    <div className="flex items-center justify-between bg-gray-50 p-6 rounded-lg">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Overall Rating</h3>
        <div className="mt-2 flex items-center">
          {[0, 1, 2, 3, 4].map((rating) => (
            <StarIcon
              key={rating}
              className={`h-6 w-6 ${averageRating > rating ? 'text-yellow-400' : 'text-gray-300'}`}
              aria-hidden="true"
            />
          ))}
          <span className="ml-2 text-lg font-semibold text-gray-900">
            {averageRating.toFixed(1)}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-600">
          Based on {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
        </p>
      </div>
      <div className="text-center">
        <p className="text-4xl font-bold text-amazon-600">{averageRating.toFixed(1)}</p>
        <p className="text-sm text-gray-500">out of 5</p>
      </div>
    </div>
  );
};

export default RatingSummary;
