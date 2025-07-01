// components/orders/OrderStatusBadge.tsx

import React from 'react';
import { clsx } from 'clsx';
import { Order } from '@/types';

interface OrderStatusBadgeProps {
  status: Order['status'];
}

const statusStyles: Record<Order['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
};

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
        statusStyles[status] || 'bg-gray-100 text-gray-800'
      )}
    >
      {status.replace('_', ' ')}
    </span>
  );
};

export default OrderStatusBadge;
