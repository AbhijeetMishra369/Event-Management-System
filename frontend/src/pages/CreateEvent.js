import React, { useState } from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, TextField, Button, Chip, IconButton, Alert } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { eventService } from '../services/eventService';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    eventDate: '',
    endDate: '',
    venue: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    eventImage: '',
    category: '',
    tags: '',
  });
  const [ticketTypes, setTicketTypes] = useState([
    { name: '', price: '', totalQuantity: '', active: true }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [uploading, setUploading] = useState(false);

  const updateField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const updateTicket = (idx, key, value) => {
    setTicketTypes(prev => prev.map((t, i) => i === idx ? { ...t, [key]: value } : t));
  };

  const addTicketType = () => setTicketTypes(prev => [...prev, { name: '', price: '', totalQuantity: '', active: true }]);
  const removeTicketType = (idx) => setTicketTypes(prev => prev.filter((_, i) => i !== idx));

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post('/upload/image', formData, { 
        headers: { 'Content-Type': 'multipart/form-data' } 
      });
      
      // Construct full URL for the image
      const baseURL = process.env.REACT_APP_API_URL || '/api';
      const fullImageUrl = data.url.startsWith('http') ? data.url : `${baseURL}${data.url}`;
      
      updateField('eventImage', fullImageUrl);
      setInfo('Image uploaded successfully!');
    } catch (err) {
      setError('Image upload failed. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    setError('');
    setInfo('');
    if (!form.name || !form.eventDate || !form.venue || ticketTypes.length === 0) {
      setError('Please fill required fields and add at least one ticket type.');
      return;
    }
    const payload = {
      name: form.name,
      description: form.description,
      eventDate: form.eventDate,
      endDate: form.endDate || null,
      venue: form.venue,
      address: form.address,
      city: form.city,
      state: form.state,
      country: form.country,
      postalCode: form.postalCode,
      eventImage: form.eventImage,
      category: form.category,
      tags: form.tags ? form.tags.split(',').map(s => s.trim()).filter(Boolean) : [],
      ticketTypes: ticketTypes.map(t => ({
        name: t.name,
        price: Number(t.price || 0),
        totalQuantity: Number(t.totalQuantity || 0),
        active: Boolean(t.active),
      })),
      settings: { refundsAllowed: true, salesEndDate: form.endDate || form.eventDate },
    };
    setLoading(true);
    try {
      const created = await eventService.createEvent(payload);
      setInfo('Event created. You can now publish it.');
      navigate(`/events/${created.id}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Create Event
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {info && <Alert severity="success" sx={{ mb: 2 }}>{info}</Alert>}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField label="Event Name" fullWidth value={form.name} onChange={(e) => updateField('name', e.target.value)} required />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField label="Description" fullWidth multiline minRows={4} value={form.description} onChange={(e) => updateField('description', e.target.value)} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField type="datetime-local" label="Start Date" fullWidth InputLabelProps={{ shrink: true }} value={form.eventDate} onChange={(e) => updateField('eventDate', e.target.value)} required />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField type="datetime-local" label="End Date" fullWidth InputLabelProps={{ shrink: true }} value={form.endDate} onChange={(e) => updateField('endDate', e.target.value)} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField label="Venue" fullWidth value={form.venue} onChange={(e) => updateField('venue', e.target.value)} required />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField label="Address" fullWidth value={form.address} onChange={(e) => updateField('address', e.target.value)} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField label="City" fullWidth value={form.city} onChange={(e) => updateField('city', e.target.value)} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField label="State" fullWidth value={form.state} onChange={(e) => updateField('state', e.target.value)} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField label="Postal Code" fullWidth value={form.postalCode} onChange={(e) => updateField('postalCode', e.target.value)} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField label="Country" fullWidth value={form.country} onChange={(e) => updateField('country', e.target.value)} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Button variant="outlined" component="label" disabled={uploading}>
                        {uploading ? 'Uploading...' : 'Upload Image'}
                        <input hidden type="file" accept="image/*" onChange={handleImageUpload} />
                      </Button>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    {form.eventImage && (
                      <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 2 }}>Image Preview:</Typography>
                        <Box
                          component="img"
                          src={form.eventImage}
                          alt="Event preview"
                          sx={{
                            maxWidth: '100%',
                            maxHeight: 200,
                            borderRadius: 2,
                            border: '2px solid',
                            borderColor: 'grey.200',
                            objectFit: 'cover'
                          }}
                        />
                      </Box>
                    )}
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField label="Category" fullWidth value={form.category} onChange={(e) => updateField('category', e.target.value)} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField label="Tags (comma-separated)" fullWidth value={form.tags} onChange={(e) => updateField('tags', e.target.value)} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Ticket Types</Typography>
                {ticketTypes.map((t, idx) => (
                  <Box key={idx} sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: 2, p: 2, mb: 2 }}>
                    <TextField label="Name" fullWidth sx={{ mb: 1 }} value={t.name} onChange={(e) => updateTicket(idx, 'name', e.target.value)} />
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <TextField type="number" label="Price (₹)" fullWidth value={t.price} onChange={(e) => updateTicket(idx, 'price', e.target.value)} />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField type="number" label="Total Quantity" fullWidth value={t.totalQuantity} onChange={(e) => updateTicket(idx, 'totalQuantity', e.target.value)} />
                      </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                      <IconButton onClick={() => removeTicketType(idx)}><DeleteIcon /></IconButton>
                    </Box>
                  </Box>
                ))}
                <Button startIcon={<AddIcon />} onClick={addTicketType} sx={{ mb: 2 }}>Add Ticket Type</Button>
                <Button variant="contained" fullWidth onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Creating...' : 'Create Event'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default CreateEvent;