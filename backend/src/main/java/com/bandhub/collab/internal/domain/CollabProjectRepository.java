package com.bandhub.collab.internal.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.List;

public interface CollabProjectRepository extends JpaRepository<CollabProject, UUID> {
    List<CollabProject> findByOwnerIdOrderByCreatedAtDesc(UUID ownerId);
}
