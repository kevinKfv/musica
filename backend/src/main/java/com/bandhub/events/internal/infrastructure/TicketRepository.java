package com.bandhub.events.internal.infrastructure;

import com.bandhub.events.internal.domain.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface TicketRepository extends JpaRepository<Ticket, UUID> {
    Optional<Ticket> findByQrToken(String qrToken);
}
