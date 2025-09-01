package com.eventmanagement.service;

import com.eventmanagement.model.Event;
import com.eventmanagement.model.Ticket;
import com.eventmanagement.repository.EventRepository;
import com.eventmanagement.repository.TicketRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {
	private final EventRepository eventRepository;
	private final TicketRepository ticketRepository;

	public AnalyticsService(EventRepository eventRepository, TicketRepository ticketRepository) {
		this.eventRepository = eventRepository;
		this.ticketRepository = ticketRepository;
	}

	public Map<String, Object> getEventMetrics(String eventId) {
		Event event = eventRepository.findById(eventId).orElseThrow(() -> new RuntimeException("Event not found"));
		List<Ticket> all = ticketRepository.findByEventId(eventId);
		int sold = all.size();
		int used = (int) all.stream().filter(t -> t.getStatus() == Ticket.TicketStatus.USED).count();
		int refunded = (int) all.stream().filter(t -> t.getStatus() == Ticket.TicketStatus.REFUNDED).count();
		BigDecimal revenue = all.stream()
				.filter(t -> t.getPaymentStatus() == Ticket.PaymentStatus.COMPLETED)
				.map(Ticket::getPrice)
				.reduce(BigDecimal.ZERO, BigDecimal::add);
		Map<String, Object> res = new HashMap<>();
		res.put("eventId", eventId);
		res.put("sold", sold);
		res.put("used", used);
		res.put("refunded", refunded);
		res.put("revenue", revenue);
		return res;
	}

	public Map<String, Object> getOrganizerOverview(String organizerId) {
		List<Event> events = eventRepository.findByOrganizerId(organizerId);
		int totalEvents = events.size();
		int activeEvents = (int) events.stream().filter(Event::isPublished).count();
		int ticketsSold = 0;
		BigDecimal revenue = BigDecimal.ZERO;
		for (Event e : events) {
			List<Ticket> ts = ticketRepository.findByEventId(e.getId());
			ticketsSold += ts.size();
			revenue = revenue.add(ts.stream()
					.filter(t -> t.getPaymentStatus() == Ticket.PaymentStatus.COMPLETED)
					.map(Ticket::getPrice)
					.reduce(BigDecimal.ZERO, BigDecimal::add));
		}
		Map<String, Object> res = new HashMap<>();
		res.put("totalEvents", totalEvents);
		res.put("activeEvents", activeEvents);
		res.put("ticketsSold", ticketsSold);
		res.put("revenue", revenue);
		return res;
	}
}