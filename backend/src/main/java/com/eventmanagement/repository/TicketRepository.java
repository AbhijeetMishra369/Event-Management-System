package com.eventmanagement.repository;

import com.eventmanagement.model.Ticket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {
    
    Optional<Ticket> findByTicketNumber(String ticketNumber);
    
    Optional<Ticket> findByQrCode(String qrCode);
    
    @Query("{'attendeeId': ?0}")
    Page<Ticket> findByAttendeeId(String attendeeId, Pageable pageable);
    
    @Query("{'eventId': ?0}")
    List<Ticket> findByEventId(String eventId);
    
    @Query("{'eventId': ?0, 'status': 'ACTIVE'}")
    List<Ticket> findActiveTicketsByEventId(String eventId);
    
    @Query("{'eventId': ?0, 'status': 'USED'}")
    List<Ticket> findUsedTicketsByEventId(String eventId);
    
    @Query("{'attendeeEmail': ?0}")
    List<Ticket> findByAttendeeEmail(String attendeeEmail);
    
    @Query("{'status': 'ACTIVE'}")
    List<Ticket> findActiveTickets();
    
    @Query("{'status': 'USED'}")
    List<Ticket> findUsedTickets();
    
    @Query("{'status': 'REFUNDED'}")
    List<Ticket> findRefundedTickets();
    
    @Query("{'purchaseDate': {$gte: ?0, $lte: ?1}}")
    List<Ticket> findByPurchaseDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("{'validatedAt': {$gte: ?0, $lte: ?1}}")
    List<Ticket> findByValidationDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    @Query("{'paymentStatus': 'COMPLETED'}")
    List<Ticket> findPaidTickets();
    
    @Query("{'paymentStatus': 'PENDING'}")
    List<Ticket> findPendingPaymentTickets();
    
    @Query("{'refundRequested': true}")
    List<Ticket> findRefundRequestedTickets();
    
    @Query("{'eventId': ?0, 'ticketTypeId': ?1}")
    List<Ticket> findByEventIdAndTicketTypeId(String eventId, String ticketTypeId);
    
    @Query("{'eventId': ?0, 'ticketTypeId': ?1, 'status': 'ACTIVE'}")
    List<Ticket> findActiveTicketsByEventAndType(String eventId, String ticketTypeId);
    
    @Query("{'validatedBy': ?0}")
    List<Ticket> findByValidatedBy(String validatedBy);
    
    @Query("{'status': 'ACTIVE', 'eventDate': {$lt: ?0}}")
    List<Ticket> findExpiredTickets(LocalDateTime now);
    
    @Query("{'status': 'ACTIVE', 'paymentStatus': 'COMPLETED'}")
    List<Ticket> findValidTickets();
}