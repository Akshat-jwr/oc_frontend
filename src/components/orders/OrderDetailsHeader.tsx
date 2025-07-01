// components/orders/OrderDetailsHeader.tsx

import React from 'react';
import { Order } from '@/types';
import Link from 'next/link';

interface OrderDetailsHeaderProps {
  order: Order;
}

const OrderDetailsHeader: React.FC<OrderDetailsHeaderProps> = ({ order }) => {
  return (
    <div className="bg-white p-6 shadow sm:rounded-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            Order #{order.orderNumber}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Placed on <time dateTime={order.createdAt}>{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Link href={`/profile/orders/${order._id}/invoice`} className="text-sm font-medium bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 hover:bg-gray-50">
            View Invoice
          </Link>
          <button className="text-sm font-medium bg-amazon-600 text-white rounded-md shadow-sm px-4 py-2 hover:bg-amazon-700">
            Get Help
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsHeader;
