package com.bandhub.auth.internal.application;

import com.bandhub.auth.internal.domain.Account;
import com.bandhub.auth.internal.domain.AccountRepository;
import com.bandhub.auth.internal.web.dto.AuthRequest;
import com.bandhub.auth.internal.web.dto.AuthResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.context.ApplicationEventPublisher;
import com.bandhub.auth.UserRegisteredEvent;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
public class AuthApplicationService {

    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenProviderService tokenProviderService;
    private final AuthenticationManager authenticationManager;
    private final ApplicationEventPublisher applicationEventPublisher;

    public AuthApplicationService(AccountRepository accountRepository, 
                                  PasswordEncoder passwordEncoder,
                                  TokenProviderService tokenProviderService,
                                  AuthenticationManager authenticationManager,
                                  ApplicationEventPublisher applicationEventPublisher) {
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProviderService = tokenProviderService;
        this.authenticationManager = authenticationManager;
        this.applicationEventPublisher = applicationEventPublisher;
    }

    @Transactional
    public AuthResponse register(AuthRequest request) {
        if (accountRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        Account account = new Account();
        account.setEmail(request.getEmail());
        account.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        
        accountRepository.save(account);

        applicationEventPublisher.publishEvent(new UserRegisteredEvent(account.getId(), account.getEmail()));

        return authenticate(request);
    }

    public AuthResponse authenticate(AuthRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User userDetails = new User(request.getEmail(), "", Collections.emptyList());
        String jwtToken = tokenProviderService.generateToken(userDetails);
        
        return new AuthResponse(jwtToken, request.getEmail());
    }
}
