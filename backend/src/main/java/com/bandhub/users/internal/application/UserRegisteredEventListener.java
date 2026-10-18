package com.bandhub.users.internal.application;

import com.bandhub.auth.UserRegisteredEvent;
import com.bandhub.users.internal.domain.UserProfile;
import com.bandhub.users.internal.domain.UserProfileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.modulith.events.ApplicationModuleListener;
import org.springframework.stereotype.Component;

@Component
public class UserRegisteredEventListener {

    private static final Logger logger = LoggerFactory.getLogger(UserRegisteredEventListener.class);
    
    private final UserProfileRepository userProfileRepository;

    public UserRegisteredEventListener(UserProfileRepository userProfileRepository) {
        this.userProfileRepository = userProfileRepository;
    }

    @ApplicationModuleListener
    public void on(UserRegisteredEvent event) {
        logger.info("Received UserRegisteredEvent for account: {}", event.accountId());
        
        if (userProfileRepository.existsById(event.accountId())) {
            logger.warn("UserProfile already exists for account: {}", event.accountId());
            return;
        }

        UserProfile profile = new UserProfile();
        profile.setAccountId(event.accountId());
        profile.setEmail(event.email());
        
        userProfileRepository.save(profile);
        logger.info("Created default UserProfile for account: {}", event.accountId());
    }
}
