import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const CreateEvent = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Create Event
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Create and configure your event with details, ticket types, and settings. This page will be implemented with a comprehensive event creation form.
        </Typography>
      </Box>
    </Container>
  );
};

export default CreateEvent;