package com.bandhub.marketplace;

import java.util.UUID;
import java.time.ZonedDateTime;

public record BookingRequestedEvent(
    UUID bookingId,
    UUID serviceOfferingId,
    UUID clientId,
    UUID providerId,
    ZonedDateTime bookingDate
) {}
