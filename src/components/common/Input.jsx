import React, { forwardRef } from 'react';
import './Input.css';

/**
 * Input Component
 * Reusable input field with validation states and error messages
 * 
 * @param {string} type - Input type (text, email, password, etc.)
 * @param {string} label - Input label
 * @param {string} name - Input name
 * @param {string} value - Input value
 * @param {function} onChange - Change handler
 * @param {string} placeholder - Placeholder text
 * @param {boolean} required - Required field indicator
 * @param {string} error - Error message
 * @param {string} helperText - Helper text
 * @param {boolean} disabled - Disabled state
 * @param {React.ReactNode} icon - Icon element
 * @param {React.ReactNode} rightIcon - Right icon element (e.g., password toggle)
 * @param {string} className - Additional CSS classes
 */
const Input = forwardRef(({
  type = 'text',
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error,
  helperText,
  disabled = false,
  icon,
  rightIcon,
  className = '',
  ...props
}, ref) => {
  const inputClasses = [
    'input',
    error && 'input--error',
    disabled && 'input--disabled',
    icon && 'input--with-icon',
    rightIcon && 'input--with-right-icon',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="input-group">
      {label && (
        <label htmlFor={name} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      
      <div className="input-wrapper">
        {icon && <span className="input-icon-left">{icon}</span>}
        
        <input
          ref={ref}
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClasses}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${name}-error` : helperText ? `${name}-helper` : undefined
          }
          {...props}
        />
        
        {rightIcon && <span className="input-icon-right">{rightIcon}</span>}
      </div>
      
      {error && (
        <span id={`${name}-error`} className="input-error" role="alert">
          {error}
        </span>
      )}
      
      {helperText && !error && (
        <span id={`${name}-helper`} className="input-helper">
          {helperText}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
