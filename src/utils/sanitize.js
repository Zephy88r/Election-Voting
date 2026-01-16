/**
 * Input Sanitization Utilities
 * Prevents XSS attacks and ensures data integrity
 */

/**
 * Sanitize HTML string to prevent XSS
 * @param {string} html - HTML string to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeHTML = (html) => {
  if (!html || typeof html !== 'string') return '';
  
  // Create a temporary div element
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

/**
 * Sanitize user input (remove potentially dangerous characters)
 * @param {string} input - User input to sanitize
 * @returns {string} - Sanitized input
 */
export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') return '';
  
  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');
  
  // Remove script tags and their content
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove event handlers (onclick, onerror, etc.)
  sanitized = sanitized.replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '');
  
  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');
  
  // Remove data: protocol (can be used for XSS)
  sanitized = sanitized.replace(/data:/gi, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  return sanitized;
};

/**
 * Sanitize email address
 * @param {string} email - Email to sanitize
 * @returns {string} - Sanitized email
 */
export const sanitizeEmail = (email) => {
  if (!email || typeof email !== 'string') return '';
  
  // Remove any HTML/script tags
  let sanitized = sanitizeInput(email);
  
  // Remove whitespace
  sanitized = sanitized.trim();
  
  // Convert to lowercase
  sanitized = sanitized.toLowerCase();
  
  return sanitized;
};

/**
 * Sanitize phone number (keep only digits, +, -, and spaces)
 * @param {string} phone - Phone number to sanitize
 * @returns {string} - Sanitized phone number
 */
export const sanitizePhone = (phone) => {
  if (!phone || typeof phone !== 'string') return '';
  
  // Keep only digits, +, -, spaces, and parentheses
  return phone.replace(/[^0-9+\-() ]/g, '').trim();
};

/**
 * Sanitize text input (remove special characters that could be used for injection)
 * @param {string} text - Text to sanitize
 * @param {object} options - Sanitization options
 * @returns {string} - Sanitized text
 */
export const sanitizeText = (text, options = {}) => {
  if (!text || typeof text !== 'string') return '';
  
  let sanitized = sanitizeInput(text);
  
  // Remove SQL injection patterns if specified
  if (options.preventSQLInjection) {
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
      /(--|;|\*|'|"|`)/g,
      /(\b(OR|AND)\s+\d+\s*=\s*\d+)/gi,
    ];
    
    sqlPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });
  }
  
  // Limit length if specified
  if (options.maxLength) {
    sanitized = sanitized.substring(0, options.maxLength);
  }
  
  return sanitized.trim();
};

/**
 * Escape special characters for HTML output
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
export const escapeHTML = (text) => {
  if (!text || typeof text !== 'string') return '';
  
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

/**
 * Sanitize object recursively
 * @param {object} obj - Object to sanitize
 * @param {object} options - Sanitization options
 * @returns {object} - Sanitized object
 */
export const sanitizeObject = (obj, options = {}) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, options));
  }
  
  const sanitized = {};
  
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      
      if (typeof value === 'string') {
        // Apply appropriate sanitization based on key name
        if (key.toLowerCase().includes('email')) {
          sanitized[key] = sanitizeEmail(value);
        } else if (key.toLowerCase().includes('phone')) {
          sanitized[key] = sanitizePhone(value);
        } else {
          sanitized[key] = sanitizeText(value, options);
        }
      } else if (typeof value === 'object') {
        sanitized[key] = sanitizeObject(value, options);
      } else {
        sanitized[key] = value;
      }
    }
  }
  
  return sanitized;
};

export default {
  sanitizeHTML,
  sanitizeInput,
  sanitizeEmail,
  sanitizePhone,
  sanitizeText,
  escapeHTML,
  sanitizeObject,
};
