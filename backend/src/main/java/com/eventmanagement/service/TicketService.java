package com.eventmanagement.service;

import com.eventmanagement.dto.TicketPurchaseRequest;
import com.eventmanagement.model.Event;
import com.eventmanagement.model.Ticket;
import com.eventmanagement.model.User;
import com.eventmanagement.repository.EventRepository;
import com.eventmanagement.repository.TicketRepository;
import com.eventmanagement.repository.UserRepository;
import com.eventmanagement.util.QRCodeGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TicketService {
    
    @Autowired
    private TicketRepository ticketRepository;
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private QRCodeGenerator qrCodeGenerator;
    
    public List<Ticket> purchaseTickets(TicketPurchaseRequest request, String attendeeId) {
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        Event.TicketType ticketType = event.getTicketTypes().stream()
                .filter(type -> type.getId().equals(request.getTicketTypeId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Ticket type not found"));
        
        if (!ticketType.isActive()) {
            throw new RuntimeException("Ticket type is not active");
        }
        
        if (ticketType.getAvailableQuantity() < request.getQuantity()) {
            throw new RuntimeException("Not enough tickets available");
        }
        
        // Update ticket availability
        ticketType.setSoldQuantity(ticketType.getSoldQuantity() + request.getQuantity());
        ticketType.setAvailableQuantity(ticketType.getAvailableQuantity() - request.getQuantity());
        eventRepository.save(event);
        
        // Create tickets
        List<Ticket> tickets = new java.util.ArrayList<>();
        for (int i = 0; i < request.getQuantity(); i++) {
            Ticket ticket = new Ticket(
                event.getId(),
                event.getName(),
                event.getEventDate().toString(),
                event.getVenue(),
                ticketType.getId(),
                ticketType.getName(),
                ticketType.getPrice(),
                attendeeId,
                request.getAttendeeName(),
                request.getAttendeeEmail()
            );
            
            ticket.setAttendeePhone(request.getAttendeePhone());
            ticket.setPaymentStatus(Ticket.PaymentStatus.COMPLETED);
            ticket.setPaymentMethod(request.getPaymentMethod());
            
            // Generate QR code
            String qrCodeData = ticket.getTicketNumber() + "|" + event.getId() + "|" + attendeeId;
            ticket.setQrCode(qrCodeGenerator.generateQRCode(qrCodeData));
            
            tickets.add(ticketRepository.save(ticket));
        }
        
        return tickets;
    }
    
    public Optional<Ticket> getTicketById(String ticketId) {
        return ticketRepository.findById(ticketId);
    }
    
    public Optional<Ticket> getTicketByNumber(String ticketNumber) {
        return ticketRepository.findByTicketNumber(ticketNumber);
    }
    
    public Optional<Ticket> getTicketByQRCode(String qrCode) {
        return ticketRepository.findByQrCode(qrCode);
    }
    
    public Page<Ticket> getTicketsByAttendee(String attendeeId, Pageable pageable) {
        return ticketRepository.findByAttendeeId(attendeeId, pageable);
    }
    
    public List<Ticket> getTicketsByEvent(String eventId) {
        return ticketRepository.findByEventId(eventId);
    }
    
    public List<Ticket> getActiveTicketsByEvent(String eventId) {
        return ticketRepository.findActiveTicketsByEventId(eventId);
    }
    
    public List<Ticket> getUsedTicketsByEvent(String eventId) {
        return ticketRepository.findUsedTicketsByEventId(eventId);
    }
    
    public boolean validateTicket(String ticketNumber, String validatedBy) {
        Optional<Ticket> ticketOpt = ticketRepository.findByTicketNumber(ticketNumber);
        if (ticketOpt.isEmpty()) {
            return false;
        }
        
        Ticket ticket = ticketOpt.get();
        if (!ticket.isValid()) {
            return false;
        }
        
        ticket.markAsUsed(validatedBy);
        ticketRepository.save(ticket);
        return true;
    }
    
    public boolean validateTicketByQR(String qrCode, String validatedBy) {
        Optional<Ticket> ticketOpt = ticketRepository.findByQrCode(qrCode);
        if (ticketOpt.isEmpty()) {
            return false;
        }
        
        Ticket ticket = ticketOpt.get();
        if (!ticket.isValid()) {
            return false;
        }
        
        ticket.markAsUsed(validatedBy);
        ticketRepository.save(ticket);
        return true;
    }
    
    public boolean requestRefund(String ticketId, String reason, String attendeeId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        
        if (!ticket.getAttendeeId().equals(attendeeId)) {
            throw new RuntimeException("Unauthorized to request refund for this ticket");
        }
        
        if (!ticket.canBeRefunded()) {
            throw new RuntimeException("Ticket cannot be refunded");
        }
        
        ticket.requestRefund(reason);
        ticketRepository.save(ticket);
        return true;
    }
    
    public boolean processRefund(String ticketId, String organizerId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        
        Event event = eventRepository.findById(ticket.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        if (!event.getOrganizerId().equals(organizerId)) {
            throw new RuntimeException("Unauthorized to process refund");
        }
        
        if (!ticket.isRefundRequested()) {
            throw new RuntimeException("Ticket has not been requested for refund");
        }
        
        ticket.processRefund(ticket.getPrice());
        ticketRepository.save(ticket);
        
        // Update event ticket availability
        Event.TicketType ticketType = event.getTicketTypes().stream()
                .filter(type -> type.getId().equals(ticket.getTicketTypeId()))
                .findFirst()
                .orElse(null);
        
        if (ticketType != null) {
            ticketType.setSoldQuantity(ticketType.getSoldQuantity() - 1);
            ticketType.setAvailableQuantity(ticketType.getAvailableQuantity() + 1);
            eventRepository.save(event);
        }
        
        return true;
    }
    
    public List<Ticket> getRefundRequestedTickets() {
        return ticketRepository.findRefundRequestedTickets();
    }
    
    public List<Ticket> getExpiredTickets() {
        return ticketRepository.findExpiredTickets(LocalDateTime.now());
    }
    
    public String generateQRCode(String ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        
        String qrCodeData = ticket.getTicketNumber() + "|" + ticket.getEventId() + "|" + ticket.getAttendeeId();
        return qrCodeGenerator.generateQRCode(qrCodeData);
    }
}