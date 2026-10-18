package com.bandhub.bands.internal.application;

import com.bandhub.bands.MemberInvitedEvent;
import com.bandhub.bands.internal.domain.*;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class BandApplicationService {

    private final BandRepository bandRepository;
    private final BandInvitationRepository invitationRepository;
    private final RehearsalRepository rehearsalRepository;
    private final SetlistRepository setlistRepository;
    private final ApplicationEventPublisher eventPublisher;

    public BandApplicationService(BandRepository bandRepository,
                                  BandInvitationRepository invitationRepository,
                                  RehearsalRepository rehearsalRepository,
                                  SetlistRepository setlistRepository,
                                  ApplicationEventPublisher eventPublisher) {
        this.bandRepository = bandRepository;
        this.invitationRepository = invitationRepository;
        this.rehearsalRepository = rehearsalRepository;
        this.setlistRepository = setlistRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public Band createBand(String name, String bio, UUID creatorUserId) {
        Band band = new Band();
        band.setName(name);
        band.setBio(bio);

        BandMember leader = new BandMember();
        leader.setUserId(creatorUserId);
        leader.setRole(BandRole.LEADER);
        
        band.addMember(leader);
        return bandRepository.save(band);
    }

    @Transactional
    public BandInvitation inviteMember(UUID bandId, String email) {
        Band band = bandRepository.findById(bandId)
                .orElseThrow(() -> new RuntimeException("Band not found"));

        // Check if invitation already exists
        boolean alreadyInvited = band.getInvitations().stream()
                .anyMatch(i -> i.getEmail().equalsIgnoreCase(email) && i.getStatus() == InvitationStatus.PENDING);
                
        if (alreadyInvited) {
            throw new RuntimeException("User is already invited");
        }

        BandInvitation invitation = new BandInvitation();
        invitation.setEmail(email);
        band.addInvitation(invitation);
        
        bandRepository.save(band);

        eventPublisher.publishEvent(new MemberInvitedEvent(band.getId(), band.getName(), email));

        return invitation;
    }

    @Transactional
    public void acceptInvitation(UUID invitationId, UUID userId) {
        BandInvitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new RuntimeException("Invitation not found"));

        if (invitation.getStatus() != InvitationStatus.PENDING) {
            throw new RuntimeException("Invitation is no longer pending");
        }

        invitation.setStatus(InvitationStatus.ACCEPTED);
        
        Band band = invitation.getBand();
        BandMember member = new BandMember();
        member.setUserId(userId);
        member.setRole(BandRole.MEMBER);
        
        band.addMember(member);
        bandRepository.save(band);
    }

    @Transactional
    public Rehearsal scheduleRehearsal(UUID bandId, LocalDateTime dateTime, String location, String notes) {
        Band band = bandRepository.findById(bandId)
                .orElseThrow(() -> new RuntimeException("Band not found"));

        Rehearsal rehearsal = new Rehearsal();
        rehearsal.setBand(band);
        rehearsal.setDateTime(dateTime);
        rehearsal.setLocation(location);
        rehearsal.setNotes(notes);

        return rehearsalRepository.save(rehearsal);
    }

    @Transactional
    public Setlist createSetlist(UUID bandId, String name, String description) {
        Band band = bandRepository.findById(bandId)
                .orElseThrow(() -> new RuntimeException("Band not found"));

        Setlist setlist = new Setlist();
        setlist.setBand(band);
        setlist.setName(name);
        setlist.setDescription(description);

        return setlistRepository.save(setlist);
    }
}
