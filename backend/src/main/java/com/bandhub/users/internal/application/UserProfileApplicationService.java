package com.bandhub.users.internal.application;

import com.bandhub.users.internal.domain.ActorRole;
import com.bandhub.users.internal.domain.ActorRoleProfile;
import com.bandhub.users.internal.domain.UserProfile;
import com.bandhub.users.internal.domain.UserProfileRepository;
import com.bandhub.users.internal.web.dto.ActivateRoleRequest;
import com.bandhub.users.internal.web.dto.UserProfileDto;
import com.bandhub.users.internal.web.dto.UpdateProfileRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserProfileApplicationService {

    private final UserProfileRepository userProfileRepository;

    public UserProfileApplicationService(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    @Transactional(readOnly = true)
    public UserProfileDto getProfile(String email) {
        UserProfile profile = userProfileRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User profile not found for email: " + email));
        return mapToDto(profile);
    }

    @Transactional
    public UserProfileDto updateProfile(String email, UpdateProfileRequest request) {
        UserProfile profile = userProfileRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User profile not found for email: " + email));

        if (request.getAvatarUrl() != null) profile.setAvatarUrl(request.getAvatarUrl());
        if (request.getBio() != null) profile.setBio(request.getBio());
        if (request.getLocation() != null) profile.setLocation(request.getLocation());

        userProfileRepository.save(profile);
        return mapToDto(profile);
    }

    @Transactional
    public UserProfileDto activateRole(String email, ActivateRoleRequest request) {
        UserProfile profile = userProfileRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User profile not found for email: " + email));

        ActorRole requestedRole = ActorRole.valueOf(request.getRole().toUpperCase());
        
        boolean roleExists = profile.getRoles().stream()
                .anyMatch(r -> r.getRole() == requestedRole);
                
        if (roleExists) {
            throw new RuntimeException("Role " + requestedRole + " is already active for this user.");
        }

        ActorRoleProfile roleProfile = new ActorRoleProfile();
        roleProfile.setRole(requestedRole);
        roleProfile.setDescription(request.getDescription());
        roleProfile.setYearsOfExperience(request.getYearsOfExperience());

        profile.addRole(roleProfile);
        userProfileRepository.save(profile);

        // Here we could publish an ActorRoleActivatedEvent if needed by other modules

        return mapToDto(profile);
    }

    private UserProfileDto mapToDto(UserProfile profile) {
        UserProfileDto dto = new UserProfileDto();
        dto.setAccountId(profile.getAccountId());
        dto.setEmail(profile.getEmail());
        dto.setAvatarUrl(profile.getAvatarUrl());
        dto.setBio(profile.getBio());
        dto.setLocation(profile.getLocation());
        dto.setRoles(profile.getRoles().stream()
                .map(r -> new UserProfileDto.RoleDto(r.getId(), r.getRole().name(), r.getDescription(), r.getYearsOfExperience()))
                .collect(Collectors.toList()));
        return dto;
    }
}
