package com.eventmanagement.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PaymentDtos {
	public static class CreateOrderRequest {
		@NotBlank
		private String eventId;
		@NotBlank
		private String ticketTypeId;
		@Min(1)
		private int quantity;
		@NotBlank
		private String currency = "INR";

		public String getEventId() { return eventId; }
		public void setEventId(String eventId) { this.eventId = eventId; }
		public String getTicketTypeId() { return ticketTypeId; }
		public void setTicketTypeId(String ticketTypeId) { this.ticketTypeId = ticketTypeId; }
		public int getQuantity() { return quantity; }
		public void setQuantity(int quantity) { this.quantity = quantity; }
		public String getCurrency() { return currency; }
		public void setCurrency(String currency) { this.currency = currency; }
	}

	public static class CreateOrderResponse {
		private String orderId;
		private long amount;
		private String currency;
		private String key;

		public CreateOrderResponse(String orderId, long amount, String currency, String key) {
			this.orderId = orderId; this.amount = amount; this.currency = currency; this.key = key;
		}
		public String getOrderId() { return orderId; }
		public long getAmount() { return amount; }
		public String getCurrency() { return currency; }
		public String getKey() { return key; }
	}

	public static class VerifyPaymentRequest {
		@NotBlank
		private String razorpayOrderId;
		@NotBlank
		private String razorpayPaymentId;
		@NotBlank
		private String razorpaySignature;
		@NotBlank
		private String eventId;
		@NotBlank
		private String ticketTypeId;
		@Min(1)
		private int quantity;
		@NotBlank
		private String attendeeName;
		@NotBlank
		private String attendeeEmail;
		private String attendeePhone;

		public String getRazorpayOrderId() { return razorpayOrderId; }
		public void setRazorpayOrderId(String s) { this.razorpayOrderId = s; }
		public String getRazorpayPaymentId() { return razorpayPaymentId; }
		public void setRazorpayPaymentId(String s) { this.razorpayPaymentId = s; }
		public String getRazorpaySignature() { return razorpaySignature; }
		public void setRazorpaySignature(String s) { this.razorpaySignature = s; }
		public String getEventId() { return eventId; }
		public void setEventId(String s) { this.eventId = s; }
		public String getTicketTypeId() { return ticketTypeId; }
		public void setTicketTypeId(String s) { this.ticketTypeId = s; }
		public int getQuantity() { return quantity; }
		public void setQuantity(int q) { this.quantity = q; }
		public String getAttendeeName() { return attendeeName; }
		public void setAttendeeName(String s) { this.attendeeName = s; }
		public String getAttendeeEmail() { return attendeeEmail; }
		public void setAttendeeEmail(String s) { this.attendeeEmail = s; }
		public String getAttendeePhone() { return attendeePhone; }
		public void setAttendeePhone(String s) { this.attendeePhone = s; }
	}
}