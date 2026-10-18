package com.bandhub.library.internal.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface AudioTrackRepository extends JpaRepository<AudioTrack, UUID> {
}
