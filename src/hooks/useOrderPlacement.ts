// hooks/useOrderPlacement.ts

import { useState } from 'react';
import { userService, paymentService } from '@/lib/api';
import toast from 'react-hot-toast';
import { useApp } from '@/context/AppContext';

const loadScript = (src: string) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const useOrderPlacement = () => {
  const { user } = useApp();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const placeOrder = async (orderData: {
    shippingAddressId: string;
    paymentMethod: 'upi' | 'credit_card' | 'debit_card' | 'cash_on_delivery';
  }) => {
    setIsPlacingOrder(true);
    try {
      // Step 1: Create the order and get the full response with payment details.
      const response = await userService.createOrder(orderData);
      const { order, paymentRequired, paymentDetails } = response;

      // Step 2: Handle non-payment cases like Cash on Delivery.
      if (!paymentRequired) {
        toast.success('Order placed successfully! Redirecting...');
        window.location.href = '/profile/orders?success=true';
        return;
      }

      // Step 3: Handle online payment (Razorpay).
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!res) {
        toast.error('Payment gateway failed to load. Please try again.');
        setIsPlacingOrder(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Your Razorpay Key ID
        amount: paymentDetails.amount * 100, // Amount in paise from backend
        currency: paymentDetails.currency, // Currency from backend
        name: 'Om Creations',
        description: `Order #${order.orderNumber}`,
        image: '/logo.png', // Your logo URL
        order_id: paymentDetails.orderId, // CRITICAL: The Razorpay Order ID from backend
        handler: async function (paymentResponse: any) {
          // Step 4: Verify the payment with your backend
          await paymentService.verifyPayment({
            orderId: order._id,
            razorpay_order_id: paymentResponse.razorpay_order_id,
            razorpay_payment_id: paymentResponse.razorpay_payment_id,
            razorpay_signature: paymentResponse.razorpay_signature,
          });
          
          // Step 5: Redirect to the success page
          window.location.href = '/profile/orders?success=true';
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone,
        },
        theme: {
          color: '#0284c7',
        },
        modal: {
            ondismiss: function() {
                toast.error('Payment was cancelled.');
                setIsPlacingOrder(false); // Re-enable button if user closes the modal
            }
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
      paymentObject.on('payment.failed', function (failureResponse: any) {
        toast.error(`Payment failed: ${failureResponse.error.description}`);
        setIsPlacingOrder(false);
      });
      
    } catch (error: any) {
      if (error.response?.status === 429) {
        toast.error('Too many requests. Please wait a moment and try again.');
      } else {
        toast.error(error.response?.data?.message || 'Failed to place order.');
      }
      setIsPlacingOrder(false);
    }
  };

  return { placeOrder, isPlacingOrder };
};

export default useOrderPlacement;
