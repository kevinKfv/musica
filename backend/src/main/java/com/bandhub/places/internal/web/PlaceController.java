package com.bandhub.places.internal.web;

import com.bandhub.places.internal.application.PlaceService;
import com.bandhub.places.internal.web.dto.CreatePlaceRequest;
import com.bandhub.places.internal.web.dto.PlaceDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/places")
@RequiredArgsConstructor
public class PlaceController {

    private final PlaceService placeService;

    @GetMapping
    public ResponseEntity<List<PlaceDTO>> getAllPlaces() {
        return ResponseEntity.ok(placeService.getAllPlaces());
    }

    @PostMapping
    public ResponseEntity<PlaceDTO> createPlace(@RequestBody CreatePlaceRequest request,
                                                @AuthenticationPrincipal Jwt jwt) {
        String userEmail = jwt.getClaimAsString("email");
        PlaceDTO createdPlace = placeService.createPlace(request, userEmail);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPlace);
    }
}
