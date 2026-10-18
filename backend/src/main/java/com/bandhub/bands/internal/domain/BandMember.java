package com.bandhub.bands.internal.domain;

import jakarta.persistence.*;
import java.util.UUID;
import java.time.LocalDateTime;

@Entity
@Table(name = "band_members", schema = "schema_bands")
public class BandMember {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "band_id", nullable = false)
    private Band band;

    @Column(nullable = false)
    private UUID userId; // Decoupled reference to module-users / Account

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BandRole role;

    private LocalDateTime joinedAt;

    @PrePersist
    protected void onCreate() {
        joinedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Band getBand() { return band; }
    public void setBand(Band band) { this.band = band; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public BandRole getRole() { return role; }
    public void setRole(BandRole role) { this.role = role; }

    public LocalDateTime getJoinedAt() { return joinedAt; }
}
