package com.bandhub.auth.internal.application;

import com.bandhub.auth.internal.domain.Account;
import com.bandhub.auth.internal.domain.AccountRepository;
import com.bandhub.auth.internal.web.dto.AuthRequest;
import com.bandhub.auth.internal.web.dto.AuthResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthApplicationServiceTest {

    @Mock
    private AccountRepository accountRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private TokenProviderService tokenProviderService;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private ApplicationEventPublisher applicationEventPublisher;

    @InjectMocks
    private AuthApplicationService authApplicationService;

    private AuthRequest authRequest;

    @BeforeEach
    void setUp() {
        authRequest = new AuthRequest();
        authRequest.setEmail("musico@bandhub.com");
        authRequest.setPassword("password123");
    }

    @Test
    void register_success() {
        when(accountRepository.existsByEmail("musico@bandhub.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPasswordHash");
        when(accountRepository.save(any(Account.class))).thenAnswer(invocation -> {
            Account acc = invocation.getArgument(0);
            acc.setId(UUID.randomUUID());
            return acc;
        });
        when(tokenProviderService.generateToken(any(UserDetails.class))).thenReturn("jwt-token-xyz");

        AuthResponse response = authApplicationService.register(authRequest);

        assertNotNull(response);
        assertEquals("musico@bandhub.com", response.getEmail());
        assertEquals("jwt-token-xyz", response.getAccessToken());
        verify(accountRepository, times(1)).save(any(Account.class));
        verify(applicationEventPublisher, times(1)).publishEvent(any());
    }

    @Test
    void register_failsWhenEmailAlreadyExists() {
        when(accountRepository.existsByEmail("musico@bandhub.com")).thenReturn(true);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authApplicationService.register(authRequest);
        });

        assertEquals("Email already in use", exception.getMessage());
        verify(accountRepository, never()).save(any(Account.class));
        verify(applicationEventPublisher, never()).publishEvent(any());
    }

    @Test
    void authenticate_success() {
        when(tokenProviderService.generateToken(any(UserDetails.class))).thenReturn("valid-jwt-token");

        AuthResponse response = authApplicationService.authenticate(authRequest);

        assertNotNull(response);
        assertEquals("musico@bandhub.com", response.getEmail());
        assertEquals("valid-jwt-token", response.getAccessToken());
        verify(authenticationManager, times(1)).authenticate(
                any(UsernamePasswordAuthenticationToken.class)
        );
    }

    @Test
    void authenticate_throwsOnBadCredentials() {
        doThrow(new BadCredentialsException("Bad credentials"))
                .when(authenticationManager)
                .authenticate(any(UsernamePasswordAuthenticationToken.class));

        assertThrows(BadCredentialsException.class, () -> {
            authApplicationService.authenticate(authRequest);
        });

        verify(tokenProviderService, never()).generateToken(any(UserDetails.class));
    }
}
