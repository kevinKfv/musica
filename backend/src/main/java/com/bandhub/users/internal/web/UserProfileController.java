package com.bandhub.users.internal.web;

import com.bandhub.users.internal.application.UserProfileApplicationService;
import com.bandhub.users.internal.web.dto.ActivateRoleRequest;
import com.bandhub.users.internal.web.dto.UpdateProfileRequest;
import com.bandhub.users.internal.web.dto.UserProfileDto;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
public class UserProfileController {

    private final UserProfileApplicationService userProfileApplicationService;

    public UserProfileController(UserProfileApplicationService userProfileApplicationService) {
        this.userProfileApplicationService = userProfileApplicationService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        UserProfileDto profile = userProfileApplicationService.getProfile(userDetails.getUsername());
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileDto> updateMyProfile(@AuthenticationPrincipal UserDetails userDetails,
                                                          @RequestBody UpdateProfileRequest request) {
        UserProfileDto profile = userProfileApplicationService.updateProfile(userDetails.getUsername(), request);
        return ResponseEntity.ok(profile);
    }

    @PostMapping("/me/roles")
    public ResponseEntity<UserProfileDto> activateRole(@AuthenticationPrincipal UserDetails userDetails,
                                                       @Validated @RequestBody ActivateRoleRequest request) {
        UserProfileDto profile = userProfileApplicationService.activateRole(userDetails.getUsername(), request);
        return ResponseEntity.ok(profile);
    }
}
