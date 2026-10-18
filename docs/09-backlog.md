# 09 - Backlog Inicial de Producto e Historias de Usuario

## 1. Criterios de Calidad de Historias de Usuario

Todas las Historias de Usuario (US) deben cumplir el estándar **INVEST** y definir Criterios de Aceptación bajo el formato **BDD (Given-When-Then / Dado-Cuando-Entonces)**.

---

## 2. Definición de Preparado (Definition of Ready - DoR)
Una Historia de Usuario está **Ready** para entrar en desarrollo si:
1. Posee un valor de negocio claro y descripción de actor.
2. Contiene Criterios de Aceptación BDD sin ambigüedades.
3. Se han identificado los módulos involucrados y sus eventos.
4. Los mockups/wireframes UI (si aplica) están definidos.

---

## 3. Definición de Hecho (Definition of Done - DoD)
Una Historia de Usuario está **Done** si:
1. El código cumple con las directrices de Clean Architecture y SOLID.
2. Las migraciones Flyway están creadas y probadas.
3. Cobertura de pruebas unitarias/integración >= 80%.
4. Pruebas de verificación de módulos Spring Modulith aprobadas.
5. Endpoints documentados en Swagger / OpenAPI.
6. Código revisado e integrado en la rama principal tras CI/CD limpio.

---

## 4. Backlog Priorizado (Extracto Fase 1 - Fase 4)

### US-01.1: Configuración de Infraestructura Monolito Modular
- **Como** Ingeniero de Software,
- **Quiero** contar con un entorno Docker Compose con PostgreSQL, Redis y MinIO, junto al proyecto Spring Boot 3 estructurado en Spring Modulith,
- **Para** iniciar el desarrollo con desacoplamiento y persistencia aislada por esquemas.
- **Criterios de Aceptación**:
  - *Dado* el comando `docker compose up -d`, *Cuando* los contenedores inician, *Entonces* PostgreSQL, Redis y MinIO están saludables y accesibles.
  - *Dado* el proyecto Spring Boot, *Cuando* se ejecuta `modules.verify()`, *Entonces* la prueba pasa sin detectar dependencias cíclicas.

### US-02.1: Registro de Cuenta de Usuario
- **Como** Músico o Profesional de la industria,
- **Quiero** registrar una cuenta con mi correo y contraseña,
- **Para** acceder a las funcionalidades de BandHub.
- **Criterios de Aceptación**:
  - *Dado* un correo no registrado previamente y contraseña válida (mínimo 8 caracteres, números y símbolos), *Cuando* envío el formulario de registro, *Entonces* se crea el registro en `schema_auth.accounts`, la contraseña se cifra con BCrypt cost 12 y se publica `UserRegisteredEvent`.

### US-02.2: Autenticación JWT y Rotación de Refresh Token
- **Como** Usuario registrado,
- **Quiero** iniciar sesión de forma segura y mantener mi sesión activa mediante tokens,
- **Para** interactuar con la plataforma sin ingresar credenciales constantemente.
- **Criterios de Aceptación**:
  - *Dado* credenciales válidas, *Cuando* solicito el inicio de sesión, *Entonces* obtengo un Access Token JWT (15 min) en JSON y un Refresh Token en cookie `HttpOnly`.
  - *Dado* un Refresh Token expirado o revocado, *Cuando* intento solicitar un nuevo Access Token, *Entonces* la API responde `401 Unauthorized` e inhabilita las sesiones activas del usuario.

### US-03.1: Activación de Múltiples Roles de Actor
- **Como** Usuario autenticado,
- **Quiero** activar los roles de "Guitarrista", "Productor" y "Profesor de Música" en mi perfil único,
- **Para** ofrecer servicios distintos dentro de la plataforma sin crear múltiples cuentas.
- **Criterios de Aceptación**:
  - *Dado* mi perfil activo, *Cuando* selecciono agregar el rol `TEACHER` con mis detalles pedagógicos, *Entonces* se registra en `schema_users.actor_roles` y mi Access Token JWT refleja el nuevo alcance de permisos tras refrescarse.

### US-04.1: Creación e Invitación a Agrupación Musical (Banda)
- **Como** Líder de una banda,
- **Quiero** crear el perfil de mi grupo e invitar a otros miembros registrados mediante su correo,
- **Para** coordinar ensayos y repertorio en conjunto.
- **Criterios de Aceptación**:
  - *Dado* una banda creada, *Cuando* envío una invitación a un usuario existente, *Entonces* se emite `MemberInvitedEvent`, el invitado recibe una notificación y al aceptar se le asigna el rol `BAND_MEMBER`.
