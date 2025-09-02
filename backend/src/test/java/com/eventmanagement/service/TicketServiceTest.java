package com.eventmanagement.service;

import com.eventmanagement.dto.TicketPurchaseRequest;
import com.eventmanagement.model.Event;
import com.eventmanagement.model.User;
import com.eventmanagement.repository.EventRepository;
import com.eventmanagement.repository.TicketRepository;
import com.eventmanagement.repository.UserRepository;
import com.eventmanagement.util.QRCodeGenerator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

public class TicketServiceTest {

    @InjectMocks
    private TicketService ticketService;

    @Mock
    private EventRepository eventRepository;

    @Mock
    private TicketRepository ticketRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private QRCodeGenerator qrCodeGenerator;

    @Mock
    private EmailService emailService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testPurchaseTickets_shouldThrowExceptionWhenSalesHaveEnded() {
        // Arrange
        String eventId = "eventId";
        String ticketTypeId = "ticketTypeId";
        String attendeeId = "attendeeId";

        Event.TicketType ticketType = new Event.TicketType();
        ticketType.setId(ticketTypeId);
        ticketType.setSaleEndDate(LocalDateTime.now().minusDays(1)); // Sales ended yesterday
        ticketType.setAvailableQuantity(10);
        ticketType.setActive(true);

        List<Event.TicketType> ticketTypes = new ArrayList<>();
        ticketTypes.add(ticketType);

        Event event = new Event();
        event.setId(eventId);
        event.setTicketTypes(ticketTypes);

        User user = new User();
        user.setId(attendeeId);

        TicketPurchaseRequest request = new TicketPurchaseRequest();
        request.setEventId(eventId);
        request.setTicketTypeId(ticketTypeId);
        request.setQuantity(1);

        when(eventRepository.findById(eventId)).thenReturn(Optional.of(event));
        when(userRepository.findById(attendeeId)).thenReturn(Optional.of(user));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            ticketService.purchaseTickets(request, attendeeId);
        });
    }
}
