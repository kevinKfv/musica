package com.bandhub.events.internal.infrastructure;

import com.bandhub.events.internal.domain.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface EventRepository extends JpaRepository<Event, UUID> {
}
