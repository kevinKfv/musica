package com.bandhub.agenda.internal.application;

import com.bandhub.agenda.AgendaEventCreatedEvent;
import com.bandhub.agenda.RsvpConfirmedEvent;
import com.bandhub.agenda.ScheduleConflictDetectedEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component("agendaEventPublisher")
public class EventPublisher {

    private final ApplicationEventPublisher applicationEventPublisher;

    public EventPublisher(ApplicationEventPublisher applicationEventPublisher) {
        this.applicationEventPublisher = applicationEventPublisher;
    }

    public void publishEventCreated(UUID eventId, UUID userId, String title) {
        applicationEventPublisher.publishEvent(new AgendaEventCreatedEvent(eventId, userId, title));
    }

    public void publishScheduleConflict(UUID userId, UUID newEventId, UUID conflictingEventId) {
        applicationEventPublisher.publishEvent(new ScheduleConflictDetectedEvent(userId, newEventId, conflictingEventId));
    }

    public void publishRsvpConfirmed(UUID eventId, UUID userId, String status) {
        applicationEventPublisher.publishEvent(new RsvpConfirmedEvent(eventId, userId, status));
    }
}
