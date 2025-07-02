// app/profile/page.tsx
// Prevent build-timeouts by forcing dynamic fetch
'use client';
export const dynamic = 'force-dynamic';

import React from 'react';
import { useApp } from '@/context/AppContext';
import ProfileForm from '@/components/profile/ProfileForm';
import AvatarUpload from '@/components/profile/AvatarUpload';
import Loading from '@/components/ui/Loading';

export default function ProfilePage() {
  const { user, isLoading } = useApp();

  if (isLoading) {
    return <Loading text="Loading Profile..." />;
  }

  if (!user) {
    // This case should ideally be handled by a higher-level auth guard,
    // but it's good practice to have a fallback.
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Welcome back, {user.name}!
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Here you can view and edit your personal information.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <AvatarUpload />
        </div>
        <div className="md:col-span-2">
          <ProfileForm />
        </div>
      </div>

       {/* TODO: Add Change Password Component here */}
    </div>
  );
}
