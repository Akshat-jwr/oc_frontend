import React, { useState } from 'react';
import { userService } from '@/lib/api';
import toast from 'react-hot-toast';
import { StarIcon } from '@heroicons/react/24/solid';
import { clsx } from 'clsx';

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a star rating.');
      return;
    }
    
    if (comment.trim().length < 10) {
      toast.error('Please write at least 10 characters in your review.');
      return;
    }

    setIsLoading(true);
    
    try {
      await userService.createReview({ productId, rating, comment: comment.trim() });
      toast.success('Thank you for your review!');
      
      // Reset form
      setRating(0);
      setComment('');
      
      // Trigger revalidation in parent component
      onReviewSubmitted();
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit review.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg border">
      <h3 className="text-lg font-medium text-gray-900">Write a review</h3>
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Your Rating *</label>
          <div className="mt-1 flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className={clsx(
                  (hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300',
                  'h-8 w-8 cursor-pointer transition-colors hover:scale-110'
                )}
              />
            ))}
          </div>
          {rating > 0 && (
            <p className="mt-1 text-sm text-gray-600">
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
            Your Review * <span className="text-xs text-gray-500">(minimum 10 characters)</span>
          </label>
          <div className="mt-1">
            <textarea
              rows={4}
              name="comment"
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-amazon-500 focus:ring-amazon-500 sm:text-sm"
              placeholder="Share your thoughts on the product..."
              minLength={10}
              maxLength={1000}
            />
            <div className="mt-1 text-xs text-gray-500 text-right">
              {comment.length}/1000 characters
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || rating === 0 || comment.trim().length < 10}
          className="w-full bg-amazon-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-amazon-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
