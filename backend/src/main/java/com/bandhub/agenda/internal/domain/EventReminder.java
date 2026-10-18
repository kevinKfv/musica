package com.bandhub.agenda.internal.domain;

import jakarta.persistence.*;
import java.util.UUID;
import java.time.ZonedDateTime;

@Entity
@Table(name = "event_reminders", schema = "schema_agenda")
public class EventReminder {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entry_id", nullable = false)
    private CalendarEntry calendarEntry;

    @Column(name = "reminder_time", nullable = false)
    private ZonedDateTime reminderTime;

    @Column(nullable = false)
    private String method; // EMAIL, PUSH, IN_APP

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

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public CalendarEntry getCalendarEntry() { return calendarEntry; }
    public void setCalendarEntry(CalendarEntry calendarEntry) { this.calendarEntry = calendarEntry; }

    public ZonedDateTime getReminderTime() { return reminderTime; }
    public void setReminderTime(ZonedDateTime reminderTime) { this.reminderTime = reminderTime; }

    public String getMethod() { return method; }
    public void setMethod(String method) { this.method = method; }

    public ZonedDateTime getCreatedAt() { return createdAt; }
    public ZonedDateTime getUpdatedAt() { return updatedAt; }
    public ZonedDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(ZonedDateTime deletedAt) { this.deletedAt = deletedAt; }
}
