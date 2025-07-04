'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { publicService } from '@/lib/api';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import Loading from '@/components/ui/Loading';
import Pagination from '@/components/ui/Pagination';

// Simple, clear interface
interface SearchResults {
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    const performSearch = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('Searching for:', query, 'Page:', currentPage, 'Sort:', sortBy);
        
        // ✅ FIXED: Call the API function with the correct signature
        // If your API expects a boolean for the second argument (e.g., for "featured" or similar), pass undefined or a boolean as needed:
        const apiResponse = await publicService.searchProducts(query);
        // If you want to support pagination/sorting, update the API function to accept an options object.
        
        console.log('API response:', apiResponse);

        // Ensure apiResponse is wrapped in the expected SearchResults format
        if (Array.isArray(apiResponse)) {
          // Filter out any non-object (string) entries to ensure only Product[]
          const products: Product[] = apiResponse.filter(
            (item): item is Product => typeof item === 'object' && item !== null && '_id' in item
          );
          setResults({
            products,
            pagination: {
              total: products.length,
              page: 1,
              limit: products.length,
              pages: 1,
              hasNext: false,
              hasPrev: false,
            },
          });
        } else if (apiResponse && typeof apiResponse === 'object') {
          // Ensure pagination object exists even if the API response structure is different
          const responseObj = apiResponse as any;
          const products = responseObj.products || [];
          const pagination = responseObj.pagination || {
            total: products.length,
            page: 1,
            limit: products.length,
            pages: 1,
            hasNext: false,
            hasPrev: false,
          };
          
          setResults({
            products,
            pagination,
          });
        } else {
          // Fallback for unexpected response format
          setResults({
            products: [],
            pagination: {
              total: 0,
              page: 1,
              limit: 0,
              pages: 1,
              hasNext: false,
              hasPrev: false,
            },
          });
        }
        
      } catch (err: any) {
        console.error('Search failed:', err);
        setError('Search failed. Please try again.');
        setResults(null);
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query, currentPage, sortBy]);

  // Reset page when query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amazon-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Searching for "{query}"...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <h2 className="text-xl font-bold text-red-600">Search Error</h2>
            <p className="text-gray-600 mt-2">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-amazon-600 text-white px-4 py-2 rounded-md hover:bg-amazon-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty query
  if (!query.trim()) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <h2 className="text-xl font-bold text-gray-900">Enter a search term</h2>
            <p className="text-gray-600 mt-2">Use the search bar above to find products.</p>
          </div>
        </div>
      </div>
    );
  }

  // No results
  if (!results || results.products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <h2 className="text-xl font-bold text-gray-900">No products found</h2>
            <p className="text-gray-600 mt-2">
              No products match your search for "{query}". Try different keywords.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show results
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Results for "{query}"
              </h1>
              <p className="text-gray-600 mt-1">
                {results.pagination.total} products found
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-amazon-500 focus:border-amazon-500"
              >
                <option value="relevance">Sort by Relevance</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
                <option value="rating">Customer Rating</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {results.products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* Pagination */}
        {results.pagination.pages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination 
              pagination={results.pagination} 
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amazon-600"></div>
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}
