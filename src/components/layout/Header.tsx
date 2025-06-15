'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { publicService } from '@/lib/api';
import { Category, Product } from '@/types';
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  HeartIcon,
  UserIcon,
  MapPinIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

const Header: React.FC = () => {
  const { state, logout } = useApp();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await publicService.getCategories({ parentOnly: true });
      setCategories(response.data.data.slice(0, 10));
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleSearchInput = async (value: string) => {
    setSearchQuery(value);
    
    if (value.length > 2) {
      try {
        const response = await publicService.searchProducts({
          q: value,
          suggestions: true
        });
        setSearchSuggestions(response.data.data as string[]);
        setShowSuggestions(true);
      } catch (error) {
        setSearchSuggestions([]);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const searchParams = new URLSearchParams({
        q: searchQuery.trim(),
        ...(selectedCategory !== 'all' && { category: selectedCategory })
      });
      router.push(`/search?${searchParams.toString()}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    const searchParams = new URLSearchParams({
      q: suggestion,
      ...(selectedCategory !== 'all' && { category: selectedCategory })
    });
    router.push(`/search?${searchParams.toString()}`);
  };

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        {/* Top Bar */}
        <div className="bg-amazon-800 text-white py-1.5">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1">
                <MapPinIcon className="h-3 w-3" />
                <span className="text-white font-medium">Deliver to Mumbai 400001</span>
              </div>
              <div className="hidden md:flex items-center space-x-4 text-white">
                <span>Free delivery on orders above ₹999</span>
                <span>•</span>
                <span>100% Authentic Products</span>
                <span>•</span>
                <span className="font-medium">📞 +91-9876543210</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
              <div className="bg-amazon-600 text-white px-2.5 py-1.5 rounded-md font-bold text-lg">
                OC
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-900 leading-tight">Om Creations</h1>
                <p className="text-xs text-gray-700 leading-none">Customized Gifts</p>
              </div>
            </Link>

            {/* Amazon-Style Search Bar */}
            <div className="flex-1 max-w-2xl mx-3 relative" ref={searchRef}>
              <form onSubmit={handleSearch} className="flex">
                <div className="flex w-full border-2 border-amazon-600 rounded-l-md focus-within:border-amazon-700 focus-within:shadow-lg">
                  {/* Category Dropdown */}
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-gray-100 border-r border-gray-300 px-2 py-2 text-sm rounded-l-md focus:outline-none min-w-[70px] text-gray-800 font-medium"
                  >
                    <option value="all">All</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  
                  {/* Search Input */}
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchInput(e.target.value)}
                    placeholder="Search Om Creations for customized gifts..."
                    className="flex-1 px-3 py-2 focus:outline-none text-sm text-gray-900 placeholder-gray-500"
                  />
                </div>
                
                {/* Search Button */}
                <button
                  type="submit"
                  className="bg-amazon-600 text-white px-3 py-2 rounded-r-md hover:bg-amazon-700 transition-colors flex items-center justify-center"
                >
                  <MagnifyingGlassIcon className="h-4 w-4" />
                </button>
              </form>

              {/* Search Suggestions */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-md shadow-lg z-50 max-h-60 overflow-y-auto">
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm border-b border-gray-100 last:border-b-0 text-gray-900 flex items-center"
                    >
                      <MagnifyingGlassIcon className="h-4 w-4 mr-2 text-gray-400" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-2">
              {/* Language Selector */}
              <div className="hidden md:flex items-center space-x-1 text-sm bg-gray-100 px-2 py-1 rounded">
                <span className="w-4 h-3 bg-orange-500 rounded-sm flex items-center justify-center text-white text-xs font-bold">🇮🇳</span>
                <span className="text-gray-900 font-medium">EN</span>
                <ChevronDownIcon className="h-3 w-3 text-gray-700" />
              </div>

              {/* Account Section */}
              {state.isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex flex-col items-start text-sm hover:outline hover:outline-1 hover:outline-gray-300 p-1.5 rounded min-w-[100px]"
                  >
                    <span className="text-xs text-gray-700">Hello, {state.user?.name?.split(' ')[0]}</span>
                    <div className="flex items-center">
                      <span className="font-semibold text-gray-900">Account & Lists</span>
                      <ChevronDownIcon className="h-3 w-3 ml-1 text-gray-700" />
                    </div>
                  </button>

                  {/* User Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-50">
                      <div className="p-3 border-b bg-gray-50">
                        <div className="flex items-center space-x-3">
                          {state.user?.avatar ? (
                            <Image
                              src={state.user.avatar}
                              alt={state.user.name}
                              width={32}
                              height={32}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <UserIcon className="h-5 w-5 text-gray-500" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{state.user?.name}</p>
                            <p className="text-xs text-gray-600">{state.user?.email}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="py-1">
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Your Account
                        </Link>
                        <Link
                          href="/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Your Orders
                        </Link>
                        <Link
                          href="/wishlist"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Your Wish List
                        </Link>
                        <Link
                          href="/addresses"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setShowUserMenu(false)}
                        >
                          Your Addresses
                        </Link>
                      </div>

                      <div className="border-t py-1">
                        <button
                          onClick={() => {
                            logout();
                            setShowUserMenu(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth"
                  className="flex flex-col items-start text-sm hover:outline hover:outline-1 hover:outline-gray-300 p-1.5 rounded min-w-[100px]"
                >
                  <span className="text-xs text-gray-700">Hello, sign in</span>
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-900">Account & Lists</span>
                    <ChevronDownIcon className="h-3 w-3 ml-1 text-gray-700" />
                  </div>
                </Link>
              )}

              {/* Returns & Orders */}
              <Link
                href="/orders"
                className="hidden lg:flex flex-col items-start text-sm hover:outline hover:outline-1 hover:outline-gray-300 p-1.5 rounded min-w-[70px]"
              >
                <span className="text-xs text-gray-700">Returns</span>
                <span className="font-semibold text-gray-900">& Orders</span>
              </Link>

              {/* Wishlist */}
              {state.isAuthenticated && (
                <Link
                  href="/wishlist"
                  className="relative p-1.5 text-gray-700 hover:text-amazon-600 transition-colors"
                  title="Wishlist"
                >
                  <HeartIcon className="h-6 w-6" />
                  {state.wishlistCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-amazon-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                      {state.wishlistCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Cart */}
              <Link
                href={state.isAuthenticated ? "/cart" : "/auth"}
                className="relative flex items-center space-x-1 hover:outline hover:outline-1 hover:outline-gray-300 p-1.5 rounded"
              >
                <div className="relative">
                  <ShoppingCartIcon className="h-6 w-6 text-gray-700" />
                  {state.isAuthenticated && state.cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-amazon-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                      {state.cartCount}
                    </span>
                  )}
                </div>
                <div className="hidden md:flex flex-col items-start text-sm">
                  <span className="text-xs text-gray-700">Cart</span>
                  <span className="font-semibold text-gray-900">
                    {state.cartCount} {state.cartCount === 1 ? 'item' : 'items'}
                  </span>
                </div>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-1.5 text-gray-700"
              >
                {showMobileMenu ? (
                  <XMarkIcon className="h-5 w-5" />
                ) : (
                  <Bars3Icon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="bg-amazon-800 text-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center space-x-6 py-1.5 text-sm overflow-x-auto">
              <button className="flex items-center space-x-1 hover:outline hover:outline-1 hover:outline-gray-300 px-2 py-1 rounded whitespace-nowrap">
                <Bars3Icon className="h-4 w-4" />
                <span className="font-medium">All</span>
              </button>
              
              {categories.slice(0, 8).map((category) => (
                <Link
                  key={category._id}
                  href={`/category/${category._id}`}
                  className="hover:outline hover:outline-1 hover:outline-gray-300 px-2 py-1 rounded whitespace-nowrap font-medium"
                >
                  {category.name}
                </Link>
              ))}
              
              <Link
                href="/products"
                className="hover:outline hover:outline-1 hover:outline-gray-300 px-2 py-1 rounded whitespace-nowrap font-medium"
              >
                All Products
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden bg-white border-t border-gray-200 absolute w-full z-40 shadow-lg">
            <div className="px-4 py-3 space-y-1">
              <Link href="/" className="block py-2 text-gray-900 hover:text-amazon-600 font-medium">
                Home
              </Link>
              {categories.map((category) => (
                <Link
                  key={category._id}
                  href={`/category/${category._id}`}
                  className="block py-2 text-gray-900 hover:text-amazon-600"
                >
                  {category.name}
                </Link>
              ))}
              <Link href="/products" className="block py-2 text-gray-900 hover:text-amazon-600">
                All Products
              </Link>
              {!state.isAuthenticated && (
                <Link
                  href="/auth"
                  className="block w-full text-left py-2 text-amazon-600 font-semibold"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
