package com.bandhub.marketplace.internal.infrastructure;

import com.bandhub.marketplace.internal.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, UUID> {
    List<Review> findByBookingId(UUID bookingId);
}
