package com.bandhub.bands.internal.domain;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "setlist_songs", schema = "schema_bands")
public class SetlistSong {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "setlist_id", nullable = false)
    private Setlist setlist;

    @Column(nullable = false)
    private String songName;

    private String notes;
    
    @Column(name = "song_order")
    private Integer order;

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Setlist getSetlist() { return setlist; }
    public void setSetlist(Setlist setlist) { this.setlist = setlist; }

    public String getSongName() { return songName; }
    public void setSongName(String songName) { this.songName = songName; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Integer getOrder() { return order; }
    public void setOrder(Integer order) { this.order = order; }
}
