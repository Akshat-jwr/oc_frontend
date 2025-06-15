import React from 'react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amazon-50 to-primary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="bg-amazon-600 text-white px-3 py-2 rounded-lg font-bold text-xl">
              OC
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Om Creations</h1>
              <p className="text-sm text-gray-600">Customized Gifts</p>
            </div>
          </Link>
        </div>
        
        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {children}
        </div>
        
        {/* Footer */}
        <div className="text-center text-sm text-gray-600">
          <p>By continuing, you agree to our</p>
          <div className="space-x-2">
            <Link href="/terms" className="text-amazon-600 hover:text-amazon-700">Terms of Service</Link>
            <span>•</span>
            <Link href="/privacy" className="text-amazon-600 hover:text-amazon-700">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
