package com.bandhub.agenda.internal.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface CalendarEntryRepository extends JpaRepository<CalendarEntry, UUID> {
    List<CalendarEntry> findByUserIdAndDeletedAtIsNull(UUID userId);
    List<CalendarEntry> findByUserIdAndStartTimeBetweenAndDeletedAtIsNull(UUID userId, ZonedDateTime start, ZonedDateTime end);
}
