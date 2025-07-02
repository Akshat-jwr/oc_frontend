// app/profile/addresses/page.tsx

// Prevent build-time timeouts by forcing dynamic fetch
'use client';

// Disable static generation; fetch dynamically due to build-time timeouts
export const dynamic = 'force-dynamic';

import React, { useState, useCallback } from 'react';
import { Address } from '@/types';
import AddressList from '@/components/profile/AddressList';
import AddressForm from '@/components/profile/AddressForm';
import { PlusIcon } from '@heroicons/react/24/solid';

export default function AddressesPage() {
  // State to manage the form's visibility and mode (add vs. edit)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // This callback is passed to the AddressList component.
  // When the list is re-fetched, we can close the form if needed.
  const handleAddressesUpdate = useCallback(() => {
    setIsFormOpen(false);
    setEditingAddress(null);
  }, []);

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setIsFormOpen(true);
  };
  
  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingAddress(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 sm:p-6 shadow sm:rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Shipping Addresses</h3>
            <p className="mt-1 text-sm text-gray-500">Manage your saved addresses for a faster checkout.</p>
          </div>
          {!isFormOpen && (
            <button
              onClick={handleAddNew}
              className="inline-flex items-center gap-2 bg-amazon-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-amazon-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Add New Address</span>
            </button>
          )}
        </div>
        
        {isFormOpen && (
          <div className="mt-6 border-t border-gray-200 pt-6">
            <AddressForm
              addressToEdit={editingAddress}
              onSuccess={handleAddressesUpdate}
              onCancel={handleCancel}
            />
          </div>
        )}
      </div>

      {!isFormOpen && (
        <AddressList onEdit={handleEdit} />
      )}
    </div>
  );
}
