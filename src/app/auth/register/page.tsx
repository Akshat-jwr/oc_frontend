// app/auth/register/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated, register } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Name is required.';
    if (!formData.email) newErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid.';
    if (!formData.phone) newErrors.phone = 'Phone number is required.';
    else if (!/^[0-9]{10}$/.test(formData.phone)) newErrors.phone = 'Phone must be 10 digits.';
    if (!formData.password) newErrors.password = 'Password is required.';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters.';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      toast.success('Registration successful! Please verify your email.');
      router.push(`/auth/verify-email?email=${encodeURIComponent(formData.email)}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
        setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Create an Account</h2>
        <p className="mt-2 text-gray-600">Join us to get the best personalized gifts</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {['name', 'email', 'phone', 'password', 'confirmPassword'].map(field => (
          <div key={field}>
            <label htmlFor={field} className="block text-sm font-medium text-gray-700 capitalize">{field.replace('confirmPassword', 'Confirm Password')}</label>
            <input
              id={field}
              name={field}
              type={field.includes('password') ? 'password' : field === 'email' ? 'email' : 'text'}
              value={formData[field as keyof typeof formData]}
              onChange={handleChange}
              required
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-amazon-500 focus:border-amazon-500 sm:text-sm ${errors[field] ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors[field] && <p className="mt-1 text-sm text-red-600">{errors[field]}</p>}
          </div>
        ))}

        <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amazon-600 hover:bg-amazon-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amazon-500 disabled:opacity-50">
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="text-center text-sm">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link href="/auth" className="font-medium text-amazon-600 hover:text-amazon-500">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
