import React, { createContext, useContext, useState, useCallback } from 'react';
import { eventService } from '../services/eventService';

const EventContext = createContext();

export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await eventService.getEvents(params);
      setEvents(data.content || data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch events');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFeaturedEvents = useCallback(async () => {
    try {
      setError(null);
      const data = await eventService.getFeaturedEvents();
      setFeaturedEvents(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to fetch featured events');
      throw err;
    }
  }, []);

  const createEvent = useCallback(async (eventData) => {
    try {
      setLoading(true);
      setError(null);
      const newEvent = await eventService.createEvent(eventData);
      setEvents(prev => [newEvent, ...prev]);
      return newEvent;
    } catch (err) {
      setError(err.message || 'Failed to create event');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEvent = useCallback(async (eventId, eventData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedEvent = await eventService.updateEvent(eventId, eventData);
      setEvents(prev => prev.map(event => 
        event.id === eventId ? updatedEvent : event
      ));
      return updatedEvent;
    } catch (err) {
      setError(err.message || 'Failed to update event');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteEvent = useCallback(async (eventId) => {
    try {
      setLoading(true);
      setError(null);
      await eventService.deleteEvent(eventId);
      setEvents(prev => prev.filter(event => event.id !== eventId));
    } catch (err) {
      setError(err.message || 'Failed to delete event');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const publishEvent = useCallback(async (eventId) => {
    try {
      setError(null);
      const publishedEvent = await eventService.publishEvent(eventId);
      setEvents(prev => prev.map(event => 
        event.id === eventId ? publishedEvent : event
      ));
      return publishedEvent;
    } catch (err) {
      setError(err.message || 'Failed to publish event');
      throw err;
    }
  }, []);

  const cancelEvent = useCallback(async (eventId) => {
    try {
      setError(null);
      const cancelledEvent = await eventService.cancelEvent(eventId);
      setEvents(prev => prev.map(event => 
        event.id === eventId ? cancelledEvent : event
      ));
      return cancelledEvent;
    } catch (err) {
      setError(err.message || 'Failed to cancel event');
      throw err;
    }
  }, []);

  const searchEvents = useCallback(async (query, params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await eventService.searchEvents(query, params);
      setEvents(data.content || data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to search events');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getEventById = useCallback(async (eventId) => {
    try {
      setError(null);
      return await eventService.getEventById(eventId);
    } catch (err) {
      setError(err.message || 'Failed to fetch event');
      throw err;
    }
  }, []);

  const value = {
    events,
    featuredEvents,
    loading,
    error,
    fetchEvents,
    fetchFeaturedEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    publishEvent,
    cancelEvent,
    searchEvents,
    getEventById,
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};