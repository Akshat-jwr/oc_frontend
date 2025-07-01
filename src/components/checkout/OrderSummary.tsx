// components/checkout/OrderSummary.tsx

'use client';

import React from 'react';
import Image from 'next/image';
import { Cart } from '@/types';

interface OrderSummaryProps {
  cart: Cart | null;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ cart }) => {
  // Use the backend-provided summary as the single source of truth.
  const summary = cart?.summary;

  if (!cart || !summary) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-6"></div>
        <div className="h-4 bg-gray-200 rounded w-full mt-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mt-4"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
      <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>
      
      {/* Collapsible item list for mobile might be a good future improvement */}
      <ul role="list" className="mt-4 divide-y divide-gray-200 max-h-60 overflow-y-auto">
        {cart.items.map(item => (
          <li key={item.product._id} className="flex py-4">
            <div className="flex-shrink-0 w-16 h-16 rounded-md border border-gray-200">
              <Image src={item.product.images[0]?.url || '/placeholder.svg'} alt={item.product.name} width={64} height={64} className="object-cover" />
            </div>
            <div className="ml-4 flex flex-1 flex-col">
              <div>
                <h4 className="text-sm font-medium text-gray-800 line-clamp-1">{item.product.name}</h4>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="mt-1 text-sm font-medium">₹{(item.product.price * item.quantity).toFixed(2)}</p>
            </div>
          </li>
        ))}
      </ul>
      
      <dl className="mt-6 space-y-2 border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between text-sm">
          <dt className="text-gray-600">Subtotal</dt>
          <dd className="font-medium text-gray-900">₹{(summary.totalPrice || 0).toFixed(2)}</dd>
        </div>
        <div className="flex items-center justify-between text-sm">
          <dt className="text-gray-600">Shipping</dt>
          <dd className="font-medium text-gray-900">{(summary.estimatedShipping || 0) > 0 ? `₹${(summary.estimatedShipping || 0).toFixed(2)}` : 'Free'}</dd>
        </div>
        <div className="flex items-center justify-between text-sm">
          <dt className="text-gray-600">Taxes</dt>
          <dd className="font-medium text-gray-900">₹{(summary.estimatedTax || 0).toFixed(2)}</dd>
        </div>
        <div className="flex items-center justify-between text-base font-bold text-gray-900 border-t border-gray-200 pt-4 mt-2">
          <dt>Total</dt>
          <dd>₹{(summary.estimatedTotal || 0).toFixed(2)}</dd>
        </div>
      </dl>
      
      {/* --- THIS COMPONENT HAS NO BUTTON. THE PARENT PAGE CONTROLS THE ACTION. --- */}
    </div>
  );
};

export default OrderSummary;
