package com.bandhub.admin.internal.web;

import com.bandhub.admin.internal.application.AdminApplicationService;
import com.bandhub.admin.internal.domain.ModerationReport;
import com.bandhub.admin.internal.web.dto.ResolveReportRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminApplicationService adminService;

    @GetMapping("/reports")
    public ResponseEntity<List<ModerationReport>> getPendingReports() {
        return ResponseEntity.ok(adminService.getPendingReports());
    }

    @PutMapping("/reports/{reportId}/status")
    public ResponseEntity<ModerationReport> resolveReport(@AuthenticationPrincipal Jwt jwt, 
                                                          @PathVariable UUID reportId, 
                                                          @RequestBody ResolveReportRequest request) {
        UUID adminId = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(adminService.resolveReport(reportId, adminId, request.getStatus(), request.getResolutionNotes()));
    }
    
    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalyticsMock() {
        // Mocked metrics as agreed in MVP phase
        return ResponseEntity.ok(Map.of(
            "activeUsers", 1450,
            "totalBands", 230,
            "totalCollabProjects", 89,
            "pendingReports", adminService.getPendingReports().size()
        ));
    }
}
