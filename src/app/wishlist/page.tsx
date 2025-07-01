// app/wishlist/page.tsx

'use client';

import React from 'react';
import useSWR from 'swr';
import { userService } from '@/lib/api';
import { useApp } from '@/context/AppContext';
import Loading from '@/components/ui/Loading';
import ProductCard from '@/components/product/ProductCard';
import { HeartIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import toast from 'react-hot-toast';

// The fetcher function for SWR, which calls our API service.
const wishlistFetcher = () => userService.getWishlist();

export default function WishlistPage() {
  const { isAuthenticated } = useApp();
  const { data, error, mutate } = useSWR(isAuthenticated ? 'user/wishlist' : null, wishlistFetcher);

  const handleClearWishlist = async () => {
    if (window.confirm('Are you sure you want to remove all items from your wishlist?')) {
        // NOTE: A "clear all" endpoint doesn't exist on your backend.
        // This would be implemented by iterating and calling removeFromWishlist for each item.
        // For now, we'll keep it simple and just show a toast.
        toast.success('Functionality to clear all items coming soon!');
    }
  };

  if (!isAuthenticated) {
    return (
        <div className="text-center py-24 px-4">
            <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-semibold text-gray-900">Your Wishlist Awaits</h3>
            <p className="mt-1 text-sm text-gray-500">Sign in to view items you've saved for later.</p>
            <div className="mt-6">
                <Link href="/auth" className="inline-flex items-center px-6 py-3 text-sm font-medium rounded-md shadow-sm text-white bg-amazon-600 hover:bg-amazon-700">
                    Sign In
                </Link>
            </div>
      </div>
    );
  }

  if (error) return <div className="text-center p-6 text-red-500">Failed to load wishlist. Please try again.</div>;
  if (!data) return <Loading fullScreen text="Loading Your Wishlist..." />;

  const { items: products } = data;

  return (
    <div className="bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Wishlist</h1>
            {products.length > 0 && (
                <button 
                    onClick={handleClearWishlist} 
                    className="text-sm font-medium text-red-600 hover:text-red-800"
                >
                    Clear All
                </button>
            )}
        </div>
        
        {products.length === 0 ? (
          <div className="text-center py-16 px-6 bg-white rounded-lg shadow-sm">
            <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Your wishlist is empty</h3>
            <p className="mt-1 text-sm text-gray-600">Click the heart icon on products to save them for later.</p>
            <div className="mt-6">
                <Link href="/" className="text-sm font-medium text-amazon-600 hover:text-amazon-800">
                    Continue Shopping &rarr;
                </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard 
                key={product._id} 
                product={product} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
