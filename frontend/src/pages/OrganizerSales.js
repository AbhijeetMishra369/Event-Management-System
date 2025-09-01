import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Container, Card, CardContent, Tabs, Tab, Grid, Button, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { ticketService } from '../services/ticketService';
import { eventService } from '../services/eventService';
import { analyticsService } from '../services/analyticsService';
import { format } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const OrganizerSales = () => {
  const [tab, setTab] = useState(0);
  const [refunds, setRefunds] = useState([]);
  const [events, setEvents] = useState([]);
  const [overview, setOverview] = useState(null);
  const [info, setInfo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [refundList, organizerEvents, ov] = await Promise.all([
        ticketService.getRefundRequestedTickets(),
        eventService.getOrganizerEvents(),
        analyticsService.getOrganizerOverview(),
      ]);
      setRefunds(refundList || []);
      setEvents(organizerEvents || []);
      setOverview(ov || null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const salesData = useMemo(() => {
    const today = new Date();
    const series = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const label = format(d, 'MMM dd');
      const value = Math.floor(Math.random() * 50) + 10; // placeholder
      series.push({ date: label, tickets: value });
    }
    return series;
  }, [events]);

  const processRefund = async (ticketId) => {
    try {
      await ticketService.processRefund(ticketId);
      setInfo('Refund processed.');
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
          Sales & Refunds
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {info && <Alert severity="success" sx={{ mb: 2 }}>{info}</Alert>}

        <Card sx={{ mb: 3 }}>
          <Tabs value={tab} onChange={(e, v) => setTab(v)}>
            <Tab label="Overview" />
            <Tab label="Refund Requests" />
          </Tabs>
        </Card>

        {tab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>Tickets Sold (last 7 days)</Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={salesData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorT" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#1976d2" stopOpacity={0.5}/>
                            <stop offset="95%" stopColor="#1976d2" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Area type="monotone" dataKey="tickets" stroke="#1976d2" fillOpacity={1} fill="url(#colorT)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>Overview</Typography>
                  <Box sx={{ display: 'grid', gap: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Total Events</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{overview?.totalEvents ?? '-'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Active Events</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{overview?.activeEvents ?? '-'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Tickets Sold</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{overview?.ticketsSold ?? '-'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Revenue</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>₹ {overview?.revenue ?? '-'}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {tab === 1 && (
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Refund Requests</Typography>
              {loading ? (
                <Typography>Loading...</Typography>
              ) : (
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Event</TableCell>
                        <TableCell>Ticket #</TableCell>
                        <TableCell>Attendee</TableCell>
                        <TableCell>Reason</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell align="right">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {refunds.map((t) => (
                        <TableRow key={t.id}>
                          <TableCell>{t.eventName}</TableCell>
                          <TableCell>{t.ticketNumber}</TableCell>
                          <TableCell>{t.attendeeName}</TableCell>
                          <TableCell>{t.refundReason || '-'}</TableCell>
                          <TableCell>{t.refundRequestedAt ? format(new Date(t.refundRequestedAt), 'MMM dd, yyyy') : '-'}</TableCell>
                          <TableCell align="right">
                            <Button size="small" variant="outlined" onClick={() => processRefund(t.id)}>Process Refund</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
};

export default OrganizerSales;