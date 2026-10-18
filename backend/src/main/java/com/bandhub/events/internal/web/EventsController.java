package com.bandhub.events.internal.web;

import com.bandhub.events.internal.application.EventsService;
import com.bandhub.events.internal.domain.Event;
import com.bandhub.events.internal.domain.Ticket;
import com.bandhub.events.internal.domain.TicketTier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/events")
public class EventsController {

    private final EventsService eventsService;

    public EventsController(EventsService eventsService) {
        this.eventsService = eventsService;
    }

    @PostMapping
    public ResponseEntity<Event> createEvent(@RequestBody CreateEventRequest request) {
        Event event = eventsService.publishEvent(
                request.organizerId(),
                request.title(),
                request.description(),
                request.location(),
                request.eventDate()
        );
        return ResponseEntity.ok(event);
    }

    @PostMapping("/{eventId}/tiers")
    public ResponseEntity<TicketTier> addTier(@PathVariable UUID eventId, @RequestBody CreateTierRequest request) {
        TicketTier tier = eventsService.addTicketTier(
                eventId,
                request.name(),
                request.price(),
                request.currency(),
                request.capacity()
        );
        return ResponseEntity.ok(tier);
    }

    @GetMapping
    public ResponseEntity<List<Event>> getEvents() {
        return ResponseEntity.ok(eventsService.getAllEvents());
    }

    @GetMapping("/{eventId}/tiers")
    public ResponseEntity<List<TicketTier>> getTiers(@PathVariable UUID eventId) {
        return ResponseEntity.ok(eventsService.getTicketTiers(eventId));
    }

    @PostMapping("/{eventId}/tiers/{tierId}/purchase")
    public ResponseEntity<Ticket> purchaseTicket(
            @PathVariable UUID eventId,
            @PathVariable UUID tierId,
            @RequestBody PurchaseTicketRequest request) {
        Ticket ticket = eventsService.purchaseTicket(eventId, tierId, request.buyerId());
        return ResponseEntity.ok(ticket);
    }

    @PostMapping("/checkin")
    public ResponseEntity<Ticket> checkInTicket(@RequestBody CheckInRequest request) {
        Ticket ticket = eventsService.checkIn(request.qrToken());
        return ResponseEntity.ok(ticket);
    }

    // DTOs
    public record CreateEventRequest(UUID organizerId, String title, String description, String location, ZonedDateTime eventDate) {}
    public record CreateTierRequest(String name, BigDecimal price, String currency, Integer capacity) {}
    public record PurchaseTicketRequest(UUID buyerId) {}
    public record CheckInRequest(String qrToken) {}
}
