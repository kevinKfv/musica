package com.bandhub.agenda;

import java.util.UUID;

public record ScheduleConflictDetectedEvent(UUID userId, UUID newEventId, UUID conflictingEventId) {}
