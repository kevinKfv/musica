package com.bandhub.marketplace.internal.infrastructure;

import com.bandhub.marketplace.internal.domain.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, UUID> {
    List<Booking> findByClientId(UUID clientId);
    List<Booking> findByServiceOfferingId(UUID serviceOfferingId);
}
