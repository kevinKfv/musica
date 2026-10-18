package com.bandhub.library.internal.application;

import com.bandhub.library.ResourceUploadedEvent;
import com.bandhub.library.SheetMusicUpdatedEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component("libraryEventPublisher")
public class EventPublisher {

    private final ApplicationEventPublisher applicationEventPublisher;

    public EventPublisher(ApplicationEventPublisher applicationEventPublisher) {
        this.applicationEventPublisher = applicationEventPublisher;
    }

    public void publishResourceUploaded(UUID resourceId, String resourceType, UUID songId, UUID uploadedBy) {
        applicationEventPublisher.publishEvent(new ResourceUploadedEvent(resourceId, resourceType, songId, uploadedBy));
    }

    public void publishSheetMusicUpdated(UUID sheetMusicId, UUID songId, Integer newVersion) {
        applicationEventPublisher.publishEvent(new SheetMusicUpdatedEvent(sheetMusicId, songId, newVersion));
    }
}
