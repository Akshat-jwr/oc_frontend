// app/checkout/review/page.tsx

'use client';

import React, { Suspense } from 'react';
import useSWR from 'swr';
import { useRouter, useSearchParams } from 'next/navigation';
import { userService } from '@/lib/api';
import Loading from '@/components/ui/Loading';
import OrderSummary from '@/components/checkout/OrderSummary';
import ReviewDetails from '@/components/checkout/ReviewDetails';
import useOrderPlacement from '@/hooks/useOrderPlacement'; 

function ReviewPageComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addressId = searchParams.get('addressId');
  const paymentMethod = searchParams.get('paymentMethod');

  // Fetch all necessary data for review
  const { data: cart } = useSWR('user/cart', () => userService.getCart());
  const { data: addresses } = useSWR('user/addresses', () => userService.getUserAddresses());
  
  // Custom hook to encapsulate the complex order placement logic
  const { placeOrder, isPlacingOrder } = useOrderPlacement();

  const isLoading = !cart || !addresses;

  if (isLoading) {
    return <Loading fullScreen text="Finalizing Your Order..." />;
  }

  // Find the selected address from the fetched list
  const selectedAddress = addresses?.find(a => a._id === addressId);

  if (!selectedAddress || !paymentMethod) {
    return (
      <div className="text-center p-6 text-red-500 bg-white rounded-lg shadow-sm">
        Order details are incomplete. Please <a href="/checkout" className="underline">start over</a>.
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    await placeOrder({
        shippingAddressId: selectedAddress._id,
        paymentMethod: paymentMethod as any, // Cast to the correct type
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12 lg:items-start">
      <div className="lg:col-span-7 space-y-6">
        <ReviewDetails
          address={selectedAddress}
          paymentMethod={paymentMethod}
        />
      </div>
      <div className="lg:col-span-5 mt-10 lg:mt-0">
        <OrderSummary cart={cart} />
        <div className="mt-6">
          <button
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder}
            className="w-full bg-green-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPlacingOrder ? 'Placing Order...' : `Place Order & Pay`}
          </button>
        </div>
      </div>
    </div>
  );
}

// Wrap in Suspense as required by useSearchParams
export default function ReviewPage() {
    return (
        <Suspense fallback={<Loading fullScreen text="Loading Review..." />}>
            <ReviewPageComponent />
        </Suspense>
    );
}
