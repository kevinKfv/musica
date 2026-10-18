package com.bandhub.agenda.internal.application;

import com.bandhub.agenda.internal.domain.CalendarEntry;
import com.bandhub.agenda.internal.domain.CalendarEntryRepository;
import com.bandhub.agenda.internal.domain.RsvpConfirmation;
import com.bandhub.agenda.internal.domain.RsvpConfirmationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class AgendaApplicationService {

    private final CalendarEntryRepository entryRepository;
    private final RsvpConfirmationRepository rsvpRepository;
    private final ConflictDetectionService conflictDetectionService;
    private final EventPublisher eventPublisher;

    public AgendaApplicationService(CalendarEntryRepository entryRepository, 
                                    RsvpConfirmationRepository rsvpRepository,
                                    ConflictDetectionService conflictDetectionService,
                                    EventPublisher eventPublisher) {
        this.entryRepository = entryRepository;
        this.rsvpRepository = rsvpRepository;
        this.conflictDetectionService = conflictDetectionService;
        this.eventPublisher = eventPublisher;
    }

    public List<CalendarEntry> getUserCalendar(UUID userId) {
        return entryRepository.findByUserIdAndDeletedAtIsNull(userId);
    }

    public CalendarEntry createCalendarEntry(UUID userId, String title, String description, 
                                             ZonedDateTime start, ZonedDateTime end, 
                                             String eventType, UUID referenceId) {
        
        if (conflictDetectionService.hasConflict(userId, start, end)) {
            // Publishing the conflict event, but depending on requirements, it could throw an exception or just notify.
            // Let's assume we create it anyway but notify
            eventPublisher.publishScheduleConflict(userId, null, null); // Simplified
        }

        CalendarEntry entry = new CalendarEntry();
        entry.setUserId(userId);
        entry.setTitle(title);
        entry.setDescription(description);
        entry.setStartTime(start);
        entry.setEndTime(end);
        entry.setEventType(eventType);
        entry.setReferenceId(referenceId);

        CalendarEntry saved = entryRepository.save(entry);
        
        eventPublisher.publishEventCreated(saved.getId(), userId, title);

        return saved;
    }

    public void confirmRsvp(UUID entryId, UUID userId, String status) {
        CalendarEntry entry = entryRepository.findById(entryId)
            .orElseThrow(() -> new IllegalArgumentException("Entry not found"));

        RsvpConfirmation rsvp = rsvpRepository.findByCalendarEntryIdAndUserId(entryId, userId)
            .orElseGet(() -> {
                RsvpConfirmation newRsvp = new RsvpConfirmation();
                newRsvp.setCalendarEntry(entry);
                newRsvp.setUserId(userId);
                return newRsvp;
            });

        rsvp.setStatus(status);
        rsvpRepository.save(rsvp);

        eventPublisher.publishRsvpConfirmed(entryId, userId, status);
    }
}
