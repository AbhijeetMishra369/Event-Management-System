import api from './api';

export const analyticsService = {
  async getOrganizerOverview() {
    const { data } = await api.get('/analytics/organizer/overview');
    return data;
  },
  async getEventMetrics(eventId) {
    const { data } = await api.get(`/analytics/event/${eventId}`);
    return data;
  }
};