import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h1" sx={{ fontWeight: 800, lineHeight: 1 }}>
            404
          </Typography>
          <Typography variant="h5" sx={{ mt: 2, mb: 3 }}>
            Page not found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            The page you are looking for might have been removed or is temporarily unavailable.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')}>Go Home</Button>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFound;