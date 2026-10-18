package com.bandhub.users.internal.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;

public class ActivateRoleRequest {
    
    @NotBlank
    private String role;
    
    private String description;
    
    @Min(0)
    private Integer yearsOfExperience;

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getYearsOfExperience() { return yearsOfExperience; }
    public void setYearsOfExperience(Integer yearsOfExperience) { this.yearsOfExperience = yearsOfExperience; }
}
