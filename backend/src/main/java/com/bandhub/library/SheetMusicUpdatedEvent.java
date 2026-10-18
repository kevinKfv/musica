package com.bandhub.library;

import java.util.UUID;

public record SheetMusicUpdatedEvent(UUID sheetMusicId, UUID songId, Integer newVersion) {}
