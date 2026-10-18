package com.bandhub.auth;

import java.util.UUID;

public record UserRegisteredEvent(UUID accountId, String email) {
}
