import api from './api';

export const ticketService = {
  async purchaseTickets(ticketData) {
    try {
      const response = await api.post('/tickets/purchase', ticketData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to purchase tickets');
    }
  },

  async getUserTickets(params = {}) {
    try {
      const response = await api.get('/tickets', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user tickets');
    }
  },

  async getTicketById(id) {
    try {
      const response = await api.get(`/tickets/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch ticket');
    }
  },

  async getTicketByNumber(ticketNumber) {
    try {
      const response = await api.get(`/tickets/number/${ticketNumber}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch ticket');
    }
  },

  async getTicketsByEvent(eventId) {
    try {
      const response = await api.get(`/tickets/event/${eventId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch event tickets');
    }
  },

  async getActiveTicketsByEvent(eventId) {
    try {
      const response = await api.get(`/tickets/event/${eventId}/active`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch active tickets');
    }
  },

  async getUsedTicketsByEvent(eventId) {
    try {
      const response = await api.get(`/tickets/event/${eventId}/used`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch used tickets');
    }
  },

  async validateTicket(validationData) {
    try {
      const response = await api.post('/tickets/validate', validationData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to validate ticket');
    }
  },

  async requestRefund(ticketId, reason) {
    try {
      const response = await api.post(`/tickets/${ticketId}/refund-request`, { reason });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to request refund');
    }
  },

  async processRefund(ticketId) {
    try {
      const response = await api.post(`/tickets/${ticketId}/refund-process`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to process refund');
    }
  },

  async getRefundRequestedTickets() {
    try {
      const response = await api.get('/tickets/refund-requests');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch refund requests');
    }
  },

  async getExpiredTickets() {
    try {
      const response = await api.get('/tickets/expired');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch expired tickets');
    }
  },

  async generateQRCode(ticketId) {
    try {
      const response = await api.get(`/tickets/${ticketId}/qr`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to generate QR code');
    }
  },
};