package com.bandhub.agenda;

import java.util.UUID;

public record RsvpConfirmedEvent(UUID eventId, UUID userId, String status) {}
