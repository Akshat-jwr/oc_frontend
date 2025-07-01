// components/profile/AddressCard.tsx

'use client';

import React, { useState } from 'react';
import { Address } from '@/types';
import { userService } from '@/lib/api';
import toast from 'react-hot-toast';
import { PencilIcon, TrashIcon, CheckCircleIcon, StarIcon } from '@heroicons/react/24/solid';

interface AddressCardProps {
  address: Address;
  onEdit: () => void;
  onDeleteSuccess: () => void;
  onSetDefaultSuccess: () => void;
}

const AddressCard: React.FC<AddressCardProps> = ({ address, onEdit, onDeleteSuccess, onSetDefaultSuccess }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSettingDefault, setIsSettingDefault] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      setIsDeleting(true);
      try {
        await userService.deleteAddress(address._id); // DELETE /api/v1/user/addresses/:id
        toast.success('Address deleted successfully.');
        onDeleteSuccess(); // Triggers a re-fetch in the parent list component
      } catch (error) {
        toast.error('Failed to delete address.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleSetDefault = async () => {
    setIsSettingDefault(true);
    try {
      await userService.setDefaultAddress(address._id); // PATCH /api/v1/user/addresses/:id/default
      toast.success('Address set as default.');
      onSetDefaultSuccess();
    } catch (error) {
      toast.error('Failed to set as default address.');
    } finally {
      setIsSettingDefault(false);
    }
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border-2 ${address.isDefault ? 'border-amazon-600' : 'border-transparent'}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-gray-900">{address.label}</p>
          <address className="mt-2 not-italic text-gray-600 text-sm">
            {address.street}<br />
            {address.city}, {address.state} {address.postalCode}<br />
            {address.country}
          </address>
        </div>
        {address.isDefault && (
          <div className="flex items-center gap-1 bg-amazon-100 text-amazon-700 text-xs font-bold px-2 py-1 rounded-full">
            <CheckCircleIcon className="h-4 w-4" />
            <span>Default</span>
          </div>
        )}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
        {!address.isDefault && (
          <button
            onClick={handleSetDefault}
            disabled={isSettingDefault}
            className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-amazon-600 disabled:opacity-50"
          >
            <StarIcon className="h-4 w-4" />
            {isSettingDefault ? 'Setting...' : 'Set as Default'}
          </button>
        )}
        <div className="flex gap-2 ml-auto">
          <button onClick={onEdit} className="p-2 text-gray-500 hover:text-blue-600">
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-gray-500 hover:text-red-600 disabled:opacity-50"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressCard;
