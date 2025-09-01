import api from './api';

export const eventService = {
  async getPublishedEvents(page = 0, size = 10) {
    try {
      const response = await api.get('/events/public', { 
        params: { page, size } 
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch events');
    }
  },

  async getEvents(params = {}) {
    try {
      const response = await api.get('/events/public', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch events');
    }
  },

  async getFeaturedEvents() {
    try {
      const response = await api.get('/events/public/featured');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch featured events');
    }
  },

  async getUpcomingEvents(params = {}) {
    try {
      const response = await api.get('/events/public/upcoming', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch upcoming events');
    }
  },

  async searchEvents(query, page = 0, size = 10) {
    try {
      const response = await api.get('/events/public/search', {
        params: { query, page, size }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to search events');
    }
  },

  async getEventsByCategory(category, params = {}) {
    try {
      const response = await api.get(`/events/public/category/${category}`, { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch events by category');
    }
  },

  async getEventsByCity(city, params = {}) {
    try {
      const response = await api.get(`/events/public/city/${city}`, { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch events by city');
    }
  },

  async getEventById(id) {
    try {
      const response = await api.get(`/events/public/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch event');
    }
  },

  async createEvent(eventData) {
    try {
      const response = await api.post('/events', eventData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create event');
    }
  },

  async updateEvent(id, eventData) {
    try {
      const response = await api.put(`/events/${id}`, eventData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update event');
    }
  },

  async deleteEvent(id) {
    try {
      const response = await api.delete(`/events/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete event');
    }
  },

  async publishEvent(id) {
    try {
      const response = await api.post(`/events/${id}/publish`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to publish event');
    }
  },

  async cancelEvent(id) {
    try {
      const response = await api.post(`/events/${id}/cancel`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to cancel event');
    }
  },

  async getOrganizerEvents(params = {}) {
    try {
      const response = await api.get('/events/organizer', { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch organizer events');
    }
  },

  async toggleFeatured(id) {
    try {
      const response = await api.post(`/events/${id}/feature`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to toggle featured status');
    }
  },
};