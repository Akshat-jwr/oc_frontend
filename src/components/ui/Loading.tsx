// components/ui/Loading.tsx

import React from 'react';

interface LoadingProps {
  text?: string;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  text = 'Loading...',
  fullScreen = false,
}) => {
  const containerClasses = fullScreen
    ? 'fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full animate-spin border-4 border-dashed border-amazon-600 border-t-transparent"></div>
        <p className="text-lg font-medium text-gray-700">{text}</p>
      </div>
    </div>
  );
};

export default Loading;
