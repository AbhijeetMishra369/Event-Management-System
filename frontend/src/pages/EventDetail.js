import React, { useEffect, useState, useMemo } from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, CardMedia, Chip, Stack, TextField, MenuItem, Button, Alert, CircularProgress } from '@mui/material';
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
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Loading event details...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error || !event) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Alert severity="error" sx={{ maxWidth: 600, mx: 'auto' }}>
            {error || 'Event not found'}
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              {event.eventImage && (
                <CardMedia 
                  component="img" 
                  height="400" 
                  image={event.eventImage.startsWith('http') ? event.eventImage : `${process.env.REACT_APP_API_URL || '/api'}${event.eventImage}`} 
                  alt={event.name}
                  sx={{ objectFit: 'cover' }}
                />
              )}
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }} gutterBottom>
                  {event.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, fontSize: '1.1rem', lineHeight: 1.6 }}>
                  {event.description}
                </Typography>
                
                {/* Event Details */}
                <Box sx={{ mb: 3, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    📅 Event Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">Start Date</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {new Date(event.eventDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Typography>
                    </Grid>
                    {event.endDate && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">End Date</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {new Date(event.endDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Box>
                
                {/* Location Details */}
                <Box sx={{ mb: 3, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    📍 Location
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                    {event.venue}
                  </Typography>
                  {event.address && (
                    <Typography variant="body2" color="text.secondary">
                      {event.address}
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary">
                    {[event.city, event.state, event.country].filter(Boolean).join(', ')}
                  </Typography>
                </Box>
                
                {/* Tags */}
                {event.tags && event.tags.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Tags
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                      {event.tags.map((tag) => (
                        <Chip key={tag} label={tag} size="medium" color="primary" variant="outlined" />
                      ))}
                    </Stack>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={5}>
            <Card elevation={3} sx={{ borderRadius: 2, position: 'sticky', top: 24 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
                  🎫 Purchase Tickets
                </Typography>
                
                {purchaseError && <Alert severity="error" sx={{ mb: 3 }}>{purchaseError}</Alert>}
                {purchaseSuccess && <Alert severity="success" sx={{ mb: 3 }}>{purchaseSuccess}</Alert>}
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Select Ticket Type
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    label="Ticket Type"
                    value={ticketTypeId}
                    onChange={(e) => setTicketTypeId(e.target.value)}
                    variant="outlined"
                    size="medium"
                  >
                    {event.ticketTypes?.filter(t => t.active).map((t) => (
                      <MenuItem key={t.id} value={t.id} disabled={t.saleEndDate && new Date(t.saleEndDate) < new Date()}>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {t.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ₹{t.price.toFixed(2)} • Available: {t.availableQuantity}
                          </Typography>
                          {t.saleEndDate && (
                            <Typography variant="caption" color="error">
                              Sales end: {new Date(t.saleEndDate).toLocaleDateString()}
                            </Typography>
                          )}
                        </Box>
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Quantity
                  </Typography>
                  <TextField
                    type="number"
                    fullWidth
                    label="Number of tickets"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    inputProps={{ min: 1, max: selectedType?.availableQuantity || 10 }}
                    variant="outlined"
                    size="medium"
                  />
                </Box>
                
                <Box sx={{ p: 3, bgcolor: 'primary.50', borderRadius: 2, mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Total Amount
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      ₹{totalPrice.toFixed(2)}
                    </Typography>
                  </Box>
                  {selectedType && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {quantity} × {selectedType.name} @ ₹{selectedType.price.toFixed(2)}
                    </Typography>
                  )}
                </Box>
                
                <Button 
                  variant="contained" 
                  fullWidth 
                  onClick={handlePurchase} 
                  size="large"
                  sx={{ 
                    py: 2, 
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    background: 'linear-gradient(45deg, #2e7d32, #4caf50)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1b5e20, #2e7d32)',
                    }
                  }}
                  disabled={selectedType && selectedType.saleEndDate && new Date(selectedType.saleEndDate) < new Date()}
                >
                  {selectedType && selectedType.saleEndDate && new Date(selectedType.saleEndDate) < new Date() 
                    ? 'Sales Ended' 
                    : 'Pay with Razorpay'
                  }
                </Button>
                
                <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
                  Secure payment powered by Razorpay
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default EventDetail;