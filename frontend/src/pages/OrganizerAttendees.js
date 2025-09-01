import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Card, CardContent, Grid, FormControl, InputLabel, Select, MenuItem, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { eventService } from '../services/eventService';
import { ticketService } from '../services/ticketService';

const toCsv = (rows) => {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(',')];
  for (const r of rows) {
    lines.push(headers.map(h => JSON.stringify(r[h] ?? '')).join(','));
  }
  return lines.join('\n');
};

const OrganizerAttendees = () => {
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState('');
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    (async () => {
      const list = await eventService.getOrganizerEvents();
      setEvents(list.content || []);
      if (list.content && list.content.length) setEventId(list.content[0].id);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!eventId) return;
      const res = await ticketService.getTicketsByEvent(eventId);
      setTickets(res || []);
    })();
  }, [eventId]);

  const handleExport = () => {
    const rows = tickets.map(t => ({
      ticketNumber: t.ticketNumber,
      name: t.attendeeName,
      email: t.attendeeEmail,
      phone: t.attendeePhone,
      type: t.ticketTypeName,
      status: t.status,
    }));
    const csv = toCsv(rows);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'attendees.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
          Attendees
        </Typography>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="ev-label">Event</InputLabel>
                  <Select labelId="ev-label" value={eventId} label="Event" onChange={(e) => setEventId(e.target.value)}>
                    {events.map(ev => <MenuItem key={ev.id} value={ev.id}>{ev.name}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Button variant="outlined" onClick={handleExport}>Export CSV</Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Ticket #</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.map(t => (
                <TableRow key={t.id}>
                  <TableCell>{t.ticketNumber}</TableCell>
                  <TableCell>{t.attendeeName}</TableCell>
                  <TableCell>{t.attendeeEmail}</TableCell>
                  <TableCell>{t.attendeePhone}</TableCell>
                  <TableCell>{t.ticketTypeName}</TableCell>
                  <TableCell>{t.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default OrganizerAttendees;