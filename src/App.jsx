import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Page Components
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import Profile from './pages/Profile';
import VotingHistory from './pages/VotingHistory';

// Province Pages
import Koshi from './pages/provinces/Koshi';
import Madhesh from './pages/provinces/Madesh';
import Bagmati from './pages/provinces/Bagmati';
import Gandaki from './pages/provinces/Gandaki';
import Lumbini from './pages/provinces/Lumbini';
import Karnali from './pages/provinces/Karnali';
import Sudurpashchim from './pages/provinces/Sudurpashchim';

/**
 * Main App Component
 * Handles routing and authentication protection
 * All province pages require authentication
 */
function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ minHeight: '100vh', width: '100%' }}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Dashboard />} />
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} 
        />

        {/* Protected Routes - Require Authentication */}
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/voting-history" 
          element={
            <ProtectedRoute>
              <VotingHistory />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/koshi" 
          element={
            <ProtectedRoute>
              <Koshi />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/madhesh" 
          element={
            <ProtectedRoute>
              <Madhesh />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/bagmati" 
          element={
            <ProtectedRoute>
              <Bagmati />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/gandaki" 
          element={
            <ProtectedRoute>
              <Gandaki />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/lumbini" 
          element={
            <ProtectedRoute>
              <Lumbini />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/karnali" 
          element={
            <ProtectedRoute>
              <Karnali />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/sudurpaschim" 
          element={
            <ProtectedRoute>
              <Sudurpashchim />
            </ProtectedRoute>
          } 
        />

        {/* Fallback - Redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
