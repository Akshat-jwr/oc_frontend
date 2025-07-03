import React from 'react';
import { publicService, userService } from '@/lib/api';
import HeroBanner from '@/components/home/HeroBanner';
import CategoryGrid from '@/components/home/CategoryGrid';
import ProductSection from '@/components/home/ProductSection';
import StatsSection from '@/components/home/StatsSection';
import NewsletterSection from '@/components/home/NewsletterSection';
import TrustBadges from '@/components/ui/TrustBadges';

export default async function HomePage() {
  // Fetch all data in parallel
  const [
    featuredProductsData,
    categoriesData,
    trendingProductsData,
    allProductsData
  ] = await Promise.all([
    publicService.getFeaturedProducts(8).catch(() => []),
    publicService.getAllCategories({ parentOnly: true }).catch(() => []),
    userService.getTrendingProducts(8).catch(() => []),
    publicService.getAllProducts({ limit: 12, sort: 'newest' }).catch(() => ({ products: [] }))
  ]);

  const featuredProducts = featuredProductsData || [];
  const categories = categoriesData || [];
  const trendingProducts = trendingProductsData || [];
  const newProducts = allProductsData?.products || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroBanner />

      {/* Trust Badges */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TrustBadges />
        </div>
      </section>

      {/* Trending/Deals Section */}
      <ProductSection
        title="Trending Now"
        subtitle="Popular items flying off our virtual shelves"
        products={trendingProducts}
        viewAllLink="/deals"
        backgroundColor="gray"
      />

      {/* New Arrivals */}
      <ProductSection
        title="New Arrivals"
        subtitle="Fresh designs and latest additions to our collection"
        products={newProducts}
        viewAllLink="/products?sort=newest"
        backgroundColor="white"
      />

      {/* Categories Section */}
      <CategoryGrid categories={categories} />

      {/* Featured Products */}
      <ProductSection
        title="Featured Products"
        subtitle="Handpicked items our customers love most"
        products={featuredProducts}
        viewAllLink="/products?featured=true"
        backgroundColor="white"
      />

      {/* Stats Section */}
      {/* <StatsSection /> */}

    

      {/* Newsletter */}
      {/* <NewsletterSection /> */}
    </div>
  );
}
