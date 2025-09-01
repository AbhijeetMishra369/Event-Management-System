package com.eventmanagement.controller;

import com.eventmanagement.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/analytics")
@CrossOrigin
public class AnalyticsController {
	private final AnalyticsService analyticsService;

	public AnalyticsController(AnalyticsService analyticsService) { this.analyticsService = analyticsService; }

	@GetMapping("/organizer/overview")
	public ResponseEntity<Map<String, Object>> organizerOverview(@AuthenticationPrincipal UserDetails user) {
		return ResponseEntity.ok(analyticsService.getOrganizerOverview(user.getUsername()));
	}

	@GetMapping("/event/{eventId}")
	public ResponseEntity<Map<String, Object>> eventMetrics(@PathVariable String eventId) {
		return ResponseEntity.ok(analyticsService.getEventMetrics(eventId));
	}
}