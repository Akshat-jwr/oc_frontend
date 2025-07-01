// components/profile/AddressForm.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { Address } from '@/types';
import { userService } from '@/lib/api';
import toast from 'react-hot-toast';

interface AddressFormProps {
  addressToEdit?: Address | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ addressToEdit, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    label: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India', // Default country
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (addressToEdit) {
      setFormData({
        label: addressToEdit.label,
        street: addressToEdit.street,
        city: addressToEdit.city,
        state: addressToEdit.state,
        postalCode: addressToEdit.postalCode,
        country: addressToEdit.country,
      });
    } else {
        // Reset form for "Add New"
        setFormData({ label: '', street: '', city: '', state: '', postalCode: '', country: 'India'});
    }
  }, [addressToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (addressToEdit) {
        // Edit mode: calls PUT /api/v1/user/addresses/:id
        await userService.updateAddress(addressToEdit._id, formData);
        toast.success('Address updated successfully!');
      } else {
        // Add mode: calls POST /api/v1/user/addresses
        await userService.addAddress(formData);
        toast.success('New address added successfully!');
      }
      onSuccess(); // Signal success to the parent page to close the form and refetch list
    } catch (error) {
      toast.error('An error occurred. Please check your details and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4 className="text-md font-medium text-gray-800 mb-4">
        {addressToEdit ? 'Edit Address' : 'Add a New Address'}
      </h4>
      <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
        <div>
          <label htmlFor="label" className="block text-sm font-medium text-gray-700">Label (e.g., Home, Work)</label>
          <input type="text" name="label" id="label" value={formData.label} onChange={handleChange} required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street Address</label>
          <input type="text" name="street" id="street" value={formData.street} onChange={handleChange} required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
        </div>
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
          <input type="text" name="city" id="city" value={formData.city} onChange={handleChange} required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
        </div>
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">State / Province</label>
          <input type="text" name="state" id="state" value={formData.state} onChange={handleChange} required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
        </div>
        <div>
          <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">ZIP / Postal Code</label>
          <input type="text" name="postalCode" id="postalCode" value={formData.postalCode} onChange={handleChange} required className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
        </div>
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
          <select id="country" name="country" value={formData.country} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-amazon-500 focus:border-amazon-500 sm:text-sm rounded-md">
            <option>India</option>
            <option>United States</option>
            <option>Canada</option>
          </select>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
          Cancel
        </button>
        <button type="submit" disabled={isLoading} className="bg-amazon-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-amazon-700 disabled:opacity-50">
          {isLoading ? 'Saving...' : 'Save Address'}
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
