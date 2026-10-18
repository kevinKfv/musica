package com.bandhub.auth.internal.application;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

/**
 * Implementación en memoria del RefreshTokenStore para el perfil local.
 * No requiere Redis — los tokens se almacenan en un ConcurrentHashMap.
 * Los tokens se pierden al reiniciar el servidor (comportamiento esperado en dev).
 */
@Component
@Profile("local")
public class InMemoryRefreshTokenStore implements RefreshTokenStore {

    private final Map<String, String> store = new ConcurrentHashMap<>();

    @Override
    public void save(String token, String email, long expirationDays) {
        // En local no manejamos expiración — suficiente para desarrollo
        store.put(token, email);
    }

    @Override
    public String getAndRevoke(String token) {
        return store.remove(token); // remove() devuelve el valor y lo elimina (token rotation)
    }
}
