// components/checkout/ReviewDetails.tsx

import React from 'react';
import { Address } from '@/types';
import Link from 'next/link';
import { PencilIcon, MapPinIcon, CreditCardIcon } from '@heroicons/react/24/solid';

interface ReviewDetailsProps {
  address: Address;
  paymentMethod: string;
}

const ReviewDetails: React.FC<ReviewDetailsProps> = ({ address, paymentMethod }) => {
  return (
    <div className="space-y-6">
      {/* Shipping Address Review */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <MapPinIcon className="h-6 w-6 text-amazon-600" />
            Shipping To
          </h3>
          <Link href="/checkout" className="text-sm font-medium text-amazon-600 hover:underline flex items-center gap-1">
            <PencilIcon className="h-4 w-4" />
            Edit
          </Link>
        </div>
        <div className="mt-4 pl-8">
            <address className="not-italic text-gray-600">
                <p className="font-semibold">{address.label}</p>
                <p>{address.street}</p>
                <p>{address.city}, {address.state} {address.postalCode}</p>
            </address>
        </div>
      </div>

      {/* Payment Method Review */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <CreditCardIcon className="h-6 w-6 text-amazon-600" />
            Payment Method
          </h3>
          <Link href={`/checkout/payment?addressId=${address._id}`} className="text-sm font-medium text-amazon-600 hover:underline flex items-center gap-1">
            <PencilIcon className="h-4 w-4" />
            Edit
          </Link>
        </div>
        <div className="mt-4 pl-8">
            <p className="font-semibold capitalize text-gray-800">{paymentMethod.replace('_', ' ')}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetails;
