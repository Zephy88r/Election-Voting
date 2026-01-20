/**
 * API Configuration
 * Toggle between localStorage (development) and API (production)
 * 
 * To enable API mode:
 * 1. Set USE_API to true
 * 2. Set API_BASE_URL to your backend URL
 * 3. Ensure your backend implements the endpoints defined in services/api.js
 */

export const API_CONFIG = {
  // Set to true to use API, false to use localStorage
  USE_API: true,

  // Backend API base URL (point to Django dev server)
  // Example: http://localhost:8000
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',

  // Request timeout in milliseconds
  TIMEOUT: 30000,

  // Retry configuration
  RETRY: {
    enabled: true,
    maxRetries: 3,
    retryDelay: 1000,
  },
};

/**
 * Helper function to check if API mode is enabled
 */
export const isApiMode = () => {
  return API_CONFIG.USE_API;
};

export default API_CONFIG;
