/**
 * Centralized API service for backend communication
 * All API calls should go through this service
 * 
 * Backend developer notes:
 * - Replace API_BASE_URL with your actual backend URL
 * - All endpoints expect JSON responses
 * - Authentication tokens are sent in Authorization header
 */

// API Base URL - Use environment variable in production
// In Vite, use import.meta.env instead of process.env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

/**
 * Generic API request handler
 * @param {string} endpoint - API endpoint (e.g., "/auth/login")
 * @param {object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise<object>} - Response data
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get token from localStorage for authenticated requests
  const token = localStorage.getItem("token");
  
  // Default headers
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  // Add authorization header if token exists
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    
    // Handle non-JSON responses
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Server response is not JSON");
    }

    const data = await response.json();

    // Handle error responses
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

/**
 * Authentication API endpoints
 */
export const authAPI = {
  /**
   * Register a new user
   * @param {object} userData - User registration data
   * @param {string} userData.name - Full name
   * @param {string} userData.email - Email address
   * @param {string} userData.address - Address
   * @param {string} userData.dateOfBirth - Date of birth (AD format: YYYY-MM-DD)
   * @param {string} userData.citizenshipNumber - Citizenship number
   * @param {string} userData.voterId - Voter ID
   * @param {string} userData.password - Password
   * @param {string|File} userData.faceImage - Face image (base64 or File object)
   * @returns {Promise<object>} - Response with token and user data
   */
  register: async (userData) => {
    // If faceImage is a File, convert to base64 or FormData
    let body = { ...userData };
    
    // For multipart/form-data (if backend expects it)
    // const formData = new FormData();
    // Object.keys(userData).forEach(key => {
    //   if (key === 'faceImage' && userData[key] instanceof File) {
    //     formData.append('faceImage', userData[key]);
    //   } else {
    //     formData.append(key, userData[key]);
    //   }
    // });

    return apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  /**
   * Login user
   * @param {object} credentials - Login credentials
   * @param {string} credentials.voterId - Voter ID
   * @param {string} credentials.password - Password
   * @param {string} credentials.faceImage - Face image (base64 string)
   * @returns {Promise<object>} - Response with token and user data
   */
  login: async (credentials) => {
    return apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  /**
   * Get current user profile
   * @returns {Promise<object>} - User profile data
   */
  getProfile: async () => {
    return apiRequest("/auth/profile", {
      method: "GET",
    });
  },

  /**
   * Update user profile
   * @param {object} userData - Updated user data
   * @returns {Promise<object>} - Updated user data
   */
  updateProfile: async (userData) => {
    return apiRequest("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  },

  /**
   * Logout user (optional - for token invalidation on backend)
   * @returns {Promise<object>} - Logout response
   */
  logout: async () => {
    return apiRequest("/auth/logout", {
      method: "POST",
    });
  },
};

/**
 * Voting API endpoints
 */
export const votingAPI = {
  /**
   * Get candidates for a province
   * @param {string} provinceId - Province identifier
   * @returns {Promise<object>} - List of candidates
   */
  getCandidates: async (provinceId) => {
    return apiRequest(`/voting/candidates/${provinceId}`, {
      method: "GET",
    });
  },

  /**
   * Submit vote
   * @param {object} voteData - Vote data
   * @param {string} voteData.provinceId - Province identifier
   * @param {string} voteData.candidateId - Selected candidate ID
   * @returns {Promise<object>} - Vote confirmation
   */
  submitVote: async (voteData) => {
    return apiRequest("/voting/vote", {
      method: "POST",
      body: JSON.stringify(voteData),
    });
  },

  /**
   * Get voting status for current user
   * @returns {Promise<object>} - Voting status information
   */
  getVotingStatus: async () => {
    return apiRequest("/voting/status", {
      method: "GET",
    });
  },
};

/**
 * Province API endpoints
 */
export const provinceAPI = {
  /**
   * Get all provinces
   * @returns {Promise<object>} - List of provinces
   */
  getAll: async () => {
    return apiRequest("/provinces", {
      method: "GET",
    });
  },

  /**
   * Get province details
   * @param {string} provinceId - Province identifier
   * @returns {Promise<object>} - Province details
   */
  getById: async (provinceId) => {
    return apiRequest(`/provinces/${provinceId}`, {
      method: "GET",
    });
  },
};

// Export default API request function for custom endpoints
export default apiRequest;
