package com.bandhub.users.internal.domain;

import jakarta.persistence.*;
import java.util.UUID;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "user_profiles", schema = "schema_users")
public class UserProfile {

    @Id
    private UUID accountId; // Used as the primary key and corresponds to Account.id

    @Column(nullable = false, unique = true)
    private String email;

    private String avatarUrl;
    
    @Column(columnDefinition = "TEXT")
    private String bio;
    
    private String location;

    @OneToMany(mappedBy = "userProfile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ActorRoleProfile> roles = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

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

    public List<ActorRoleProfile> getRoles() { return roles; }
    public void addRole(ActorRoleProfile role) {
        roles.add(role);
        role.setUserProfile(this);
    }
    public void removeRole(ActorRoleProfile role) {
        roles.remove(role);
        role.setUserProfile(null);
    }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
