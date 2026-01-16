import React from 'react';
import './SuccessMessage.css';

/**
 * SuccessMessage Component
 * Displays success messages with consistent styling
 * 
 * @param {string} message - Success message to display
 * @param {string} className - Additional CSS classes
 */
const SuccessMessage = ({ message, className = '' }) => {
  if (!message) return null;

  return (
    <div className={`success-message ${className}`} role="alert" aria-live="polite">
      <span className="success-message__icon" aria-hidden="true">✓</span>
      <span className="success-message__text">{message}</span>
    </div>
  );
};

export default SuccessMessage;
