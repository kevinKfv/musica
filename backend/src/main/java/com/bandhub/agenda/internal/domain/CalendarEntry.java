package com.bandhub.agenda.internal.domain;

import jakarta.persistence.*;
import java.util.UUID;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "calendar_entries", schema = "schema_agenda")
public class CalendarEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "start_time", nullable = false)
    private ZonedDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private ZonedDateTime endTime;

    @Column(name = "event_type", nullable = false)
    private String eventType;

    @Column(name = "reference_id")
    private UUID referenceId;

    @OneToMany(mappedBy = "calendarEntry", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EventReminder> reminders = new ArrayList<>();

    @OneToMany(mappedBy = "calendarEntry", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RsvpConfirmation> rsvps = new ArrayList<>();

    @Column(name = "created_at")
    private ZonedDateTime createdAt;

    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;

    @Column(name = "deleted_at")
    private ZonedDateTime deletedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = ZonedDateTime.now();
        updatedAt = ZonedDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = ZonedDateTime.now();
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public ZonedDateTime getStartTime() { return startTime; }
    public void setStartTime(ZonedDateTime startTime) { this.startTime = startTime; }

    public ZonedDateTime getEndTime() { return endTime; }
    public void setEndTime(ZonedDateTime endTime) { this.endTime = endTime; }

    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }

    public UUID getReferenceId() { return referenceId; }
    public void setReferenceId(UUID referenceId) { this.referenceId = referenceId; }

    public List<EventReminder> getReminders() { return reminders; }
    public void addReminder(EventReminder reminder) {
        reminders.add(reminder);
        reminder.setCalendarEntry(this);
    }
    public void removeReminder(EventReminder reminder) {
        reminders.remove(reminder);
        reminder.setCalendarEntry(null);
    }

    public List<RsvpConfirmation> getRsvps() { return rsvps; }
    public void addRsvp(RsvpConfirmation rsvp) {
        rsvps.add(rsvp);
        rsvp.setCalendarEntry(this);
    }
    public void removeRsvp(RsvpConfirmation rsvp) {
        rsvps.remove(rsvp);
        rsvp.setCalendarEntry(null);
    }

    public ZonedDateTime getCreatedAt() { return createdAt; }
    public ZonedDateTime getUpdatedAt() { return updatedAt; }
    public ZonedDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(ZonedDateTime deletedAt) { this.deletedAt = deletedAt; }
}
