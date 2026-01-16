/**
 * Error Message Utilities
 * Centralized error message handling for consistent user feedback
 */

/**
 * Get user-friendly error message
 * @param {string|Error} error - Error object or error message string
 * @param {string} context - Context where error occurred (e.g., 'login', 'register')
 * @returns {string} - User-friendly error message
 */
export const getErrorMessage = (error, context = 'general') => {
  // If it's already a string, return it
  if (typeof error === 'string') {
    return error;
  }

  // If it's an Error object, get the message
  const errorMessage = error?.message || error?.error || 'An unexpected error occurred';

  // Context-specific error message mappings
  const errorMappings = {
    login: {
      'Invalid credentials': 'The email or password you entered is incorrect. Please try again.',
      'User not found': 'No account found with this email address.',
      'Network error': 'Unable to connect to the server. Please check your internet connection.',
      'Invalid email': 'Please enter a valid email address.',
      'Password required': 'Please enter your password.',
    },
    register: {
      'This email is already registered': 'An account with this email already exists. Please use a different email or try logging in.',
      'Invalid email': 'Please enter a valid email address.',
      'Password must be at least 6 characters': 'Password must be at least 6 characters long.',
      'Password must contain uppercase, lowercase, and special characters': 'Password must include uppercase letters, lowercase letters, and special characters.',
      'Passwords do not match': 'The passwords you entered do not match. Please try again.',
      'Province selection is required': 'Please select your province to continue.',
      'Network error': 'Unable to connect to the server. Please check your internet connection.',
    },
    general: {
      'Network error': 'Unable to connect to the server. Please check your internet connection.',
      'Unauthorized': 'You are not authorized to perform this action.',
      'Forbidden': 'Access denied. You do not have permission to access this resource.',
      'Not found': 'The requested resource was not found.',
      'Server error': 'An error occurred on the server. Please try again later.',
    },
  };

  // Get context-specific mappings
  const mappings = errorMappings[context] || errorMappings.general;

  // Check if we have a specific mapping for this error
  if (mappings[errorMessage]) {
    return mappings[errorMessage];
  }

  // Check general mappings
  if (errorMappings.general[errorMessage]) {
    return errorMappings.general[errorMessage];
  }

  // Return the original error message if no mapping found
  return errorMessage;
};

/**
 * Get success message
 * @param {string} action - Action that succeeded (e.g., 'register', 'login', 'vote')
 * @param {object} data - Optional data for personalized messages
 * @returns {string} - Success message
 */
export const getSuccessMessage = (action, data = {}) => {
  const messages = {
    register: 'Registration successful! Redirecting to login...',
    login: `Welcome back${data.name ? `, ${data.name}` : ''}! Redirecting to dashboard...`,
    vote: `Your vote for ${data.candidateName || 'the candidate'} has been recorded successfully!`,
    profileUpdate: 'Your profile has been updated successfully!',
    logout: 'You have been logged out successfully.',
  };

  return messages[action] || 'Operation completed successfully!';
};

/**
 * Format validation error for display
 * @param {object} validation - Validation result object
 * @returns {string|null} - Formatted error message or null
 */
export const formatValidationError = (validation) => {
  if (!validation || validation.valid) {
    return null;
  }
  return validation.error || 'Invalid input';
};

export default {
  getErrorMessage,
  getSuccessMessage,
  formatValidationError,
};
