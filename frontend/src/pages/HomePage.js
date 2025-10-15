import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  CardMedia,
  Chip,
  Rating,
  TextField,
  InputAdornment,
  IconButton,
  Paper
} from '@mui/material';
import { 
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  TrendingUp as TrendingIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  School as SchoolIcon,
  Home as HomeIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const HomePage = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: <SearchIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Smart Search',
      description: 'AI-powered recommendations to find hostels that match your preferences and budget.'
    },
    {
      icon: <LocationIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Location Intelligence',
      description: 'Find hostels near your university with accurate distance and travel time calculations.'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Secure Booking',
      description: 'Blockchain-powered transparency and secure payment processing for peace of mind.'
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Instant Updates',
      description: 'Real-time notifications about booking status, availability, and important updates.'
    }
  ];

  const featuredHostels = [
    {
      id: 1,
      name: 'Green Valley Hostel',
      image: '/api/placeholder/300/200',
      rating: 4.5,
      price: 8000,
      location: 'Near Delhi University',
      amenities: ['WiFi', 'Mess', 'Laundry', 'Security'],
      distance: '0.5 km'
    },
    {
      id: 2,
      name: 'City Center PG',
      image: '/api/placeholder/300/200',
      rating: 4.2,
      price: 12000,
      location: 'Near Mumbai University',
      amenities: ['AC', 'WiFi', 'Gym', 'Parking'],
      distance: '1.2 km'
    },
    {
      id: 3,
      name: 'Student Haven',
      image: '/api/placeholder/300/200',
      rating: 4.7,
      price: 9500,
      location: 'Near Bangalore University',
      amenities: ['WiFi', 'Mess', 'Study Room', 'Recreation'],
      distance: '0.8 km'
    }
  ];

  const stats = [
    { icon: <SchoolIcon />, number: '500+', label: 'Universities Covered' },
    { icon: <HomeIcon />, number: '10,000+', label: 'Hostels Listed' },
    { icon: <PersonIcon />, number: '50,000+', label: 'Happy Students' },
    { icon: <StarIcon />, number: '4.8', label: 'Average Rating' }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              mb: 3
            }}
          >
            Find Your Perfect Hostel
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              opacity: 0.9,
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            AI-powered hostel discovery platform connecting students with quality accommodation near their universities
          </Typography>

          {/* Search Bar */}
          <Paper
            elevation={4}
            sx={{
              p: 2,
              maxWidth: 600,
              mx: 'auto',
              mb: 4,
              borderRadius: 3
            }}
          >
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                placeholder="Search by university, city, or area..."
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  sx: { '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }
                }}
              />
              <Button
                variant="contained"
                size="large"
                sx={{
                  minWidth: 120,
                  borderRadius: 2
                }}
              >
                Search
              </Button>
            </Box>
          </Paper>

          {user ? (
            <Button
              variant="contained"
              size="large"
              color="secondary"
              sx={{
                py: 1.5,
                px: 4,
                fontSize: '1.1rem',
                borderRadius: 3
              }}
            >
              View Dashboard
            </Button>
          ) : (
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                color="secondary"
                sx={{
                  py: 1.5,
                  px: 4,
                  fontSize: '1.1rem',
                  borderRadius: 3
                }}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  py: 1.5,
                  px: 4,
                  fontSize: '1.1rem',
                  borderRadius: 3,
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Learn More
              </Button>
            </Box>
          )}
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 6, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box sx={{ color: 'primary.main', mb: 1 }}>
                    {React.cloneElement(stat.icon, { sx: { fontSize: 40 } })}
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {stat.number}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 6 }}
          >
            Why Choose HABS?
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} lg={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    p: 3,
                    border: '1px solid',
                    borderColor: 'grey.200',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                      borderColor: 'primary.main'
                    }
                  }}
                >
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Featured Hostels Section */}
      <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{ fontWeight: 'bold' }}
            >
              Featured Hostels
            </Typography>
            <Button
              variant="outlined"
              endIcon={<TrendingIcon />}
            >
              View All
            </Button>
          </Box>
          <Grid container spacing={4}>
            {featuredHostels.map((hostel) => (
              <Grid item xs={12} md={4} key={hostel.id}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={hostel.image}
                    alt={hostel.name}
                    sx={{ bgcolor: 'grey.300' }}
                  />
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                        {hostel.name}
                      </Typography>
                      <Chip
                        label={`₹${hostel.price}/month`}
                        color="primary"
                        size="small"
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={hostel.rating} precision={0.1} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {hostel.rating}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {hostel.location} • {hostel.distance}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                      {hostel.amenities.map((amenity, index) => (
                        <Chip
                          key={index}
                          label={amenity}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ borderRadius: 2 }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 8,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 3 }}
          >
            Ready to Find Your Perfect Hostel?
          </Typography>
          <Typography
            variant="h6"
            sx={{ mb: 4, opacity: 0.9 }}
          >
            Join thousands of students who have found their ideal accommodation through HABS
          </Typography>
          {!user && (
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                color="secondary"
                sx={{
                  py: 1.5,
                  px: 4,
                  fontSize: '1.1rem',
                  borderRadius: 3
                }}
              >
                Register Now
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  py: 1.5,
                  px: 4,
                  fontSize: '1.1rem',
                  borderRadius: 3,
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                List Your Hostel
              </Button>
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;