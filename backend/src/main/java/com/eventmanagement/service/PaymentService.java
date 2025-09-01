package com.eventmanagement.service;

import com.eventmanagement.dto.PaymentDtos.CreateOrderRequest;
import com.eventmanagement.dto.PaymentDtos.CreateOrderResponse;
import com.eventmanagement.dto.PaymentDtos.VerifyPaymentRequest;
import com.eventmanagement.model.Event;
import com.eventmanagement.model.Ticket;
import com.eventmanagement.repository.TicketRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
public class PaymentService {
	private final RazorpayClient razorpayClient;
	private final EventService eventService;
	private final TicketService ticketService;
	private final TicketRepository ticketRepository;
	private final MailService mailService;
	@Value("${razorpay.keyId}")
	private String keyId;
	@Value("${razorpay.keySecret}")
	private String keySecret;

	public PaymentService(RazorpayClient razorpayClient, EventService eventService, TicketService ticketService, TicketRepository ticketRepository, MailService mailService) {
		this.razorpayClient = razorpayClient;
		this.eventService = eventService;
		this.ticketService = ticketService;
		this.ticketRepository = ticketRepository;
		this.mailService = mailService;
	}

	public CreateOrderResponse createOrder(CreateOrderRequest req) throws Exception {
		Event event = eventService.getEventById(req.getEventId())
				.orElseThrow(() -> new RuntimeException("Event not found"));
		Event.TicketType type = event.getTicketTypes().stream()
				.filter(t -> t.getId().equals(req.getTicketTypeId()))
				.findFirst()
				.orElseThrow(() -> new RuntimeException("Ticket type not found"));
		if (!type.isActive()) throw new RuntimeException("Ticket type inactive");
		if (type.getAvailableQuantity() < req.getQuantity()) throw new RuntimeException("Insufficient availability");

		long amountPaise = Math.round(type.getPrice().multiply(java.math.BigDecimal.valueOf(100)).doubleValue()) * req.getQuantity();
		JSONObject orderRequest = new JSONObject();
		orderRequest.put("amount", amountPaise);
		orderRequest.put("currency", req.getCurrency());
		orderRequest.put("receipt", "evt_" + event.getId() + "_" + System.currentTimeMillis());
		orderRequest.put("payment_capture", 1);
		Order order = razorpayClient.orders.create(orderRequest);
		return new CreateOrderResponse(order.get("id"), amountPaise, req.getCurrency(), keyId);
	}

	public boolean verifyPayment(VerifyPaymentRequest req, String userId) throws Exception {
		String payload = req.getRazorpayOrderId() + '|' + req.getRazorpayPaymentId();
		String expectedSig = hmacSHA256(payload, keySecret);
		if (!expectedSig.equals(req.getRazorpaySignature())) {
			return false;
		}
		// Signature valid: create tickets
		com.eventmanagement.dto.TicketPurchaseRequest purchaseRequest = new com.eventmanagement.dto.TicketPurchaseRequest();
		purchaseRequest.setEventId(req.getEventId());
		purchaseRequest.setTicketTypeId(req.getTicketTypeId());
		purchaseRequest.setQuantity(req.getQuantity());
		purchaseRequest.setAttendeeName(req.getAttendeeName());
		purchaseRequest.setAttendeeEmail(req.getAttendeeEmail());
		purchaseRequest.setAttendeePhone(req.getAttendeePhone());
		purchaseRequest.setPaymentMethod("RAZORPAY");
		
		List<Ticket> tickets = ticketService.purchaseTickets(purchaseRequest, userId);
		// Set payment id on tickets
		for (Ticket ticket : tickets) {
			ticket.setPaymentId(req.getRazorpayPaymentId());
		}
		ticketRepository.saveAll(tickets);
		// Email tickets
		sendTicketEmails(tickets);
		return tickets != null && !tickets.isEmpty();
	}

	public void refundPaymentForTicket(Ticket ticket) throws Exception {
		if (ticket.getPaymentId() == null || ticket.getPaymentId().isEmpty()) {
			throw new RuntimeException("Missing payment id for ticket");
		}
		long amountPaise = Math.round(ticket.getPrice().doubleValue() * 100);
		JSONObject body = new JSONObject();
		body.put("amount", amountPaise);
		// Attempt refund via Razorpay Payments API
		razorpayClient.payments.refund(ticket.getPaymentId(), body);
	}

	private void sendTicketEmails(List<Ticket> tickets) {
		for (Ticket t : tickets) {
			try {
				String subject = "Your Ticket - " + t.getEventName();
				String html = "<h2>" + t.getEventName() + "</h2>" +
					"<p>Ticket Number: " + t.getTicketNumber() + "</p>" +
					"<p>Type: " + t.getTicketTypeName() + "</p>" +
					"<p>Venue: " + t.getEventVenue() + "</p>" +
					"<img alt=\"QR\" src=\"data:image/png;base64," + (t.getQrCode() == null ? "" : t.getQrCode()) + "\" style=\"max-width:240px;border-radius:8px;\" />";
				mailService.sendHtml(t.getAttendeeEmail(), subject, html);
			} catch (Exception ignore) {}
		}
	}

	private String hmacSHA256(String data, String secret) throws Exception {
		javax.crypto.Mac mac = javax.crypto.Mac.getInstance("HmacSHA256");
		javax.crypto.spec.SecretKeySpec secretKeySpec = new javax.crypto.spec.SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
		mac.init(secretKeySpec);
		byte[] digest = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
		StringBuilder sb = new StringBuilder();
		for (byte b : digest) {
			sb.append(String.format("%02x", b));
		}
		return sb.toString();
	}
}