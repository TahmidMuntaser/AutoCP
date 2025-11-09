import React from 'react';

// Base Skeleton Component with smooth animation
export const Skeleton = ({ className = '', width, height, rounded = true }) => (
  <div
    className={`relative overflow-hidden bg-[#003d52] ${rounded ? 'rounded' : ''} ${className}`}
    style={{ width, height }}
  >
    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-[#005066]/40 to-transparent" />
  </div>
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

// Card Skeleton - Problem Card
export const SkeletonCard = ({ className = '' }) => (
  <div className={`bg-[#00303d]/60 backdrop-blur-xl border border-[#004052] rounded-2xl p-6 shadow-sm ${className}`}>
    {/* Header */}
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-7 w-4/5 mb-2 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-8 rounded-lg" />
    </div>
    
    {/* Content */}
    <div className="space-y-4">
      <div>
        <Skeleton className="h-4 w-24 mb-2 rounded" />
        <SkeletonText lines={3} />
      </div>
      
      <div>
        <Skeleton className="h-4 w-32 mb-2 rounded" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-6 w-16 rounded-full" />
          ))}
        </div>
      </div>
    </div>
    
    {/* Actions */}
    <div className="flex gap-3 pt-4 border-t border-[#003d52] mt-4">
      <Skeleton className="h-10 w-28 rounded-lg" />
      <Skeleton className="h-10 w-32 rounded-lg" />
      <Skeleton className="h-10 w-28 rounded-lg" />
    </div>
  </div>
);

// Table Row Skeleton
export const SkeletonTableRow = () => (
  <tr>
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
        <Skeleton className="h-8 w-16 rounded" />
        <Skeleton className="h-8 w-16 rounded" />
      </div>
    </td>
  </tr>
);

// Dashboard Card Skeleton
export const SkeletonDashboardCard = () => (
  <div className="bg-[#00303d]/60 backdrop-blur-xl border border-[#004052] rounded-xl shadow-sm p-6">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div>
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
      <div className="pt-2 border-t border-[#003d52]">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-12 rounded" />
          <Skeleton className="h-4 w-16 rounded" />
        </div>
      </div>
    </div>
  </div>
);

// Form Skeleton
export const SkeletonForm = () => (
  <div className="bg-[#00303d]/60 backdrop-blur-xl border border-[#004052] rounded-xl shadow-sm p-6">
    <div className="space-y-6">
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
      <div className="flex justify-between pt-6 border-t border-[#003d52]">
        <Skeleton className="h-10 w-20 rounded-lg" />
        <Skeleton className="h-10 w-24 rounded-lg" />
      </div>
    </div>
  </div>
);

// Page Header Skeleton
export const SkeletonPageHeader = () => (
  <div className="mb-6 sm:mb-8">
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
  <div className="bg-[#00303d]/60 backdrop-blur-xl border border-[#004052] rounded-xl shadow-sm p-4 sm:p-6 mb-6">
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

// History List Skeleton
export const SkeletonHistoryItem = () => (
  <div className="bg-[#00303d]/60 backdrop-blur-xl border border-[#004052] rounded-lg p-4">
    <div className="flex items-center justify-between gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <Skeleton className="h-6 w-3/4 mb-2 rounded-lg" />
        <Skeleton className="h-4 w-40 rounded" />
      </div>
      <div className="flex gap-2 shrink-0">
        <Skeleton className="h-8 w-16 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
    </div>
  </div>
);

// Problem List Skeleton (for Judge)
export const SkeletonProblemListItem = () => (
  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3">
    <Skeleton className="h-5 w-4/5 mb-2 rounded" />
    <div className="flex items-center gap-2 flex-wrap">
      <Skeleton className="h-6 w-20 rounded" />
      <Skeleton className="h-6 w-16 rounded" />
      <Skeleton className="h-6 w-24 rounded" />
    </div>
  </div>
);

// HomePage Hero Skeleton
export const SkeletonHeroSection = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Text */}
      <div className="text-center mb-16">
        <Skeleton className="h-12 w-3/4 mx-auto mb-4 rounded-xl" />
        <Skeleton className="h-6 w-2/3 mx-auto mb-8 rounded-lg" />
        <div className="flex justify-center gap-4">
          <Skeleton className="h-12 w-40 rounded-lg" />
          <Skeleton className="h-12 w-40 rounded-lg" />
        </div>
      </div>
      
      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <Skeleton className="h-12 w-12 rounded-xl mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2 rounded-lg" />
            <Skeleton className="h-4 w-full rounded" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Problem Generator Form Skeleton
export const SkeletonProblemGenerator = () => (
  <div className="max-w-6xl mx-auto">
    <div className="grid md:grid-cols-2 gap-12 items-center py-6">
      {/* Left Side Info */}
      <div className="hidden md:flex flex-col justify-center space-y-8">
        <div>
          <Skeleton className="h-16 w-48 mb-4 rounded-xl" />
          <Skeleton className="h-12 w-64 rounded-xl" />
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex gap-4 items-start">
              <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
              <div className="flex-1">
                <Skeleton className="h-5 w-32 mb-1 rounded" />
                <Skeleton className="h-4 w-full rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side Form */}
      <div className="bg-[#00303d]/60 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6 md:p-8 shadow-2xl">
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-48 mb-1 rounded-lg" />
            <Skeleton className="h-4 w-64 rounded" />
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {[...Array(12)].map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
          
          <div className="flex gap-3 mt-8">
            <Skeleton className="h-10 w-20 rounded-lg" />
            <Skeleton className="flex-1 h-10 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  </div>
);