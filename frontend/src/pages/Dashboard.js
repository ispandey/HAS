import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from './dashboard/AdminDashboard';
import StudentDashboard from './dashboard/StudentDashboard';
import OwnerDashboard from './dashboard/OwnerDashboard';
import { Box, CircularProgress, Container, Typography } from '@mui/material';

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Container>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh'
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh',
            textAlign: 'center'
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Please log in to access your dashboard.
          </Typography>
        </Box>
      </Container>
    );
  }

  // Route to appropriate dashboard based on user role
  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'student':
      return <StudentDashboard />;
    case 'hostel_owner':
      return <OwnerDashboard />;
    default:
      return (
        <Container>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '50vh',
              textAlign: 'center'
            }}
          >
            <Typography variant="h6" color="error">
              Invalid user role. Please contact support.
            </Typography>
          </Box>
        </Container>
      );
  }
};

export default Dashboard;