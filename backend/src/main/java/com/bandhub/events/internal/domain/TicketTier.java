package com.bandhub.events.internal.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "ticket_tiers", schema = "schema_events")
public class TicketTier {

    @Id
    private UUID id;
    private UUID eventId;
    private String name;
    private BigDecimal price;
    private String currency;
    private Integer capacity;
    private Integer availableQuantity;

    @Version
    private Long version;
    private ZonedDateTime createdAt;

    protected TicketTier() {}

    public TicketTier(UUID id, UUID eventId, String name, BigDecimal price, String currency, Integer capacity) {
        this.id = id;
        this.eventId = eventId;
        this.name = name;
        this.price = price;
        this.currency = currency;
        this.capacity = capacity;
        this.availableQuantity = capacity;
        this.createdAt = ZonedDateTime.now();
    }

    public UUID getId() { return id; }
    public UUID getEventId() { return eventId; }
    public String getName() { return name; }
    public BigDecimal getPrice() { return price; }
    public String getCurrency() { return currency; }
    public Integer getCapacity() { return capacity; }
    public Integer getAvailableQuantity() { return availableQuantity; }
    public Long getVersion() { return version; }
    public ZonedDateTime getCreatedAt() { return createdAt; }

    public void decreaseAvailability(int count) {
        if (this.availableQuantity < count) {
            throw new IllegalStateException("Not enough tickets available in this tier");
        }
        this.availableQuantity -= count;
    }
}
