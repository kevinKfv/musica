package com.bandhub.bands.internal.web.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateBandRequest {
    @NotBlank
    private String name;
    private String bio;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
}
