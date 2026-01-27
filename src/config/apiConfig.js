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
  USE_API: true, // Enable to use backend authentication

  // Backend API base URL. In dev we use a relative URL so Vite proxy can forward requests to Django
  // This avoids cross-origin cookie/session problems during local development
  API_BASE_URL: import.meta.env.DEV ? '' : (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'),

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
