import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import ProvinceProtectedRoute from './components/common/ProvinceProtectedRoute';
import SessionWarning from './components/common/SessionWarning';
import Footer from './components/common/Footer';

// Page Components
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import Profile from './pages/Profile';
import DistrictSelection from './pages/DistrictSelection';
import VoteWizard from './pages/VoteWizard';
import AdminPanel from './pages/AdminPanel';

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
    <div style={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>
      {isAuthenticated && <SessionWarning />}
      <div style={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes - Require Authentication */}
          <Route 
            path="/" 
            element={
              
                <Dashboard />
              
            } 
          />
          <Route 
            path="/dashboard" 
            element={
                <Dashboard />
            } 
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
          
          {/* Admin Panel Route */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            } 
          />
          
          {/* District Selection Routes */}
          <Route 
            path="/:provinceId/districts" 
            element={
              <ProtectedRoute>
                <ProvinceProtectedRoute>
                  <DistrictSelection />
                </ProvinceProtectedRoute>
              </ProtectedRoute>
            } 
          />
          
          {/* Vote Wizard Route */}
          <Route 
            path="/vote/:provinceId" 
            element={
              <ProtectedRoute>
                <ProvinceProtectedRoute>
                  <VoteWizard />
                </ProvinceProtectedRoute>
              </ProtectedRoute>
            } 
          />
          
          {/* Legacy Voting Routes */}
          <Route 
            path="/koshi/vote" 
            element={
              <ProtectedRoute>
                <ProvinceProtectedRoute>
                  <Koshi />
                </ProvinceProtectedRoute>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/madhesh/vote" 
            element={
              <ProtectedRoute>
                <ProvinceProtectedRoute>
                  <Koshi />
                </ProvinceProtectedRoute>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/bagmati/vote" 
            element={
              <ProtectedRoute>
                <ProvinceProtectedRoute>
                  <Bagmati />
                </ProvinceProtectedRoute>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/gandaki/vote" 
            element={
              <ProtectedRoute>
                <ProvinceProtectedRoute>
                  <Gandaki />
                </ProvinceProtectedRoute>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/lumbini/vote" 
            element={
              <ProtectedRoute>
                <ProvinceProtectedRoute>
                  <Lumbini />
                </ProvinceProtectedRoute>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/karnali/vote" 
            element={
              <ProtectedRoute>
                <ProvinceProtectedRoute>
                  <Karnali />
                </ProvinceProtectedRoute>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/sudurpaschim/vote" 
            element={
              <ProtectedRoute>
                <ProvinceProtectedRoute>
                  <Sudurpashchim />
                </ProvinceProtectedRoute>
              </ProtectedRoute>
            } 
          />

          {/* Fallback - Redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
