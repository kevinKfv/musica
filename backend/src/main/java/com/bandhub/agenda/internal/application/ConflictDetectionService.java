package com.bandhub.agenda.internal.application;

import com.bandhub.agenda.internal.domain.CalendarEntry;
import com.bandhub.agenda.internal.domain.CalendarEntryRepository;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ConflictDetectionService {

    private final CalendarEntryRepository entryRepository;

    public ConflictDetectionService(CalendarEntryRepository entryRepository) {
        this.entryRepository = entryRepository;
    }

    public boolean hasConflict(UUID userId, ZonedDateTime start, ZonedDateTime end) {
        List<CalendarEntry> overlappingEntries = entryRepository.findByUserIdAndStartTimeBetweenAndDeletedAtIsNull(userId, start, end);
        // Note: this query only checks if start_time is between start and end. 
        // A more robust check might be needed for real applications, but this is a starting point.
        return !overlappingEntries.isEmpty();
    }
}
