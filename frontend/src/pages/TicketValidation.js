import React, { useState } from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, TextField, Button, Alert, Tabs, Tab } from '@mui/material';
import { ticketService } from '../services/ticketService';
import QrReader from 'react-qr-scanner';

const previewStyle = {
  height: 300,
  width: '100%'
};

const TicketValidation = () => {
  const [tab, setTab] = useState(0);
  const [ticketNumber, setTicketNumber] = useState('');
  const [qrError, setQrError] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async (data) => {
    if (data && data.text) {
      setLoading(true);
      setQrError('');
      try {
        const res = await ticketService.validateByQr(data.text);
        setResult(res);
      } catch (e) {
        setQrError(e.response?.data?.message || 'Validation failed');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleError = (err) => {
    setQrError(err?.message || 'Camera access error');
  };

  const handleSubmit = async () => {
    if (!ticketNumber) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await ticketService.validateByNumber(ticketNumber);
      setResult(res);
    } catch (e) {
      setResult({ valid: false, message: e.response?.data?.message || 'Validation failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Ticket Validation
        </Typography>

        <Card sx={{ mb: 3 }}>
          <Tabs value={tab} onChange={(e, v) => setTab(v)}>
            <Tab label="Scan QR" />
            <Tab label="Manual Input" />
          </Tabs>
        </Card>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                {tab === 0 ? (
                  <>
                    {qrError && <Alert severity="error" sx={{ mb: 2 }}>{qrError}</Alert>}
                    <QrReader
                      delay={500}
                      style={previewStyle}
                      onError={handleError}
                      onScan={handleScan}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      Point the camera at the ticket QR code to validate.
                    </Typography>
                  </>
                ) : (
                  <>
                    <TextField
                      fullWidth
                      label="Ticket Number"
                      value={ticketNumber}
                      onChange={(e) => setTicketNumber(e.target.value)}
                      sx={{ mb: 2 }}
                    />
                    <Button variant="contained" onClick={handleSubmit} disabled={loading}>
                      {loading ? 'Validating...' : 'Validate Ticket'}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Result</Typography>
                {result ? (
                  result.valid ? (
                    <Alert severity="success">Valid ticket. {result.message || ''}</Alert>
                  ) : (
                    <Alert severity="error">Invalid ticket. {result.message || ''}</Alert>
                  )
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Awaiting validation...
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default TicketValidation;