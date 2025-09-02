package com.eventmanagement.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventRequest {
    
    @NotBlank(message = "Event name is required")
    @Size(max = 200, message = "Event name must be less than 200 characters")
    private String name;
    
    @NotBlank(message = "Event description is required")
    @Size(max = 2000, message = "Event description must be less than 2000 characters")
    private String description;
    
    @NotNull(message = "Event date is required")
    private LocalDateTime eventDate;
    
    @NotNull(message = "Event end date is required")
    private LocalDateTime endDate;
    
    @NotBlank(message = "Venue is required")
    private String venue;
    
    @NotBlank(message = "Address is required")
    private String address;
    
    @NotBlank(message = "City is required")
    private String city;
    
    @NotBlank(message = "State is required")
    private String state;
    
    @NotBlank(message = "Country is required")
    private String country;
    
    private String postalCode;
    private String eventImage;
    private String category;
    private List<String> tags;
    private List<TicketTypeRequest> ticketTypes;
    private EventSettingsRequest settings;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TicketTypeRequest {
        @NotBlank(message = "Ticket type name is required")
        private String name;
        
        private String description;
        
        @NotNull(message = "Price is required")
        private BigDecimal price;
        
        @NotNull(message = "Total quantity is required")
        private Integer totalQuantity;
        
        private LocalDateTime saleStartDate;
        private LocalDateTime saleEndDate;
        private List<String> benefits;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EventSettingsRequest {
        private Boolean allowWaitlist = false;
        private Boolean requireApproval = false;
        private Boolean allowRefunds = true;
        private Integer refundDaysBeforeEvent = 7;
        private Boolean sendReminders = true;
        private Integer reminderDaysBeforeEvent = 1;
        private Boolean allowGroupDiscounts = false;
        private Boolean requirePhoneNumber = false;
        private Boolean requireAddress = false;
    }
}