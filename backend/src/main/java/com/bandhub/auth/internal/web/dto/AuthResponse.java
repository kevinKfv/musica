package com.bandhub.auth.internal.web.dto;

public class AuthResponse {
    private String accessToken;
    private String email;

    public AuthResponse(String accessToken, String email) {
        this.accessToken = accessToken;
        this.email = email;
    }

    public String getAccessToken() { return accessToken; }
    public void setAccessToken(String accessToken) { this.accessToken = accessToken; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
