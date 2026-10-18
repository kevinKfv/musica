package com.bandhub.agenda.internal.infrastructure.web;

import com.bandhub.agenda.internal.application.AgendaApplicationService;
import com.bandhub.agenda.internal.domain.CalendarEntry;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/agenda/events")
public class AgendaController {

    private final AgendaApplicationService agendaService;

    public AgendaController(AgendaApplicationService agendaService) {
        this.agendaService = agendaService;
    }

    @GetMapping
    public ResponseEntity<List<CalendarEntry>> getUserEvents(@RequestParam UUID userId) {
        // In a real scenario, userId would be extracted from the authenticated principal (SecurityContextHolder).
        List<CalendarEntry> events = agendaService.getUserCalendar(userId);
        return ResponseEntity.ok(events);
    }

    @PostMapping
    public ResponseEntity<CalendarEntry> createEvent(@RequestBody CreateEventRequest request) {
        // userId should be extracted from context, passing directly for simplicity in the request body for now.
        CalendarEntry entry = agendaService.createCalendarEntry(
            request.userId(),
            request.title(),
            request.description(),
            request.start(),
            request.end(),
            request.eventType(),
            request.referenceId()
        );
        return ResponseEntity.ok(entry);
    }

    @PostMapping("/{eventId}/rsvp")
    public ResponseEntity<Void> confirmRsvp(@PathVariable UUID eventId, @RequestBody RsvpRequest request) {
        agendaService.confirmRsvp(eventId, request.userId(), request.status());
        return ResponseEntity.ok().build();
    }
}

record CreateEventRequest(
    UUID userId, 
    String title, 
    String description, 
    ZonedDateTime start, 
    ZonedDateTime end, 
    String eventType, 
    UUID referenceId
) {}

record RsvpRequest(UUID userId, String status) {}
