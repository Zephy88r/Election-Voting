import { bsToAd } from "@sbmdkl/nepali-date-converter";

/**
 * Converts Bikram Sambat (BS) date to Anno Domini (AD) date
 * @param {string} bsDate - BS date in format "YYYY-MM-DD" or "YYYY/MM/DD"
 * @returns {string|null} - AD date in format "YYYY-MM-DD" or null if conversion fails
 */
export const convertBSToAD = (bsDate) => {
  if (!bsDate) {
    return null;
  }
  
  // Convert to string if it's not already
  const dateStr = String(bsDate).trim();
  
  if (!dateStr || dateStr === "") {
    return null;
  }

  try {
    // Normalize date format (handle both / and - separators)
    const normalizedBS = dateStr.replace(/\//g, "-");
    const adDate = bsToAd(normalizedBS);
    
    // Verify the conversion returned a valid date string
    if (!adDate || adDate === "Invalid Date" || adDate === "NaN-NaN-NaN") {
      console.error("Invalid BS date conversion result:", adDate);
      return null;
    }
    
    return adDate; // Returns "YYYY-MM-DD" format
  } catch (error) {
    console.error("BS to AD conversion error:", error, "Input:", bsDate);
    return null;
  }
};

/**
 * Validates if user is 18 years or older based on BS date
 * @param {string} bsDate - BS date in format "YYYY-MM-DD" or "YYYY/MM/DD"
 * @returns {boolean} - true if user is 18+, false otherwise
 */
export const isAge18Plus = (bsDate) => {
  if (!bsDate) return false;

  const adDate = convertBSToAD(bsDate);
  if (!adDate) return false;

  try {
    const birthDate = new Date(adDate);
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
    console.error("Age calculation error:", error);
    return false;
  }
};

/**
 * Validates if BS date is not in the future
 * @param {string} bsDate - BS date in format "YYYY-MM-DD" or "YYYY/MM/DD"
 * @returns {boolean} - true if date is not in the future, false otherwise
 */
export const isNotFutureDate = (bsDate) => {
  if (!bsDate) return false;

  const adDate = convertBSToAD(bsDate);
  if (!adDate) return false;

  try {
    const selectedDate = new Date(adDate);
    if (isNaN(selectedDate.getTime())) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare dates only
    selectedDate.setHours(0, 0, 0, 0);

    return selectedDate <= today;
  } catch (error) {
    console.error("Future date validation error:", error);
    return false;
  }
};

/**
 * Validates BS date for registration (18+ and not future)
 * @param {string} bsDate - BS date in format "YYYY-MM-DD" or "YYYY/MM/DD"
 * @returns {object} - { valid: boolean, error: string|null }
 */
export const validateBSDate = (bsDate) => {
  // Convert to string and trim
  const dateStr = bsDate ? String(bsDate).trim() : "";
  
  if (!dateStr || dateStr === "") {
    return { valid: false, error: "Date of Birth is required" };
  }

  // Check if it's a valid date format (should be YYYY-MM-DD or YYYY/MM/DD)
  const datePattern = /^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/;
  if (!datePattern.test(dateStr)) {
    return { valid: false, error: "Invalid date format. Please use YYYY-MM-DD format" };
  }

  // Check if date can be converted to AD
  const adDate = convertBSToAD(dateStr);
  if (!adDate) {
    return { valid: false, error: "Invalid date. Please check the date and try again." };
  }

  if (!isNotFutureDate(dateStr)) {
    return { valid: false, error: "Date of Birth cannot be in the future" };
  }

  if (!isAge18Plus(dateStr)) {
    return { valid: false, error: "You must be 18 years or older to register" };
  }

  return { valid: true, error: null };
};
