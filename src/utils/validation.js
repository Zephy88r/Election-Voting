/**
 * Validation Utilities
 * Comprehensive validation functions for forms and user input
 */

/**
 * Validates email address
 * @param {string} email - Email to validate
 * @returns {object} - { valid: boolean, error: string|null }
 */
export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return { valid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { valid: false, error: 'Please enter a valid email address' };
  }

  return { valid: true, error: null };
};

/**
 * Validates Nepal phone number format
 * Format: +977-XXX-XXXXXXX or 977XXXXXXXXX or 98XXXXXXXXX
 * @param {string} phone - Phone number to validate
 * @returns {object} - { valid: boolean, error: string|null }
 */
export const validatePhone = (phone) => {
  if (!phone || !phone.trim()) {
    return { valid: false, error: 'Phone number is required' };
  }

  const cleaned = phone.trim().replace(/\s+/g, '');
  
  // Nepal phone number patterns
  const patterns = [
    /^\+977-[0-9]{2}-[0-9]{7}$/,           // +977-98-1234567
    /^977[0-9]{9}$/,                        // 977981234567
    /^98[0-9]{8}$/,                         // 9812345678
    /^9[0-9]{9}$/,                          // 9812345678 (without leading 0)
  ];

  const isValid = patterns.some(pattern => pattern.test(cleaned));
  
  if (!isValid) {
    return { 
      valid: false, 
      error: 'Please enter a valid Nepal phone number (e.g., +977-98-1234567)' 
    };
  }

  return { valid: true, error: null };
};

/**
 * Validates password strength
 * Requirements: min 6 chars, at least one uppercase, one lowercase, one special char
 * @param {string} password - Password to validate
 * @returns {object} - { valid: boolean, error: string|null, strength: string }
 */
export const validatePassword = (password) => {
  if (!password || !password.trim()) {
    return { valid: false, error: 'Password is required', strength: 'weak' };
  }

  if (password.length < 6) {
    return { 
      valid: false, 
      error: 'Password must be at least 6 characters long', 
      strength: 'weak' 
    };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasSpecialChar = /[\W_]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasSpecialChar) {
    return { 
      valid: false, 
      error: 'Password must contain uppercase, lowercase, and special characters', 
      strength: 'medium' 
    };
  }

  // Calculate strength
  let strength = 'weak';
  if (password.length >= 8 && hasNumber) {
    strength = 'strong';
  } else if (password.length >= 6) {
    strength = 'medium';
  }

  return { valid: true, error: null, strength };
};

/**
 * Validates citizenship number (Nepal format)
 * @param {string} citizenshipNumber - Citizenship number to validate
 * @returns {object} - { valid: boolean, error: string|null }
 */
export const validateCitizenshipNumber = (citizenshipNumber) => {
  if (!citizenshipNumber || !citizenshipNumber.trim()) {
    return { valid: false, error: 'Citizenship number is required' };
  }

  const cleaned = citizenshipNumber.trim().replace(/[^0-9-]/g, '');
  
  if (cleaned.length < 5) {
    return { valid: false, error: 'Citizenship number must be at least 5 characters' };
  }

  // Basic format validation (can be enhanced based on actual Nepal format)
  if (!/^[0-9-]+$/.test(cleaned)) {
    return { valid: false, error: 'Citizenship number contains invalid characters' };
  }

  return { valid: true, error: null };
};

/**
 * Validates voter ID
 * @param {string} voterId - Voter ID to validate
 * @returns {object} - { valid: boolean, error: string|null }
 */
export const validateVoterId = (voterId) => {
  if (!voterId || !voterId.trim()) {
    return { valid: false, error: 'Voter ID is required' };
  }

  if (voterId.trim().length < 3) {
    return { valid: false, error: 'Voter ID must be at least 3 characters' };
  }

  return { valid: true, error: null };
};

/**
 * Validates full name
 * @param {string} name - Name to validate
 * @returns {object} - { valid: boolean, error: string|null }
 */
export const validateName = (name) => {
  if (!name || !name.trim()) {
    return { valid: false, error: 'Name is required' };
  }

  if (name.trim().length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' };
  }

  // Check for valid name characters (letters, spaces, hyphens, apostrophes)
  if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) {
    return { valid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }

  return { valid: true, error: null };
};

/**
 * Validates address
 * @param {string} address - Address to validate
 * @returns {object} - { valid: boolean, error: string|null }
 */
export const validateAddress = (address) => {
  if (!address || !address.trim()) {
    return { valid: false, error: 'Address is required' };
  }

  if (address.trim().length < 5) {
    return { valid: false, error: 'Address must be at least 5 characters' };
  }

  return { valid: true, error: null };
};

/**
 * Validates that two passwords match
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {object} - { valid: boolean, error: string|null }
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (!confirmPassword || !confirmPassword.trim()) {
    return { valid: false, error: 'Please confirm your password' };
  }

  if (password !== confirmPassword) {
    return { valid: false, error: 'Passwords do not match' };
  }

  return { valid: true, error: null };
};

/**
 * Validates form field based on field type
 * @param {string} fieldType - Type of field (email, phone, password, etc.)
 * @param {string} value - Value to validate
 * @param {object} options - Additional validation options
 * @returns {object} - { valid: boolean, error: string|null }
 */
export const validateField = (fieldType, value, options = {}) => {
  switch (fieldType) {
    case 'email':
      return validateEmail(value);
    case 'phone':
      return validatePhone(value);
    case 'password':
      return validatePassword(value);
    case 'citizenshipNumber':
      return validateCitizenshipNumber(value);
    case 'voterId':
      return validateVoterId(value);
    case 'name':
      return validateName(value);
    case 'address':
      return validateAddress(value);
    case 'passwordMatch':
      return validatePasswordMatch(options.password, value);
    default:
      return { valid: true, error: null };
  }
};

/**
 * Formats phone number to standard Nepal format
 * @param {string} phone - Phone number to format
 * @returns {string} - Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  const cleaned = phone.replace(/\D/g, '');
  
  // If starts with 977, format as +977-XX-XXXXXXX
  if (cleaned.startsWith('977') && cleaned.length === 12) {
    return `+977-${cleaned.slice(3, 5)}-${cleaned.slice(5)}`;
  }
  
  // If starts with 98 and has 10 digits, format as +977-98-XXXXXXX
  if (cleaned.startsWith('98') && cleaned.length === 10) {
    return `+977-${cleaned.slice(0, 2)}-${cleaned.slice(2)}`;
  }
  
  return phone; // Return original if format doesn't match
};

export default {
  validateEmail,
  validatePhone,
  validatePassword,
  validateCitizenshipNumber,
  validateVoterId,
  validateName,
  validateAddress,
  validatePasswordMatch,
  validateField,
  formatPhoneNumber,
};
