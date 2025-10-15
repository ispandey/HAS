import React, { useState } from 'react';
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
  useMediaQuery
} from '@mui/material';
import { 
  Home as HomeIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => { navigate('/dashboard'); handleMenuClose(); }}>
        Dashboard
      </MenuItem>
      <MenuItem onClick={() => { navigate('/student/profile'); handleMenuClose(); }}>
        Profile
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        Logout
      </MenuItem>
    </Menu>
  );

  return (
    <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
      <Toolbar>
        {/* Logo and Brand */}
        <Box 
          component={Link} 
          to="/" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            textDecoration: 'none', 
            color: 'inherit',
            mr: 4
          }}
        >
          <HomeIcon sx={{ mr: 1 }} />
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '1.1rem', md: '1.25rem' }
            }}
          >
            HABS
          </Typography>
        </Box>

        {/* Navigation Links - Desktop */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Button 
              color="inherit" 
              component={Link} 
              to="/search"
              startIcon={<SearchIcon />}
            >
              Find Hostels
            </Button>
            
            {isAuthenticated && user?.role === 'student' && (
              <>
                <Button color="inherit" component={Link} to="/student/bookings">
                  My Bookings
                </Button>
              </>
            )}

            {isAuthenticated && user?.role === 'hostel_owner' && (
              <>
                <Button color="inherit" component={Link} to="/owner/hostels">
                  My Hostels
                </Button>
                <Button color="inherit" component={Link} to="/owner/add-hostel">
                  Add Hostel
                </Button>
              </>
            )}

            {isAuthenticated && user?.role === 'admin' && (
              <>
                <Button color="inherit" component={Link} to="/admin/hostels">
                  Manage Hostels
                </Button>
                <Button color="inherit" component={Link} to="/admin/users">
                  Manage Users
                </Button>
              </>
            )}
          </Box>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton
              color="inherit"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        )}

        {/* User Actions - Desktop */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <IconButton color="inherit">
                  <Badge badgeContent={3} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>

                {/* Profile Menu */}
                <IconButton
                  edge="end"
                  color="inherit"
                  onClick={handleProfileMenuOpen}
                >
                  {user?.profileImage ? (
                    <Avatar 
                      src={user.profileImage} 
                      sx={{ width: 32, height: 32 }}
                    />
                  ) : (
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                      {user?.name?.[0]?.toUpperCase()}
                    </Avatar>
                  )}
                </IconButton>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={handleLogin}>
                  Login
                </Button>
                <Button 
                  variant="outlined" 
                  color="inherit" 
                  component={Link} 
                  to="/register"
                  sx={{ ml: 1 }}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        )}
      </Toolbar>

      {/* Mobile Menu */}
      {isMobile && mobileMenuOpen && (
        <Box sx={{ bgcolor: 'primary.dark', p: 2 }}>
          <Button 
            color="inherit" 
            component={Link} 
            to="/search"
            fullWidth
            sx={{ justifyContent: 'flex-start', mb: 1 }}
            onClick={() => setMobileMenuOpen(false)}
          >
            Find Hostels
          </Button>
          
          {isAuthenticated ? (
            <>
              <Button 
                color="inherit" 
                component={Link} 
                to="/dashboard"
                fullWidth
                sx={{ justifyContent: 'flex-start', mb: 1 }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Button>
              <Button 
                color="inherit" 
                onClick={handleLogout}
                fullWidth
                sx={{ justifyContent: 'flex-start' }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button 
                color="inherit" 
                component={Link} 
                to="/login"
                fullWidth
                sx={{ justifyContent: 'flex-start', mb: 1 }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/register"
                fullWidth
                sx={{ justifyContent: 'flex-start' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      )}

      {renderProfileMenu}
    </AppBar>
  );
};

export default Navbar;