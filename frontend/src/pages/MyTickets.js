import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const MyTickets = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          My Tickets
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View and manage your purchased tickets. This page will be implemented with ticket listing, QR code display, and ticket management functionality.
        </Typography>
      </Box>
    </Container>
  );
};

export default MyTickets;