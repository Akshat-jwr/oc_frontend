// components/checkout/PaymentMethodSelector.tsx

'use client';

import React from 'react';
import { clsx } from 'clsx';
import { CreditCardIcon, DevicePhoneMobileIcon, BanknotesIcon } from '@heroicons/react/24/solid';

interface PaymentMethodSelectorProps {
  selectedMethod: string | null;
  onChange: (method: string) => void;
  addressId: string | null; // For potential future use to fetch available methods
}

// Based on the enum in your Order model: ['upi', 'credit_card', 'debit_card', 'cash_on_delivery']
const paymentMethods = [
  { id: 'credit_card', label: 'Credit or Debit Card', icon: CreditCardIcon },
  { id: 'upi', label: 'UPI', icon: DevicePhoneMobileIcon },
  { id: 'cash_on_delivery', label: 'Cash on Delivery', icon: BanknotesIcon },
];

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ selectedMethod, onChange }) => {
  // NOTE: To make this dynamic, you could use SWR here to call
  // `paymentService.getAvailablePaymentMethods({ postalCode: address.postalCode })`
  // and then filter the static `paymentMethods` list.

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium text-gray-900">Payment Method</h3>
      <p className="text-sm text-gray-500 mt-1">All transactions are secure and encrypted.</p>
      <fieldset className="mt-4">
        <legend className="sr-only">Payment type</legend>
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              onClick={() => onChange(method.id)}
              className={clsx(
                'relative flex items-center p-4 rounded-lg border cursor-pointer transition-all',
                selectedMethod === method.id
                  ? 'border-amazon-600 ring-2 ring-amazon-600'
                  : 'border-gray-300 hover:border-gray-400'
              )}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={selectedMethod === method.id}
                onChange={() => onChange(method.id)}
                className="h-4 w-4 text-amazon-600 border-gray-300 focus:ring-amazon-500"
              />
              <label className="ml-3 flex flex-col cursor-pointer">
                <span className="block text-sm font-medium text-gray-900">{method.label}</span>
              </label>
              <method.icon className="h-6 w-6 text-gray-400 absolute right-4" />
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  );
};

export default PaymentMethodSelector;
