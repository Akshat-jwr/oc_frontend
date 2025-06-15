'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { 
  useFeaturedProducts, 
  useCategories, 
  useTrendingProducts,
  usePersonalizedRecommendations 
} from '@/hooks/useProducts';
import HeroBanner from '@/components/home/HeroBanner';
import ProductSection from '@/components/home/ProductSection';
import CategoryGrid from '@/components/home/CategoryGrid';
import DealsOfTheDay from '@/components/home/DealsOfTheDay';
import PersonalizedSection from '@/components/home/PersonalizedSection';
import TrustBadges from '@/components/home/TrustBadges';
import NewsletterSignup from '@/components/home/NewsletterSignup';
import Loading from '@/components/ui/Loading';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

const HomePage: React.FC = () => {
  const { state } = useApp();
  
  // Use real API data with SWR caching
  const { products: featuredProducts, isLoading: featuredLoading } = useFeaturedProducts(12);
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { trending, isLoading: trendingLoading } = useTrendingProducts(8);
  // ✅ FIXED - Now returns Recommendation[]
  const { recommendations, isLoading: recommendationsLoading } = usePersonalizedRecommendations(
    state.isAuthenticated, 
    10
  );

  const isInitialLoading = featuredLoading && categoriesLoading && !featuredProducts.length && !categories.length;

  if (isInitialLoading) {
    return <Loading text="Loading Om Creations..." fullScreen />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Banner */}
        <HeroBanner />

        {/* Trust Badges */}
        <TrustBadges />

        {/* ✅ FIXED - Personalized Recommendations with Recommendation[] */}
        {state.isAuthenticated && recommendations.length > 0 && (
          <PersonalizedSection
            recommendations={recommendations}
            isLoading={recommendationsLoading}
            userName={state.user?.name?.split(' ')[0]}
          />
        )}

        {/* Categories Grid */}
        <section className="bg-white py-8 border-b">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
              <Link 
                href="/categories" 
                className="text-amazon-600 hover:text-amazon-700 font-medium flex items-center group"
              >
                See all 
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            <CategoryGrid categories={categories.slice(0, 8)} isLoading={categoriesLoading} />
          </div>
        </section>

        {/* Deals of the Day */}
        <DealsOfTheDay products={trending.length > 0 ? trending : featuredProducts.slice(0, 6)} isLoading={trendingLoading} />

        {/* Featured Products */}
        <section className="bg-white py-8">
          <div className="max-w-7xl mx-auto px-4">
            <ProductSection
              title="Featured Products"
              icon="✨"
              products={featuredProducts}
              isLoading={featuredLoading}
              viewAllLink="/products?featured=true"
              showViewAll
            />
          </div>
        </section>

        {/* Trending Now */}
        <section className="bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <ProductSection
              title="Trending Now"
              icon="🔥"
              products={trending.length > 0 ? trending : featuredProducts.slice(0, 8)}
              isLoading={trendingLoading}
              viewAllLink="/trending"
              showViewAll
            />
          </div>
        </section>

        {/* More to Explore */}
        {featuredProducts.length > 6 && (
          <section className="bg-white py-8">
            <div className="max-w-7xl mx-auto px-4">
              <ProductSection
                title={state.isAuthenticated ? "More items for you" : "Discover Amazing Products"}
                icon="🎯"
                products={featuredProducts.slice(6, 12)}
                isLoading={false}
                viewAllLink="/products"
                showViewAll
              />
            </div>
          </section>
        )}

        {/* Newsletter Signup */}
        <NewsletterSignup />
      </div>
    </ErrorBoundary>
  );
};

export default HomePage;
