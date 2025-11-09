import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

// Simple centered loading spinner
export const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="flex items-center justify-center min-h-screen bg-[#002029]">
    <div className="text-center">
      <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
      <p className="text-gray-300 text-lg">{message}</p>
    </div>
  </div>
);

// Full page loading with branding
export const LoadingScreen = ({ message = 'Loading your workspace...' }) => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#002029] via-[#00303d] to-[#004052]">
    <div className="text-center">
      {/* Animated logo or icon */}
      <div className="relative mb-8">
        <div className="w-20 h-20 mx-auto bg-[#00303d] border-2 border-blue-500/30 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20 animate-pulse">
          <img 
            src="/src/assets/logo.png" 
            alt="AutoCP Logo" 
            className="h-12 w-12 object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<svg class="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>';
            }}
          />
        </div>
        {/* Orbiting circles */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
          <div className="w-2 h-2 bg-blue-400 rounded-full absolute top-0 left-1/2 -translate-x-1/2"></div>
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}>
          <div className="w-2 h-2 bg-cyan-400 rounded-full absolute bottom-0 left-1/2 -translate-x-1/2"></div>
        </div>
      </div>
      
      {/* Loading text */}
      <h2 className="text-2xl font-bold text-white mb-3">AutoCP</h2>
      <p className="text-gray-300 text-lg mb-6">{message}</p>
      
      {/* Progress bar */}
      <div className="w-64 mx-auto h-1 bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-loading-bar"></div>
      </div>
    </div>
  </div>
);

// Inline loading (for sections)
export const InlineLoading = ({ message = 'Loading...', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        <Loader2 className={`${sizeClasses[size]} text-blue-400 animate-spin mx-auto mb-2`} />
        <p className="text-gray-400 text-sm">{message}</p>
      </div>
    </div>
  );
};

// Compact loading for buttons or small areas
export const CompactLoading = () => (
  <div className="inline-flex items-center gap-2">
    <Loader2 className="w-4 h-4 animate-spin text-current" />
    <span>Loading...</span>
  </div>
);
