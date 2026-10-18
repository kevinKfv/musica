package com.bandhub.admin.internal.web.dto;

import lombok.Data;

@Data
public class ResolveReportRequest {
    private String status;
    private String resolutionNotes;
}
