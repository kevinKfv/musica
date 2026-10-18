package com.bandhub.collab.internal.web.dto;

import lombok.Data;

@Data
public class AddTimelineCommentRequest {
    private Integer timestampSeconds;
    private String content;
}
