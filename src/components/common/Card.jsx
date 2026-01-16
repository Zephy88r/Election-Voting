import React from 'react';
import './Card.css';

/**
 * Card Component
 * Reusable card container with consistent styling
 * 
 * @param {React.ReactNode} children - Card content
 * @param {string} className - Additional CSS classes
 * @param {string} variant - Card variant (default, elevated, outlined)
 * @param {function} onClick - Click handler (makes card clickable)
 */
const Card = ({
  children,
  className = '',
  variant = 'default',
  onClick,
  ...props
}) => {
  const cardClasses = [
    'card',
    `card--${variant}`,
    onClick && 'card--clickable',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      className={cardClasses}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Card;
