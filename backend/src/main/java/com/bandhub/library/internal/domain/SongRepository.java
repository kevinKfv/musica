package com.bandhub.library.internal.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SongRepository extends JpaRepository<Song, UUID> {
    List<Song> findByCreatedByAndDeletedAtIsNull(UUID createdBy);
    List<Song> findByBandIdAndDeletedAtIsNull(UUID bandId);
}
