// components/reviews/ReviewCard.tsx

import React from 'react';
import { Review } from '@/types';
import { StarIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="flex space-x-4">
      <div className="flex-shrink-0">
        <Image
          className="h-10 w-10 rounded-full object-cover"
          src={review.userId?.avatar || '/default-avatar.png'}
          alt={review.userId?.name || 'Anonymous User'}
          width={40}
          height={40}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">{review.userId?.name || 'Anonymous'}</p>
            <div className="flex items-center">
              {[0, 1, 2, 3, 4].map((r) => (
                <StarIcon key={r} className={`h-5 w-5 ${review.rating > r ? 'text-yellow-400' : 'text-gray-300'}`} />
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-500">
            <time dateTime={review.createdAt}>{new Date(review.createdAt).toLocaleDateString()}</time>
          </p>
        </div>

        {review.isVerifiedPurchase && (
          <div className="mt-1 flex items-center gap-1 text-xs font-medium text-green-700">
            <CheckBadgeIcon className="h-4 w-4" />
            Verified Purchase
          </div>
        )}

        <div className="mt-4 text-base text-gray-600">
          <p>{review.comment}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
