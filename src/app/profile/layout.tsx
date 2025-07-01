// app/profile/layout.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserCircleIcon, MapPinIcon, ShoppingBagIcon, HeartIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx'; // A tiny utility for constructing className strings conditionally.

const navigation = [
  { name: 'My Profile', href: '/profile', icon: UserCircleIcon },
  { name: 'My Addresses', href: '/profile/addresses', icon: MapPinIcon },
  { name: 'My Orders', href: '/profile/orders', icon: ShoppingBagIcon },
  { name: 'My Wishlist', href: '/wishlist', icon: HeartIcon },
  { name: 'Account Settings', href: '/profile/settings', icon: Cog6ToothIcon },
];

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
          <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
            <nav className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    'group rounded-md px-3 py-2 flex items-center text-sm font-medium transition-colors',
                    pathname === item.href
                      ? 'bg-amazon-100 text-amazon-700'
                      : 'text-gray-900 hover:text-gray-900 hover:bg-gray-200'
                  )}
                  aria-current={pathname === item.href ? 'page' : undefined}
                >
                  <item.icon
                    className={clsx(
                      'flex-shrink-0 -ml-1 mr-3 h-6 w-6 transition-colors',
                       pathname === item.href ? 'text-amazon-600' : 'text-gray-400 group-hover:text-gray-500'
                    )}
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.name}</span>
                </Link>
              ))}
            </nav>
          </aside>

          <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
