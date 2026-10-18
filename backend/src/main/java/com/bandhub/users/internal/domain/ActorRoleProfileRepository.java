package com.bandhub.users.internal.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface ActorRoleProfileRepository extends JpaRepository<ActorRoleProfile, UUID> {
}
