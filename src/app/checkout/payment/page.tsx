// app/checkout/payment/page.tsx

'use client';

import React, { useState, Suspense } from 'react';
import useSWR from 'swr';
import { useRouter, useSearchParams } from 'next/navigation';
import { userService } from '@/lib/api';
import Loading from '@/components/ui/Loading';
import PaymentMethodSelector from '@/components/checkout/PaymentMethodSelector';
import OrderSummary from '@/components/checkout/OrderSummary';
import toast from 'react-hot-toast';

function PaymentPageComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addressId = searchParams.get('addressId');

  const { data: cart, error: cartError } = useSWR('user/cart', () => userService.getCart());

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!addressId) {
    // This is a critical check to ensure the user has completed the previous step.
    return (
        <div className="text-center p-6 text-red-500 bg-white rounded-lg shadow-sm">
            Shipping address is missing. Please return to the previous step.
        </div>
    );
  }

  if (cartError) {
    return <div className="text-center p-6 text-red-500 bg-white rounded-lg shadow-sm">Failed to load cart. Please try again.</div>;
  }

  if (!cart) {
    return <Loading fullScreen text="Loading Your Cart..." />;
  }

  const handleProceedToReview = () => {
    if (!selectedPaymentMethod) {
      toast.error('Please select a payment method.');
      return;
    }
    // Navigate to the final review page, carrying forward the address and payment method choices.
    router.push(`/checkout/review?addressId=${addressId}&paymentMethod=${selectedPaymentMethod}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12 lg:items-start">
      <div className="lg:col-span-7 space-y-6">
        <PaymentMethodSelector
          selectedMethod={selectedPaymentMethod}
          onChange={setSelectedPaymentMethod}
          addressId={addressId}
        />
      </div>

      <div className="lg:col-span-5 mt-10 lg:mt-0">
        <OrderSummary cart={cart} />
        <div className="mt-6">
          <button
            onClick={handleProceedToReview}
            disabled={!selectedPaymentMethod || isProcessing}
            className="w-full bg-amazon-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-amazon-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Continue to Review'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Wrap the component in Suspense because useSearchParams can only be used in a Client Component that is a child of a Suspense boundary.
export default function PaymentPage() {
    return (
        <Suspense fallback={<Loading fullScreen text="Loading..." />}>
            <PaymentPageComponent />
        </Suspense>
    )
}
