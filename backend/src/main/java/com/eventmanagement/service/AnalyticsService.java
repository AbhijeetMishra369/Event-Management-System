package com.eventmanagement.service;

import com.eventmanagement.dto.DailySales;
import com.eventmanagement.model.Event;
import com.eventmanagement.model.Ticket;
import com.eventmanagement.repository.EventRepository;
import com.eventmanagement.repository.TicketRepository;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

@Service
public class AnalyticsService {
	private final EventRepository eventRepository;
	private final TicketRepository ticketRepository;
	private final MongoTemplate mongoTemplate;

	public AnalyticsService(EventRepository eventRepository, TicketRepository ticketRepository, MongoTemplate mongoTemplate) {
		this.eventRepository = eventRepository;
		this.ticketRepository = ticketRepository;
		this.mongoTemplate = mongoTemplate;
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

	public List<DailySales> getOrganizerSalesByDate(String organizerId, int days) {
		List<String> eventIds = eventRepository.findByOrganizerId(organizerId)
				.stream()
				.map(Event::getId)
				.collect(Collectors.toList());

		if (eventIds.isEmpty()) {
			return List.of();
		}

		LocalDateTime endDate = LocalDateTime.now();
		LocalDateTime startDate = endDate.minusDays(days);

		Aggregation aggregation = newAggregation(
				match(Criteria.where("eventId").in(eventIds)
						.and("purchaseDate").gte(startDate).lte(endDate)),
				project()
						.andExpression("{$dateToString: { format: '%Y-%m-%d', date: '$purchaseDate' }}").as("date"),
				group("date").count().as("ticketsSold"),
				project("ticketsSold").and("date").previousOperation()
		);

		AggregationResults<DailySales> results = mongoTemplate.aggregate(aggregation, "tickets", DailySales.class);
		return results.getMappedResults();
	}
}