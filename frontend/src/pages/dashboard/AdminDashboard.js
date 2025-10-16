import React, { useState, useEffect } from 'react';
import {
  Box, Container, Grid, Paper, Typography, Card, CardContent, Button, Chip,
  Avatar, List, ListItem, ListItemText, ListItemAvatar, Divider, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Tab, Tabs,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, CircularProgress
} from '@mui/material';
import {
  TrendingUp, People, Business, Assessment, Add, Edit, Delete,
  Visibility, Check, Close, Refresh, Download
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState({
    users: { total: 0, students: 0, hostelOwners: 0 },
    hostels: { total: 0, approved: 0, pending: 0 },
    bookings: { total: 0, active: 0 },
    revenue: 0,
    recentActivities: { bookings: [], hostels: [] }
  });
  
  const [users, setUsers] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [pendingHostels, setPendingHostels] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (tabValue === 1) fetchUsers();
    else if (tabValue === 2) fetchHostels();
    else if (tabValue === 3) fetchBookings();
    else if (tabValue === 4) fetchPendingHostels();
  }, [tabValue, page, rowsPerPage]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAdminDashboard();
      setStats(response.stats);
    } catch (error) {
      console.error('Dashboard error:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await adminService.getAllUsers({ page: page + 1, limit: rowsPerPage });
      setUsers(response.users || []);
    } catch (error) {
      toast.error('Failed to load users');
    }
  };

  const fetchHostels = async () => {
    try {
      const response = await adminService.getAllHostels({ page: page + 1, limit: rowsPerPage });
      setHostels(response.hostels || []);
    } catch (error) {
      toast.error('Failed to load hostels');
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await adminService.getAllBookings({ page: page + 1, limit: rowsPerPage });
      setBookings(response.bookings || []);
    } catch (error) {
      toast.error('Failed to load bookings');
    }
  };

  const fetchPendingHostels = async () => {
    try {
      const response = await adminService.getPendingHostels({ page: page + 1, limit: rowsPerPage });
      setPendingHostels(response.hostels || []);
    } catch (error) {
      toast.error('Failed to load pending hostels');
    }
  };

  const handleApproveHostel = async (hostelId) => {
    try {
      await adminService.approveHostel(hostelId);
      toast.success('Hostel approved');
      fetchPendingHostels();
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to approve hostel');
    }
  };

  const handleRejectHostel = async () => {
    if (!selectedItem || !rejectReason.trim()) {
      toast.error('Please provide a reason');
      return;
    }
    try {
      await adminService.rejectHostel(selectedItem._id, rejectReason);
      toast.success('Hostel rejected');
      setDialogOpen(false);
      setRejectReason('');
      fetchPendingHostels();
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to reject hostel');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const s = status?.toLowerCase();
    if (['active', 'approved', 'confirmed'].includes(s)) return 'success';
    if (s === 'pending') return 'warning';
    if (['rejected', 'cancelled'].includes(s)) return 'error';
    return 'default';
  };

  const statCards = [
    { title: 'Total Users', value: stats.users.total, icon: <People sx={{ fontSize: 40 }} />, color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { title: 'Total Hostels', value: stats.hostels.total, icon: <Business sx={{ fontSize: 40 }} />, color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { title: 'Total Bookings', value: stats.bookings.total, icon: <Assessment sx={{ fontSize: 40 }} />, color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { title: 'Revenue', value: formatCurrency(stats.revenue), icon: <TrendingUp sx={{ fontSize: 40 }} />, color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }
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
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>Admin Dashboard</Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, {user?.name}! Here's what's happening with HABS today.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, mt: { xs: 2, md: 0 } }}>
          <Button startIcon={<Refresh />} onClick={fetchDashboardData} variant="outlined">Refresh</Button>
          <Button startIcon={<Download />} variant="contained">Export</Button>
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
        <Tabs value={tabValue} onChange={(e, v) => { setTabValue(v); setPage(0); }} variant="scrollable" scrollButtons="auto">
          <Tab label="Overview" />
          <Tab label="Users" />
          <Tab label="Hostels" />
          <Tab label="Bookings" />
          <Tab label="Pending Approvals" />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '400px', overflow: 'auto' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Recent Activity</Typography>
              <List>
                {stats.recentActivities.bookings.slice(0, 5).map((booking, i) => (
                  <React.Fragment key={booking._id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar>{booking.student?.name?.charAt(0) || 'U'}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={booking.student?.name || 'N/A'}
                        secondary={new Date(booking.createdAt).toLocaleDateString()}
                      />
                      <Chip label={booking.status} size="small" color={getStatusColor(booking.status)} />
                    </ListItem>
                    {i < 4 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '400px', overflow: 'auto' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Pending Hostels</Typography>
              <List>
                {stats.recentActivities.hostels.map((hostel, i) => (
                  <React.Fragment key={hostel._id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={hostel.name}
                        secondary={`${hostel.owner?.name} - ${hostel.location?.city}`}
                      />
                      <Chip label="Pending" size="small" color="warning" />
                    </ListItem>
                    {i < stats.recentActivities.hostels.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Paper>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">All Users</Typography>
            <Button startIcon={<Add />} variant="contained">Add User</Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u._id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, width: 32, height: 32 }}>{u.name?.charAt(0)}</Avatar>
                        {u.name}
                      </Box>
                    </TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell><Chip label={u.role} size="small" /></TableCell>
                    <TableCell>
                      <Chip label={u.isVerified ? 'Verified' : 'Pending'} size="small" color={u.isVerified ? 'success' : 'warning'} />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small"><Visibility fontSize="small" /></IconButton>
                      <IconButton size="small"><Edit fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={users.length}
            page={page}
            onPageChange={(e, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          />
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={4}>
        <Paper>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">Pending Hostel Approvals</Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Owner</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Submitted</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingHostels.map((h) => (
                  <TableRow key={h._id}>
                    <TableCell>{h.name}</TableCell>
                    <TableCell>{h.owner?.name || 'N/A'}</TableCell>
                    <TableCell>{h.location?.city}</TableCell>
                    <TableCell>{new Date(h.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell align="right">
                      <Button size="small" startIcon={<Check />} color="success" onClick={() => handleApproveHostel(h._id)} sx={{ mr: 1 }}>
                        Approve
                      </Button>
                      <Button size="small" startIcon={<Close />} color="error" onClick={() => { setSelectedItem(h); setDialogOpen(true); }}>
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </TabPanel>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Reject Hostel</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Reason for Rejection"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleRejectHostel} color="error" variant="contained">Reject</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;
