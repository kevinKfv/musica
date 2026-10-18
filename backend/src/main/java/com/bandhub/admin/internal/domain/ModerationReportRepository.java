package com.bandhub.admin.internal.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.List;

public interface ModerationReportRepository extends JpaRepository<ModerationReport, UUID> {
    List<ModerationReport> findByStatusOrderByCreatedAtDesc(String status);
}
