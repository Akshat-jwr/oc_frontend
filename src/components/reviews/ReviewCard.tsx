import React from 'react';
import { Review } from '@/types';
import { StarIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

interface ReviewCardProps {
  review: Review;
}

// WhatsApp-style default avatar component
const DefaultAvatar: React.FC<{ name: string; size?: number }> = ({ name, size = 40 }) => {
  // Get initials from name
  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(name => name.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  // Generate a consistent color based on name
  const getAvatarColor = (name: string) => {
    const colors = [
      '#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e',
      '#16a085', '#27ae60', '#2980b9', '#8e44ad', '#2c3e50',
      '#f39c12', '#e67e22', '#e74c3c', '#95a5a6', '#f1c40f',
      '#d35400', '#c0392b', '#bdc3c7', '#7f8c8d'
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const initials = getInitials(name || 'A');
  const backgroundColor = getAvatarColor(name || 'Anonymous');

  return (
    <div 
      className="flex items-center justify-center rounded-full border border-gray-200"
      style={{ 
        width: size, 
        height: size, 
        backgroundColor,
        color: 'white',
        fontSize: size * 0.4,
        fontWeight: '600'
      }}
    >
      {initials}
    </div>
  );
};

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  // Defensive check for review data
  if (!review) {
    return null;
  }

  const userName = review.userId?.name || 'Anonymous';
  const userAvatar = review.userId?.avatar;

  return (
    <div className="flex space-x-4 border-b border-gray-100 pb-8">
      <div className="flex-shrink-0">
        {userAvatar ? (
          <Image
            className="h-10 w-10 rounded-full object-cover border border-gray-200"
            src={userAvatar}
            alt={userName}
            width={40}
            height={40}
            onError={(e) => {
              // Hide the image if it fails to load and show the default avatar
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        {/* Default avatar - shown when no avatar URL or when image fails to load */}
        <div className={userAvatar ? 'hidden' : ''}>
          <DefaultAvatar name={userName} size={40} />
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">
              {userName}
            </p>
            <div className="flex items-center mt-1">
              {[0, 1, 2, 3, 4].map((r) => (
                <StarIcon 
                  key={r} 
                  className={`h-4 w-4 ${review.rating > r ? 'text-yellow-400' : 'text-gray-300'}`} 
                />
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {review.rating}/5
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            <time dateTime={review.createdAt}>
              {new Date(review.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </time>
          </p>
        </div>

        {review.isVerifiedPurchase && (
          <div className="mt-2 flex items-center gap-1 text-xs font-medium text-green-700">
            <CheckBadgeIcon className="h-4 w-4" />
            Verified Purchase
          </div>
        )}

        <div className="mt-3 text-base text-gray-700">
          <p className="leading-relaxed">{review.comment}</p>
        </div>

        {review.images && review.images.length > 0 && (
          <div className="mt-3 flex space-x-2">
            {review.images.slice(0, 3).map((image, index) => (
              <Image
                key={index}
                src={image}
                alt={`Review image ${index + 1}`}
                width={60}
                height={60}
                className="rounded-md object-cover border border-gray-200"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
