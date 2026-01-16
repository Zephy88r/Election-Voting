/**
 * Date Validation Utilities for AD (Gregorian) Dates
 * Validates date of birth and other date fields
 */

/**
 * Validates if user is 18 years or older based on AD date
 * @param {string} dateString - AD date in format "YYYY-MM-DD"
 * @returns {boolean} - true if user is 18+, false otherwise
 */
export const isAge18Plus = (dateString) => {
  if (!dateString) return false;

  try {
    const birthDate = new Date(dateString);
    if (isNaN(birthDate.getTime())) return false;

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Adjust age if birthday hasn't occurred this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= 18;
  } catch (error) {
    console.error('Age calculation error:', error);
    return false;
  }
};

/**
 * Validates if AD date is not in the future
 * @param {string} dateString - AD date in format "YYYY-MM-DD"
 * @returns {boolean} - true if date is not in the future, false otherwise
 */
export const isNotFutureDate = (dateString) => {
  if (!dateString) return false;

  try {
    const selectedDate = new Date(dateString);
    if (isNaN(selectedDate.getTime())) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare dates only
    selectedDate.setHours(0, 0, 0, 0);

    return selectedDate <= today;
  } catch (error) {
    console.error('Future date validation error:', error);
    return false;
  }
};

/**
 * Validates AD date for registration (18+ and not future)
 * @param {string} dateString - AD date in format "YYYY-MM-DD"
 * @returns {object} - { valid: boolean, error: string|null }
 */
export const validateADDate = (dateString) => {
  const dateStr = dateString ? String(dateString).trim() : '';
  
  if (!dateStr || dateStr === '') {
    return { valid: false, error: 'Date of Birth is required' };
  }

  // Check if it's a valid date format (YYYY-MM-DD)
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(dateStr)) {
    return { valid: false, error: 'Invalid date format. Please use YYYY-MM-DD format' };
  }

  // Check if date is valid
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return { valid: false, error: 'Invalid date. Please check the date and try again.' };
  }

  if (!isNotFutureDate(dateStr)) {
    return { valid: false, error: 'Date of Birth cannot be in the future' };
  }

  if (!isAge18Plus(dateStr)) {
    return { valid: false, error: 'You must be 18 years or older to register' };
  }

  return { valid: true, error: null };
};

/**
 * Format date for display
 * @param {string} dateString - AD date in format "YYYY-MM-DD"
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
};

export default {
  isAge18Plus,
  isNotFutureDate,
  validateADDate,
  formatDate,
};
