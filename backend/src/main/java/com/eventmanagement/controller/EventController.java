package com.eventmanagement.controller;

import com.eventmanagement.dto.EventRequest;
import com.eventmanagement.model.Event;
import com.eventmanagement.model.User;
import com.eventmanagement.repository.UserRepository;
import com.eventmanagement.service.EventService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
@CrossOrigin(origins = "*")
public class EventController {
    
    @Autowired
    private EventService eventService;

    @Autowired
    private UserRepository userRepository;
    
    // Public endpoints
    @GetMapping("/public")
    public ResponseEntity<Page<Event>> getPublishedEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(eventService.getPublishedEvents(pageable));
    }
    
    @GetMapping("/public/upcoming")
    public ResponseEntity<Page<Event>> getUpcomingEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(eventService.getUpcomingEvents(pageable));
    }
    
    @GetMapping("/public/featured")
    public ResponseEntity<List<Event>> getFeaturedEvents() {
        return ResponseEntity.ok(eventService.getFeaturedEvents());
    }
    
    @GetMapping("/public/search")
    public ResponseEntity<Page<Event>> searchEvents(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(eventService.searchEvents(query, pageable));
    }
    
    @GetMapping("/public/category/{category}")
    public ResponseEntity<Page<Event>> getEventsByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(eventService.getEventsByCategory(category, pageable));
    }
    
    @GetMapping("/public/city/{city}")
    public ResponseEntity<Page<Event>> getEventsByCity(
            @PathVariable String city,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(eventService.getEventsByCity(city, pageable));
    }
    
    @GetMapping("/public/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable String id) {
        return eventService.getEventById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Protected endpoints
    @PostMapping
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<Event> createEvent(@Valid @RequestBody EventRequest eventRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String organizerEmail = authentication.getName();
        
        Event event = eventService.createEvent(eventRequest, organizerEmail);
        return ResponseEntity.ok(event);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<Event> updateEvent(
            @PathVariable String id,
            @Valid @RequestBody EventRequest eventRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String organizerEmail = authentication.getName();
        User user = userRepository.findByEmail(organizerEmail).orElseThrow(() -> new RuntimeException("User not found"));
        
        try {
            Event event = eventService.updateEvent(id, eventRequest, user.getId());
            return ResponseEntity.ok(event);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/{id}/publish")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<Event> publishEvent(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String organizerEmail = authentication.getName();
        User user = userRepository.findByEmail(organizerEmail).orElseThrow(() -> new RuntimeException("User not found"));
        
        try {
            Event event = eventService.publishEvent(id, user.getId());
            return ResponseEntity.ok(event);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<Event> cancelEvent(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String organizerEmail = authentication.getName();
        User user = userRepository.findByEmail(organizerEmail).orElseThrow(() -> new RuntimeException("User not found"));
        
        try {
            Event event = eventService.cancelEvent(id, user.getId());
            return ResponseEntity.ok(event);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<Void> deleteEvent(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String organizerEmail = authentication.getName();
        User user = userRepository.findByEmail(organizerEmail).orElseThrow(() -> new RuntimeException("User not found"));
        
        try {
            eventService.deleteEvent(id, user.getId());
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/organizer")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public ResponseEntity<Page<Event>> getOrganizerEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String organizerEmail = authentication.getName();
        User user = userRepository.findByEmail(organizerEmail).orElseThrow(() -> new RuntimeException("User not found"));
        
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(eventService.getOrganizerEvents(user.getId(), pageable));
    }
    
    @PostMapping("/{id}/feature")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Event> toggleFeatured(@PathVariable String id) {
        try {
            Event event = eventService.toggleFeatured(id);
            return ResponseEntity.ok(event);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}