// components/orders/OrderTracking.tsx

'use client';

import React from 'react';
import { Order } from '@/types';
import { CheckIcon } from '@heroicons/react/24/solid';
import { clsx } from 'clsx';

interface OrderTrackingProps {
  order: Order;
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ order }) => {
  const allStatuses: Order['status'][] = ['confirmed', 'processing', 'shipped', 'delivered'];
  const currentStatusIndex = allStatuses.indexOf(order.status);

  // If the status is something else (e.g., pending, cancelled), we don't show this tracker.
  if (currentStatusIndex === -1) {
    return null;
  }

  return (
    <div className="bg-white p-6 shadow sm:rounded-lg">
      <h3 className="text-lg font-medium text-gray-900">Order Progress</h3>
      <nav aria-label="Progress" className="mt-6">
        <ol role="list" className="flex items-start">
          {allStatuses.map((status, index) => (
            <li key={status} className="relative flex-1">
              <div className="flex flex-col items-center gap-2 text-center">
                {/* Visual Step Indicator */}
                <div className="flex items-center w-full">
                  {/* Left-side connector line (hidden for the first item) */}
                  <div className={clsx("flex-1 h-0.5", index === 0 ? 'bg-transparent' : (index <= currentStatusIndex ? 'bg-amazon-600' : 'bg-gray-300'))} />
                  
                  {/* The Circle */}
                  {index < currentStatusIndex ? (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amazon-600">
                      <CheckIcon className="h-5 w-5 text-white" aria-hidden="true" />
                    </span>
                  ) : index === currentStatusIndex ? (
                    <span className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-amazon-600 bg-white" aria-current="step">
                      <span className="h-2.5 w-2.5 rounded-full bg-amazon-600" aria-hidden="true" />
                    </span>
                  ) : (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white"></span>
                  )}
                  
                  {/* Right-side connector line (hidden for the last item) */}
                  <div className={clsx("flex-1 h-0.5", index === allStatuses.length - 1 ? 'bg-transparent' : (index < currentStatusIndex ? 'bg-amazon-600' : 'bg-gray-300'))} />
                </div>
                {/* Step Label */}
                <p className={clsx("text-sm font-medium capitalize", index <= currentStatusIndex ? 'text-amazon-600' : 'text-gray-500')}>
                  {status}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default OrderTracking;
