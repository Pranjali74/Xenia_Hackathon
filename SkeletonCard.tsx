import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="animate-pulse bg-gray-900 border border-gray-800 rounded-xl p-1">
      <div className="relative aspect-video bg-gray-800 rounded-t-lg" />
      <div className="p-5">
        <div className="h-6 bg-gray-800 rounded w-3/4 mb-3" />
        <div className="h-4 bg-gray-800 rounded w-full mb-2" />
        <div className="h-4 bg-gray-800 rounded w-5/6" />
        <div className="mt-6 h-10 bg-gray-800 rounded w-1/3 mx-auto" />
      </div>
    </div>
  );
};

export default SkeletonCard;
