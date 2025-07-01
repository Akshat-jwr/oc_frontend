// app/cart/page.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import Loading from '@/components/ui/Loading';
import CartItemsList from '@/components/cart/CartItemsList';
import CartSummary from '@/components/cart/CartSummary';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

export default function CartPage() {
  const { isLoading, isAuthenticated, cart } = useApp();

  // 1. Handle the initial loading state while context initializes
  if (isLoading) {
    return <Loading fullScreen text="Loading Your Cart..." />;
  }

  // 2. Handle the case where the user is not logged in
  if (!isAuthenticated) {
    return (
      <div className="text-center py-24 px-4">
        <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-semibold text-gray-900">Your cart is waiting</h3>
        <p className="mt-1 text-sm text-gray-500">Please sign in to view and manage your items.</p>
        <div className="mt-6">
          <Link
            href="/auth"
            className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amazon-600 hover:bg-amazon-700"
          >
            Sign In to View Cart
          </Link>
        </div>
      </div>
    );
  }

  // 3. Handle the case where the user is logged in but the cart is empty
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="text-center py-24 px-4">
        <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-semibold text-gray-900">Your cart is empty</h3>
        <p className="mt-1 text-sm text-gray-500">Looks like you haven't added anything to your cart yet.</p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amazon-600 hover:bg-amazon-700"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  // 4. Render the full cart view
  return (
    <div className="bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <CartItemsList cart={cart} />
          </section>
          <section aria-labelledby="summary-heading" className="lg:col-span-5 mt-16 lg:mt-0">
            <CartSummary cart={cart} />
          </section>
        </div>
      </div>
    </div>
  );
}
