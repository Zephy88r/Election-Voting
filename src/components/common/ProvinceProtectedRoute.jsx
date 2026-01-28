import React from 'react';
import { Navigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { PROVINCE_REVERSE_MAPPING } from '../../constants/provinces';

/**
 * ProvinceProtectedRoute Component
 * Ensures users can only access their registered province
 */
const ProvinceProtectedRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { provinceId } = useParams();
  const location = useLocation();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If no user data, wait for it to load
  if (!user) {
    return <div>Loading...</div>;
  }

  const userProvinceName = user?.province?.name;
  
  // Handle legacy routes like /koshi/vote, /madhesh/vote, etc.
  let requiredProvinceName;
  if (provinceId) {
    requiredProvinceName = PROVINCE_REVERSE_MAPPING[provinceId];
  } else {
    // Extract province from path for legacy routes
    const pathParts = location.pathname.split('/');
    const provinceFromPath = pathParts[1]; // e.g., 'koshi' from '/koshi/vote'
    requiredProvinceName = PROVINCE_REVERSE_MAPPING[provinceFromPath];
  }

  // If user doesn't have access to this province, redirect to dashboard with error
  if (userProvinceName !== requiredProvinceName) {
    // Show alert and redirect
    setTimeout(() => {
      alert(`Access denied. You can only vote in your registered province: ${userProvinceName}`);
    }, 100);
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProvinceProtectedRoute;