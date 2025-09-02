package com.eventmanagement.service;

import com.eventmanagement.dto.EventRequest;
import com.eventmanagement.model.User;
import com.eventmanagement.repository.EventRepository;
import com.eventmanagement.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class EventServiceTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private EventService eventService;

    @Test
    public void testCreateEventWithNullTicketType() {
        // Given
        EventRequest eventRequest = new EventRequest();
        eventRequest.setName("Test Event");
        eventRequest.setDescription("Test Description");
        eventRequest.setEventDate(java.time.LocalDateTime.now().plusDays(1));
        eventRequest.setEndDate(java.time.LocalDateTime.now().plusDays(2));
        eventRequest.setVenue("Test Venue");
        eventRequest.setAddress("Test Address");
        eventRequest.setCity("Test City");
        eventRequest.setState("Test State");
        eventRequest.setCountry("Test Country");

        List<EventRequest.TicketTypeRequest> ticketTypes = new ArrayList<>();
        ticketTypes.add(null);
        eventRequest.setTicketTypes(ticketTypes);

        User organizer = new User();
        organizer.setId("organizer-123");
        organizer.setFirstName("Test");
        organizer.setLastName("Organizer");

        when(userRepository.findById("organizer-123")).thenReturn(Optional.of(organizer));
        when(eventRepository.save(any())).thenAnswer(i -> i.getArguments()[0]);

        // When & Then
        // This should not throw a NullPointerException
        eventService.createEvent(eventRequest, "organizer-123");
    }
}
