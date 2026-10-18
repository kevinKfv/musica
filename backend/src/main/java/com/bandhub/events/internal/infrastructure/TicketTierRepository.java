package com.bandhub.events.internal.infrastructure;

import com.bandhub.events.internal.domain.TicketTier;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface TicketTierRepository extends JpaRepository<TicketTier, UUID> {
    List<TicketTier> findByEventId(UUID eventId);
}
