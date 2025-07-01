// app/page.tsx

import React from 'react';
import { publicService, userService } from '@/lib/api';
import HeroBanner from '@/components/home/HeroBanner';
import CategoryGrid from '@/components/home/CategoryGrid';
import ProductSection from '@/components/home/ProductSection';
import TrustBadges from '@/components/ui/TrustBadges'; 

export default async function HomePage() {
  // Fetch all necessary data in parallel for maximum efficiency
  const [featuredProductsData, categoriesData, trendingProductsData] = await Promise.all([
    publicService.getFeaturedProducts(8),
    publicService.getAllCategories({ parentOnly: true }),
    // NOTE: Using trending as a proxy for "Deals of the Day" as per our plan.
    // This fetches from GET /api/v1/user/recommendations/trending
    userService.getTrendingProducts(6) 
  ]).catch(err => {
    // Gracefully handle API errors during server-side rendering
    console.error("Failed to fetch homepage data:", err);
    return [[], [], []]; // Return empty arrays as fallback
  });
  
  const featuredProducts = featuredProductsData || [];
  const categories = categoriesData || [];
  const trendingProducts = trendingProductsData || [];

  return (
    <div className="flex flex-col space-y-12">
      <HeroBanner />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <TrustBadges />
      </div>

      {categories.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <CategoryGrid categories={categories} />
        </div>
      )}
      
      {trendingProducts.length > 0 && (
         <div className="bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <ProductSection 
                title="Deals of the Day" 
                products={trendingProducts}
                viewAllLink="/deals"
              />
            </div>
         </div>
      )}

      {featuredProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-12">
          <ProductSection 
            title="Featured Products" 
            products={featuredProducts} 
            viewAllLink="/products?sort=featured"
          />
        </div>
      )}

      {/* TODO: Add Newsletter and other sections as needed */}
    </div>
  );
}
