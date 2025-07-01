// components/cart/CartItemCard.tsx

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CartItem } from '@/types';
import { useApp } from '@/context/AppContext';
import { MinusIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

interface CartItemCardProps {
  item: CartItem;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item }) => {
  const { removeFromCart, updateCartItemQuantity } = useApp();
  const [quantity, setQuantity] = useState(item.quantity || 1);
  const { product } = item;

  const handleUpdate = useCallback((newQuantity: number) => {
    if (!product?._id) return;
    toast.promise(
      updateCartItemQuantity(product._id, newQuantity),
      {
        loading: 'Updating quantity...',
        success: 'Quantity updated!',
        error: 'Failed to update quantity.',
      }
    );
  }, [product?._id, updateCartItemQuantity]);

  useEffect(() => {
    if (quantity === item.quantity) return;
    const handler = setTimeout(() => handleUpdate(quantity), 750);
    return () => clearTimeout(handler);
  }, [quantity, item.quantity, handleUpdate]);

  const handleRemove = () => {
    if (!product?._id) return;
    toast.promise(
      removeFromCart(product._id),
      {
        loading: 'Removing item...',
        success: `${product.name} removed.`,
        error: 'Failed to remove item.',
      }
    );
  };

  const handleQuantityChange = (amount: number) => {
    const newQuantity = quantity + amount;
    if (product && newQuantity > 0 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  if (!product) return null; // Render nothing if product data is missing

  const productName = product.name || 'Product Not Found';
  const productLink = `/products/${product.seo?.slug || product._id}`;
  const displayPrice = product.price || 0;
  const imageUrl = product.images?.[0]?.url || '/placeholder.svg';

  return (
    <li className="flex py-6">
      <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
        <Image src={imageUrl} alt={productName} width={96} height={96} className="w-full h-full object-cover" />
      </div>
      <div className="ml-4 flex-1 flex flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3><Link href={productLink}>{productName}</Link></h3>
            <p className="ml-4">₹{(displayPrice * quantity).toFixed(2)}</p>
          </div>
          <p className="mt-1 text-sm text-gray-500">Price: ₹{displayPrice.toFixed(2)}</p>
        </div>
        <div className="flex-1 flex items-end justify-between text-sm">
          <div className="flex items-center border border-gray-300 rounded-md">
            <button onClick={() => handleQuantityChange(-1)} className="p-2 disabled:opacity-50" disabled={quantity <= 1}><MinusIcon className="h-4 w-4" /></button>
            <span className="px-3 text-base">{quantity}</span>
            <button onClick={() => handleQuantityChange(1)} className="p-2 disabled:opacity-50" disabled={quantity >= product.stock}><PlusIcon className="h-4 w-4" /></button>
          </div>
          <div className="flex">
            <button onClick={handleRemove} type="button" className="font-medium text-red-600 hover:text-red-800 flex items-center gap-1"><XMarkIcon className="h-4 w-4" /><span>Remove</span></button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default CartItemCard;
