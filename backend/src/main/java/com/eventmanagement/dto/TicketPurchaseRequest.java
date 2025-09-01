package com.eventmanagement.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketPurchaseRequest {
    
    @NotBlank(message = "Event ID is required")
    private String eventId;
    
    @NotBlank(message = "Ticket type ID is required")
    private String ticketTypeId;
    
    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;
    
    @NotBlank(message = "Attendee name is required")
    private String attendeeName;
    
    @NotBlank(message = "Attendee email is required")
    private String attendeeEmail;
    
    private String attendeePhone;
    private String attendeeAddress;
    private String paymentMethod;
    private String couponCode;
}