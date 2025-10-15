import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Link, 
  IconButton,
  Divider
} from '@mui/material';
import { 
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.dark',
        color: 'white',
        py: 4,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* About Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              HABS
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.6 }}>
              AI-powered Hostel Allotment and Booking System helping students find 
              the perfect accommodation near their universities across India.
            </Typography>
            <Box>
              <IconButton color="inherit" size="small">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" size="small">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" size="small">
                <InstagramIcon />
              </IconButton>
              <IconButton color="inherit" size="small">
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link 
                href="/" 
                color="inherit" 
                sx={{ mb: 1, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Home
              </Link>
              <Link 
                href="/search" 
                color="inherit" 
                sx={{ mb: 1, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Find Hostels
              </Link>
              <Link 
                href="/register" 
                color="inherit" 
                sx={{ mb: 1, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Register
              </Link>
              <Link 
                href="/login" 
                color="inherit" 
                sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Login
              </Link>
            </Box>
          </Grid>

          {/* For Students */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              For Students
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link 
                href="#" 
                color="inherit" 
                sx={{ mb: 1, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                How It Works
              </Link>
              <Link 
                href="#" 
                color="inherit" 
                sx={{ mb: 1, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Safety Guidelines
              </Link>
              <Link 
                href="#" 
                color="inherit" 
                sx={{ mb: 1, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                FAQs
              </Link>
              <Link 
                href="#" 
                color="inherit" 
                sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Support
              </Link>
            </Box>
          </Grid>

          {/* For Owners */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              For Owners
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link 
                href="#" 
                color="inherit" 
                sx={{ mb: 1, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                List Your Hostel
              </Link>
              <Link 
                href="#" 
                color="inherit" 
                sx={{ mb: 1, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Owner Guidelines
              </Link>
              <Link 
                href="#" 
                color="inherit" 
                sx={{ mb: 1, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Pricing
              </Link>
              <Link 
                href="#" 
                color="inherit" 
                sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Resources
              </Link>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <EmailIcon sx={{ fontSize: 18, mr: 1 }} />
                <Typography variant="body2">
                  support@habs.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PhoneIcon sx={{ fontSize: 18, mr: 1 }} />
                <Typography variant="body2">
                  +91 98765 43210
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <LocationIcon sx={{ fontSize: 18, mr: 1, mt: 0.2 }} />
                <Typography variant="body2">
                  India
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3, bgcolor: 'rgba(255,255,255,0.2)' }} />

        {/* Bottom Section */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mb: { xs: 2, md: 0 } }}>
            © {currentYear} HABS - Hostel Allotment and Booking System. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link 
              href="#" 
              color="inherit" 
              variant="body2"
              sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              Privacy Policy
            </Link>
            <Link 
              href="#" 
              color="inherit" 
              variant="body2"
              sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              Terms of Service
            </Link>
            <Link 
              href="#" 
              color="inherit" 
              variant="body2"
              sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              Cookie Policy
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;