// components/checkout/CheckoutStepper.tsx

'use client';

import React from 'react';
import { clsx } from 'clsx';
import { CheckIcon } from '@heroicons/react/24/solid';

const steps = [
  { id: 1, name: 'Shipping Address' },
  { id: 2, name: 'Payment Method' },
  { id: 3, name: 'Review Order' },
];

interface CheckoutStepperProps {
  currentStep: number;
}

const CheckoutStepper: React.FC<CheckoutStepperProps> = ({ currentStep }) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, index) => (
          <li key={step.name} className="relative flex-1">
            <div className="flex flex-col items-center gap-y-2">
              {/* --- THE INDICATOR CIRCLE AND CONNECTOR LINE (Completely Rebuilt) --- */}
              <div className="relative flex h-8 w-8 items-center justify-center">
                {/* The Connector Line (draws from the center of one circle to the next) */}
                {index !== steps.length - 1 && (
                  <div
                    className={clsx(
                      'absolute left-4 top-1/2 -mt-px h-0.5 w-full',
                      step.id < currentStep ? 'bg-amazon-600' : 'bg-gray-300'
                    )}
                    aria-hidden="true"
                  />
                )}
                
                {/* The Circle Itself (rendered on top of the line) */}
                {step.id < currentStep ? (
                  // Completed Step
                  <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-amazon-600">
                    <CheckIcon className="h-5 w-5 text-white" aria-hidden="true" />
                  </div>
                ) : step.id === currentStep ? (
                  // Current Step
                  <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-amazon-600 bg-white" aria-current="step">
                    <span className="h-3 w-3 rounded-full bg-amazon-600" aria-hidden="true" />
                  </div>
                ) : (
                  // Upcoming Step
                  <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white"></div>
                )}
              </div>

              {/* --- THE LABEL (Placed below the indicator) --- */}
              <p
                className={clsx(
                  'text-sm font-medium text-center',
                  currentStep === step.id ? 'text-amazon-600' : 'text-gray-500'
                )}
              >
                {step.name}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default CheckoutStepper;
