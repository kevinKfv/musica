package com.bandhub.social.internal.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;
import java.util.List;

@Repository
public interface FollowRelationRepository extends JpaRepository<FollowRelation, UUID> {
    Optional<FollowRelation> findByFollowerIdAndTargetId(UUID followerId, UUID targetId);
    
    List<FollowRelation> findByFollowerId(UUID followerId);
}
