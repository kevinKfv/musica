package com.bandhub.bands;

import java.util.UUID;

public record MemberInvitedEvent(UUID bandId, String bandName, String inviteeEmail) {
}
