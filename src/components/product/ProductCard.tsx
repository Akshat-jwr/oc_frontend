'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { useApp } from '@/context/AppContext';
import { 
  HeartIcon, 
  ShoppingCartIcon, 
  StarIcon,
  EyeIcon 
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'featured';
  showQuickActions?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  variant = 'default',
  showQuickActions = true 
}) => {
  const { state, addToCart, addToWishlist, removeFromWishlist } = useApp();
  const [imageLoading, setImageLoading] = useState(true);
  const [isHovering, setIsHovering] = useState(false);

  const isInWishlist = state.wishlist.some(item => item._id === product._id);
  const discountedPrice = product.discountedPrice || product.price;
  const savings = product.price - discountedPrice;
  const discountPercentage = Math.round((savings / product.price) * 100);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product._id);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product._id);
    }
  };

  const featuredImage = product.images?.find(img => img.isFeatured) || product.images?.[0];

  const cardClasses = {
    default: "bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 group",
    compact: "bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 group",
    featured: "bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group"
  };

  const imageClasses = {
    default: "aspect-square",
    compact: "aspect-square",
    featured: "aspect-[4/3]"
  };

  return (
    <div 
      className={cardClasses[variant]}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Link href={`/product/${product._id}`} className="block">
        {/* Image Container */}
        <div className={`relative overflow-hidden rounded-t-lg ${imageClasses[variant]}`}>
          {featuredImage ? (
            <Image
              src={featuredImage.url}
              alt={featuredImage.alt || product.name}
              fill
              className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
                imageLoading ? 'blur-sm' : 'blur-0'
              }`}
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onLoad={() => setImageLoading(false)}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">No Image</span>
              </div>
            </div>
          )}

          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
              {discountPercentage}% OFF
            </div>
          )}

          {/* Stock Status */}
          {!product.isInStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-600 text-white px-3 py-1 rounded-lg font-semibold">
                Out of Stock
              </span>
            </div>
          )}

          {/* Quick Actions - Show on hover */}
          {showQuickActions && isHovering && product.isInStock && (
            <div className="absolute top-2 right-2 flex flex-col space-y-2">
              <button
                onClick={handleWishlistToggle}
                className="p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-colors"
                title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                {isInWishlist ? (
                  <HeartSolid className="w-4 h-4 text-red-500" />
                ) : (
                  <HeartIcon className="w-4 h-4 text-gray-700" />
                )}
              </button>

              <button
                onClick={handleAddToCart}
                className="p-2 bg-amazon-600 hover:bg-amazon-700 text-white rounded-full shadow-md transition-colors"
                title="Add to cart"
              >
                <ShoppingCartIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Category */}
          <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">
            {product.category?.name}
          </p>

          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-amazon-600 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.averageRating > 0 && (
            <div className="flex items-center mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(product.averageRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600 ml-1">
                ({product.reviewCount})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-gray-900">
                  ₹{discountedPrice.toLocaleString()}
                </span>
                {savings > 0 && (
                  <span className="text-sm text-gray-500 line-through">
                    ₹{product.price.toLocaleString()}
                  </span>
                )}
              </div>
              {savings > 0 && (
                <p className="text-xs text-green-600 font-medium">
                  Save ₹{savings.toLocaleString()}
                </p>
              )}
            </div>

            {/* Stock indicator */}
            <div className="text-right">
              {product.isInStock ? (
                <span className="text-xs text-green-600 font-medium">In Stock</span>
              ) : (
                <span className="text-xs text-red-600 font-medium">Out of Stock</span>
              )}
              {product.stock <= 5 && product.isInStock && (
                <p className="text-xs text-orange-600">Only {product.stock} left</p>
              )}
            </div>
          </div>

          {/* Features */}
          {product.features && product.features.length > 0 && variant === 'featured' && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-600 line-clamp-2">
                {product.features.slice(0, 2).join(' • ')}
              </p>
            </div>
          )}
        </div>
      </Link>

      {/* Action Buttons - Compact variant */}
      {variant === 'compact' && showQuickActions && (
        <div className="px-4 pb-4 space-y-2">
          <button
            onClick={handleAddToCart}
            disabled={!product.isInStock}
            className="w-full bg-amazon-600 text-white py-2 rounded-md hover:bg-amazon-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium"
          >
            {product.isInStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
