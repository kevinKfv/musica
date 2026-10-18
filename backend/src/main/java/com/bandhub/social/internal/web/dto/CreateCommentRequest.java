package com.bandhub.social.internal.web.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class CreateCommentRequest {
    private String content;
}
