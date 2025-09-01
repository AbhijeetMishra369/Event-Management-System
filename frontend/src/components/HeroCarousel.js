import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  IconButton,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  PlayArrow as PlayIcon,
  Event as EventIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const carouselItems = [
  {
    id: 1,
    title: "Create Amazing Events",
    subtitle: "The complete platform for event management, ticket sales, and attendee engagement",
    description: "From small meetups to large conferences, EventHub provides everything you need to create successful events.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    ctaText: "Get Started",
    ctaLink: "/register",
    features: ["Easy Event Creation", "QR Code Tickets", "Real-time Analytics"],
  },
  {
    id: 2,
    title: "Seamless Ticket Management",
    subtitle: "Generate QR codes, track sales, and manage attendees with ease",
    description: "Our advanced ticket system ensures smooth check-ins and provides detailed insights into your event performance.",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    ctaText: "Browse Events",
    ctaLink: "/events",
    features: ["QR Code Generation", "Sales Tracking", "Attendee Management"],
  },
  {
    id: 3,
    title: "Professional Analytics",
    subtitle: "Get insights into your event performance and audience engagement",
    description: "Track ticket sales, revenue, and attendee data in real-time to make informed decisions for your next event.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    ctaText: "View Dashboard",
    ctaLink: "/dashboard",
    features: ["Real-time Reports", "Revenue Analytics", "Performance Metrics"],
  },
];

const HeroCarousel = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const prevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
      );
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const goToSlide = (index) => {
    if (!isAnimating && index !== currentIndex) {
      setIsAnimating(true);
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const currentItem = carouselItems[currentIndex];

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '60vh', md: '80vh' },
        overflow: 'hidden',
        backgroundColor: 'grey.900',
      }}
    >
      {/* Background Image */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(${currentItem.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transition: 'opacity 0.3s ease-in-out',
          opacity: isAnimating ? 0.8 : 1,
        }}
      />

      {/* Content */}
      <Container maxWidth="lg" sx={{ height: '100%', position: 'relative', zIndex: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
            color: 'white',
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <Box
            sx={{
              maxWidth: { xs: '100%', md: '60%' },
              opacity: isAnimating ? 0.7 : 1,
              transform: isAnimating ? 'translateY(20px)' : 'translateY(0)',
              transition: 'all 0.3s ease-in-out',
            }}
          >
            <Typography
              variant={isMobile ? 'h3' : 'h2'}
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                mb: 2,
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              {currentItem.title}
            </Typography>

            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 400,
                mb: 3,
                opacity: 0.9,
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              }}
            >
              {currentItem.subtitle}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 4,
                opacity: 0.8,
                lineHeight: 1.6,
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              }}
            >
              {currentItem.description}
            </Typography>

            {/* Features */}
            <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {currentItem.features.map((feature, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 2,
                    py: 1,
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 2,
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <EventIcon sx={{ fontSize: 16 }} />
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {feature}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* CTA Buttons */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate(currentItem.ctaLink)}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: 'primary.dark',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {currentItem.ctaText}
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/events')}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Learn More
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Navigation Arrows */}
      <IconButton
        onClick={prevSlide}
        sx={{
          position: 'absolute',
          left: { xs: 10, md: 20 },
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          color: 'white',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.2)',
          },
          zIndex: 3,
        }}
      >
        <ChevronLeftIcon />
      </IconButton>

      <IconButton
        onClick={nextSlide}
        sx={{
          position: 'absolute',
          right: { xs: 10, md: 20 },
          top: '50%',
          transform: 'translateY(-50%)',
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          color: 'white',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.2)',
          },
          zIndex: 3,
        }}
      >
        <ChevronRightIcon />
      </IconButton>

      {/* Dots Indicator */}
      <Box
        sx={{
          position: 'absolute',
          bottom: { xs: 20, md: 40 },
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 1,
          zIndex: 3,
        }}
      >
        {carouselItems.map((_, index) => (
          <Box
            key={index}
            onClick={() => goToSlide(index)}
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: index === currentIndex ? 'white' : 'rgba(255, 255, 255, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: index === currentIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                transform: 'scale(1.2)',
              },
            }}
          />
        ))}
      </Box>

      {/* Play/Pause Button */}
      <IconButton
        sx={{
          position: 'absolute',
          bottom: { xs: 20, md: 40 },
          right: { xs: 20, md: 40 },
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          color: 'white',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.2)',
          },
          zIndex: 3,
        }}
      >
        <PlayIcon />
      </IconButton>
    </Box>
  );
};

export default HeroCarousel;