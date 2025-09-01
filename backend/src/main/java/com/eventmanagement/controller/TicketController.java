package com.eventmanagement.controller;

import com.eventmanagement.dto.TicketPurchaseRequest;
import com.eventmanagement.model.Ticket;
import com.eventmanagement.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/tickets")
@CrossOrigin(origins = "*")
public class TicketController {
    
    @Autowired
    private TicketService ticketService;
    
    @PostMapping("/purchase")
    public ResponseEntity<List<Ticket>> purchaseTickets(@Valid @RequestBody TicketPurchaseRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String attendeeId = authentication.getName();
        
        try {
            List<Ticket> tickets = ticketService.purchaseTickets(request, attendeeId);
            return ResponseEntity.ok(tickets);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping
    public ResponseEntity<Page<Ticket>> getUserTickets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String attendeeId = authentication.getName();
        
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(ticketService.getTicketsByAttendee(attendeeId, pageable));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable String id) {
        return ticketService.getTicketById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/number/{ticketNumber}")
    public ResponseEntity<Ticket> getTicketByNumber(@PathVariable String ticketNumber) {
        return ticketService.getTicketByNumber(ticketNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Ticket>> getTicketsByEvent(@PathVariable String eventId) {
        return ResponseEntity.ok(ticketService.getTicketsByEvent(eventId));
    }
    
    @GetMapping("/event/{eventId}/active")
    public ResponseEntity<List<Ticket>> getActiveTicketsByEvent(@PathVariable String eventId) {
        return ResponseEntity.ok(ticketService.getActiveTicketsByEvent(eventId));
    }
    
    @GetMapping("/event/{eventId}/used")
    public ResponseEntity<List<Ticket>> getUsedTicketsByEvent(@PathVariable String eventId) {
        return ResponseEntity.ok(ticketService.getUsedTicketsByEvent(eventId));
    }
    
    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateTicket(@RequestBody Map<String, String> request) {
        String ticketNumber = request.get("ticketNumber");
        String qrCode = request.get("qrCode");
        String validatedBy = request.get("validatedBy");
        
        boolean isValid = false;
        String message = "Invalid ticket";
        
        if (ticketNumber != null) {
            isValid = ticketService.validateTicket(ticketNumber, validatedBy);
        } else if (qrCode != null) {
            isValid = ticketService.validateTicketByQR(qrCode, validatedBy);
        }
        
        if (isValid) {
            message = "Ticket validated successfully";
        }
        
        return ResponseEntity.ok(Map.of(
            "valid", isValid,
            "message", message
        ));
    }
    
    @PostMapping("/{id}/refund-request")
    public ResponseEntity<Boolean> requestRefund(
            @PathVariable String id,
            @RequestBody Map<String, String> request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String attendeeId = authentication.getName();
        String reason = request.get("reason");
        
        try {
            boolean success = ticketService.requestRefund(id, reason, attendeeId);
            return ResponseEntity.ok(success);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/{id}/refund-process")
    public ResponseEntity<Boolean> processRefund(@PathVariable String id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String organizerId = authentication.getName();
        
        try {
            boolean success = ticketService.processRefund(id, organizerId);
            return ResponseEntity.ok(success);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/refund-requests")
    public ResponseEntity<List<Ticket>> getRefundRequestedTickets() {
        return ResponseEntity.ok(ticketService.getRefundRequestedTickets());
    }
    
    @GetMapping("/expired")
    public ResponseEntity<List<Ticket>> getExpiredTickets() {
        return ResponseEntity.ok(ticketService.getExpiredTickets());
    }
    
    @GetMapping("/{id}/qr")
    public ResponseEntity<Map<String, String>> generateQRCode(@PathVariable String id) {
        try {
            String qrCode = ticketService.generateQRCode(id);
            return ResponseEntity.ok(Map.of("qrCode", qrCode));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}