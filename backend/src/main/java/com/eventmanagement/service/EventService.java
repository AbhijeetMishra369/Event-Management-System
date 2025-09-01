package com.eventmanagement.service;

import com.eventmanagement.dto.EventRequest;
import com.eventmanagement.model.Event;
import com.eventmanagement.model.User;
import com.eventmanagement.repository.EventRepository;
import com.eventmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class EventService {
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public Event createEvent(EventRequest eventRequest, String organizerId) {
        User organizer = userRepository.findById(organizerId)
                .orElseThrow(() -> new RuntimeException("Organizer not found"));
        
        Event event = new Event();
        event.setId(UUID.randomUUID().toString());
        event.setName(eventRequest.getName());
        event.setDescription(eventRequest.getDescription());
        event.setEventDate(eventRequest.getEventDate());
        event.setEndDate(eventRequest.getEndDate());
        event.setVenue(eventRequest.getVenue());
        event.setAddress(eventRequest.getAddress());
        event.setCity(eventRequest.getCity());
        event.setState(eventRequest.getState());
        event.setCountry(eventRequest.getCountry());
        event.setPostalCode(eventRequest.getPostalCode());
        event.setEventImage(eventRequest.getEventImage());
        event.setCategory(eventRequest.getCategory());
        event.setTags(eventRequest.getTags());
        event.setOrganizerId(organizerId);
        event.setOrganizerName(organizer.getFullName());
        event.setStatus(Event.EventStatus.DRAFT);
        event.setPublished(false);
        event.setFeatured(false);
        event.setCreatedAt(LocalDateTime.now());
        event.setUpdatedAt(LocalDateTime.now());
        
        // Convert ticket types
        if (eventRequest.getTicketTypes() != null) {
            event.setTicketTypes(eventRequest.getTicketTypes().stream()
                    .map(this::convertToTicketType)
                    .collect(java.util.stream.Collectors.toList()));
        }
        
        // Set default settings
        if (eventRequest.getSettings() != null) {
            event.setSettings(convertToEventSettings(eventRequest.getSettings()));
        } else {
            event.setSettings(new Event.EventSettings());
        }
        
        // Initialize analytics
        event.setAnalytics(new Event.EventAnalytics());
        
        return eventRepository.save(event);
    }
    
    public Event updateEvent(String eventId, EventRequest eventRequest, String organizerId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        if (!event.getOrganizerId().equals(organizerId)) {
            throw new RuntimeException("Unauthorized to update this event");
        }
        
        event.setName(eventRequest.getName());
        event.setDescription(eventRequest.getDescription());
        event.setEventDate(eventRequest.getEventDate());
        event.setEndDate(eventRequest.getEndDate());
        event.setVenue(eventRequest.getVenue());
        event.setAddress(eventRequest.getAddress());
        event.setCity(eventRequest.getCity());
        event.setState(eventRequest.getState());
        event.setCountry(eventRequest.getCountry());
        event.setPostalCode(eventRequest.getPostalCode());
        event.setEventImage(eventRequest.getEventImage());
        event.setCategory(eventRequest.getCategory());
        event.setTags(eventRequest.getTags());
        event.setUpdatedAt(LocalDateTime.now());
        
        if (eventRequest.getTicketTypes() != null) {
            event.setTicketTypes(eventRequest.getTicketTypes().stream()
                    .map(this::convertToTicketType)
                    .collect(java.util.stream.Collectors.toList()));
        }
        
        if (eventRequest.getSettings() != null) {
            event.setSettings(convertToEventSettings(eventRequest.getSettings()));
        }
        
        return eventRepository.save(event);
    }
    
    public Event publishEvent(String eventId, String organizerId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        if (!event.getOrganizerId().equals(organizerId)) {
            throw new RuntimeException("Unauthorized to publish this event");
        }
        
        event.setStatus(Event.EventStatus.PUBLISHED);
        event.setPublished(true);
        event.setPublishedAt(LocalDateTime.now());
        event.setUpdatedAt(LocalDateTime.now());
        
        return eventRepository.save(event);
    }
    
    public Event cancelEvent(String eventId, String organizerId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        if (!event.getOrganizerId().equals(organizerId)) {
            throw new RuntimeException("Unauthorized to cancel this event");
        }
        
        event.setStatus(Event.EventStatus.CANCELLED);
        event.setUpdatedAt(LocalDateTime.now());
        
        return eventRepository.save(event);
    }
    
    public Optional<Event> getEventById(String eventId) {
        return eventRepository.findById(eventId);
    }
    
    public Page<Event> getPublishedEvents(Pageable pageable) {
        return eventRepository.findPublishedEvents(pageable);
    }
    
    public Page<Event> getUpcomingEvents(Pageable pageable) {
        return eventRepository.findUpcomingEvents(LocalDateTime.now(), pageable);
    }
    
    public List<Event> getFeaturedEvents() {
        return eventRepository.findFeaturedEvents();
    }
    
    public Page<Event> getEventsByCategory(String category, Pageable pageable) {
        return eventRepository.findByCategory(category, pageable);
    }
    
    public Page<Event> getEventsByCity(String city, Pageable pageable) {
        return eventRepository.findByCity(city, pageable);
    }
    
    public Page<Event> searchEvents(String searchTerm, Pageable pageable) {
        return eventRepository.searchEvents(searchTerm, pageable);
    }
    
    public Page<Event> getOrganizerEvents(String organizerId, Pageable pageable) {
        return eventRepository.findByOrganizerId(organizerId, pageable);
    }
    
    public List<Event> getCompletedEvents() {
        return eventRepository.findCompletedEvents();
    }
    
    public List<Event> getCancelledEvents() {
        return eventRepository.findCancelledEvents();
    }
    
    public void deleteEvent(String eventId, String organizerId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        if (!event.getOrganizerId().equals(organizerId)) {
            throw new RuntimeException("Unauthorized to delete this event");
        }
        
        eventRepository.delete(event);
    }
    
    public Event toggleFeatured(String eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        event.setFeatured(!event.isFeatured());
        event.setUpdatedAt(LocalDateTime.now());
        
        return eventRepository.save(event);
    }
    
    private Event.TicketType convertToTicketType(EventRequest.TicketTypeRequest request) {
        Event.TicketType ticketType = new Event.TicketType();
        ticketType.setId(UUID.randomUUID().toString());
        ticketType.setName(request.getName());
        ticketType.setDescription(request.getDescription());
        ticketType.setPrice(request.getPrice());
        ticketType.setTotalQuantity(request.getTotalQuantity());
        ticketType.setSoldQuantity(0);
        ticketType.setAvailableQuantity(request.getTotalQuantity());
        ticketType.setActive(true);
        ticketType.setSaleStartDate(request.getSaleStartDate());
        ticketType.setSaleEndDate(request.getSaleEndDate());
        ticketType.setBenefits(request.getBenefits());
        return ticketType;
    }
    
    private Event.EventSettings convertToEventSettings(EventRequest.EventSettingsRequest request) {
        Event.EventSettings settings = new Event.EventSettings();
        settings.setAllowWaitlist(request.getAllowWaitlist());
        settings.setRequireApproval(request.getRequireApproval());
        settings.setAllowRefunds(request.getAllowRefunds());
        settings.setRefundDaysBeforeEvent(request.getRefundDaysBeforeEvent());
        settings.setSendReminders(request.getSendReminders());
        settings.setReminderDaysBeforeEvent(request.getReminderDaysBeforeEvent());
        settings.setAllowGroupDiscounts(request.getAllowGroupDiscounts());
        settings.setRequirePhoneNumber(request.getRequirePhoneNumber());
        settings.setRequireAddress(request.getRequireAddress());
        return settings;
    }
}