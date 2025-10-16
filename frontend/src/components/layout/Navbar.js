import React, { useMemo, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  useTheme,
  useMediaQuery,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  AddCircle as AddCircleIcon,
  DashboardCustomize as DashboardIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const MotionBox = motion(Box);

const baseLinks = [
  {
    label: 'Find Hostels',
    to: '/search',
    icon: <SearchIcon fontSize="small" />
  }
];

const roleBasedLinks = {
  student: [
    { label: 'My Bookings', to: '/student/bookings' }
  ],
  hostel_owner: [
    { label: 'My Hostels', to: '/owner/hostels' },
    { label: 'Add Hostel', to: '/owner/add-hostel', icon: <AddCircleIcon fontSize="small" /> }
  ],
  admin: [
    { label: 'Manage Hostels', to: '/admin/hostels' },
    { label: 'Manage Users', to: '/admin/users' }
  ]
};

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = useMemo(() => {
    if (!isAuthenticated || !user?.role) return baseLinks;
    return [...baseLinks, ...(roleBasedLinks[user.role] || [])];
  }, [isAuthenticated, user?.role]);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const renderProfileMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      PaperProps={{
        sx: {
          mt: 1,
          px: 1,
          py: 0.5,
          borderRadius: 3,
          minWidth: 180,
          bgcolor: theme.palette.background.paper,
        }
      }}
    >
      <MenuItem onClick={() => { navigate('/dashboard'); handleMenuClose(); }}>
        <DashboardIcon fontSize="small" sx={{ mr: 1 }} /> Dashboard
      </MenuItem>
      <MenuItem onClick={() => { navigate('/student/profile'); handleMenuClose(); }}>
        Profile
      </MenuItem>
      <Divider sx={{ my: 0.5, borderColor: 'rgba(148,163,184,0.2)' }} />
      <MenuItem onClick={handleLogout}>
        Logout
      </MenuItem>
    </Menu>
  );

  return (
    <AppBar position="fixed" color="transparent" elevation={0} sx={{ px: { xs: 2, md: 4 }, py: 2 }}>
      <Toolbar
        sx={{
          width: '100%',
          mx: 'auto',
          borderRadius: 999,
          px: { xs: 2, md: 3.5 },
          py: 1,
          backgroundColor: 'rgba(8, 15, 30, 0.75)',
          border: '1px solid rgba(148, 163, 184, 0.15)',
          backdropFilter: 'blur(18px)',
          gap: 2
        }}
      >
        <MotionBox
          component={Link}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none'
          }}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #7C3AED 0%, #22D3EE 100%)',
              display: 'grid',
              placeItems: 'center',
              mr: 1.5
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>H</Typography>
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1 }}>HABS</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', letterSpacing: '0.1em' }}>
              HOSTEL INTELLIGENCE
            </Typography>
          </Box>
        </MotionBox>

        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
            {navLinks.map((link) => (
              <Button
                key={link.to}
                component={Link}
                to={link.to}
                startIcon={link.icon}
                sx={{
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'text.primary',
                    backgroundColor: 'rgba(124, 58, 237, 0.14)'
                  }
                }}
              >
                {link.label}
              </Button>
            ))}
          </Box>
        )}

        {isMobile && (
          <Box sx={{ ml: 'auto' }}>
            <IconButton color="primary" onClick={() => setMobileMenuOpen((prev) => !prev)}>
              <MenuIcon />
            </IconButton>
          </Box>
        )}

        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {isAuthenticated ? (
              <>
                <IconButton color="primary" sx={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                  <Badge badgeContent={3} color="error" overlap="circular">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0 }}>
                  {user?.profileImage ? (
                    <Avatar src={user.profileImage} sx={{ width: 36, height: 36 }} />
                  ) : (
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        backgroundImage: 'linear-gradient(135deg, #22D3EE 0%, #7C3AED 100%)',
                        fontWeight: 600
                      }}
                    >
                      {user?.name?.[0]?.toUpperCase()}
                    </Avatar>
                  )}
                </IconButton>
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Button color="inherit" onClick={handleLogin}>
                  Login
                </Button>
                <Button variant="contained" color="primary" component={Link} to="/register">
                  Join the Platform
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Toolbar>

      {isMobile && mobileMenuOpen && (
        <MotionBox
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          sx={{
            backgroundColor: 'rgba(8, 15, 30, 0.92)',
            borderRadius: 3,
            border: '1px solid rgba(148, 163, 184, 0.2)',
            mx: 2,
            mt: 1,
            p: 2,
            display: 'grid',
            gap: 1
          }}
        >
          {navLinks.map((link) => (
            <Button
              key={link.to}
              component={Link}
              to={link.to}
              fullWidth
              onClick={() => setMobileMenuOpen(false)}
              sx={{ justifyContent: 'flex-start', color: 'text.primary' }}
              startIcon={link.icon}
            >
              {link.label}
            </Button>
          ))}

          <Divider sx={{ borderColor: 'rgba(148,163,184,0.2)', my: 1.5 }} />

          {isAuthenticated ? (
            <>
              <Button
                component={Link}
                to="/dashboard"
                fullWidth
                onClick={() => setMobileMenuOpen(false)}
                sx={{ justifyContent: 'flex-start', color: 'text.primary' }}
              >
                Dashboard
              </Button>
              <Button onClick={handleLogout} fullWidth sx={{ justifyContent: 'flex-start' }}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to="/login"
                fullWidth
                onClick={() => setMobileMenuOpen(false)}
                sx={{ justifyContent: 'flex-start' }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                fullWidth
                variant="contained"
                onClick={() => setMobileMenuOpen(false)}
                sx={{ justifyContent: 'center', mt: 0.5 }}
              >
                Create Account
              </Button>
            </>
          )}
        </MotionBox>
      )}

      {renderProfileMenu}
    </AppBar>
  );
};

export default Navbar;