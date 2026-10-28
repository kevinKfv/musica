package com.bandhub.auth.internal.web;

import com.bandhub.auth.internal.application.AuthApplicationService;
import com.bandhub.auth.internal.application.TokenProviderService;
import com.bandhub.auth.internal.web.dto.AuthRequest;
import com.bandhub.auth.internal.web.dto.AuthResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Collections;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthApplicationService authService;
    private final TokenProviderService tokenProviderService;

    @Value("${cookie.secure:true}")
    private boolean cookieSecure;

    @Value("${cookie.same-site:None}")
    private String cookieSameSite;

    public AuthController(AuthApplicationService authService, TokenProviderService tokenProviderService) {
        this.authService = authService;
        this.tokenProviderService = tokenProviderService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody AuthRequest request, HttpServletResponse response) {
        AuthResponse authResponse = authService.register(request);
        setRefreshTokenCookie(response, request.getEmail());
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticate(@RequestBody AuthRequest request, HttpServletResponse response) {
        AuthResponse authResponse = authService.authenticate(request);
        setRefreshTokenCookie(response, request.getEmail());
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthResponse> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = null;
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("refreshToken".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }

        if (refreshToken == null) {
            return ResponseEntity.status(401).build();
        }

        String email = tokenProviderService.validateRefreshTokenAndGetEmail(refreshToken);
        if (email == null) {
            return ResponseEntity.status(401).build();
        }

        User userDetails = new User(email, "", Collections.emptyList());
        String newAccessToken = tokenProviderService.generateToken(userDetails);
        
        // Token Rotation: set new refresh token
        setRefreshTokenCookie(response, email);

        return ResponseEntity.ok(new AuthResponse(newAccessToken, email));
    }

    private void setRefreshTokenCookie(HttpServletResponse response, String email) {
        String newRefreshToken = tokenProviderService.generateRefreshToken(email);
        ResponseCookie cookie = ResponseCookie.from("refreshToken", newRefreshToken)
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite(cookieSameSite)
                .path("/api/v1/auth")
                .maxAge(Duration.ofDays(7))
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
