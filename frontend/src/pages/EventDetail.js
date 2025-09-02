import React, { useEffect, useState, useMemo } from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, CardMedia, Chip, Stack, TextField, MenuItem, Button, Alert } from '@mui/material';
import { useParams } from 'react-router-dom';
import { eventService } from '../services/eventService';
import { createOrder, verifyPayment } from '../services/paymentService';
import { useAuth } from '../contexts/AuthContext';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-sdk')) return resolve(true);
    const script = document.createElement('script');
    script.id = 'razorpay-sdk';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const EventDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ticketTypeId, setTicketTypeId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [purchaseError, setPurchaseError] = useState('');
  const [purchaseSuccess, setPurchaseSuccess] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await eventService.getEventById(id);
        setEvent(data);
        if (data.ticketTypes && data.ticketTypes.length > 0) {
          setTicketTypeId(data.ticketTypes[0].id);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const selectedType = useMemo(() => {
    if (!event || !event.ticketTypes) return null;
    return event.ticketTypes.find(t => t.id === ticketTypeId) || null;
  }, [event, ticketTypeId]);

  const totalPrice = useMemo(() => {
    if (!selectedType) return 0;
    return (selectedType.price || 0) * quantity;
  }, [selectedType, quantity]);

  const handlePurchase = async () => {
    setPurchaseError('');
    setPurchaseSuccess('');
    if (!isAuthenticated) {
      setPurchaseError('Please login to purchase tickets.');
      return;
    }
    if (!selectedType) {
      setPurchaseError('Please select a ticket type.');
      return;
    }
    if (quantity < 1) {
      setPurchaseError('Please select a valid quantity.');
      return;
    }

    const ok = await loadRazorpayScript();
    if (!ok) {
      setPurchaseError('Unable to load Razorpay. Please check your network.');
      return;
    }
    try {
      const order = await createOrder({ eventId: id, ticketTypeId, quantity, currency: 'INR' });
      const rzp = new window.Razorpay({
        key: order.key || process.env.REACT_APP_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: event?.name,
        description: `${selectedType?.name} x ${quantity}`,
        order_id: order.orderId,
        prefill: {
          name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
          email: user?.email || '',
          contact: user?.phoneNumber || '',
        },
        notes: { eventId: id, ticketTypeId, quantity: String(quantity) },
        handler: async function (response) {
          try {
            await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              eventId: id,
              ticketTypeId,
              quantity,
              attendeeName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Attendee',
              attendeeEmail: user?.email || 'noreply@example.com',
              attendeePhone: user?.phoneNumber || '',
            });
            setPurchaseSuccess('Payment successful! Tickets have been issued.');
          } catch (e) {
            setPurchaseError(e.response?.data || e.message || 'Payment verification failed.');
          }
        },
        modal: {
          ondismiss: function () {
            // User closed modal
          }
        },
        theme: { color: '#1976d2' }
      });
      rzp.open();
    } catch (e) {
      setPurchaseError(e.message || 'Failed to initiate payment.');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Typography>Loading event...</Typography>
        </Box>
      </Container>
    );
  }

  if (error || !event) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Alert severity="error">{error || 'Event not found'}</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Card>
              {event.eventImage && (
                <CardMedia component="img" height="360" image={event.eventImage} alt={event.name} />
              )}
              <CardContent>
                <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
                  {event.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  {event.description}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                  {event.tags?.map((tag) => (
                    <Chip key={tag} label={tag} size="small" />
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={5}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Purchase Tickets
                </Typography>
                {purchaseError && <Alert severity="error" sx={{ mb: 2 }}>{purchaseError}</Alert>}
                {purchaseSuccess && <Alert severity="success" sx={{ mb: 2 }}>{purchaseSuccess}</Alert>}
                <TextField
                  select
                  fullWidth
                  label="Ticket Type"
                  value={ticketTypeId}
                  onChange={(e) => setTicketTypeId(e.target.value)}
                  sx={{ mb: 2 }}
                >
                  {event.ticketTypes?.filter(t => t.active).map((t) => (
                    <MenuItem key={t.id} value={t.id} disabled={t.saleEndDate && new Date(t.saleEndDate) < new Date()}>
                      {t.name} — ₹{t.price.toFixed(2)} (Available: {t.availableQuantity})
                      {t.saleEndDate && <Typography variant="caption" sx={{ ml: 1 }}>Sales end: {new Date(t.saleEndDate).toLocaleDateString()}</Typography>}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  type="number"
                  fullWidth
                  label="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                  inputProps={{ min: 1 }}
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body1">Total</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>₹ {totalPrice.toFixed(2)}</Typography>
                </Box>
                <Button variant="contained" fullWidth onClick={handlePurchase} sx={{ py: 1.5 }} disabled={selectedType && selectedType.saleEndDate && new Date(selectedType.saleEndDate) < new Date()}>
                  {selectedType && selectedType.saleEndDate && new Date(selectedType.saleEndDate) < new Date() ? 'Sales Ended' : 'Pay with Razorpay'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default EventDetail;