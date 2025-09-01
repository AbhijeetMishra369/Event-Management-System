package com.eventmanagement.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.TextIndexed;
import org.springframework.data.mongodb.core.index.Indexed;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "events")
public class Event {
    
    @Id
    private String id;
    
    @TextIndexed
    private String name;
    
    @TextIndexed
    private String description;
    
    private String organizerId;
    private String organizerName;
    private LocalDateTime eventDate;
    private LocalDateTime endDate;
    private String venue;
    private String address;
    private String city;
    private String state;
    private String country;
    private String postalCode;
    private String eventImage;
    private String category;
    private List<String> tags;
    private EventStatus status;
    private boolean isPublished;
    private boolean isFeatured;
    
    // Ticket Types
    private List<TicketType> ticketTypes;
    
    // Event Settings
    private EventSettings settings;
    
    // Analytics
    private EventAnalytics analytics;
    
    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime publishedAt;
    
    public enum EventStatus {
        DRAFT,
        PUBLISHED,
        CANCELLED,
        COMPLETED
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TicketType {
        private String id;
        private String name;
        private String description;
        private BigDecimal price;
        private int totalQuantity;
        private int soldQuantity;
        private int availableQuantity;
        private boolean isActive;
        private LocalDateTime saleStartDate;
        private LocalDateTime saleEndDate;
        private List<String> benefits;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EventSettings {
        private boolean allowWaitlist;
        private boolean requireApproval;
        private boolean allowRefunds;
        private int refundDaysBeforeEvent;
        private boolean sendReminders;
        private int reminderDaysBeforeEvent;
        private boolean allowGroupDiscounts;
        private Map<String, BigDecimal> groupDiscounts;
        private boolean requirePhoneNumber;
        private boolean requireAddress;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EventAnalytics {
        private int totalTicketsSold;
        private BigDecimal totalRevenue;
        private int uniqueAttendees;
        private Map<String, Integer> ticketTypeSales;
        private Map<String, BigDecimal> ticketTypeRevenue;
        private LocalDateTime lastSaleDate;
        private int pageViews;
        private int shares;
    }
    
    public boolean isEventActive() {
        LocalDateTime now = LocalDateTime.now();
        return eventDate != null && eventDate.isAfter(now) && status == EventStatus.PUBLISHED;
    }
    
    public boolean isEventCompleted() {
        return endDate != null && endDate.isBefore(LocalDateTime.now());
    }
    
    public int getTotalAvailableTickets() {
        if (ticketTypes == null) return 0;
        return ticketTypes.stream()
                .filter(TicketType::isActive)
                .mapToInt(TicketType::getAvailableQuantity)
                .sum();
    }
    
    public BigDecimal getTotalRevenue() {
        if (ticketTypes == null) return BigDecimal.ZERO;
        return ticketTypes.stream()
                .map(type -> type.getPrice().multiply(BigDecimal.valueOf(type.getSoldQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}