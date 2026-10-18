package com.bandhub.users.internal.web.dto;

import java.util.UUID;
import java.util.List;

public class UserProfileDto {
    private UUID accountId;
    private String email;
    private String avatarUrl;
    private String bio;
    private String location;
    private List<RoleDto> roles;

    // Getters and Setters
    public UUID getAccountId() { return accountId; }
    public void setAccountId(UUID accountId) { this.accountId = accountId; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    
    public List<RoleDto> getRoles() { return roles; }
    public void setRoles(List<RoleDto> roles) { this.roles = roles; }

    public static class RoleDto {
        private UUID id;
        private String role;
        private String description;
        private Integer yearsOfExperience;

        public RoleDto(UUID id, String role, String description, Integer yearsOfExperience) {
            this.id = id;
            this.role = role;
            this.description = description;
            this.yearsOfExperience = yearsOfExperience;
        }

        public UUID getId() { return id; }
        public String getRole() { return role; }
        public String getDescription() { return description; }
        public Integer getYearsOfExperience() { return yearsOfExperience; }
    }
}
