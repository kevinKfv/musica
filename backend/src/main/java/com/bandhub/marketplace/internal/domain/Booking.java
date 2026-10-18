package com.bandhub.marketplace.internal.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import java.util.UUID;
import java.time.ZonedDateTime;

@Entity
@Table(name = "bookings", schema = "schema_marketplace")
public class Booking {

    @Id
    private UUID id;

    @Column(name = "service_offering_id", nullable = false)
    private UUID serviceOfferingId;

    @Column(name = "client_id", nullable = false)
    private UUID clientId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status;

    @Column(name = "booking_date", nullable = false)
    private ZonedDateTime bookingDate;

    private String notes;

    @Column(name = "created_at", nullable = false)
    private ZonedDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private ZonedDateTime updatedAt;

    protected Booking() {}

    public Booking(UUID id, UUID serviceOfferingId, UUID clientId, ZonedDateTime bookingDate, String notes) {
        this.id = id != null ? id : UUID.randomUUID();
        this.serviceOfferingId = serviceOfferingId;
        this.clientId = clientId;
        this.status = BookingStatus.PENDING;
        this.bookingDate = bookingDate;
        this.notes = notes;
        this.createdAt = ZonedDateTime.now();
        this.updatedAt = this.createdAt;
    }

    public void accept() {
        if (this.status != BookingStatus.PENDING) {
            throw new IllegalStateException("Booking must be in PENDING state to accept");
        }
        this.status = BookingStatus.ACCEPTED;
        this.updatedAt = ZonedDateTime.now();
    }

    public void reject() {
        if (this.status != BookingStatus.PENDING) {
            throw new IllegalStateException("Booking must be in PENDING state to reject");
        }
        this.status = BookingStatus.REJECTED;
        this.updatedAt = ZonedDateTime.now();
    }
    
    public void complete() {
        if (this.status != BookingStatus.ACCEPTED) {
            throw new IllegalStateException("Booking must be in ACCEPTED state to complete");
        }
        this.status = BookingStatus.COMPLETED;
        this.updatedAt = ZonedDateTime.now();
    }

    public UUID getId() { return id; }
    public UUID getServiceOfferingId() { return serviceOfferingId; }
    public UUID getClientId() { return clientId; }
    public BookingStatus getStatus() { return status; }
    public ZonedDateTime getBookingDate() { return bookingDate; }
    public String getNotes() { return notes; }
}
