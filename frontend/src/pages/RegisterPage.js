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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Visibility,
  VisibilityOff,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const sanitizeString = (value) => (typeof value === 'string' ? value.trim() : '');

const parseYearToNumber = (label) => {
  if (typeof label !== 'string') return null;
  const match = label.match(/\d+/);
  if (match) {
    return parseInt(match[0], 10);
  }
  switch (label) {
    case 'Final Year':
      return 4;
    case 'Post Graduate':
      return 5;
    default:
      return null;
  }
};

const RegisterPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    // Student-specific fields
    university: '',
    course: '',
    year: '',
    // Hostel Owner-specific fields
    businessName: '',
    businessAddress: '',
    businessPhone: '',
    licenseNumber: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const steps = ['Basic Info', 'Account Details', 'Role Specific'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const validateStep = (step) => {
    switch (step) {
      case 0: // Basic Info
        if (!formData.name || !formData.email || !formData.phone) {
          setError('Please fill in all required fields');
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          setError('Please enter a valid email address');
          return false;
        }
        if (!/^[6-9]\d{9}$/.test(formData.phone)) {
          setError('Please enter a valid 10-digit Indian phone number');
          return false;
        }
        break;
      case 1: // Account Details
        if (!formData.password || !formData.confirmPassword) {
          setError('Please fill in all password fields');
          return false;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters long');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        break;
      case 2: // Role Specific
        if (formData.role === 'student') {
          if (!formData.university || !formData.course || !formData.year) {
            setError('Please fill in all student details');
            return false;
          }
        } else if (formData.role === 'hostel_owner') {
          if (!formData.businessName || !formData.businessAddress || !formData.businessPhone) {
            setError('Please fill in all business details');
            return false;
          }
          if (!/^\d{10}$/.test(formData.businessPhone)) {
            setError('Business phone must be a valid 10-digit number');
            return false;
          }
        }
        break;
      default:
        break;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(activeStep)) return;

    setLoading(true);
    setError('');

    try {
      const payload = {
        name: sanitizeString(formData.name),
        email: sanitizeString(formData.email).toLowerCase(),
        phone: sanitizeString(formData.phone),
        password: formData.password,
        role: formData.role
      };

      if (formData.role === 'student') {
        payload.studentProfile = {
          institutionName: sanitizeString(formData.university),
          course: sanitizeString(formData.course),
          yearLabel: formData.year,
          year: parseYearToNumber(formData.year)
        };
      } else {
        payload.ownerProfile = {
          businessName: sanitizeString(formData.businessName),
          businessPhone: sanitizeString(formData.businessPhone),
          businessRegistration: sanitizeString(formData.licenseNumber) || undefined,
          address: {
            street: sanitizeString(formData.businessAddress)
          }
        };
      }

      await register(payload);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
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
              id="phone"
              label="Phone Number"
              name="phone"
              autoComplete="tel"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
          </Box>
        );
      case 1:
        return (
          <Box>
            <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
              <InputLabel id="role-label">I am a</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={formData.role}
                label="I am a"
                onChange={handleChange}
                disabled={loading}
              >
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="hostel_owner">Hostel Owner</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
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
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={formData.confirmPassword}
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
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
          </Box>
        );
      case 2:
        return (
          <Box>
            {formData.role === 'student' ? (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="university"
                  label="University/College"
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  disabled={loading}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="course"
                  label="Course/Program"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  disabled={loading}
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
                  <InputLabel id="year-label">Year of Study</InputLabel>
                  <Select
                    labelId="year-label"
                    id="year"
                    name="year"
                    value={formData.year}
                    label="Year of Study"
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <MenuItem value="1st Year">1st Year</MenuItem>
                    <MenuItem value="2nd Year">2nd Year</MenuItem>
                    <MenuItem value="3rd Year">3rd Year</MenuItem>
                    <MenuItem value="4th Year">4th Year</MenuItem>
                    <MenuItem value="Final Year">Final Year</MenuItem>
                    <MenuItem value="Post Graduate">Post Graduate</MenuItem>
                  </Select>
                </FormControl>
              </>
            ) : (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="businessName"
                  label="Business Name"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  disabled={loading}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="businessAddress"
                  label="Business Address"
                  name="businessAddress"
                  multiline
                  rows={3}
                  value={formData.businessAddress}
                  onChange={handleChange}
                  disabled={loading}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="businessPhone"
                  label="Business Phone"
                  name="businessPhone"
                  value={formData.businessPhone}
                  onChange={handleChange}
                  disabled={loading}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="licenseNumber"
                  label="Business License Number (Optional)"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  disabled={loading}
                  sx={{ mb: 2 }}
                />
              </>
            )}
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container component="main" maxWidth="md">
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
            <PersonAddIcon
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
              Create Account
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Join HABS and find your perfect hostel
            </Typography>
          </Box>

          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Form Content */}
          <Box component="form" onSubmit={handleSubmit}>
            {renderStepContent(activeStep)}

            {/* Navigation Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0 || loading}
                onClick={handleBack}
                sx={{ borderRadius: 2 }}
              >
                Back
              </Button>
              <Box>
                {activeStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      px: 4,
                      fontSize: '1.1rem',
                      borderRadius: 2
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      px: 4,
                      fontSize: '1.1rem',
                      borderRadius: 2
                    }}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </Box>

          {/* Login Link */}
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link
                to="/login"
                style={{
                  color: 'inherit',
                  textDecoration: 'none'
                }}
              >
                <Typography
                  component="span"
                  color="primary"
                  sx={{
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Sign In
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Paper>

        {/* Additional Info */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            By creating an account, you agree to our{' '}
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

export default RegisterPage;