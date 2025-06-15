'use client';

import React from 'react';

interface LoadingProps {
  text?: string;
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'gray';
}

const Loading: React.FC<LoadingProps> = ({
  text = 'Loading...',
  fullScreen = false,
  size = 'md',
  color = 'primary'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'text-amazon-600',
    white: 'text-white',
    gray: 'text-gray-600'
  };

  const textColorClasses = {
    primary: 'text-gray-700',
    white: 'text-white',
    gray: 'text-gray-600'
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClasses}>
      <div className="text-center">
        {/* Loading Spinner */}
        <div className="relative mb-4">
          <div className={`animate-spin rounded-full border-2 border-gray-200 ${sizeClasses[size]}`}>
            <div className={`rounded-full border-2 border-transparent border-t-current ${colorClasses[color]} ${sizeClasses[size]}`}></div>
          </div>
          
          {/* Pulsing dots */}
          <div className="flex justify-center space-x-1 mt-2">
            <div className={`w-1 h-1 rounded-full animate-pulse ${colorClasses[color]}`} style={{ animationDelay: '0ms' }}></div>
            <div className={`w-1 h-1 rounded-full animate-pulse ${colorClasses[color]}`} style={{ animationDelay: '150ms' }}></div>
            <div className={`w-1 h-1 rounded-full animate-pulse ${colorClasses[color]}`} style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>

        {/* Loading Text */}
        <p className={`text-sm font-medium ${textColorClasses[color]}`}>
          {text}
        </p>

        {/* Om Creations branding for full screen */}
        {fullScreen && (
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className="bg-amazon-600 text-white px-2 py-1 rounded text-xs font-bold">
              OC
            </div>
            <span className="text-gray-700 text-sm font-medium">Om Creations</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Loading;
