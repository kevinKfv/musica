package com.bandhub.collab.internal.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.List;

public interface AudioStemRepository extends JpaRepository<AudioStem, UUID> {
    List<AudioStem> findByProjectId(UUID projectId);
}
