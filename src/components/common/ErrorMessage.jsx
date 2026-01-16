import React from 'react';
import './ErrorMessage.css';

/**
 * ErrorMessage Component
 * Displays error messages with consistent styling
 * 
 * @param {string} message - Error message to display
 * @param {string} className - Additional CSS classes
 */
const ErrorMessage = ({ message, className = '' }) => {
  if (!message) return null;

  return (
    <div className={`error-message ${className}`} role="alert" aria-live="polite">
      <span className="error-message__icon" aria-hidden="true">⚠</span>
      <span className="error-message__text">{message}</span>
    </div>
  );
};

export default ErrorMessage;
