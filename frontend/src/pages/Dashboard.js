import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Container,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from '@mui/material';
import {
  Event as EventIcon,
  ConfirmationNumber as TicketIcon,
  Add as AddIcon,
  TrendingUp as TrendingIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEvent } from '../contexts/EventContext';
import { format } from 'date-fns';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { events, fetchEvents } = useEvent();
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalTickets: 0,
    revenue: 0,
  });

  useEffect(() => {
    if (user?.role === 'ORGANIZER') {
      fetchEvents();
    }
  }, [user]); // fetchEvents is now memoized, so we don't need it in dependencies

  useEffect(() => {
    // Calculate stats from events
    if (events && events.length > 0) {
      const totalEvents = events.length;
      const activeEvents = events.filter(event => 
        new Date(event.eventDate) > new Date() && event.status === 'PUBLISHED'
      ).length;
      const totalTickets = events.reduce((sum, event) => 
        sum + (event.analytics?.totalTicketsSold || 0), 0
      );
      const revenue = events.reduce((sum, event) => 
        sum + (event.analytics?.totalRevenue || 0), 0
      );

      setStats({ totalEvents, activeEvents, totalTickets, revenue });
    }
  }, [events]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {getGreeting()}, {user?.firstName}!
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Welcome to your EventHub dashboard
        </Typography>
      </Box>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AddIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Quick Actions</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate('/create-event')}
                    sx={{ mb: 1 }}
                  >
                    Create Event
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate('/events')}
                    sx={{ mb: 1 }}
                  >
                    Browse Events
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate('/my-tickets')}
                    sx={{ mb: 1 }}
                  >
                    My Tickets
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate('/validate-tickets')}
                    sx={{ mb: 1 }}
                  >
                    Validate Tickets
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Profile Overview</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                  {user?.firstName?.charAt(0) || 'U'}
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {user?.firstName} {user?.lastName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user?.email}
                  </Typography>
                  <Chip 
                    label={user?.role} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Box>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/profile')}
              >
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Stats Cards */}
      {user?.role === 'ORGANIZER' && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EventIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Box>
                    <Typography variant="h4">{stats.totalEvents}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Events
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingIcon sx={{ mr: 2, color: 'success.main' }} />
                  <Box>
                    <Typography variant="h4">{stats.activeEvents}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Events
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TicketIcon sx={{ mr: 2, color: 'warning.main' }} />
                  <Box>
                    <Typography variant="h4">{stats.totalTickets}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tickets Sold
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TrendingIcon sx={{ mr: 2, color: 'success.main' }} />
                  <Box>
                    <Typography variant="h4">${stats.revenue}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Revenue
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Recent Events */}
      {user?.role === 'ORGANIZER' && events && events.length > 0 && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Events
            </Typography>
            <List>
              {events.slice(0, 5).map((event, index) => (
                <React.Fragment key={event.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <EventIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={event.name}
                      secondary={`${format(new Date(event.eventDate), 'MMM dd, yyyy')} • ${event.venue}`}
                    />
                    <Chip 
                      label={event.status} 
                      color={event.status === 'PUBLISHED' ? 'success' : 'default'}
                      size="small"
                    />
                  </ListItem>
                  {index < events.slice(0, 5).length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button onClick={() => navigate('/events')}>
                View All Events
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Welcome Message for Attendees */}
      {user?.role === 'ATTENDEE' && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Welcome to EventHub!
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              As an attendee, you can browse events, purchase tickets, and manage your bookings.
              Start by exploring available events or check your existing tickets.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                onClick={() => navigate('/events')}
              >
                Browse Events
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/my-tickets')}
              >
                My Tickets
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default Dashboard;