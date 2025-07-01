// components/cart/CartItemsList.tsx

'use client';

import React from 'react';
import { Cart } from '@/types';
import CartItemCard from './CartItemCard';
import { useApp } from '@/context/AppContext';
import toast from 'react-hot-toast';

interface CartItemsListProps {
  cart: Cart | null; // Allow cart to be null for safety
}

const CartItemsList: React.FC<CartItemsListProps> = ({ cart }) => {
  // --- PERFECTLY CORRECTED: Using the new, robust functions from the context ---
  const { clearCart, cartCount } = useApp();

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to remove all items from your cart?')) {
      // Use toast.promise for excellent user feedback
      toast.promise(
        clearCart(), // This single call handles the API request AND the state refresh
        {
          loading: 'Clearing your cart...',
          success: 'Your cart has been cleared.',
          error: 'Failed to clear the cart. Please try again.',
        }
      );
    }
  };

  // Defensive guard: Don't render if the cart or items are not yet available.
  if (!cart || !Array.isArray(cart.items)) {
    return null; 
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 id="cart-heading" className="text-lg font-medium text-gray-900">
          {/* --- PERFECTLY CORRECTED: Using the cartCount from context as the single source of truth --- */}
          Items in your cart ({cartCount})
        </h2>
        <button 
          onClick={handleClearCart}
          className="text-sm font-medium text-red-600 hover:text-red-800"
        >
          Clear All
        </button>
      </div>
      <ul role="list" className="divide-y divide-gray-200">
        {cart.items.map((item) => (
          // The CartItemCard component is already corrected and will work perfectly.
          <CartItemCard key={item._id} item={item} />
        ))}
      </ul>
    </div>
  );
};

export default CartItemsList;
