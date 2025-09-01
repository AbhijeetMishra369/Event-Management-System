import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Container, Grid, Card, CardContent, CardMedia, 
  CardActions, Button, TextField, Chip, CircularProgress, Alert 
} from '@mui/material';
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
        <Typography variant="h3" component="h1" gutterBottom>
          Events
        </Typography>
        
        <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
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
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {event.eventImage && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={event.eventImage.startsWith('http') ? event.eventImage : `${process.env.REACT_APP_API_URL || '/api'}${event.eventImage}`}
                        alt={event.name}
                        sx={{ objectFit: 'cover' }}
                      />
                    )}
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom noWrap>
                        {event.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {formatDate(event.eventDate)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        📍 {event.venue}, {event.city}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }} noWrap>
                        {event.description}
                      </Typography>
                      {event.category && (
                        <Chip label={event.category} size="small" color="primary" />
                      )}
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        variant="contained" 
                        fullWidth
                        onClick={() => navigate(`/events/${event.id}`)}
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
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