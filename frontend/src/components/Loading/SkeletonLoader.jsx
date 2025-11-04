import React from 'react';

// Base Skeleton Component
export const Skeleton = ({ className = '', width, height, rounded = true }) => (
  <div
    className={`animate-pulse bg-gradient-to-r from-[#004052] via-[#005066] to-[#004052] bg-[length:200%_100%] ${rounded ? 'rounded' : ''} ${className}`}
    style={{ 
      width, 
      height,
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite, shimmer 2s linear infinite'
    }}
  />
);

// Text Skeleton
export const SkeletonText = ({ lines = 1, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton 
        key={index} 
        className={`h-4 ${index === lines - 1 ? 'w-3/4' : 'w-full'}`} 
      />
    ))}
  </div>
);

// Card Skeleton
export const SkeletonCard = ({ className = '' }) => (
  <div className={`bg-[#00607a] rounded-xl border border-[#004052] p-6 shadow-sm ${className}`}>
    <div className="animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Skeleton className="h-6 w-3/4 mb-2 rounded-lg" />
          <div className="flex space-x-4 mb-3">
            <Skeleton className="h-4 w-20 rounded-full" />
            <Skeleton className="h-4 w-24 rounded-full" />
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      
      {/* Content */}
      <div className="space-y-4">
        <div>
          <Skeleton className="h-4 w-16 mb-2 rounded" />
          <SkeletonText lines={3} />
        </div>
        
        <div>
          <Skeleton className="h-4 w-20 mb-2 rounded" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-6 w-16 rounded-full" />
            ))}
          </div>
        </div>
        
        <div>
          <Skeleton className="h-4 w-16 mb-2 rounded" />
          <SkeletonText lines={1} />
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-[#00303d] mt-6">
        <Skeleton className="h-10 w-24 rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
    </div>
  </div>
);

// Table Row Skeleton
export const SkeletonTableRow = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4">
      <Skeleton className="h-4 w-full" />
    </td>
    <td className="px-6 py-4">
      <Skeleton className="h-4 w-20" />
    </td>
    <td className="px-6 py-4">
      <Skeleton className="h-4 w-24" />
    </td>
    <td className="px-6 py-4">
      <Skeleton className="h-6 w-16 rounded-full" />
    </td>
    <td className="px-6 py-4">
      <div className="flex gap-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
    </td>
  </tr>
);

// Dashboard Card Skeleton
export const SkeletonDashboardCard = () => (
  <div className="bg-[#00607a] rounded-xl shadow-sm border border-[#004052] p-6">
    <div className="animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div className="ml-4">
            <Skeleton className="h-5 w-32 mb-2 rounded-lg" />
            <Skeleton className="h-4 w-24 rounded" />
          </div>
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-4 w-16 rounded" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>
        <div className="pt-2 border-t border-[#00303d]">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-12 rounded" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Form Skeleton
export const SkeletonForm = () => (
  <div className="bg-[#00607a] rounded-xl shadow-sm border border-[#004052] p-6">
    <div className="animate-pulse space-y-6">
      {/* Form Header */}
      <div className="flex items-center mb-6">
        <Skeleton className="h-6 w-6 mr-3 rounded" />
        <Skeleton className="h-6 w-48 rounded-lg" />
      </div>
      
      {/* Form Fields */}
      {[1, 2, 3, 4].map((i) => (
        <div key={i}>
          <Skeleton className="h-4 w-24 mb-2 rounded" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      ))}
      
      {/* Form Actions */}
      <div className="flex justify-between pt-6 border-t border-[#00303d]">
        <Skeleton className="h-10 w-20 rounded-lg" />
        <Skeleton className="h-10 w-24 rounded-lg" />
      </div>
    </div>
  </div>
);

// Review Card Skeleton
export const SkeletonReviewCard = () => (
  <div className="border border-[#004052] rounded-lg p-4 bg-[#00607a]">
    <div className="animate-pulse">
      {/* Review Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Skeleton className="h-8 w-8 rounded-full mr-3" />
          <div>
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      
      <Skeleton className="h-4 w-40 mb-4" />
      
      {/* Comments */}
      <div className="mb-4">
        <Skeleton className="h-4 w-16 mb-2" />
        <div className="bg-[#005066] rounded-lg p-3">
          <SkeletonText lines={3} />
        </div>
      </div>
      
      {/* Document */}
      <div>
        <Skeleton className="h-4 w-24 mb-2" />
        <div className="bg-[#004052] border border-[#00303d] rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Skeleton className="h-6 w-6 mr-2" />
              <div>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-12" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Page Header Skeleton
export const SkeletonPageHeader = () => (
  <div className="mb-6 sm:mb-8 animate-pulse">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <Skeleton className="h-8 w-48 mb-2 rounded-lg" />
        <Skeleton className="h-4 w-80 rounded" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-10 w-20 rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
    </div>
  </div>
);

// Search and Filter Skeleton
export const SkeletonSearchFilter = () => (
  <div className="bg-[#00607a] rounded-xl shadow-sm border border-[#004052] p-4 sm:p-6 mb-6 animate-pulse">
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="flex-1">
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-10 w-32 rounded-lg" />
        <Skeleton className="h-10 w-24 rounded-lg" />
      </div>
    </div>
  </div>
);