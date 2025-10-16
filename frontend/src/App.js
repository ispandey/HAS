import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { AnimatePresence } from 'framer-motion';

// Context
import { useAuth } from './context/AuthContext';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PageTransition from './components/common/PageTransition';

// Public Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Dashboard Pages
import AdminDashboard from './pages/dashboard/AdminDashboard';
import StudentDashboard from './pages/dashboard/StudentDashboard';
import OwnerDashboard from './pages/dashboard/OwnerDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

// Public Route Component (redirect if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function App() {
  const { loading, checkAuthStatus } = useAuth();
  const [initializing, setInitializing] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const initializeApp = async () => {
      await checkAuthStatus();
      setInitializing(false);
    };

    initializeApp();
  }, [checkAuthStatus]);

  if (initializing || loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        flexDirection="column"
      >
        <CircularProgress size={60} />
        <Box mt={2} fontSize={18} color="text.secondary">
          Loading HABS...
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      
      <Box component="main" sx={{ flexGrow: 1, mt: 10, px: { xs: 2, md: 3 } }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />

            {/* Auth Routes */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <PageTransition>
                    <LoginPage />
                  </PageTransition>
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <PageTransition>
                    <RegisterPage />
                  </PageTransition>
                </PublicRoute>
              } 
            />

            {/* Dashboard Route - Redirects based on role */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <DashboardRedirect />
                  </PageTransition>
                </ProtectedRoute>
              } 
            />

            {/* Student Routes */}
            <Route 
              path="/student/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <PageTransition>
                    <StudentDashboard />
                  </PageTransition>
                </ProtectedRoute>
              } 
            />

            {/* Hostel Owner Routes */}
            <Route 
              path="/owner/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['hostel_owner']}>
                  <PageTransition>
                    <OwnerDashboard />
                  </PageTransition>
                </ProtectedRoute>
              } 
            />

            {/* Admin Routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <PageTransition>
                    <AdminDashboard />
                  </PageTransition>
                </ProtectedRoute>
              } 
            />

            {/* 404 Route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AnimatePresence>
      </Box>

      <Footer />
    </Box>
  );
}

// Helper component to redirect to appropriate dashboard
const DashboardRedirect = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case 'student':
      return <Navigate to="/student/dashboard" />;
    case 'hostel_owner':
      return <Navigate to="/owner/dashboard" />;
    case 'admin':
      return <Navigate to="/admin/dashboard" />;
    default:
      return <Navigate to="/" />;
  }
};

export default App;