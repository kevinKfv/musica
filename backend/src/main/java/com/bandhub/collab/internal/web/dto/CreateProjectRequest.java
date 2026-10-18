package com.bandhub.collab.internal.web.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class CreateProjectRequest {
    private String title;
    private String description;
}
