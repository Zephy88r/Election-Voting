import React from 'react';
import './LoadingSpinner.css';

/**
 * LoadingSpinner Component
 * Reusable loading spinner with different sizes
 * 
 * @param {string} size - Spinner size (sm, md, lg)
 * @param {string} className - Additional CSS classes
 */
const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const spinnerClasses = [
    'loading-spinner',
    `loading-spinner--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={spinnerClasses} role="status" aria-label="Loading">
      <div className="loading-spinner__circle" />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default LoadingSpinner;
