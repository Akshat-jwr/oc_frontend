// components/profile/AddressList.tsx

'use client';

import React from 'react';
import useSWR from 'swr';
import { Address } from '@/types';
import { userService } from '@/lib/api';
import AddressCard from './AddressCard';
import Loading from '@/components/ui/Loading';
import { MapPinIcon } from '@heroicons/react/24/outline';

interface AddressListProps {
  onEdit: (address: Address) => void;
}

// The fetcher function for SWR, which calls our API service
const addressFetcher = () => userService.getUserAddresses();

const AddressList: React.FC<AddressListProps> = ({ onEdit }) => {
  const { data: addresses, error, mutate } = useSWR('user/addresses', addressFetcher);

  if (error) {
    return <div className="text-center text-red-500 bg-white p-6 rounded-lg shadow-sm">Failed to load addresses. Please try refreshing.</div>;
  }
  if (!addresses) {
    return <Loading text="Fetching Your Addresses..." />;
  }

  if (addresses.length === 0) {
    return (
      <div className="text-center text-gray-500 bg-white p-12 rounded-lg shadow-sm">
        <MapPinIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No addresses found</h3>
        <p className="mt-1 text-sm text-gray-600">Get started by adding a new shipping address.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {addresses.map((address) => (
        <AddressCard
          key={address._id}
          address={address}
          onEdit={() => onEdit(address)}
          onDeleteSuccess={mutate} // `mutate` will trigger a re-fetch of the address list
          onSetDefaultSuccess={mutate}
        />
      ))}
    </div>
  );
};

export default AddressList;
