package com.bandhub.marketplace.internal.infrastructure;

import com.bandhub.marketplace.internal.domain.ServiceOffering;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.List;

public interface ServiceOfferingRepository extends JpaRepository<ServiceOffering, UUID> {
    List<ServiceOffering> findByProviderIdAndDeletedAtIsNull(UUID providerId);
    List<ServiceOffering> findByCategoryAndIsActiveTrueAndDeletedAtIsNull(String category);
}
