import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Stack,
  IconButton,
  Divider,
  Chip,
  Button
} from '@mui/material';
import {
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Facebook as FacebookIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        mt: 12,
        color: 'text.primary',
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at top, rgba(124, 58, 237, 0.28), transparent 55%)',
          pointerEvents: 'none'
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <MotionBox
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          sx={{
            borderRadius: 6,
            px: { xs: 4, md: 10 },
            py: { xs: 6, md: 10 },
            backdropFilter: 'blur(22px)',
            border: '1px solid rgba(148, 163, 184, 0.18)',
            background: 'linear-gradient(125deg, rgba(9, 20, 40, 0.92) 10%, rgba(13, 33, 63, 0.62) 90%)',
            boxShadow: '0 40px 100px rgba(15, 23, 42, 0.45)'
          }}
        >
          <Grid container spacing={6}>
            <Grid item xs={12} md={5}>
              <Stack spacing={2.5}>
                <Chip
                  label="AI x Blockchain Hostel Platform"
                  variant="outlined"
                  sx={{
                    alignSelf: 'flex-start',
                    borderColor: 'rgba(56, 189, 248, 0.4)',
                    color: 'primary.light',
                    backgroundColor: 'rgba(56, 189, 248, 0.08)'
                  }}
                />
                <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  Reimagining hostel discovery with immersive intelligence.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Discover curated stays, automate allotments, and verify every booking with tamper-proof ledgers. Unlock the smartest hostel ecosystem built for institutions, owners, and students alike.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    component={Link}
                    href="/register"
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                  >
                    Get started
                  </Button>
                  <Button
                    component={Link}
                    href="/demo"
                    variant="outlined"
                    color="inherit"
                  >
                    Request a demo
                  </Button>
                </Stack>
              </Stack>
            </Grid>

            <Grid item xs={12} md={7}>
              <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Explore
                  </Typography>
                  <Stack spacing={1.2}>
                    <Link href="/search" color="text.secondary" underline="hover">
                      Find hostels
                    </Link>
                    <Link href="/how-it-works" color="text.secondary" underline="hover">
                      How it works
                    </Link>
                    <Link href="/pricing" color="text.secondary" underline="hover">
                      Pricing plans
                    </Link>
                    <Link href="/blog" color="text.secondary" underline="hover">
                      Insights & updates
                    </Link>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    For partners
                  </Typography>
                  <Stack spacing={1.2}>
                    <Link href="/institutions" color="text.secondary" underline="hover">
                      Institutions
                    </Link>
                    <Link href="/owners" color="text.secondary" underline="hover">
                      Hostel owners
                    </Link>
                    <Link href="/integrations" color="text.secondary" underline="hover">
                      API integrations
                    </Link>
                    <Link href="/security" color="text.secondary" underline="hover">
                      Security
                    </Link>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Connect
                  </Typography>
                  <Stack spacing={1.2}>
                    <Typography color="text.secondary">support@habs.ai</Typography>
                    <Typography color="text.secondary">+91 98765 43210</Typography>
                    <Stack direction="row" spacing={1}>
                      {[FacebookIcon, TwitterIcon, InstagramIcon, LinkedInIcon].map((Icon, idx) => (
                        <IconButton
                          key={idx}
                          size="small"
                          sx={{
                            color: 'text.secondary',
                            borderRadius: 2,
                            border: '1px solid rgba(148, 163, 184, 0.25)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(34,211,238,0.18))',
                              color: 'primary.light'
                            }
                          }}
                        >
                          <Icon fontSize="small" />
                        </IconButton>
                      ))}
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Divider sx={{ my: { xs: 5, md: 8 }, borderColor: 'rgba(148, 163, 184, 0.18)' }} />

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'center' }}
          >
            <Typography variant="body2" color="text.secondary">
              © {currentYear} HABS. Building intelligent and trusted hostel experiences across the globe.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Link href="/privacy" color="text.secondary" underline="hover">
                Privacy policy
              </Link>
              <Link href="/terms" color="text.secondary" underline="hover">
                Terms of service
              </Link>
              <Link href="/status" color="text.secondary" underline="hover">
                System status
              </Link>
            </Stack>
          </Stack>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default Footer;