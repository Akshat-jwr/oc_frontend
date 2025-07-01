// components/checkout/AddressSelector.tsx

import React, { useState } from 'react';
import { Address } from '@/types';
import AddressForm from '@/components/profile/AddressForm'; // Reusing the form we already built
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { clsx } from 'clsx';

interface AddressSelectorProps {
  addresses: Address[];
  selectedAddressId: string | null;
  onSelectAddress: (addressId: string) => void;
  onAddressAdded: () => void;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onAddressAdded,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleSave = () => {
    onAddressAdded(); // Tell parent to refetch addresses
    setShowAddForm(false);
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium text-gray-900">Shipping Address</h3>
      
      {!showAddForm ? (
        <div className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map(address => (
              <div
                key={address._id}
                onClick={() => onSelectAddress(address._id)}
                className={clsx(
                  'relative rounded-lg border p-4 cursor-pointer transition-all',
                  selectedAddressId === address._id
                    ? 'border-amazon-600 ring-2 ring-amazon-600'
                    : 'border-gray-300 hover:border-gray-400'
                )}
              >
                <p className="font-semibold text-gray-800">{address.label}</p>
                <address className="mt-1 not-italic text-sm text-gray-600">
                  {address.street}, {address.city}, {address.state} {address.postalCode}
                </address>
                {selectedAddressId === address._id && (
                  <CheckCircleIcon className="h-6 w-6 text-amazon-600 absolute top-2 right-2" />
                )}
              </div>
            ))}
          </div>
          <button onClick={() => setShowAddForm(true)} className="mt-6 text-sm font-medium text-amazon-600 hover:text-amazon-800">
            + Add a new address
          </button>
        </div>
      ) : (
        <div className="mt-6 border-t border-gray-200 pt-6">
          <AddressForm onSuccess={handleSave} onCancel={() => setShowAddForm(false)} />
        </div>
      )}
    </div>
  );
};

export default AddressSelector;
