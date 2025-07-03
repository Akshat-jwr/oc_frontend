'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ShoppingBagIcon, UserCircleIcon, HeartIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import SearchBar from '@/components/search/SearchBar';
import toast from 'react-hot-toast';

const Header: React.FC = () => {
  const { isAuthenticated, user, cartCount, logout } = useApp();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully.');
  };

  // ✅ FIXED: Safe user name extraction
  const firstName = user?.name ? String(user.name).split(' ')[0] : 'User';

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50">
      {/* Top Bar */}
      {/* <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-9 text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Deliver to your location</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/deals" className="text-gray-300 hover:text-white">
                Today's Deals
              </Link>
              <Link href="/customer-service" className="text-gray-300 hover:text-white">
                Customer Service
              </Link>
              <Link href="/registry" className="text-gray-300 hover:text-white">
                Registry
              </Link>
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="bg-amazon-600 text-white p-2 rounded font-bold text-xl mr-1">
                OC
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold">Om Creations</h1>
                {/* <span className="text-xs text-gray-300">.in</span> */}
              </div>
            </Link>
          </div>

          {/* Delivery Address (Desktop) */}
          {/* <div className="hidden lg:flex items-center text-sm">
            <div className="text-gray-300">
              <div className="text-xs">Deliver to</div>
              <div className="font-bold flex items-center">
                India <ChevronDownIcon className="h-3 w-3 ml-1" />
              </div>
            </div>
          </div> */}

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <SearchBar />
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-6">
            {/* Language Selector */}
            {/* <div className="hidden md:flex items-center text-sm">
              <span className="mr-1">🇮🇳</span>
              <span>EN</span>
              <ChevronDownIcon className="h-3 w-3 ml-1" />
            </div> */}

            {/* Account */}
            {isAuthenticated ? (
              <div className="relative group">
                <div className="flex items-center text-sm cursor-pointer">
                  <div>
                    {/* ✅ FIXED: Safe rendering of user name */}
                    <div className="text-xs text-gray-300">Hello, {firstName}</div>
                    <div className="font-bold flex items-center">
                      Account & Lists <ChevronDownIcon className="h-3 w-3 ml-1" />
                    </div>
                  </div>
                </div>
                {/* Dropdown */}
                <div className="absolute right-0 mt-2 w-64 bg-white text-black rounded-md shadow-lg py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <div className="font-semibold">Your Account</div>
                  </div>
                  <Link href="/profile" className="block px-4 py-2 hover:bg-gray-50">
                    Your Account
                  </Link>
                  <Link href="/profile/orders" className="block px-4 py-2 hover:bg-gray-50">
                    Your Orders
                  </Link>
                  <Link href="/wishlist" className="block px-4 py-2 hover:bg-gray-50">
                    Your Wish List
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 hover:bg-gray-50 text-red-600"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/auth" className="text-sm">
                <div className="text-xs text-gray-300">Hello User</div>
                <div className="font-bold flex items-center">
                  Sign In <ChevronDownIcon className="h-3 w-3 ml-1" />
                </div>
              </Link>
            )}

            {/* Returns & Orders */}
            <Link href="/profile/orders" className="hidden md:block text-sm">
              <div className="text-xs text-gray-300">Returns</div>
              <div className="font-bold">& Orders</div>
            </Link>

            {/* Wishlist */}
            <Link href="/wishlist" className="relative p-2">
              <HeartIcon className="h-6 w-6" />
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative flex items-center">
              <div className="relative">
                <ShoppingBagIcon className="h-8 w-8" />
                {/* ✅ FIXED: Safe rendering of cart count */}
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amazon-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {String(cartCount)}
                  </span>
                )}
              </div>
              <span className="ml-2 font-bold hidden md:block">Cart</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Categories Navigation */}
      {/* <div className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-8 h-10 text-sm">
            <div className="flex items-center">
              <Bars3Icon className="h-4 w-4 mr-2" />
              <span className="font-bold">All</span>
            </div>
            <Link href="/products" className="text-gray-300 hover:text-white">
              All Products
            </Link>
            <Link href="/categories" className="text-gray-300 hover:text-white">
              Categories
            </Link>
            <Link href="/deals" className="text-amazon-400 hover:text-amazon-300 font-bold">
              Today's Deals
            </Link>
            <Link href="/new-releases" className="text-gray-300 hover:text-white">
              New Releases
            </Link>
            <Link href="/best-sellers" className="text-gray-300 hover:text-white">
              Best Sellers
            </Link>
          </div>
        </div>
      </div> */}
    </header>
  );
};

export default Header;
