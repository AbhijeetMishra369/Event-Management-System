import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert } from '@mui/material';
import { ticketService } from '../services/ticketService';
import { format } from 'date-fns';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refundOpen, setRefundOpen] = useState(false);
  const [refundReason, setRefundReason] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [info, setInfo] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await ticketService.getUserTickets();
      setTickets(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openRefund = (ticket) => {
    setSelectedTicket(ticket);
    setRefundReason('');
    setRefundOpen(true);
  };

  const submitRefund = async () => {
    if (!selectedTicket) return;
    try {
      await ticketService.requestRefund(selectedTicket.id, refundReason || '');
      setInfo('Refund requested.');
      setRefundOpen(false);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          My Tickets
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {info && <Alert severity="success" sx={{ mb: 2 }}>{info}</Alert>}
        {loading ? (
          <Typography>Loading tickets...</Typography>
        ) : (
          <Grid container spacing={3}>
            {tickets.map((t) => (
              <Grid item xs={12} md={6} lg={4} key={t.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>{t.eventName}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{t.ticketTypeName}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {format(new Date(t.eventDate), 'MMM dd, yyyy')} · {t.eventVenue}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      <Chip label={`Ticket #${t.ticketNumber}`} size="small" />
                      <Chip label={t.status} size="small" color={t.status === 'ACTIVE' ? 'success' : 'default'} />
                    </Box>
                    {t.qrCode && (
                      <img src={`data:image/png;base64,${t.qrCode}`} alt="QR" style={{ width: '100%', borderRadius: 8 }} />
                    )}
                    <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                      {t.status === 'ACTIVE' && (
                        <Button variant="outlined" onClick={() => openRefund(t)}>Request Refund</Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Dialog open={refundOpen} onClose={() => setRefundOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Request Refund</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Reason (optional)"
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
            multiline
            minRows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRefundOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={submitRefund}>Submit</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyTickets;