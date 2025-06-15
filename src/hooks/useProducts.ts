'use client';

import useSWR from 'swr';
import { publicService, userService } from '@/lib/api';
import { Product, Category, Recommendation } from '@/types'; // ✅ Import Recommendation

// Fetcher functions
const fetchFeaturedProducts = (limit: number) => 
  publicService.getFeaturedProducts(limit).then(res => res.data.data);

const fetchCategories = () => 
  publicService.getCategories({ parentOnly: true }).then(res => res.data.data);

const fetchTrendingProducts = (limit: number) => 
  userService.getTrendingProducts({ limit }).then(res => res.data.data);

// ✅ FIXED - Return Recommendation[] from API
const fetchPersonalizedRecommendations = (limit: number) => 
  userService.getPersonalizedRecommendations({ limit, type: 'all' }).then(res => res.data.data);

// SWR configuration
const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  refreshInterval: 5 * 60 * 1000, // 5 minutes
  dedupingInterval: 2000,
  errorRetryCount: 2,
  keepPreviousData: true,
};

// Custom hooks
export const useFeaturedProducts = (limit = 8) => {
  const { data, error, isLoading } = useSWR(
    ['featured-products', limit],
    () => fetchFeaturedProducts(limit),
    swrConfig
  );

  return {
    products: data || [],
    isLoading,
    isError: error,
  };
};

export const useCategories = () => {
  const { data, error, isLoading } = useSWR(
    'categories',
    fetchCategories,
    swrConfig
  );

  return {
    categories: data || [],
    isLoading,
    isError: error,
  };
};

export const useTrendingProducts = (limit = 8) => {
  const { data, error, isLoading } = useSWR(
    ['trending-products', limit],
    () => fetchTrendingProducts(limit),
    {
      ...swrConfig,
      fallbackData: [],
      onError: (error) => {
        console.log('Trending products not available, using fallback');
      }
    }
  );

  return {
    trending: data || [],
    isLoading,
    isError: error,
  };
};

// ✅ FIXED - Return Recommendation[] type
export const usePersonalizedRecommendations = (isAuthenticated: boolean, limit = 10) => {
  const { data, error, isLoading } = useSWR(
    isAuthenticated ? ['personalized-recommendations', limit] : null,
    () => fetchPersonalizedRecommendations(limit),
    {
      ...swrConfig,
      errorRetryCount: 1, // Less retries for auth endpoints
    }
  );

  return {
    recommendations: (data || []) as Recommendation[], // ✅ Type assertion
    isLoading: isAuthenticated ? isLoading : false,
    isError: error,
  };
};
