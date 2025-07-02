// components/orders/OrderSummaryCard.tsx

import React from 'react';
import { Order } from '@/types';

interface OrderSummaryCardProps {
  order: Order;
}

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({ order }) => {
  return (
    <div className="bg-white shadow sm:rounded-lg sticky top-24">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900">Shipping Address</h3>
        <address className="mt-4 not-italic text-gray-600 text-sm">
          <span className="font-bold block">{order.shippingAddress.label}</span>
          <span>{order.shippingAddress.street}</span><br />
          <span>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</span><br />
          <span>{order.shippingAddress.country}</span>
        </address>
      </div>
      <div className="border-t border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900">Order Summary</h3>
        <dl className="mt-4 space-y-3">
          <div className="flex justify-between text-sm">
            <dt className="text-gray-600">Subtotal</dt>
            <dd className="text-gray-900">₹{order.subtotal.toFixed(2)}</dd>
          </div>
          <div className="flex justify-between text-sm">
            <dt className="text-gray-600">Shipping</dt>
            <dd className="text-gray-900">₹0.00</dd>
          </div>
          <div className="flex justify-between text-sm">
            <dt className="text-gray-600">Tax</dt>
            <dd className="text-gray-900">₹0.00</dd>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
                <dt>Discount</dt>
                <dd>- ₹{order.discount.toFixed(2)}</dd>
            </div>
          )}
          <div className="flex justify-between text-base font-bold text-gray-900 border-t border-gray-200 pt-3 mt-3">
            <dt>Total</dt>
            <dd>₹{(order.subtotal - order.discount).toFixed(2)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default OrderSummaryCard;
