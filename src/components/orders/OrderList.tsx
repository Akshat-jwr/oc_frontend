// components/orders/OrderList.tsx

'use client';

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { userService } from '@/lib/api';
import { Order, Pagination } from '@/types'; // Import Pagination type
import Loading from '@/components/ui/Loading';
import OrderStatusBadge from './OrderStatusBadge';
import PaginationComponent from '@/components/ui/Pagination'; // Renamed to avoid conflict
import Link from 'next/link';

interface OrderListProps {
  statusFilter: string;
  isRedirected: boolean;
}

const OrderList: React.FC<OrderListProps> = ({ statusFilter, isRedirected }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [shouldPoll, setShouldPoll] = useState(isRedirected);
  const limit = 10;

  useEffect(() => {
    if (isRedirected) {
      const timer = setTimeout(() => setShouldPoll(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [isRedirected]);

  const swrKey = ['user/orders', statusFilter, currentPage, limit];
  const { data, error } = useSWR(swrKey, () => 
    userService.getUserOrders({
      status: statusFilter || undefined,
      page: currentPage,
      limit: limit,
      sort: '-createdAt',
    }),
    {
      refreshInterval: shouldPoll ? 2000 : 0,
      onSuccess: (data) => {
        // --- CORRECTED: Checks the correct property 'orders' ---
        if (shouldPoll && data && data.orders.length > 0) {
          setShouldPoll(false);
        }
      },
    }
  );

  if (error) return <div className="text-center p-6 text-red-500">Failed to load orders. Please try again.</div>;
  if (!data && shouldPoll) return <Loading text="Confirming your new order..." />;
  if (!data) return <Loading text="Fetching your orders..." />;

  // --- PERFECTLY AND DEFINITIVELY CORRECTED DESTRUCTURING ---
  // The component now correctly reads from the 'orders' property.
  const { orders, pagination } = data;

  if (orders.length === 0) {
    return <div className="text-center p-6 text-gray-500">You have no orders with this status.</div>;
  }

  return (
    <div className="flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Order #</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total</th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0"><span className="sr-only">View</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order: Order) => (
                <tr key={order._id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{order.orderNumber}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"><OrderStatusBadge status={order.status} /></td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">₹{order.total.toFixed(2)}</td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <Link href={`/profile/orders/${order._id}`} className="text-amazon-600 hover:text-amazon-800">
                      View Order<span className="sr-only">, {order.orderNumber}</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-6">
            <PaginationComponent pagination={pagination} onPageChange={setCurrentPage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
