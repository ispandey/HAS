import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

// Context
import { useAuth } from './context/AuthContext';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Public Pages
import HomePage from './pages/HomePage';
import SearchHostelsPage from './pages/SearchHostelsPage';
import HostelDetailsPage from './pages/HostelDetailsPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentBookingsPage from './pages/student/StudentBookingsPage';
import StudentProfilePage from './pages/student/StudentProfilePage';

// Hostel Owner Pages
import OwnerDashboard from './pages/owner/OwnerDashboard';
import AddHostelPage from './pages/owner/AddHostelPage';
import ManageHostelsPage from './pages/owner/ManageHostelsPage';
import OwnerBookingsPage from './pages/owner/OwnerBookingsPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminHostelsPage from './pages/admin/AdminHostelsPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';

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
      
      <Box component="main" sx={{ flexGrow: 1, mt: 8 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchHostelsPage />} />
          <Route path="/hostels/:id" element={<HostelDetailsPage />} />
          
          {/* Auth Routes */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            } 
          />

          {/* Dashboard Route - Redirects based on role */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardRedirect />
              </ProtectedRoute>
            } 
          />

          {/* Student Routes */}
          <Route 
            path="/student/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/bookings" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentBookingsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/profile" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentProfilePage />
              </ProtectedRoute>
            } 
          />

          {/* Hostel Owner Routes */}
          <Route 
            path="/owner/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['hostel_owner']}>
                <OwnerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/owner/add-hostel" 
            element={
              <ProtectedRoute allowedRoles={['hostel_owner']}>
                <AddHostelPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/owner/hostels" 
            element={
              <ProtectedRoute allowedRoles={['hostel_owner']}>
                <ManageHostelsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/owner/bookings" 
            element={
              <ProtectedRoute allowedRoles={['hostel_owner']}>
                <OwnerBookingsPage />
              </ProtectedRoute>
            } 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUsersPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/hostels" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminHostelsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/bookings" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminBookingsPage />
              </ProtectedRoute>
            } 
          />

          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
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