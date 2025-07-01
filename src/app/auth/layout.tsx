// app/auth/layout.tsx

import React from 'react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Branding */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="bg-amazon-600 text-white px-3 py-2 rounded-lg font-bold text-xl group-hover:bg-amazon-700 transition-colors">
              OC
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Om Creations</h1>
              <p className="text-sm text-gray-600">Personalized Gifting</p>
            </div>
          </Link>
        </div>
        
        {/* Form Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {children}
        </div>
        
        {/* Footer Links */}
        <div className="text-center text-sm text-gray-600">
          <p>By continuing, you agree to our</p>
          <div className="space-x-2">
            <Link href="/terms" className="font-medium text-amazon-600 hover:text-amazon-700">Terms of Service</Link>
            <span>&bull;</span>
            <Link href="/privacy" className="font-medium text-amazon-600 hover:text-amazon-700">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
