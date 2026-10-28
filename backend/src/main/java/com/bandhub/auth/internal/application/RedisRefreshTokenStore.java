package com.bandhub.auth.internal.application;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;

/**
 * Implementación Redis del RefreshTokenStore para producción con Redis.
 * Los tokens se almacenan con TTL y se revocan automáticamente.
 */
@Component
@ConditionalOnProperty(name = "spring.data.redis.enabled", havingValue = "true")
public class RedisRefreshTokenStore implements RefreshTokenStore {

    private static final String KEY_PREFIX = "refresh_token:";

    private final StringRedisTemplate redisTemplate;

    public RedisRefreshTokenStore(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public void save(String token, String email, long expirationDays) {
        redisTemplate.opsForValue().set(
            KEY_PREFIX + token,
            email,
            Duration.ofDays(expirationDays)
        );
    }

    @Override
    public String getAndRevoke(String token) {
        String key = KEY_PREFIX + token;
        String email = redisTemplate.opsForValue().get(key);
        if (email != null) {
            redisTemplate.delete(key); // Token rotation: revocar inmediatamente
        }
        return email;
    }
}
