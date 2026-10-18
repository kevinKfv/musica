package com.bandhub.places.internal.application;

import com.bandhub.places.internal.domain.Place;
import com.bandhub.places.internal.domain.PlaceRepository;
import com.bandhub.places.internal.web.dto.CreatePlaceRequest;
import com.bandhub.places.internal.web.dto.PlaceDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlaceService {

    private final PlaceRepository placeRepository;

    @Transactional(readOnly = true)
    public List<PlaceDTO> getAllPlaces() {
        return placeRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public PlaceDTO createPlace(CreatePlaceRequest request, String currentUserEmail) {
        Place place = new Place();
        place.setName(request.getName());
        place.setDescription(request.getDescription());
        place.setLatitude(request.getLatitude());
        place.setLongitude(request.getLongitude());
        place.setPlaceType(request.getPlaceType());
        place.setAddress(request.getAddress());
        place.setCreatedByEmail(currentUserEmail);

        Place savedPlace = placeRepository.save(place);
        return mapToDTO(savedPlace);
    }

    private PlaceDTO mapToDTO(Place place) {
        PlaceDTO dto = new PlaceDTO();
        dto.setId(place.getId());
        dto.setName(place.getName());
        dto.setDescription(place.getDescription());
        dto.setLatitude(place.getLatitude());
        dto.setLongitude(place.getLongitude());
        dto.setPlaceType(place.getPlaceType());
        dto.setAddress(place.getAddress());
        dto.setCreatedAt(place.getCreatedAt());
        dto.setCreatedByEmail(place.getCreatedByEmail());
        return dto;
    }
}
