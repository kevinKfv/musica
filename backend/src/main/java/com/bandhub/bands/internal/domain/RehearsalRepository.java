package com.bandhub.bands.internal.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface RehearsalRepository extends JpaRepository<Rehearsal, UUID> {
}
