package com.bandhub.events.internal.application;

import com.bandhub.events.TicketPurchasedEvent;
import com.bandhub.events.internal.domain.Event;
import com.bandhub.events.internal.domain.Ticket;
import com.bandhub.events.internal.domain.TicketTier;
import com.bandhub.events.internal.infrastructure.EventRepository;
import com.bandhub.events.internal.infrastructure.TicketRepository;
import com.bandhub.events.internal.infrastructure.TicketTierRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class EventsService {

    private final EventRepository eventRepository;
    private final TicketTierRepository ticketTierRepository;
    private final TicketRepository ticketRepository;
    private final ApplicationEventPublisher eventPublisher;

    public EventsService(EventRepository eventRepository,
                         TicketTierRepository ticketTierRepository,
                         TicketRepository ticketRepository,
                         ApplicationEventPublisher eventPublisher) {
        this.eventRepository = eventRepository;
        this.ticketTierRepository = ticketTierRepository;
        this.ticketRepository = ticketRepository;
        this.eventPublisher = eventPublisher;
    }

    public Event publishEvent(UUID organizerId, String title, String description, String location, ZonedDateTime eventDate) {
        Event event = new Event(UUID.randomUUID(), organizerId, title, description, location, eventDate);
        return eventRepository.save(event);
    }

    public TicketTier addTicketTier(UUID eventId, String name, java.math.BigDecimal price, String currency, Integer capacity) {
        TicketTier tier = new TicketTier(UUID.randomUUID(), eventId, name, price, currency, capacity);
        return ticketTierRepository.save(tier);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public List<TicketTier> getTicketTiers(UUID eventId) {
        return ticketTierRepository.findByEventId(eventId);
    }

    public Ticket purchaseTicket(UUID eventId, UUID tierId, UUID buyerId) {
        TicketTier tier = ticketTierRepository.findById(tierId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket tier not found"));

        if (!tier.getEventId().equals(eventId)) {
            throw new IllegalArgumentException("Tier does not belong to the event");
        }

        tier.decreaseAvailability(1); // Modifies entity, JPA handles optimistic locking on flush
        ticketTierRepository.save(tier);

        String qrToken = UUID.randomUUID().toString();
        Ticket ticket = new Ticket(UUID.randomUUID(), eventId, tierId, buyerId, qrToken);
        ticketRepository.save(ticket);

        eventPublisher.publishEvent(new TicketPurchasedEvent(ticket.getId(), eventId, buyerId));

        return ticket;
    }

    public Ticket checkIn(String qrToken) {
        Ticket ticket = ticketRepository.findByQrToken(qrToken)
                .orElseThrow(() -> new IllegalArgumentException("Invalid QR token"));
        
        ticket.checkIn();
        return ticketRepository.save(ticket);
    }
}
