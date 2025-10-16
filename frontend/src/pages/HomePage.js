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
  Paper,
  Stack,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Shield as ShieldIcon,
  Bolt as BoltIcon,
  AutoAwesome as AutoAwesomeIcon,
  School as SchoolIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Star as StarIcon,
  TrendingUp as TrendingIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);
const MotionCard = motion(Card);

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
};

const HomePage = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      icon: <AutoAwesomeIcon fontSize="large" />,
      title: 'AI Matching Engine',
      description:
        'Personalized hostel discovery that blends preferences, safety scores, and peer insights.'
    },
    {
      icon: <LocationIcon fontSize="large" />,
      title: 'Location Intelligence',
      description: 'Hyperlocal search with MapMyIndia layers, commute times, and campus walkability scores.'
    },
    {
      icon: <ShieldIcon fontSize="large" />,
      title: 'Verified Transparency',
      description: 'End-to-end blockchain verification keeps every booking auditable and tamper-proof.'
    },
    {
      icon: <BoltIcon fontSize="large" />,
      title: 'Real-time Availability',
      description: 'Always-fresh inventory with instant alerts on allotments, waitlists, and payments.'
    }
  ];

  const featuredHostels = [
    {
      id: 1,
      name: 'Green Valley Hostel',
      image: 'https://images.unsplash.com/photo-1600585154340-0ef3c08dcdb6?auto=format&fit=crop&w=1200&q=80',
      rating: 4.6,
      price: 8200,
      location: 'Near Delhi University',
      amenities: ['WiFi 6', 'Nutri Mess', 'Laundry', '24/7 Security'],
      distance: '0.5 km'
    },
    {
      id: 2,
      name: 'City Center PG',
      image: 'https://images.unsplash.com/photo-1586105251261-72a756497a12?auto=format&fit=crop&w=1200&q=80',
      rating: 4.3,
      price: 11900,
      location: 'Near Mumbai University',
      amenities: ['AC Rooms', 'Co-work Pods', 'Gym', 'Parking'],
      distance: '1.2 km'
    },
    {
      id: 3,
      name: 'Student Haven',
      image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
      rating: 4.8,
      price: 9600,
      location: 'Near Bangalore University',
      amenities: ['WiFi', 'Mess', 'Study Lounge', 'Recreation'],
      distance: '0.8 km'
    }
  ];

  const stats = [
    { icon: <SchoolIcon />, number: '500+', label: 'Institutions onboarded' },
    { icon: <HomeIcon />, number: '12k+', label: 'Hostels verified' },
    { icon: <PersonIcon />, number: '68k', label: 'Allocations completed' },
    { icon: <StarIcon />, number: '4.8', label: 'Experience rating' }
  ];

  return (
    <Box>
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          pt: { xs: 12, md: 16 },
          pb: { xs: 12, md: 18 },
          color: 'common.white'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 10% 20%, rgba(124, 58, 237, 0.45), transparent 58%),' +
              'radial-gradient(circle at 80% 0%, rgba(34, 211, 238, 0.4), transparent 52%),' +
              'linear-gradient(140deg, rgba(8, 12, 24, 0.9) 0%, rgba(8, 18, 38, 0.92) 100%)'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.08), transparent 60%)',
            mixBlendMode: 'screen'
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={7}>
              <MotionBox {...fadeInUp}>
                <Chip
                  label="AI | Blockchain | Geo Intelligence"
                  sx={{
                    mb: 3,
                    color: 'primary.contrastText',
                    backgroundColor: 'rgba(59, 130, 246, 0.22)',
                    borderRadius: 2,
                    px: 2,
                    py: 0.5,
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(125, 211, 252, 0.35)'
                  }}
                />
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.05,
                    mb: 3,
                    fontSize: { xs: '2.6rem', md: '3.75rem' }
                  }}
                >
                  Intelligent hostel allotment built for the next decade of campus living.
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'rgba(226, 232, 240, 0.82)',
                    maxWidth: 560,
                    mb: 5,
                    fontWeight: 400
                  }}
                >
                  Discover curated stays, orchestrate bulk allotments, and deliver unmatched safety with a platform that blends predictive analytics, secured ledgers, and immersive UX.
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => navigate(user ? '/dashboard' : '/register')}
                    sx={{
                      px: 4,
                      py: 1.6,
                      fontSize: '1rem',
                      boxShadow: '0 18px 45px rgba(99, 102, 241, 0.35)'
                    }}
                  >
                    {user ? 'Go to dashboard' : 'Launch onboarding'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="large"
                    onClick={() => navigate('/search')}
                    sx={{
                      px: 4,
                      py: 1.6,
                      borderColor: 'rgba(226,232,240,0.4)',
                      color: 'rgba(226, 232, 240, 0.9)',
                      '&:hover': {
                        borderColor: 'rgba(226,232,240,0.7)',
                        backgroundColor: 'rgba(148, 163, 184, 0.12)'
                      }
                    }}
                  >
                    Browse hostels
                  </Button>
                </Stack>
              </MotionBox>

              <MotionPaper
                {...fadeInUp}
                transition={{ ...fadeInUp.transition, delay: 0.1 }}
                sx={{
                  p: { xs: 2, md: 2.5 },
                  borderRadius: 4,
                  maxWidth: 620,
                  backgroundColor: 'rgba(15, 23, 42, 0.78)',
                  border: '1px solid rgba(148, 163, 184, 0.25)',
                  boxShadow: '0 25px 60px rgba(14, 23, 42, 0.55)'
                }}
              >
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2.5} alignItems="center">
                  <TextField
                    fullWidth
                    placeholder={'Try "North Campus Delhi" or "Girls hostel Bangalore"'}
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="primary" />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(15, 23, 42, 0.65)',
                        borderRadius: 2,
                        color: 'inherit',
                        border: '1px solid rgba(148, 163, 184, 0.2)'
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.7,
                      borderRadius: 2
                    }}
                    onClick={() => navigate('/search')}
                  >
                    Search now
                  </Button>
                </Stack>
              </MotionPaper>
            </Grid>

            <Grid item xs={12} md={5}>
              <MotionBox
                {...fadeInUp}
                transition={{ ...fadeInUp.transition, delay: 0.15 }}
                sx={{ position: 'relative' }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    inset: '-10% -5% -15% -5%',
                    background: 'radial-gradient(circle at 20% 20%, rgba(34, 211, 238, 0.45), transparent 55%)',
                    filter: 'blur(80px)',
                    zIndex: 0
                  }}
                />
                <MotionPaper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 5,
                    border: '1px solid rgba(148, 163, 184, 0.18)',
                    backgroundColor: 'rgba(15, 23, 42, 0.8)',
                    backdropFilter: 'blur(18px)',
                    position: 'relative',
                    zIndex: 1
                  }}
                >
                  <Stack spacing={2}>
                    <Typography variant="body2" sx={{ color: 'rgba(148, 163, 184, 0.8)' }}>
                      Predictive occupancy · Ledger-secured payments · Adaptive pricing
                    </Typography>
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                        gap: 1.5
                      }}
                    >
                      {stats.map((stat) => (
                        <MotionPaper
                          key={stat.label}
                          elevation={0}
                          whileHover={{ translateY: -6, boxShadow: '0 25px 40px rgba(14,23,42,0.3)' }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          sx={{
                            p: 2.5,
                            borderRadius: 3,
                            backgroundColor: 'rgba(17, 24, 39, 0.82)',
                            border: '1px solid rgba(148, 163, 184, 0.16)'
                          }}
                        >
                          <Box sx={{ color: theme.palette.primary.light, mb: 1 }}>
                            {React.cloneElement(stat.icon, { sx: { fontSize: 28 } })}
                          </Box>
                          <Typography variant="h5" sx={{ fontWeight: 700 }}>
                            {stat.number}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'rgba(148, 163, 184, 0.85)' }}>
                            {stat.label}
                          </Typography>
                        </MotionPaper>
                      ))}
                    </Box>
                  </Stack>
                </MotionPaper>
              </MotionBox>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 10, md: 12 }, backgroundColor: 'rgba(8, 12, 24, 0.75)' }}>
        <Container maxWidth="lg">
          <MotionBox
            {...fadeInUp}
            component={Typography}
            variant="h3"
            sx={{
              textAlign: 'center',
              fontWeight: 700,
              mb: 6,
              color: 'text.primary'
            }}
          >
            Why institutions and students choose HABS
          </MotionBox>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} lg={3} key={feature.title}>
                <MotionPaper
                  {...fadeInUp}
                  transition={{ ...fadeInUp.transition, delay: index * 0.08 }}
                  whileHover={{ translateY: -8, borderColor: 'rgba(124,58,237,0.45)' }}
                  sx={{
                    height: '100%',
                    p: 3,
                    borderRadius: 4,
                    backgroundColor: 'rgba(12, 18, 34, 0.78)',
                    border: '1px solid rgba(148, 163, 184, 0.18)',
                    backdropFilter: 'blur(14px)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                  }}
                >
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: 2,
                      display: 'grid',
                      placeItems: 'center',
                      background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(34,211,238,0.25))',
                      color: theme.palette.primary.light
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', flexGrow: 1 }}>
                    {feature.description}
                  </Typography>
                </MotionPaper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 10, md: 12 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                Featured hostels curated by our AI explorer
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, maxWidth: 580 }}>
                We vet every space for location, ambience, community, and compliance. Real photography, ledger-backed records, and verified amenities—so you unlock stays you can trust instantly.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Button variant="outlined" endIcon={<TrendingIcon />} onClick={() => navigate('/search')}>
                Explore full catalog
              </Button>
            </Grid>
          </Grid>

          <Grid container spacing={4} sx={{ mt: 2 }}>
            {featuredHostels.map((hostel, index) => (
              <Grid item xs={12} md={4} key={hostel.id}>
                <MotionCard
                  {...fadeInUp}
                  transition={{ ...fadeInUp.transition, delay: index * 0.1 }}
                  whileHover={{ translateY: -10, boxShadow: '0 42px 60px rgba(15, 23, 42, 0.25)' }}
                  sx={{
                    height: '100%',
                    borderRadius: 4,
                    border: '1px solid rgba(148, 163, 184, 0.18)',
                    backgroundColor: 'rgba(10, 16, 30, 0.85)',
                    backdropFilter: 'blur(12px)'
                  }}
                >
                  <CardMedia
                    component="img"
                    height="220"
                    image={hostel.image}
                    alt={hostel.name}
                    sx={{
                      filter: 'saturate(1.2)',
                      borderTopLeftRadius: 16,
                      borderTopRightRadius: 16,
                      backgroundColor: 'rgba(15,23,42,0.6)'
                    }}
                  />
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={1.5}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {hostel.name}
                        </Typography>
                        <Chip
                          label={`₹${hostel.price.toLocaleString('en-IN')}/month`}
                          size="small"
                          color="primary"
                          sx={{ fontWeight: 600 }}
                        />
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Rating value={hostel.rating} precision={0.1} readOnly size="small" />
                        <Typography variant="body2" color="text.secondary">
                          {hostel.rating} · {hostel.distance}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <LocationIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {hostel.location}
                        </Typography>
                      </Stack>
                      <Stack direction="row" flexWrap="wrap" gap={1}>
                        {hostel.amenities.map((amenity) => (
                          <Chip
                            key={amenity}
                            label={amenity}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderColor: 'rgba(148, 163, 184, 0.3)',
                              color: 'text.secondary'
                            }}
                          />
                        ))}
                      </Stack>
                      <Button
                        variant="contained"
                        sx={{ borderRadius: 2, mt: 1 }}
                        onClick={() => navigate(`/hostels/${hostel.id}`)}
                      >
                        View details
                      </Button>
                    </Stack>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box
        sx={{
          py: { xs: 10, md: 12 },
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 64, 175, 0.85) 100%)'
        }}
      >
        <Container maxWidth="md">
          <MotionPaper
            {...fadeInUp}
            sx={{
              px: { xs: 4, md: 8 },
              py: { xs: 6, md: 8 },
              textAlign: 'center',
              borderRadius: 6,
              border: '1px solid rgba(148, 163, 184, 0.18)',
              backgroundColor: 'rgba(15, 23, 42, 0.82)',
              backdropFilter: 'blur(16px)'
            }}
          >
            <Chip
              label="Designed for institutions, optimized for residents"
              sx={{
                mb: 3,
                color: 'primary.light',
                backgroundColor: 'rgba(56, 189, 248, 0.12)',
                borderRadius: 2,
                px: 2,
                border: '1px solid rgba(56, 189, 248, 0.24)'
              }}
            />
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              Ready to reimagine your hostel operations?
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 580, mx: 'auto', mb: 4 }}>
              Launch in weeks, not months. Integrate your legacy systems, sync allotments automatically, and build the living experiences that today’s students expect.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button variant="contained" size="large" onClick={() => navigate('/register')}>
                Start free pilot
              </Button>
              <Button variant="outlined" size="large" color="inherit" onClick={() => navigate('/demo')}>
                Schedule strategy call
              </Button>
            </Stack>
          </MotionPaper>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;