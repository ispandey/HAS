import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Divider,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Person as PersonIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login({ email: formData.email, password: formData.password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    setLoading(true);
    setError('');

    let demoCredentials;
    switch (role) {
      case 'admin':
        demoCredentials = {
          email: 'iamsatyampandey@gmail.com',
          password: 'admin@12345'
        };
        break;
      case 'student':
        demoCredentials = {
          email: 'student@demo.com',
          password: 'demo123'
        };
        break;
      case 'owner':
        demoCredentials = {
          email: 'owner@demo.com',
          password: 'demo123'
        };
        break;
      default:
        return;
    }

    try {
  await login({ email: demoCredentials.email, password: demoCredentials.password });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Demo login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 4
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'grey.200'
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <PersonIcon
              sx={{
                fontSize: 60,
                color: 'primary.main',
                mb: 2
              }}
            />
            <Typography
              component="h1"
              variant="h4"
              sx={{ fontWeight: 'bold', mb: 1 }}
            >
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to your HABS account
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                fontSize: '1.1rem',
                borderRadius: 2,
                mb: 3
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Sign In'
              )}
            </Button>

            {/* Demo Login Section */}
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Try Demo Accounts
              </Typography>
            </Divider>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleDemoLogin('admin')}
                disabled={loading}
                sx={{ borderRadius: 2 }}
              >
                Demo Admin Login
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleDemoLogin('student')}
                disabled={loading}
                sx={{ borderRadius: 2 }}
              >
                Demo Student Login
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleDemoLogin('owner')}
                disabled={loading}
                sx={{ borderRadius: 2 }}
              >
                Demo Owner Login
              </Button>
            </Box>

            {/* Links */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link
                to="/forgot-password"
                style={{
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Forgot password?
                </Typography>
              </Link>
              <Link
                to="/register"
                style={{
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Don't have an account? Sign Up
                </Typography>
              </Link>
            </Box>
          </Box>
        </Paper>

        {/* Additional Info */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            By signing in, you agree to our{' '}
            <Link to="/terms" style={{ color: 'inherit' }}>
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" style={{ color: 'inherit' }}>
              Privacy Policy
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;