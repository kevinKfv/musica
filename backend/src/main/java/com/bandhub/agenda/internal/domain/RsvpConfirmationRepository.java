package com.bandhub.agenda.internal.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RsvpConfirmationRepository extends JpaRepository<RsvpConfirmation, UUID> {
    Optional<RsvpConfirmation> findByCalendarEntryIdAndUserId(UUID entryId, UUID userId);
}
