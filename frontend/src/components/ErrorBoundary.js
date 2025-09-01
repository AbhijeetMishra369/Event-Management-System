import React from 'react';
import { Box, Button, Typography, Container } from '@mui/material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Optionally log to an error reporting service
    // console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ py: 8 }}>
          <Container maxWidth="md">
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" gutterBottom>
                Something went wrong.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                An unexpected error occurred. Try refreshing the page.
              </Typography>
              <Button variant="contained" onClick={this.handleReload}>
                Reload
              </Button>
            </Box>
          </Container>
        </Box>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;