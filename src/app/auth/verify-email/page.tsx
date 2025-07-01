// app/auth/verify-email/page.tsx

'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/lib/api';
import toast from 'react-hot-toast';
import { useApp } from '@/context/AppContext';
import Loading from '@/components/ui/Loading'; 

function VerifyEmailComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useApp(); // We'll re-use the login logic to set the session
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    } else {
      toast.error("Email not found. Redirecting...");
      router.push('/auth/register');
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (!/^[0-9]$/.test(value) && value !== '') return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP.');
      return;
    }
    setIsLoading(true);
    try {
      const { user, accessToken, refreshToken } = await authService.verifyEmail({ email, otp: otpString });
      // The backend returns tokens, so we set them and re-initialize the app state
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      // We can leverage a manual re-init or just redirect and let the main app layout handle it.
      // For a better UX, we'll force a reload to re-trigger initializeApp in the context.
      toast.success('Email verified successfully! Welcome!');
      window.location.href = '/'; // Force a full reload to re-init context
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid or expired OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setIsResending(true);
    try {
      await authService.resendOTP({ email });
      toast.success('A new OTP has been sent to your email.');
      setCountdown(60);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="space-y-6 text-center">
      <h2 className="text-3xl font-bold text-gray-900">Check your email</h2>
      <p className="text-gray-600">We've sent a 6-digit code to <span className="font-semibold text-gray-800">{email}</span></p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-14 text-center text-2xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amazon-500"
              required
            />
          ))}
        </div>
        <button type="submit" disabled={isLoading} className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amazon-600 hover:bg-amazon-700 disabled:opacity-50">
          {isLoading ? 'Verifying...' : 'Verify Email'}
        </button>
      </form>

      <div>
        <p className="text-sm text-gray-600">Didn't receive the code?</p>
        <button onClick={handleResend} disabled={isResending || countdown > 0} className="font-medium text-amazon-600 hover:text-amazon-500 disabled:opacity-50 disabled:cursor-not-allowed">
          {isResending ? 'Sending...' : countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
        </button>
      </div>
    </div>
  );
}

// Wrap in Suspense because useSearchParams requires it
export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<Loading text="Loading..." />}>
            <VerifyEmailComponent />
        </Suspense>
    )
}
