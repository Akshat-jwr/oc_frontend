// app/categories/page.tsx

import React from 'react';
import { notFound } from 'next/navigation';
import { publicService } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types';
import { TagIcon } from '@heroicons/react/24/solid';

async function getCategories(): Promise<Category[]> {
  try {
    return await publicService.getAllCategories({ parentOnly: true });
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  if (!categories || categories.length === 0) {
    notFound();
  }

  return (
    <div className="bg-gray-50 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pb-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900">Shop by Category</h1>
            <p className="mt-1 text-gray-600">Explore our wide range of personalized gifts.</p>
        </div>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/category/${category.slug}`}
              className="group bg-white rounded-lg shadow-sm p-4 flex flex-col items-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-square w-full relative mb-3 rounded-lg overflow-hidden bg-gray-100">
                {/* --- PERFECTLY CORRECTED: Uses the intended category.image field --- */}
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 12.5vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amazon-100 to-amazon-200">
                    <TagIcon className="w-8 h-8 text-amazon-600" />
                  </div>
                )}
              </div>
              <h3 className="text-center text-sm font-semibold text-gray-900 group-hover:text-amazon-600 transition-colors line-clamp-2">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
