package com.bandhub.events;

import java.util.UUID;

public record TicketPurchasedEvent(
    UUID ticketId,
    UUID eventId,
    UUID buyerId
) {}
