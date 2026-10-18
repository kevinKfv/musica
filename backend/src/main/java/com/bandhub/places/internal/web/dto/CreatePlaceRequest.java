package com.bandhub.places.internal.web.dto;

import com.bandhub.places.internal.domain.Place;
import lombok.Data;

@Data
public class CreatePlaceRequest {
    private String name;
    private String description;
    private Double latitude;
    private Double longitude;
    private Place.PlaceType placeType;
    private String address;
}
