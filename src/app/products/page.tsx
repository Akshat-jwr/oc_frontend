// app/products/page.tsx

'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import useSWR from 'swr';
import { publicService } from '@/lib/api';
import { SearchFilters, SortOption, OrderOption } from '@/types';
import Loading from '@/components/ui/Loading';
import ProductCard from '@/components/product/ProductCard';
import Pagination from '@/components/ui/Pagination';
import FilterSidebar from '@/components/products/FilterSidebar';

const VALID_SORT_OPTIONS: SortOption[] = ['popularity', 'newest', 'price', 'rating', 'name'];
const VALID_ORDER_OPTIONS: OrderOption[] = ['asc', 'desc'];

const isSortOption = (value: any): value is SortOption => VALID_SORT_OPTIONS.includes(value);
const isOrderOption = (value: any): value is OrderOption => VALID_ORDER_OPTIONS.includes(value);

const createSWRKey = (filters: SearchFilters): string => {
  const cleanedFilters = Object.entries(filters).filter(([, value]) => value !== undefined && value !== '');
  return `/public/products?${new URLSearchParams(cleanedFilters as any).toString()}`;
};

function ProductsPageComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialFilters = useMemo((): SearchFilters => {
    const sortParam = searchParams.get('sort');
    const orderParam = searchParams.get('order');
    return {
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      sort: isSortOption(sortParam) ? sortParam : 'popularity',
      order: isOrderOption(orderParam) ? orderParam : 'desc',
      page: Number(searchParams.get('page') || '1'),
      limit: 12,
    };
  }, [searchParams]);

  const [filters, setFilters] = useState<SearchFilters>(initialFilters);

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') params.set(key, String(value));
    });
    router.replace(`/products?${params.toString()}`);
  }, [filters, router]);

  const { data, error, isLoading } = useSWR(createSWRKey(filters), () => publicService.getAllProducts(filters));

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  return (
    <div className="bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <FilterSidebar filters={filters} onChange={handleFilterChange} />
        <div className="lg:col-span-3">
          {isLoading && !data && <Loading text="Loading products..." />}
          {error && <div className="text-center p-6 bg-white rounded-lg text-red-500">Failed to load products.</div>}
          
          {/* --- PERFECTED CONDITIONAL RENDERING --- */}
          {data && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* --- CORRECTED TO USE data.products --- */}
                {data.products && data.products.length > 0 ? (
                  data.products.map((product) => <ProductCard key={product._id} product={product} />)
                ) : (
                  <div className="sm:col-span-2 lg:col-span-3 text-center py-16 bg-white rounded-lg">
                    <h3 className="text-lg font-medium">No Products Found</h3>
                    <p className="text-gray-600 mt-1">Try adjusting your filters.</p>
                  </div>
                )}
              </div>
              <Pagination pagination={data.pagination} onPageChange={handlePageChange} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<Loading fullScreen text="Loading Products..." />}>
            <ProductsPageComponent />
        </Suspense>
    );
}
