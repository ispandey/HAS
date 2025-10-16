import React, { useState, useEffect } from 'react';
import {
  Box, Container, Grid, Paper, Typography, Card, CardContent, CardMedia,
  Button, Chip, Rating, CircularProgress, Tab, Tabs
} from '@mui/material';
import {
  Business, TrendingUp, People, MonetizationOn, Visibility, Edit, Add,
  Home, Refresh
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import hostelService from '../../services/hostelService';
import bookingService from '../../services/bookingService';
import { toast } from 'react-toastify';

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const OwnerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState({ totalHostels: 0, totalBookings: 0, monthlyRevenue: 0, occupancyRate: 0 });
  const [hostels, setHostels] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const hostelsResponse = await hostelService.getOwnerHostels();
      setHostels(hostelsResponse.hostels || []);
      
      const bookingsResponse = await bookingService.getOwnerBookings();
      setBookings(bookingsResponse.bookings || []);
      
      setStats({
        totalHostels: hostelsResponse.hostels?.length || 0,
        totalBookings: bookingsResponse.bookings?.length || 0,
        monthlyRevenue: bookingsResponse.bookings?.reduce((sum, b) => sum + (b.pricing?.finalAmount || 0), 0) || 0,
        occupancyRate: 75
      });
    } catch (error) {
      console.error('Dashboard error:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (['active', 'approved', 'confirmed'].includes(s)) return 'success';
    if (s === 'pending') return 'warning';
    return 'error';
  };

  const statCards = [
    { title: 'Total Hostels', value: stats.totalHostels, icon: <Home sx={{ fontSize: 40 }} />, color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { title: 'Total Bookings', value: stats.totalBookings, icon: <People sx={{ fontSize: 40 }} />, color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { title: 'Monthly Revenue', value: formatCurrency(stats.monthlyRevenue), icon: <MonetizationOn sx={{ fontSize: 40 }} />, color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { title: 'Occupancy Rate', value: `${stats.occupancyRate}%`, icon: <TrendingUp sx={{ fontSize: 40 }} />, color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>Hostel Owner Dashboard</Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, {user?.name}! Manage your hostels and bookings.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, mt: { xs: 2, md: 0 } }}>
          <Button startIcon={<Refresh />} onClick={fetchDashboardData} variant="outlined">Refresh</Button>
          <Button startIcon={<Add />} variant="contained" onClick={() => navigate('/add-hostel')}>Add Hostel</Button>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ background: stat.color, color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>{stat.title}</Typography>
                    <Typography variant="h3" sx={{ fontWeight: 'bold' }}>{stat.value}</Typography>
                  </Box>
                  <Box sx={{ opacity: 0.3 }}>{stat.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="My Hostels" />
          <Tab label="Bookings" />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {hostels.map((hostel) => (
            <Grid item xs={12} md={6} lg={4} key={hostel._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={hostel.images?.[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'}
                  alt={hostel.name}
                />
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{hostel.name}</Typography>
                    <Chip label={hostel.status} size="small" color={getStatusColor(hostel.status)} />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {hostel.location?.city}, {hostel.location?.state}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating value={hostel.rating || 0} readOnly size="small" />
                    <Typography variant="body2" sx={{ ml: 1 }}>({hostel.reviewsCount || 0})</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" variant="outlined" startIcon={<Visibility />} fullWidth onClick={() => navigate(`/hostel/${hostel._id}`)}>
                      View
                    </Button>
                    <Button size="small" variant="contained" startIcon={<Edit />} fullWidth onClick={() => navigate(`/edit-hostel/${hostel._id}`)}>
                      Edit
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {hostels.length === 0 && (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Business sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>No hostels yet</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Start by adding your first hostel
                </Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/add-hostel')}>
                  Add Your First Hostel
                </Button>
              </Paper>
            </Grid>
          )}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Recent Bookings</Typography>
          {bookings.length === 0 ? (
            <Typography color="text.secondary">No bookings yet</Typography>
          ) : (
            bookings.map((booking) => (
              <Box key={booking._id} sx={{ py: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" fontWeight="bold">{booking.hostel?.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Student: {booking.student?.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" color="text.secondary">Amount</Typography>
                    <Typography variant="h6">{formatCurrency(booking.pricing?.finalAmount || 0)}</Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Chip label={booking.status} color={getStatusColor(booking.status)} />
                  </Grid>
                </Grid>
              </Box>
            ))
          )}
        </Paper>
      </TabPanel>
    </Container>
  );
};

export default OwnerDashboard;
