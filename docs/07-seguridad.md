# 07 - Arquitectura de Seguridad y Autorización

## 1. Visión General de Seguridad

La seguridad en **BandHub** adopta el modelo **Zero-Trust** (Confianza Cero). Toda petición REST debe ser autenticada y autorizada de forma explícita, salvo las rutas públicas documentadas (registro, login, documentación Swagger).

---

## 2. Estrategia de Autenticación (JWT + Refresh Token Rotation)

### 2.1. Tokens y Tiempos de Vida
- **Access Token (JWT)**:
  - Vida útil: **15 minutos**.
  - Formato: Signed JWT (HMAC-SHA512 o RSA-256).
  - Almacenamiento en cliente: Memoria en React State / Zustand (jamás en `localStorage` por riesgo XSS).
  - Payload: `sub` (Account UUID), `email`, `activeRoles`, `permissions`, `exp`, `iat`, `jti`.
- **Refresh Token**:
  - Vida útil: **7 días**.
  - Formato: Cadena aleatoria de 64 caracteres criptográficamente segura.
  - Almacenamiento en cliente: Cookie `HttpOnly`, `Secure`, `SameSite=Strict`.
  - Persistencia: Almacenado en **Redis** con su respectivo TTL.

### 2.2. Flujo de Rotación de Refresh Token (Token Rotation)
Cada vez que el cliente solicita un nuevo Access Token usando el Refresh Token:
1. El backend valida la existencia del Refresh Token en Redis.
2. Si es válido, **revoca inmediatamente el Refresh Token anterior** y emite un par nuevo (Access + Refresh Token).
3. Si se detecta el reúso de un Refresh Token ya revocado, se asume un ataque de secuestro de sesión y se inhabilitan **todas** las sesiones activas de ese usuario en Redis.

---

## 3. Autenticación de Dos Factores (MFA / TOTP)

- Basado en RFC 6238 (Time-Based One-Time Password - TOTP).
- Compatible con aplicaciones de autenticación estándar (Google Authenticator, Authy, 1Password).
- Durante el login, si el usuario tiene MFA activo, la API responde con un `mfa_required_token` de 5 minutos de validez. El Access Token definitivo solo se entrega tras validar el código de 6 dígitos.

---

## 4. Modelo de Autorización (RBAC + ABAC)

BandHub implementa un modelo de autorización flexible para soportar el esquema multi-rol:

### 4.1. Role-Based Access Control (RBAC)
- Permisos asignados a nivel global (ej. `ROLE_USER`, `ROLE_ADMIN`, `ROLE_MODERATOR`).

### 4.2. Attribute-Based Access Control (ABAC) - Contextual
- Permite verificar condiciones como:
  - *"¿Es el usuario actual el Líder o Administrador de la Banda X?"* (`@PreAuthorize("@bandSecurity.isLeader(#bandId, principal)")`)
  - *"¿Tiene el usuario el perfil de Profesor activo para crear un curso?"*

---

## 5. Protecciones OWASP y Configuración de Infraestructura

- **Password Hashing**: BCrypt con factor de costo `cost=12` o Argon2id.
- **Rate Limiting (Protección Anti-DDoS / Brute Force)**:
  - Implementado mediante **Bucket4j** y **Redis**.
  - Login / Auth Endpoints: Máximo **5 intentos por minuto** por IP.
  - API General: Máximo **100 peticiones por minuto** por usuario autenticado.
- **CORS Configurado**: Orígenes permitidos restringidos estrictamente al dominio de producción y desarrollo localhost autorizado.
- **CSRF (Cross-Site Request Forgery)**: Deshabilitado para peticiones stateless JWT, habilitado para la cookie de Refresh Token mediante `SameSite=Strict`.
- **Cabeceras de Seguridad HTTP**:
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains`
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Content-Security-Policy: default-src 'self'`
