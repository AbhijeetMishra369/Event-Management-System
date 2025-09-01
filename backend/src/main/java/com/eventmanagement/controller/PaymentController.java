package com.eventmanagement.controller;

import com.eventmanagement.dto.PaymentDtos.CreateOrderRequest;
import com.eventmanagement.dto.PaymentDtos.CreateOrderResponse;
import com.eventmanagement.dto.PaymentDtos.VerifyPaymentRequest;
import com.eventmanagement.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@CrossOrigin
public class PaymentController {
	private final PaymentService paymentService;

	public PaymentController(PaymentService paymentService) { this.paymentService = paymentService; }

	@PostMapping("/create-order")
	public ResponseEntity<CreateOrderResponse> createOrder(@Validated @RequestBody CreateOrderRequest request) throws Exception {
		return ResponseEntity.ok(paymentService.createOrder(request));
	}

	@PostMapping("/verify")
	public ResponseEntity<?> verify(@Validated @RequestBody VerifyPaymentRequest request,
			@AuthenticationPrincipal UserDetails user) throws Exception {
		boolean ok = paymentService.verifyPayment(request, user.getUsername());
		return ok ? ResponseEntity.ok().build() : ResponseEntity.badRequest().body("Signature mismatch");
	}
}