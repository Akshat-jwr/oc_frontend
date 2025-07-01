// components/profile/AvatarUpload.tsx

'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useApp } from '@/context/AppContext';
import { userService } from '@/lib/api';
import toast from 'react-hot-toast';
import { UserCircleIcon, PencilIcon } from '@heroicons/react/24/solid';

const AvatarUpload: React.FC = () => {
  const { user } = useApp();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    try {
      // Calls POST /api/v1/user/avatar
      await userService.uploadAvatar(file);
      toast.success('Avatar updated successfully! It may take a moment to reflect.');
      setFile(null);
      setPreview(null);
      // Forcing a reload to see the change, or the context could be updated
      // with a dedicated updateUser function.
      window.location.reload(); 
    } catch (error) {
      toast.error('Failed to upload avatar. Please ensure it is a valid image file.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg p-6 flex flex-col items-center text-center">
      <h3 className="text-lg font-medium text-gray-900">Profile Picture</h3>
      <div className="mt-4 relative">
        {preview ? (
          <Image src={preview} alt="Avatar Preview" width={128} height={128} className="w-32 h-32 rounded-full object-cover" />
        ) : user?.avatar ? (
          <Image src={user.avatar} alt="User Avatar" width={128} height={128} className="w-32 h-32 rounded-full object-cover" />
        ) : (
          <UserCircleIcon className="h-32 w-32 text-gray-300" />
        )}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute -bottom-1 -right-1 bg-white p-2 rounded-full shadow border hover:bg-gray-100"
          aria-label="Change profile picture"
        >
          <PencilIcon className="h-4 w-4 text-gray-600" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/gif"
          className="hidden"
        />
      </div>
      {preview && (
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="text-sm bg-amazon-600 text-white px-3 py-1 rounded-md hover:bg-amazon-700 disabled:opacity-50"
          >
            {isUploading ? 'Uploading...' : 'Save'}
          </button>
          <button
            onClick={() => { setFile(null); setPreview(null); }}
            className="text-sm bg-gray-200 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      )}
      <p className="mt-2 text-xs text-gray-500">PNG, JPG, GIF up to 2MB.</p>
    </div>
  );
};

export default AvatarUpload;
