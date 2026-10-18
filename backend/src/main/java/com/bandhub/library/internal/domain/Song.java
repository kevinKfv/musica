package com.bandhub.library.internal.domain;

import jakarta.persistence.*;
import java.util.UUID;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "songs", schema = "schema_library")
public class Song {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    private String artist;
    private String genre;

    @Column(name = "created_by", nullable = false)
    private UUID createdBy;

    @Column(name = "band_id")
    private UUID bandId;

    @OneToMany(mappedBy = "song", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SheetMusic> sheetMusics = new ArrayList<>();

    @OneToMany(mappedBy = "song", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AudioTrack> audioTracks = new ArrayList<>();

    @Column(name = "created_at")
    private ZonedDateTime createdAt;

    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;

    @Column(name = "deleted_at")
    private ZonedDateTime deletedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = ZonedDateTime.now();
        updatedAt = ZonedDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = ZonedDateTime.now();
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getArtist() { return artist; }
    public void setArtist(String artist) { this.artist = artist; }

    public String getGenre() { return genre; }
    public void setGenre(String genre) { this.genre = genre; }

    public UUID getCreatedBy() { return createdBy; }
    public void setCreatedBy(UUID createdBy) { this.createdBy = createdBy; }

    public UUID getBandId() { return bandId; }
    public void setBandId(UUID bandId) { this.bandId = bandId; }

    public List<SheetMusic> getSheetMusics() { return sheetMusics; }
    public void addSheetMusic(SheetMusic sheetMusic) {
        sheetMusics.add(sheetMusic);
        sheetMusic.setSong(this);
    }
    public void removeSheetMusic(SheetMusic sheetMusic) {
        sheetMusics.remove(sheetMusic);
        sheetMusic.setSong(null);
    }

    public List<AudioTrack> getAudioTracks() { return audioTracks; }
    public void addAudioTrack(AudioTrack audioTrack) {
        audioTracks.add(audioTrack);
        audioTrack.setSong(this);
    }
    public void removeAudioTrack(AudioTrack audioTrack) {
        audioTracks.remove(audioTrack);
        audioTrack.setSong(null);
    }

    public ZonedDateTime getCreatedAt() { return createdAt; }
    public ZonedDateTime getUpdatedAt() { return updatedAt; }
    public ZonedDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(ZonedDateTime deletedAt) { this.deletedAt = deletedAt; }
}
