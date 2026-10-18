package com.bandhub.library;

import java.util.UUID;

public record ResourceUploadedEvent(UUID resourceId, String resourceType, UUID songId, UUID uploadedBy) {}
