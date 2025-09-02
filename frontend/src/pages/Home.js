import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Container,
  Chip,
  Stack,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Event as EventIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  ArrowForward as ArrowIcon,
  TrendingUp as TrendingIcon,
  People as PeopleIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useEvent } from '../contexts/EventContext';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import HeroCarousel from '../components/HeroCarousel';

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { featuredEvents, fetchFeaturedEvents, loading } = useEvent();

  useEffect(() => {
    fetchFeaturedEvents();
  }, []); // Empty dependency array since fetchFeaturedEvents is now memoized

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const handleViewEvents = () => {
    navigate('/events');
  };

  const features = [
    {
      icon: <EventIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      title: 'Easy Event Creation',
      description: 'Create and manage events with our intuitive interface. Set up ticket types, pricing, and event details in minutes.',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      title: 'QR Code Tickets',
      description: 'Generate secure QR code tickets for seamless check-in. Validate tickets instantly with our mobile app.',
    },
    {
      icon: <TrendingIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      title: 'Real-time Analytics',
      description: 'Track ticket sales, revenue, and attendee data in real-time to make informed decisions for your next event.',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      title: 'Fast & Reliable',
      description: 'Built with modern technologies for speed and reliability. Handle thousands of concurrent users without issues.',
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      title: 'Community Features',
      description: 'Connect with attendees, share event updates, and build a community around your events.',
    },
    {
      icon: <CalendarIcon sx={{ fontSize: 60, color: 'primary.main' }} />,
      title: 'Smart Scheduling',
      description: 'Intelligent scheduling tools to help you plan events at optimal times and manage multiple events efficiently.',
    },
  ];

  const stats = [
    { number: '10K+', label: 'Events Created' },
    { number: '100K+', label: 'Tickets Sold' },
    { number: '50K+', label: 'Happy Users' },
    { number: '99.9%', label: 'Uptime' },
  ];

  return (
    <Box>
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Stats Section */}
      <Box sx={{ py: 6, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" component="div" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
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
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h2" gutterBottom>
            Why Choose EventHub?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Everything you need to create, manage, and attend amazing events
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%', 
                  textAlign: 'center',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ mb: 3 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Events Section */}
      <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h3" component="h2" gutterBottom>
                Featured Events
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Discover amazing events happening around you
              </Typography>
            </Box>
            <Button
              variant="outlined"
              endIcon={<ArrowIcon />}
              onClick={handleViewEvents}
              sx={{ 
                textTransform: 'none',
                borderRadius: 2,
                px: 3,
                py: 1.5,
              }}
            >
              View All Events
            </Button>
          </Box>
          
          {loading ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography>Loading featured events...</Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {featuredEvents.slice(0, 3).map((event) => (
                <Grid item xs={12} md={4} key={event.id}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      cursor: 'pointer',
                      transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                      },
                    }} 
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={event.eventImage || 'https://via.placeholder.com/400x200?text=Event+Image'}
                      alt={event.name}
                    />
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                        {event.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                        {event.description}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CalendarIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {format(new Date(event.eventDate), 'MMM dd, yyyy')}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <LocationIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {event.venue}, {event.city}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {event.tags?.slice(0, 2).map((tag) => (
                          <Chip key={tag} label={tag} size="small" />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 8,
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
              Ready to Create Your Next Event?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Join thousands of organizers who trust EventHub for their event management needs.
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
              {(!isAuthenticated || (user && (user.role === 'ORGANIZER' || user.role === 'ADMIN'))) && (
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleGetStarted}
                  sx={{
                    backgroundColor: 'white',
                    color: 'primary.main',
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    '&:hover': {
                      backgroundColor: 'grey.100',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Start Creating Events
                </Button>
              )}
              <Button
                variant="outlined"
                size="large"
                onClick={handleViewEvents}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Browse Events
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;