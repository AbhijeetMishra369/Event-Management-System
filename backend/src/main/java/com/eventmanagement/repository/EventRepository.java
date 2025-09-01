package com.eventmanagement.repository;

import com.eventmanagement.model.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends MongoRepository<Event, String> {
    
    @Query("{'organizerId': ?0}")
    Page<Event> findByOrganizerId(String organizerId, Pageable pageable);
    
    @Query("{'status': 'PUBLISHED', 'isPublished': true}")
    Page<Event> findPublishedEvents(Pageable pageable);
    
    @Query("{'status': 'PUBLISHED', 'isPublished': true, 'eventDate': {$gte: ?0}}")
    Page<Event> findUpcomingEvents(LocalDateTime now, Pageable pageable);
    
    @Query("{'status': 'PUBLISHED', 'isPublished': true, 'isFeatured': true}")
    List<Event> findFeaturedEvents();
    
    @Query("{'status': 'PUBLISHED', 'isPublished': true, 'category': ?0}")
    Page<Event> findByCategory(String category, Pageable pageable);
    
    @Query("{'status': 'PUBLISHED', 'isPublished': true, 'tags': {$in: ?0}}")
    Page<Event> findByTags(List<String> tags, Pageable pageable);
    
    @Query("{'status': 'PUBLISHED', 'isPublished': true, $text: {$search: ?0}}")
    Page<Event> searchEvents(String searchTerm, Pageable pageable);
    
    @Query("{'status': 'PUBLISHED', 'isPublished': true, 'city': ?0}")
    Page<Event> findByCity(String city, Pageable pageable);
    
    @Query("{'status': 'PUBLISHED', 'isPublished': true, 'eventDate': {$gte: ?0, $lte: ?1}}")
    Page<Event> findEventsByDateRange(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);
    
    @Query("{'status': 'PUBLISHED', 'isPublished': true, 'organizerId': ?0}")
    List<Event> findOrganizerEvents(String organizerId);
    
    @Query("{'organizerId': ?0}")
    List<Event> findByOrganizerId(String organizerId);
    
    @Query("{'status': 'COMPLETED'}")
    List<Event> findCompletedEvents();
    
    @Query("{'status': 'CANCELLED'}")
    List<Event> findCancelledEvents();
    
    @Query("{'status': 'PUBLISHED', 'isPublished': true, 'eventDate': {$lt: ?0}}")
    List<Event> findPastEvents(LocalDateTime now);
}