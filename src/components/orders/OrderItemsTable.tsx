// components/orders/OrderItemsTable.tsx

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { OrderItem } from '@/types';

interface OrderItemsTableProps {
  items: OrderItem[];
}

const OrderItemsTable: React.FC<OrderItemsTableProps> = ({ items }) => {
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900">Items in this order</h3>
        <ul role="list" className="mt-4 divide-y divide-gray-200">
          {items.map(({ product, quantity, price }) => {
            // --- PERFECTLY AND DEFINITIVELY CORRECTED ---
            const productLink = `/products/${product.seo?.slug || product._id}`;
            return (
              <li key={product._id} className="flex py-6">
                <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                  <Image
                    src={product.images[0]?.url || '/placeholder.svg'}
                    alt={product.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="ml-4 flex-1 flex flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h3>
                        <Link href={productLink}>{product.name}</Link>
                      </h3>
                      <p className="ml-4">₹{(price * quantity).toFixed(2)}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {quantity} x ₹{price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex-1 flex items-end">
                    <Link href={`/products/${product._id}/review`} className="text-sm font-medium text-amazon-600 hover:text-amazon-800">
                      Write a product review
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default OrderItemsTable;
