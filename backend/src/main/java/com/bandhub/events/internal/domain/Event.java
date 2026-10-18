package com.bandhub.events.internal.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "events", schema = "schema_events")
public class Event {

    @Id
    private UUID id;
    private UUID organizerId;
    private String title;
    private String description;
    private String location;
    private ZonedDateTime eventDate;
    private ZonedDateTime createdAt;

    protected Event() {}

    public Event(UUID id, UUID organizerId, String title, String description, String location, ZonedDateTime eventDate) {
        this.id = id;
        this.organizerId = organizerId;
        this.title = title;
        this.description = description;
        this.location = location;
        this.eventDate = eventDate;
        this.createdAt = ZonedDateTime.now();
    }

    public UUID getId() { return id; }
    public UUID getOrganizerId() { return organizerId; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getLocation() { return location; }
    public ZonedDateTime getEventDate() { return eventDate; }
    public ZonedDateTime getCreatedAt() { return createdAt; }
}
