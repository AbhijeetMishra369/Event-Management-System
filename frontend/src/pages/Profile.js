import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Profile = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Profile
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your profile information and account settings. This page will be implemented with profile editing and account management functionality.
        </Typography>
      </Box>
    </Container>
  );
};

export default Profile;