package com.bandhub.collab.internal.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.List;

public interface TimelineCommentRepository extends JpaRepository<TimelineComment, UUID> {
    List<TimelineComment> findByStemIdOrderByTimestampSecondsAsc(UUID stemId);
}
