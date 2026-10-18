package com.bandhub.admin.internal.application;

import com.bandhub.admin.internal.domain.ModerationReport;
import com.bandhub.admin.internal.domain.ModerationReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminApplicationService {

    private final ModerationReportRepository reportRepository;

    @Transactional(readOnly = true)
    public List<ModerationReport> getPendingReports() {
        return reportRepository.findByStatusOrderByCreatedAtDesc("PENDING");
    }
    
    @Transactional
    public ModerationReport resolveReport(UUID reportId, UUID adminId, String status, String notes) {
        ModerationReport report = reportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("Report not found"));
                
        report.setStatus(status);
        report.setResolutionNotes(notes);
        report.setResolvedBy(adminId);
        
        return reportRepository.save(report);
    }
}
