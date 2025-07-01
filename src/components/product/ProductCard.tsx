// components/product/ProductCard.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { useApp } from '@/context/AppContext';
import toast from 'react-hot-toast';
import { ShoppingCartIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useApp();
  const inWishlist = isInWishlist(product._id);
  const displayPrice = product.currentPrice ?? product.price;

  // --- PERFECTLY AND DEFINITIVELY CORRECTED ---
  // This logic is now guaranteed to always produce a valid URL part.
  const productLink = `/products/${product.seo?.slug || product._id}`;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await addToCart(product._id, 1);
      toast.success(`${product.name} added to cart!`);
    } catch (error: any) {
      toast.error(error.message || "Could not add to cart.");
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await toggleWishlist(product._id);
      toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist');
    } catch (error: any) {
      toast.error(error.message || "Could not update wishlist.");
    }
  };

  return (
    <div className="group block bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={productLink} className="block">
        <div className="relative">
          <div className="aspect-square w-full overflow-hidden">
            <Image
              src={product.images.find(img => img.isFeatured)?.url || product.images[0]?.url || '/placeholder.svg'}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            />
          </div>
          {product.discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
              {Math.round(product.discountPercentage)}% OFF
            </div>
          )}
          <button onClick={handleToggleWishlist} className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-2 rounded-full text-gray-600 hover:text-red-500 hover:bg-white transition-all" aria-label="Toggle Wishlist">
            {inWishlist ? <HeartSolidIcon className="h-5 w-5 text-red-500" /> : <HeartIcon className="h-5 w-5" />}
          </button>
        </div>
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-800 truncate group-hover:text-amazon-600">{product.name}</h3>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900">₹{(displayPrice || 0).toFixed(2)}</span>
              {product.discountPercentage > 0 && <span className="text-sm text-gray-500 line-through">₹{(product.price || 0).toFixed(2)}</span>}
            </div>
            <button onClick={handleAddToCart} className="p-2 rounded-full bg-amazon-100 text-amazon-600 hover:bg-amazon-200 transition-colors" aria-label="Add to cart" disabled={!product.isInStock}>
              <ShoppingCartIcon className="h-5 w-5" />
            </button>
          </div>
          {!product.isInStock && <p className="mt-1 text-xs text-red-600 font-semibold">Out of Stock</p>}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
