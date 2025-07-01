// app/checkout/layout.tsx

'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CheckoutStepper from '@/components/checkout/CheckoutStepper';

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Dynamically determine the current step based on the URL
  const currentStep = useMemo(() => {
    if (pathname.includes('/review')) return 3;
    if (pathname.includes('/payment')) return 2;
    return 1; // Default is the address selection step
  }, [pathname]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <div className="bg-amazon-600 text-white p-2 rounded-md font-bold text-lg">OC</div>
            <h1 className="text-xl font-bold text-gray-900">Om Creations Checkout</h1>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CheckoutStepper currentStep={currentStep} />
        <div className="mt-8">
          {children}
        </div>
      </main>

      <footer className="bg-gray-100">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Om Creations. All Rights Reserved.</p>
          <div className="mt-2 space-x-4">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
