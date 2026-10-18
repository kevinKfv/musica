package com.bandhub.marketplace;

import java.util.UUID;

public record BookingStatusChangedEvent(
    UUID bookingId,
    String newStatus
) {}
