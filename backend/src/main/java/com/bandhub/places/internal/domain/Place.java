package com.bandhub.places.internal.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "places", schema = "schema_places")
@Getter
@Setter
@NoArgsConstructor
public class Place {

    public enum PlaceType { BAR, RECORDING_STUDIO, REHEARSAL_ROOM, VENUE, OTHER }

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "created_by_email", nullable = false)
    private String createdByEmail;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "latitude", nullable = false)
    private Double latitude;

    @Column(name = "longitude", nullable = false)
    private Double longitude;

    @Enumerated(EnumType.STRING)
    @Column(name = "place_type", nullable = false)
    private PlaceType placeType;

    @Column(name = "address")
    private String address;

    @Column(name = "created_at")
    private ZonedDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = ZonedDateTime.now();
    }
}
