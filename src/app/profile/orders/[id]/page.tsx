'use client'; // <-- THIS IS THE MOST CRITICAL CHANGE. THE PAGE MUST BE A CLIENT COMPONENT.

import React from 'react';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import { userService } from '@/lib/api';
import { Order } from '@/types';
import Loading from '@/components/ui/Loading';
import OrderDetailsHeader from '@/components/orders/OrderDetailsHeader';
import OrderItemsTable from '@/components/orders/OrderItemsTable';
import OrderTracking from '@/components/orders/OrderTracking';
import OrderSummaryCard from '@/components/orders/OrderSummaryCard';

// The data fetching function for SWR. It runs on the client-side.
const orderFetcher = (id: string) => userService.getOrderById(id);

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = typeof params.id === 'string' ? params.id : '';

  // useSWR handles data fetching, caching, loading, and error states on the client.
  const { data: order, error } = useSWR(orderId ? ['order', orderId] : null, () => orderFetcher(orderId));

  if (error) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-sm">
        <h3 className="text-lg font-bold text-red-600">Could Not Load Order</h3>
        <p className="text-gray-600 mt-2">This order could not be found or you may not have permission to view it. Please try again later.</p>
      </div>
    );
  }

  if (!order) {
    return <Loading text="Loading your order details..." />;
  }

  return (
    <div className="space-y-8">
      {/* Header section with order number and actions */}
      <OrderDetailsHeader order={order} />

      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Order tracking timeline */}
          <OrderTracking order={order} />
          {/* Table of items in the order */}
          <OrderItemsTable items={order.items} />
        </div>
        
        <div className="lg:col-span-1">
          {/* Shipping address and price summary */}
          <OrderSummaryCard order={order} />
        </div>
      </div>
    </div>
  );
}
