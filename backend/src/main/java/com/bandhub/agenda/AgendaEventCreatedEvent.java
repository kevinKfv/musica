package com.bandhub.agenda;

import java.util.UUID;

public record AgendaEventCreatedEvent(UUID eventId, UUID userId, String title) {}
