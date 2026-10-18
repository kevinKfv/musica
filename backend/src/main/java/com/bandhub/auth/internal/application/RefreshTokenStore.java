package com.bandhub.auth.internal.application;

/**
 * Abstracción para el almacenamiento de refresh tokens.
 * Permite intercambiar la implementación según el perfil (local vs producción).
 */
public interface RefreshTokenStore {
    void save(String token, String email, long expirationDays);
    String getAndRevoke(String token);
}
