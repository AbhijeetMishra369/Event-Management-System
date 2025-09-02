import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Container, Grid, Card, CardContent, CardMedia, 
  CardActions, Button, TextField, Chip, CircularProgress, Alert,
  Paper, InputAdornment, Skeleton, Fade
} from '@mui/material';
import { Search as SearchIcon, Event as EventIcon, LocationOn as LocationIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../services/eventService';

const EventList = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);

  useEffect(() => {
    loadEvents();
  }, [page]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getPublishedEvents(page, 12);
      setEvents(response.content || []);
    } catch (err) {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadEvents();
      return;
    }
    try {
      setLoading(true);
      const response = await eventService.searchEvents(searchQuery, 0, 12);
      setEvents(response.content || []);
    } catch (err) {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Discover Amazing Events
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Find and book tickets for the best events in your area
          </Typography>
        </Box>
        
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              fullWidth
              placeholder="Search events by name, category, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              variant="outlined"
              size="medium"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <Button 
              variant="contained" 
              onClick={handleSearch}
              size="large"
              sx={{ px: 4, py: 1.5, fontWeight: 600 }}
            >
              Search
            </Button>
          </Box>
        </Paper>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loading ? (
          <Grid container spacing={3}>
            {[...Array(6)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ height: '100%' }}>
                  <Skeleton variant="rectangular" height={200} />
                  <CardContent>
                    <Skeleton variant="text" height={32} sx={{ mb: 1 }} />
                    <Skeleton variant="text" height={24} sx={{ mb: 1 }} />
                    <Skeleton variant="text" height={20} sx={{ mb: 1 }} />
                    <Skeleton variant="text" height={20} />
                  </CardContent>
                  <CardActions>
                    <Skeleton variant="rectangular" height={36} width="100%" />
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={3}>
            {events.length === 0 ? (
              <Grid item xs={12}>
                <Typography variant="body1" color="text.secondary" align="center">
                  No events found. {searchQuery && 'Try a different search term.'}
                </Typography>
              </Grid>
            ) : (
              events.map((event) => (
                <Grid item xs={12} sm={6} md={4} key={event.id}>
                  <Fade in={true} timeout={500}>
                    <Card 
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: 4,
                        }
                      }}
                      elevation={2}
                    >
                      {event.eventImage && (
                        <CardMedia
                          component="img"
                          height="200"
                          image={event.eventImage.startsWith('http') ? event.eventImage : `${process.env.REACT_APP_API_URL || '/api'}${event.eventImage}`}
                          alt={event.name}
                          sx={{ objectFit: 'cover' }}
                        />
                      )}
                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, lineHeight: 1.3 }}>
                          {event.name}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <EventIcon color="action" fontSize="small" />
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(event.eventDate)}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <LocationIcon color="action" fontSize="small" />
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {event.venue}, {event.city}
                          </Typography>
                        </Box>
                        
                        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary', lineHeight: 1.5 }}>
                          {event.description?.length > 100 
                            ? `${event.description.substring(0, 100)}...` 
                            : event.description
                          }
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {event.category && (
                            <Chip 
                              label={event.category} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                            />
                          )}
                          {event.tags?.slice(0, 2).map((tag) => (
                            <Chip 
                              key={tag} 
                              label={tag} 
                              size="small" 
                              variant="outlined"
                              sx={{ fontSize: '0.75rem' }}
                            />
                          ))}
                        </Box>
                      </CardContent>
                      <CardActions sx={{ p: 3, pt: 0 }}>
                        <Button 
                          variant="contained" 
                          fullWidth
                          onClick={() => navigate(`/events/${event.id}`)}
                          sx={{ 
                            fontWeight: 600,
                            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                            '&:hover': {
                              background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                            }
                          }}
                        >
                          View Details
                        </Button>
                      </CardActions>
                    </Card>
                  </Fade>
                </Grid>
              ))
            )}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default EventList;