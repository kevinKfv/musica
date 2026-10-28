package com.bandhub.auth.internal.application;

import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

/**
 * Implementación en memoria del RefreshTokenStore (usado por defecto o cuando Redis no está activo).
 * No requiere Redis — los tokens se almacenan en un ConcurrentHashMap.
 */
@Component
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
