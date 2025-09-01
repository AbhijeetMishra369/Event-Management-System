import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const EventList = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Events
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse and discover amazing events. This page will be implemented with event listing, search, and filtering functionality.
        </Typography>
      </Box>
    </Container>
  );
};

export default EventList;