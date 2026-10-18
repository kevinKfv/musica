package com.bandhub.events.internal.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "tickets", schema = "schema_events")
public class Ticket {

    @Id
    private UUID id;
    private UUID eventId;
    private UUID ticketTierId;
    private UUID buyerId;
    private String qrToken;

    @Enumerated(EnumType.STRING)
    private TicketStatus status;
    private ZonedDateTime purchasedAt;
    private ZonedDateTime usedAt;

    protected Ticket() {}

    public Ticket(UUID id, UUID eventId, UUID ticketTierId, UUID buyerId, String qrToken) {
        this.id = id;
        this.eventId = eventId;
        this.ticketTierId = ticketTierId;
        this.buyerId = buyerId;
        this.qrToken = qrToken;
        this.status = TicketStatus.VALID;
        this.purchasedAt = ZonedDateTime.now();
    }

    public UUID getId() { return id; }
    public UUID getEventId() { return eventId; }
    public UUID getTicketTierId() { return ticketTierId; }
    public UUID getBuyerId() { return buyerId; }
    public String getQrToken() { return qrToken; }
    public TicketStatus getStatus() { return status; }
    public ZonedDateTime getPurchasedAt() { return purchasedAt; }
    public ZonedDateTime getUsedAt() { return usedAt; }

    public void checkIn() {
        if (this.status == TicketStatus.USED) {
            throw new IllegalStateException("Ticket has already been used");
        }
        if (this.status == TicketStatus.CANCELLED) {
            throw new IllegalStateException("Ticket is cancelled");
        }
        this.status = TicketStatus.USED;
        this.usedAt = ZonedDateTime.now();
    }
}
