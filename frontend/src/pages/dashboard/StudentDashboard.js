import React, { useState, useEffect } from 'react';
import {
  Box, Container, Grid, Paper, Typography, Card, CardContent, CardMedia,
  Button, Chip, Rating, CircularProgress, Tab, Tabs, TextField, MenuItem,
  IconButton, Tooltip
} from '@mui/material';
import {
  Search, FilterList, Favorite, FavoriteBorder, Visibility,
  LocationOn, AttachMoney, CheckCircle, Pending, Settings
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import hostelService from '../../services/hostelService';
import bookingService from '../../services/bookingService';
import userService from '../../services/userService';
import { toast } from 'react-toastify';

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [hostels, setHostels] = useState([]);
  const [savedHostels, setSavedHostels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ location: '', priceRange: '', type: '' });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [hostelsRes, savedRes, bookingsRes] = await Promise.all([
        hostelService.getAllHostels(),
        userService.getSavedHostels(),
        bookingService.getMyBookings()
      ]);
      
      setHostels(hostelsRes.hostels || []);
      setSavedHostels(savedRes.hostels || []);
      setBookings(bookingsRes.bookings || []);
    } catch (error) {
      console.error('Dashboard error:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveHostel = async (hostelId) => {
    try {
      await userService.saveHostel(hostelId);
      toast.success('Hostel saved successfully');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to save hostel');
    }
  };

  const handleUnsaveHostel = async (hostelId) => {
    try {
      await userService.unsaveHostel(hostelId);
      toast.success('Hostel removed from saved list');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to unsave hostel');
    }
  };

  const isHostelSaved = (hostelId) => {
    return savedHostels.some(h => h._id === hostelId);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (['confirmed', 'completed'].includes(s)) return 'success';
    if (s === 'pending') return 'warning';
    return 'error';
  };

  const filteredHostels = hostels.filter(hostel => {
    const matchesSearch = hostel.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hostel.location?.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !filters.location || hostel.location?.city === filters.location;
    return matchesSearch && matchesLocation;
  });

  const statCards = [
    { title: 'Available Hostels', value: hostels.length, icon: <LocationOn sx={{ fontSize: 40 }} />, color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { title: 'Saved Hostels', value: savedHostels.length, icon: <Favorite sx={{ fontSize: 40 }} />, color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { title: 'My Bookings', value: bookings.length, icon: <CheckCircle sx={{ fontSize: 40 }} />, color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { title: 'Pending Bookings', value: bookings.filter(b => b.status === 'pending').length, icon: <Pending sx={{ fontSize: 40 }} />, color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }
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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>Student Dashboard</Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back, {user?.name}! Find your perfect hostel.
        </Typography>
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
          <Tab label="Browse Hostels" />
          <Tab label="My Bookings" />
          <Tab label="Saved Hostels" />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search by hostel name or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} /> }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                label="Location"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              >
                <MenuItem value="">All Locations</MenuItem>
                {[...new Set(hostels.map(h => h.location?.city))].filter(Boolean).map(city => (
                  <MenuItem key={city} value={city}>{city}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button fullWidth variant="outlined" startIcon={<FilterList />} sx={{ height: '56px' }}>
                More Filters
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={3}>
          {filteredHostels.map((hostel) => (
            <Grid item xs={12} md={6} lg={4} key={hostel._id}>
              <Card>
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={hostel.images?.[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'}
                    alt={hostel.name}
                  />
                  <IconButton
                    sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'white' }}
                    onClick={() => isHostelSaved(hostel._id) ? handleUnsaveHostel(hostel._id) : handleSaveHostel(hostel._id)}
                  >
                    {isHostelSaved(hostel._id) ? <Favorite color="error" /> : <FavoriteBorder />}
                  </IconButton>
                </Box>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>{hostel.name}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {hostel.location?.city}, {hostel.location?.state}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating value={hostel.rating || 0} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 1 }}>({hostel.reviewsCount || 0})</Typography>
                    </Box>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      {formatCurrency(hostel.pricing?.perMonth || 0)}/mo
                    </Typography>
                  </Box>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Visibility />}
                    onClick={() => navigate(`/hostel/${hostel._id}`)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>My Bookings</Typography>
          {bookings.length === 0 ? (
            <Typography color="text.secondary">No bookings yet</Typography>
          ) : (
            bookings.map((booking) => (
              <Box key={booking._id} sx={{ py: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" fontWeight="bold">{booking.hostel?.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {booking.roomType} • {booking.duration} months
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" color="text.secondary">Total Amount</Typography>
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

      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          {savedHostels.map((hostel) => (
            <Grid item xs={12} md={6} lg={4} key={hostel._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={hostel.images?.[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80'}
                  alt={hostel.name}
                />
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>{hostel.name}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {hostel.location?.city}, {hostel.location?.state}
                    </Typography>
                  </Box>
                  <Typography variant="h6" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                    {formatCurrency(hostel.pricing?.perMonth || 0)}/mo
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<Visibility />}
                      fullWidth
                      onClick={() => navigate(`/hostel/${hostel._id}`)}
                    >
                      View
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      fullWidth
                      onClick={() => handleUnsaveHostel(hostel._id)}
                    >
                      Remove
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {savedHostels.length === 0 && (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Favorite sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>No saved hostels yet</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Browse hostels and save your favorites
                </Typography>
                <Button variant="contained" onClick={() => setTabValue(0)}>
                  Browse Hostels
                </Button>
              </Paper>
            </Grid>
          )}
        </Grid>
      </TabPanel>
    </Container>
  );
};

export default StudentDashboard;
