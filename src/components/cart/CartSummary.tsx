// components/cart/CartSummary.tsx

'use client';

import React from 'react';
import { Cart } from '@/types';
import Link from 'next/link';
import { LockClosedIcon } from '@heroicons/react/24/solid';

interface CartSummaryProps {
  cart: Cart | null;
}

const CartSummary: React.FC<CartSummaryProps> = ({ cart }) => {
  // --- PERFECTLY CORRECTED: Uses backend-provided summary object as the single source of truth ---
  const summary = cart?.summary;

  if (!summary) {
    return <div className="bg-white p-6 rounded-lg shadow-sm">Loading summary...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
      <h2 id="summary-heading" className="text-lg font-medium text-gray-900">Order summary</h2>
      <dl className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <dt className="text-sm text-gray-600">Subtotal ({summary.totalItems} items)</dt>
          <dd className="text-sm font-medium text-gray-900">₹{(summary.totalPrice || 0).toFixed(2)}</dd>
        </div>
        <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
          <dt className="text-sm text-gray-600">Shipping estimate</dt>
          <dd className="text-sm font-medium text-gray-900">
            {(summary.estimatedShipping || 0) > 0 ? `₹${(summary.estimatedShipping || 0).toFixed(2)}` : 'Free'}
          </dd>
        </div>
        <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
          <dt className="text-sm text-gray-600">Tax estimate</dt>
          <dd className="text-sm font-medium text-gray-900">₹{(summary.estimatedTax || 0).toFixed(2)}</dd>
        </div>
        <div className="border-t border-gray-200 pt-4 flex items-center justify-between text-base font-medium text-gray-900">
          <dt>Order total</dt>
          <dd>₹{(summary.estimatedTotal || 0).toFixed(2)}</dd>
        </div>
      </dl>

      <div className="mt-6">
        <Link href="/checkout" className="w-full bg-amazon-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-amazon-700 flex items-center justify-center gap-2">
          <LockClosedIcon className="h-5 w-5" /> Proceed to Checkout
        </Link>
      </div>
      <p className="mt-4 text-xs text-center text-gray-500">100% Secure & Encrypted Checkout</p>
    </div>
  );
};

export default CartSummary;
