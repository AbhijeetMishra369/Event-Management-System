package com.eventmanagement.service;

import com.eventmanagement.dto.PaymentDtos.CreateOrderRequest;
import com.eventmanagement.dto.PaymentDtos.CreateOrderResponse;
import com.eventmanagement.dto.PaymentDtos.VerifyPaymentRequest;
import com.eventmanagement.model.Event;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

@Service
public class PaymentService {
	private final RazorpayClient razorpayClient;
	private final EventService eventService;
	private final TicketService ticketService;
	@Value("${razorpay.keyId}")
	private String keyId;
	@Value("${razorpay.keySecret}")
	private String keySecret;

	public PaymentService(RazorpayClient razorpayClient, EventService eventService, TicketService ticketService) {
		this.razorpayClient = razorpayClient;
		this.eventService = eventService;
		this.ticketService = ticketService;
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

		long amountPaise = Math.round(type.getPrice() * 100) * req.getQuantity();
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
		var tickets = ticketService.purchaseTickets(
			new com.eventmanagement.dto.TicketPurchaseRequest(
				req.getEventId(), req.getTicketTypeId(), req.getQuantity(),
				req.getAttendeeName(), req.getAttendeeEmail(), req.getAttendeePhone(), null,
				"RAZORPAY", null
			),
			userId
		);
		return tickets != null && !tickets.isEmpty();
	}

	private String hmacSHA256(String data, String secret) throws Exception {
		Mac mac = Mac.getInstance("HmacSHA256");
		SecretKeySpec secretKeySpec = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
		mac.init(secretKeySpec);
		byte[] digest = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
		StringBuilder sb = new StringBuilder();
		for (byte b : digest) {
			sb.append(String.format("%02x", b));
		}
		return sb.toString();
	}
}