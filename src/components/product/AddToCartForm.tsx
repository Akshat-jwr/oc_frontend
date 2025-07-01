// components/product/AddToCartForm.tsx

'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import { useApp } from '@/context/AppContext';
import toast from 'react-hot-toast';
import { PlusIcon, MinusIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface AddToCartFormProps {
  product: Product;
}

const AddToCartForm: React.FC<AddToCartFormProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const inWishlist = isInWishlist(product._id);

  const handleAddToCart = async () => {
    if (!product.isInStock) {
      toast.error("This product is currently out of stock.");
      return;
    }
    setIsAdding(true);
    try {
      await addToCart(product._id, quantity);
      toast.success(`${quantity} x ${product.name} added to cart!`);
    } catch (error: any) {
      toast.error(error.message || "Could not add item to cart.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleWishlist = async () => {
    setIsAdding(true); // Disable button during API call
    try {
      await toggleWishlist(product._id);
      toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist');
    } catch (error: any) {
      toast.error(error.message || "Could not update wishlist.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <label htmlFor="quantity" className="font-semibold text-gray-700">Quantity:</label>
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="p-3 text-gray-600 hover:bg-gray-100 rounded-l-lg disabled:opacity-50"
              disabled={quantity <= 1}
            >
              <MinusIcon className="h-4 w-4" />
            </button>
            <input
              id="quantity"
              type="text"
              value={quantity}
              readOnly
              className="w-12 text-center font-semibold border-none focus:ring-0"
            />
            <button
              onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
              className="p-3 text-gray-600 hover:bg-gray-100 rounded-r-lg disabled:opacity-50"
              disabled={quantity >= product.stock}
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>
          <span className="text-sm text-gray-500">{product.stock} items available</span>
        </div>

        {/* TODO: Customization options will be rendered here */}

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleAddToCart}
            disabled={!product.isInStock || isAdding}
            className="flex-1 bg-amazon-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-amazon-700 focus:outline-none focus:ring-2 focus:ring-amazon-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isAdding ? 'Processing...' : 'Add to Cart'}
          </button>
          <button
            onClick={handleToggleWishlist}
            disabled={isAdding}
            className="flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {inWishlist ? (
              <HeartSolidIcon className="h-6 w-6 text-red-500" />
            ) : (
              <HeartIcon className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {!product.isInStock && (
            <p className="text-center text-red-600 font-semibold">This product is currently out of stock.</p>
        )}
      </div>
    </div>
  );
};

export default AddToCartForm;
