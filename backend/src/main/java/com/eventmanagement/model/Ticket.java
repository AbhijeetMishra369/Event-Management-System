package com.eventmanagement.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tickets")
public class Ticket {
    
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String ticketNumber;
    
    private String eventId;
    private String eventName;
    private String eventDate;
    private String eventVenue;
    private String ticketTypeId;
    private String ticketTypeName;
    private BigDecimal price;
    private String attendeeId;
    private String attendeeName;
    private String attendeeEmail;
    private String attendeePhone;
    private String qrCode;
    private TicketStatus status;
    private LocalDateTime purchaseDate;
    private LocalDateTime validatedAt;
    private String validatedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Payment Information
    private String paymentId;
    private String paymentMethod;
    private PaymentStatus paymentStatus;
    
    // Refund Information
    private boolean refundRequested;
    private LocalDateTime refundRequestedAt;
    private LocalDateTime refundedAt;
    private BigDecimal refundAmount;
    private String refundReason;
    
    public enum TicketStatus {
        ACTIVE,
        USED,
        CANCELLED,
        REFUNDED,
        EXPIRED
    }
    
    public enum PaymentStatus {
        PENDING,
        COMPLETED,
        FAILED,
        REFUNDED
    }
    
    public Ticket(String eventId, String eventName, String eventDate, String eventVenue,
                 String ticketTypeId, String ticketTypeName, BigDecimal price,
                 String attendeeId, String attendeeName, String attendeeEmail) {
        this.id = UUID.randomUUID().toString();
        this.ticketNumber = generateTicketNumber();
        this.eventId = eventId;
        this.eventName = eventName;
        this.eventDate = eventDate;
        this.eventVenue = eventVenue;
        this.ticketTypeId = ticketTypeId;
        this.ticketTypeName = ticketTypeName;
        this.price = price;
        this.attendeeId = attendeeId;
        this.attendeeName = attendeeName;
        this.attendeeEmail = attendeeEmail;
        this.status = TicketStatus.ACTIVE;
        this.paymentStatus = PaymentStatus.PENDING;
        this.purchaseDate = LocalDateTime.now();
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.qrCode = generateQRCode();
    }
    
    private String generateTicketNumber() {
        return "TKT-" + System.currentTimeMillis() + "-" + 
               UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    
    private String generateQRCode() {
        // This will be replaced with actual QR code generation logic
        return this.ticketNumber + "|" + this.eventId + "|" + this.attendeeId;
    }
    
    public boolean isValid() {
        return status == TicketStatus.ACTIVE && 
               paymentStatus == PaymentStatus.COMPLETED &&
               !isExpired();
    }
    
    public boolean isExpired() {
        // Check if event date has passed
        LocalDateTime eventDateTime = LocalDateTime.parse(eventDate);
        return eventDateTime.isBefore(LocalDateTime.now());
    }
    
    public boolean canBeRefunded() {
        LocalDateTime eventDateTime = LocalDateTime.parse(eventDate);
        LocalDateTime refundDeadline = eventDateTime.minusDays(7); // 7 days before event
        return status == TicketStatus.ACTIVE && 
               paymentStatus == PaymentStatus.COMPLETED &&
               LocalDateTime.now().isBefore(refundDeadline);
    }
    
    public void markAsUsed(String validatedBy) {
        this.status = TicketStatus.USED;
        this.validatedAt = LocalDateTime.now();
        this.validatedBy = validatedBy;
        this.updatedAt = LocalDateTime.now();
    }
    
    public void requestRefund(String reason) {
        this.refundRequested = true;
        this.refundRequestedAt = LocalDateTime.now();
        this.refundReason = reason;
        this.updatedAt = LocalDateTime.now();
    }
    
    public void processRefund(BigDecimal refundAmount) {
        this.status = TicketStatus.REFUNDED;
        this.paymentStatus = PaymentStatus.REFUNDED;
        this.refundedAt = LocalDateTime.now();
        this.refundAmount = refundAmount;
        this.updatedAt = LocalDateTime.now();
    }
}