// app/checkout/page.tsx

'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { Address, Cart } from '@/types';
import { userService } from '@/lib/api';
import Loading from '@/components/ui/Loading';
import OrderSummary from '@/components/checkout/OrderSummary';
import AddressSelector from '@/components/checkout/AddressSelector';

// Fetchers for SWR
const addressFetcher = () => userService.getUserAddresses();
const cartFetcher = () => userService.getCart();

export default function CheckoutPage() {
  const router = useRouter();
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  const { data: addresses, error: addressError, mutate: mutateAddresses } = useSWR('user/addresses', addressFetcher);
  const { data: cart, error: cartError } = useSWR('user/cart', cartFetcher);

  const handleProceedToPayment = () => {
    if (!selectedAddressId) {
      alert('Please select a shipping address.');
      return;
    }
    // In a real app, you would save the selected address ID to a checkout state
    // and then navigate. For now, we simulate navigation.
    router.push(`/checkout/payment?addressId=${selectedAddressId}`);
  };

  const isLoading = !addresses || !cart;

  if (addressError || cartError) {
    return <div className="text-center p-6 text-red-500">Could not load checkout data. Please try again.</div>;
  }
  if (isLoading) {
    return <Loading fullScreen text="Loading Checkout..." />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12 lg:items-start">
      <div className="lg:col-span-7 space-y-6">
        <AddressSelector
          addresses={addresses || []}
          selectedAddressId={selectedAddressId}
          onSelectAddress={setSelectedAddressId}
          onAddressAdded={() => mutateAddresses()} // Re-fetch addresses after adding a new one
        />
      </div>

      <div className="lg:col-span-5 mt-10 lg:mt-0">
        <OrderSummary cart={cart} />
        <div className="mt-6">
          <button
            onClick={handleProceedToPayment}
            disabled={!selectedAddressId}
            className="w-full bg-amazon-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-amazon-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  );
}
