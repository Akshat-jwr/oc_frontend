// components/layout/Header.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ShoppingBagIcon, UserCircleIcon, HeartIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const Header: React.FC = () => {
  const { isAuthenticated, user, cartCount, logout } = useApp();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully.');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-amazon-600 text-white p-2 rounded-md font-bold text-lg">
                OC
              </div>
              <h1 className="text-xl font-bold text-gray-900 hidden sm:block">Om Creations</h1>
            </Link>
          </div>

          {/* Main Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link href="/products" className="text-gray-600 hover:text-amazon-600 font-medium">
              All Products
            </Link>
            <Link href="/categories" className="text-gray-600 hover:text-amazon-600 font-medium">
              Categories
            </Link>
            <Link href="/deals" className="text-red-500 hover:text-red-700 font-bold">
              Deals
            </Link>
          </div>

          {/* Right Side Icons & Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Bar Placeholder */}
            {/* <div className="hidden lg:block">...Search Bar Component...</div> */}

            <Link href="/wishlist" className="relative text-gray-500 hover:text-amazon-600">
              <HeartIcon className="h-6 w-6" />
            </Link>

            <Link href="/cart" className="relative text-gray-500 hover:text-amazon-600">
              <ShoppingBagIcon className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="h-6 w-px bg-gray-200" aria-hidden="true" />

            {isAuthenticated ? (
              <div className="relative group">
                <Link href="/profile" className="flex items-center gap-2 text-gray-600 hover:text-amazon-600">
                  <UserCircleIcon className="h-7 w-7" />
                  <span className="hidden md:inline font-medium">{user?.name.split(' ')[0]}</span>
                </Link>
                {/* Dropdown for Profile/Logout */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
                  <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    My Account
                  </Link>
                  <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    My Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/auth" className="bg-amazon-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-amazon-700 transition-colors">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
