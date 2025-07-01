// components/products/FilterSidebar.tsx

'use client';

import React from 'react';
import useSWR from 'swr';
import { Category, SearchFilters, SortOption, OrderOption } from '@/types';
import { publicService } from '@/lib/api';

interface FilterSidebarProps {
  filters: SearchFilters;
  onChange: (newFilters: Partial<SearchFilters>) => void;
}

const sortOptions = [
  { value: 'popularity-desc', label: 'Popularity' },
  { value: 'newest-desc', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Top Rated' },
];

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onChange }) => {
  const { data: categories } = useSWR('categories', () => publicService.getAllCategories({ parentOnly: true }));

  const handleSortChange = (value: string) => {
    const [sort, order] = value.split('-');
    // The values are guaranteed to be correct because they come from our hardcoded sortOptions array.
    onChange({ sort: sort as SortOption, order: order as OrderOption });
  };
  
  const currentSortValue = `${filters.sort}-${filters.order}`;

  return (
    <aside className="bg-white p-6 rounded-lg shadow-sm h-fit sticky top-24">
      <h2 className="text-xl font-bold mb-6">Filters</h2>
      <div className="space-y-6">
        <div>
          <label htmlFor="category" className="block font-medium mb-2 text-gray-700">Category</label>
          <select
            id="category"
            value={filters.category || ''}
            onChange={(e) => onChange({ category: e.target.value || undefined })}
            className="w-full border-gray-300 rounded-md shadow-sm"
          >
            <option value="">All Categories</option>
            {categories?.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium mb-2 text-gray-700">Price Range (₹)</label>
          <div className="flex space-x-2">
            <input type="number" placeholder="Min" value={filters.minPrice || ''} onChange={(e) => onChange({ minPrice: e.target.value ? Number(e.target.value) : undefined })} className="w-1/2 border-gray-300 rounded-md shadow-sm" min={0} />
            <input type="number" placeholder="Max" value={filters.maxPrice || ''} onChange={(e) => onChange({ maxPrice: e.target.value ? Number(e.target.value) : undefined })} className="w-1/2 border-gray-300 rounded-md shadow-sm" min={0} />
          </div>
        </div>
        <div>
          <label htmlFor="sort" className="block font-medium mb-2 text-gray-700">Sort By</label>
          <select id="sort" value={currentSortValue} onChange={(e) => handleSortChange(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm">
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
