// components/wishlist/WishlistProductCard.tsx

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { useApp } from '@/context/AppContext';
import { userService } from '@/lib/api';
import toast from 'react-hot-toast';
import { ShoppingCartIcon, XCircleIcon } from '@heroicons/react/24/solid';

interface WishlistProductCardProps {
  product: Product;
  onActionSuccess: () => void;
}

const WishlistProductCard: React.FC<WishlistProductCardProps> = ({ product, onActionSuccess }) => {
  const { updateCart } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);

  // --- PERFECTLY AND DEFINITIVELY CORRECTED ---
  const productLink = `/products/${product.seo?.slug || product._id}`;

  const handleMoveToCart = async () => {
    setIsProcessing(true);
    try {
      const newCart = await userService.addToCart(product._id, 1);
      await userService.removeFromWishlist(product._id);
      updateCart(newCart);
      onActionSuccess();
      toast.success(`${product.name} moved to cart!`);
    } catch (error) {
      toast.error('Failed to move item to cart.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemove = async () => {
    setIsProcessing(true);
    try {
      await userService.removeFromWishlist(product._id);
      onActionSuccess();
      toast.success(`${product.name} removed from wishlist.`);
    } catch (error) {
      toast.error('Failed to remove item.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="group block bg-white rounded-lg shadow-sm overflow-hidden relative">
      <Link href={productLink} className="block">
        <div className="aspect-square w-full overflow-hidden">
          <Image
            src={product.images.find(img => img.isFeatured)?.url || product.images[0]?.url || '/placeholder.svg'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </div>
        <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-800 truncate">{product.name}</h3>
            <div className="mt-2 flex items-baseline gap-2">
                <span className="text-lg font-bold text-gray-900">₹{(product.currentPrice ?? product.price).toFixed(2)}</span>
                {product.discountPercentage > 0 && <span className="text-sm text-gray-500 line-through">₹{product.price.toFixed(2)}</span>}
            </div>
            {!product.isInStock && <p className="mt-1 text-xs text-red-600 font-semibold">Out of Stock</p>}
        </div>
      </Link>
      <div className="border-t border-gray-200 p-2 flex justify-around">
        <button onClick={handleMoveToCart} disabled={isProcessing || !product.isInStock} className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-amazon-600 hover:bg-amazon-100 rounded-md p-2 transition-colors disabled:opacity-50">
          <ShoppingCartIcon className="h-5 w-5"/> Move to Cart
        </button>
        <button onClick={handleRemove} disabled={isProcessing} className="flex-1 flex items-center justify-center gap-2 text-sm font-medium text-red-600 hover:bg-red-100 rounded-md p-2 transition-colors disabled:opacity-50">
          <XCircleIcon className="h-5 w-5" /> Remove
        </button>
      </div>
    </div>
  );
};

export default WishlistProductCard;
