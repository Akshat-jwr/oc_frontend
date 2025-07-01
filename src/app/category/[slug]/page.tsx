// app/category/[slug]/page.tsx

import React from 'react';
import { notFound } from 'next/navigation';
import { publicService } from '@/lib/api';
import ProductCard from '@/components/product/ProductCard';
import Pagination from '@/components/ui/Pagination';

interface CategoryPageProps {
  params: { slug: string };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await publicService.getAllCategories({ parentOnly: false }).then(cats => cats.find(c => c.slug === params.slug));

  if (!category) {
    notFound();
  }

  const productsData = await publicService.getProductsByCategory(category._id, { page: 1, limit: 12 });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-6">{category.name}</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {productsData.products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      <div className="mt-8">
        <Pagination pagination={productsData.pagination} onPageChange={(page) => { /* Implement page change logic */ }} />
      </div>
    </div>
  );
}
