package com.bandhub.places.internal.web.dto;

import com.bandhub.places.internal.domain.Place;
import lombok.Data;
import java.time.ZonedDateTime;
import java.util.UUID;

@Data
public class PlaceDTO {
    private UUID id;
    private String name;
    private String description;
    private Double latitude;
    private Double longitude;
    private Place.PlaceType placeType;
    private String address;
    private ZonedDateTime createdAt;
    private String createdByEmail;
}
