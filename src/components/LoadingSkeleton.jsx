import React from 'react';

const LoadingSkeleton = ({ type = 'card' }) => {
  if (type === 'gallery') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-white to-blush py-20 px-4">
        <div className="container mx-auto">
          <div className="h-12 bg-gray-200 rounded-lg w-64 mx-auto mb-12 animate-pulse"></div>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-200 rounded-2xl h-80 animate-pulse break-inside-avoid"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header skeleton */}
          <div className="h-16 bg-gray-200 rounded-lg w-full animate-pulse"></div>
          
          {/* Stats cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-md">
                <div className="h-4 bg-gray-200 rounded w-24 mb-3 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>
            ))}
          </div>
          
          {/* Table skeleton */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'photobooth') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-white to-blush py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="h-12 bg-gray-200 rounded-lg w-48 mx-auto mb-8 animate-pulse"></div>
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="aspect-square bg-gray-200 animate-pulse"></div>
            <div className="p-6 space-y-4">
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'page') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream via-white to-blush py-20 px-4">
        <div className="container mx-auto max-w-4xl space-y-8">
          <div className="h-16 bg-gray-200 rounded-lg w-3/4 mx-auto mb-8 animate-pulse"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/5 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (type === 'image') {
    return (
      <div className="bg-gray-200 rounded-2xl h-80 animate-pulse flex items-center justify-center">
        <svg className="w-12 h-12 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      </div>
    );
  }

  if (type === 'text') {
    return (
      <div className="space-y-3 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    );
  }

  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-full"></div>
    </div>
  );
};

export default LoadingSkeleton;
