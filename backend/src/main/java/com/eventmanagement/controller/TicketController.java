package com.eventmanagement.controller;

import com.eventmanagement.model.Event;
import com.eventmanagement.model.Ticket;
import com.eventmanagement.repository.EventRepository;
import com.eventmanagement.service.PaymentService;
import com.eventmanagement.service.TicketService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/tickets")
@CrossOrigin
public class TicketController {
	private final TicketService ticketService;
	private final PaymentService paymentService;
	private final EventRepository eventRepository;

	public TicketController(TicketService ticketService, PaymentService paymentService, EventRepository eventRepository) {
		this.ticketService = ticketService;
		this.paymentService = paymentService;
		this.eventRepository = eventRepository;
	}

	// Validate by ticket number or QR
	@PostMapping("/validate")
	public ResponseEntity<Map<String, Object>> validate(@RequestBody Map<String, String> body,
			@AuthenticationPrincipal UserDetails user) {
		String ticketNumber = body.get("ticketNumber");
		String qrCode = body.get("qrCode");
		boolean valid;
		if (ticketNumber != null && !ticketNumber.isEmpty()) {
			valid = ticketService.validateTicket(ticketNumber, user != null ? user.getUsername() : "system");
		} else if (qrCode != null && !qrCode.isEmpty()) {
			valid = ticketService.validateTicketByQR(qrCode, user != null ? user.getUsername() : "system");
		} else {
			return ResponseEntity.badRequest().body(Map.of("valid", false, "message", "Provide ticketNumber or qrCode"));
		}
		Map<String, Object> res = new HashMap<>();
		res.put("valid", valid);
		res.put("message", valid ? "Ticket valid" : "Invalid or already used ticket");
		return ResponseEntity.ok(res);
	}

	// Current user's tickets
	@GetMapping
	public ResponseEntity<Page<Ticket>> getUserTickets(@AuthenticationPrincipal UserDetails user,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "12") int size) {
		Pageable pageable = PageRequest.of(page, size);
		return ResponseEntity.ok(ticketService.getTicketsByAttendee(user.getUsername(), pageable));
	}

	// Tickets by event (organizer view)
	@GetMapping("/event/{eventId}")
	@PreAuthorize("hasAnyRole('ORGANIZER','ADMIN')")
	public ResponseEntity<List<Ticket>> getTicketsByEvent(@PathVariable String eventId) {
		return ResponseEntity.ok(ticketService.getTicketsByEvent(eventId));
	}

	@GetMapping("/event/{eventId}/active")
	@PreAuthorize("hasAnyRole('ORGANIZER','ADMIN')")
	public ResponseEntity<List<Ticket>> getActiveTicketsByEvent(@PathVariable String eventId) {
		return ResponseEntity.ok(ticketService.getActiveTicketsByEvent(eventId));
	}

	@GetMapping("/event/{eventId}/used")
	@PreAuthorize("hasAnyRole('ORGANIZER','ADMIN')")
	public ResponseEntity<List<Ticket>> getUsedTicketsByEvent(@PathVariable String eventId) {
		return ResponseEntity.ok(ticketService.getUsedTicketsByEvent(eventId));
	}

	// Refund request by attendee
	@PostMapping("/{ticketId}/refund-request")
	public ResponseEntity<?> requestRefund(@PathVariable String ticketId, @RequestBody Map<String, String> body,
			@AuthenticationPrincipal UserDetails user) {
		String reason = body.getOrDefault("reason", "");
		boolean ok = ticketService.requestRefund(ticketId, reason, user.getUsername());
		return ok ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
	}

	// Refund process by organizer
	@PostMapping("/{ticketId}/refund-process")
	@PreAuthorize("hasAnyRole('ORGANIZER','ADMIN')")
	public ResponseEntity<?> processRefund(@PathVariable String ticketId, @AuthenticationPrincipal UserDetails user) throws Exception {
		Ticket ticket = ticketService.getTicketById(ticketId).orElseThrow(() -> new RuntimeException("Ticket not found"));
		paymentService.refundPaymentForTicket(ticket);
		boolean ok = ticketService.processRefund(ticketId, user.getUsername());
		return ok ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
	}

	// Refund requests listing
	@GetMapping("/refund-requests")
	@PreAuthorize("hasAnyRole('ORGANIZER','ADMIN')")
	public ResponseEntity<List<Ticket>> refundRequests() {
		return ResponseEntity.ok(ticketService.getRefundRequestedTickets());
	}

	// Expired tickets (utility)
	@GetMapping("/expired")
	@PreAuthorize("hasAnyRole('ORGANIZER','ADMIN')")
	public ResponseEntity<List<Ticket>> expired() {
		return ResponseEntity.ok(ticketService.getExpiredTickets());
	}

	// Ticket QR regenerate (utility)
	@GetMapping("/{ticketId}/qr")
	public ResponseEntity<Map<String, String>> getQr(@PathVariable String ticketId) {
		String base64 = ticketService.generateQRCode(ticketId);
		return ResponseEntity.ok(Map.of("qr", base64));
	}
}