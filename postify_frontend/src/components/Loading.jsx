import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = 'primary' }) => {

  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };
  

  const colorClasses = {
    primary: 'border-primary',
    cream: 'border-cream',
    white: 'border-white',
    gray: 'border-gray-300'
  };
  

  const spinnerSize = sizeClasses[size] || sizeClasses.medium;
  const spinnerColor = colorClasses[color] || colorClasses.primary;
  
  return (
    <div className="flex justify-center items-center">
      <div className={`${spinnerSize} border-4 ${spinnerColor} border-t-transparent rounded-full animate-spin`}></div>
    </div>
  );
};


export const LoadingOverlay = ({ size = 'large', color = 'primary', message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-cream bg-opacity-80 flex flex-col justify-center items-center z-50">
      <LoadingSpinner size={size} color={color} />
      {message && (
        <p className="mt-4 text-primary font-medium text-lg">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;


// // Basic usage
// <LoadingSpinner />

// // Custom size and color
// <LoadingSpinner size="large" color="cream" />

// // Full-page loading overlay
// <LoadingOverlay message="Loading posts..." />