// hooks/useProductReviews.ts
import useSWR from 'swr';
import { Review } from '@/types';
import { userService } from '@/lib/api';

export const useProductReviews = (productId: string, initialReviews: Review[] = []) => {
  const reviewsKey = ['product-reviews', productId];

  const { data: reviewsData, error, isLoading, mutate } = useSWR(
    reviewsKey,
    async () => {
      try {
        const response = await userService.getProductReviews(productId);
        console.log('Fetched reviews:', response.reviews);
        return response.reviews || [];
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
        throw error;
      }
    },
    {
      fallbackData: initialReviews,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 0,
    }
  );

  const reviews = reviewsData || initialReviews || [];
  
  // Calculate live stats
  const reviewCount = reviews.length;
  const averageRating = reviewCount > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount 
    : 0;

  return {
    reviews,
    reviewCount,
    averageRating,
    isLoading,
    error,
    mutate
  };
};
