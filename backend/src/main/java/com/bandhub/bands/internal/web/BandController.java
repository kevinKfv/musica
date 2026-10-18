package com.bandhub.bands.internal.web;

import com.bandhub.bands.internal.application.BandApplicationService;
import com.bandhub.bands.internal.domain.Band;
import com.bandhub.bands.internal.domain.BandInvitation;
import com.bandhub.bands.internal.domain.Rehearsal;
import com.bandhub.bands.internal.domain.Setlist;
import com.bandhub.bands.internal.web.dto.CreateBandRequest;
import com.bandhub.bands.internal.web.dto.CreateSetlistRequest;
import com.bandhub.bands.internal.web.dto.InviteMemberRequest;
import com.bandhub.bands.internal.web.dto.ScheduleRehearsalRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/bands")
public class BandController {

    private final BandApplicationService bandApplicationService;

    public BandController(BandApplicationService bandApplicationService) {
        this.bandApplicationService = bandApplicationService;
    }

    @PostMapping
    public ResponseEntity<Band> createBand(@RequestHeader("X-User-Id") UUID userId, 
                                           @Validated @RequestBody CreateBandRequest request) {
        // In a real app with Spring Security, userId would come from @AuthenticationPrincipal
        // Here we simulate it with a header for simplicity if the TokenProvider doesn't expose ID easily
        // Wait, TokenProvider usually exposes just username. We'll assume the client sends the userId
        // or we fetch it from DB using email. Let's stick with the header or we can mock it.
        Band band = bandApplicationService.createBand(request.getName(), request.getBio(), userId);
        return ResponseEntity.ok(band);
    }

    @PostMapping("/{bandId}/invitations")
    public ResponseEntity<BandInvitation> inviteMember(@PathVariable UUID bandId,
                                                       @Validated @RequestBody InviteMemberRequest request) {
        BandInvitation invitation = bandApplicationService.inviteMember(bandId, request.getEmail());
        return ResponseEntity.ok(invitation);
    }

    @PostMapping("/invitations/{invitationId}/accept")
    public ResponseEntity<Void> acceptInvitation(@PathVariable UUID invitationId,
                                                 @RequestHeader("X-User-Id") UUID userId) {
        bandApplicationService.acceptInvitation(invitationId, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{bandId}/rehearsals")
    public ResponseEntity<Rehearsal> scheduleRehearsal(@PathVariable UUID bandId,
                                                       @Validated @RequestBody ScheduleRehearsalRequest request) {
        Rehearsal rehearsal = bandApplicationService.scheduleRehearsal(bandId, request.getDateTime(), request.getLocation(), request.getNotes());
        return ResponseEntity.ok(rehearsal);
    }

    @PostMapping("/{bandId}/setlists")
    public ResponseEntity<Setlist> createSetlist(@PathVariable UUID bandId,
                                                 @Validated @RequestBody CreateSetlistRequest request) {
        Setlist setlist = bandApplicationService.createSetlist(bandId, request.getName(), request.getDescription());
        return ResponseEntity.ok(setlist);
    }
}
