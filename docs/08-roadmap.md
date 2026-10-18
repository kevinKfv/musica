# 08 - Roadmap del Proyecto y Fases de Desarrollo

El desarrollo de **BandHub** se estructurará en **12 Fases Incrementales**. Cada fase entrega un valor funcional completo y probado sin dejar cabos sueltos.

---

## Roadmap de Ejecución

```
Fase 1: Infraestructura & Docker
   │
Fase 2: Autenticación & Seguridad Core (`module-auth`)
   │
Fase 3: Usuarios & Perfiles Multi-Rol (`module-users`)
   │
Fase 4: Bandas & Organización (`module-bands`)
   │
Fase 5: Agenda & Calendario (`module-agenda`)
   │
Fase 6: Biblioteca & MinIO (`module-library`)
   │
Fase 7: Marketplace & Contrataciones (`module-marketplace`)
   │
Fase 8: Eventos & Ticketing QR (`module-events`)
   │
Fase 9: Academia & Educación (`module-academy`)
   │
Fase 10: Mensajería & WebSockets (`module-chat`)
   │
Fase 11: Red Social & Feed (`module-social`)
   │
Fase 12: Colaboración Multipista & Admin (`module-collab` & `module-admin`)
```

---

## Detalle de Fases

### Fase 1: Infraestructura Base y Setup
- Configuración de entorno Docker Compose (PostgreSQL, Redis, MinIO).
- Setup de proyecto Spring Boot 3 con Java 21, Gradle/Maven y Spring Modulith.
- Setup de proyecto React + TypeScript con Vite, Tailwind, Zustand y React Router.
- Scripting de desarrollo y pipelines iniciales de CI/CD (GitHub Actions).

### Fase 2: Autenticación y Seguridad (`module-auth`)
- Implementación de esquemas `schema_auth` y migraciones Flyway.
- Spring Security, JWT, Refresh Token Rotation en Redis, MFA (TOTP).
- Frontend: Páginas de Login, Registro, Recuperación y Confirmación MFA.

### Fase 3: Usuarios y Perfiles Multi-Rol (`module-users`)
- Perfil unificado de usuario, avatar, biografía, ubicación.
- Activación de roles polimórficos de actor (Músico, Productor, etc.).
- Integración con almacenamiento MinIO para portafolio multimedia.

### Fase 4: Bandas y Agrupaciones (`module-bands`)
- Creación de bandas, invitaciones, gestión de roles de banda.
- Creación de ensayos y setlists de canciones.

### Fase 5: Agenda y Calendario Unificado (`module-agenda`)
- Calendario consolidado con sincronización automática de ensayos y eventos.
- Confirmación de asistencia (RSVP) y alertas de conflicto.

### Fase 6: Biblioteca de Recursos Musicales (`module-library`)
- Subida y versionado de partituras (PDF/MusicXML) y backing tracks.
- Reproductor de audio embebido en frontend React.

### Fase 7: Marketplace Profesional (`module-marketplace`)
- Publicación de servicios profesionalizados y motor de búsqueda con filtros.
- Flujo completo de solicitud de reserva, aceptación y calificaciones.

### Fase 8: Eventos y Ticketing (`module-events`)
- Publicación de conciertos/festivales, configuración de entradas y aforos.
- Generación de código QR único y pantalla de Check-in para organizadores.

### Fase 9: Academia Musical (`module-academy`)
- Publicación de cursos/clases, inscripción de estudiantes y tareas.

### Fase 10: Mensajería en Tiempo Real (`module-chat`)
- Implementación de STOMP/WebSocket en backend y cliente React.
- Chats individuales, chats de banda y envío de notas de audio.

### Fase 11: Red Social y Feed (`module-social`)
- Publicación de post multimedia, feed cronológico/algorítmico, reacciones y comentarios.

### Fase 12: Colaboración Multipista y Administración (`module-collab` & `module-admin`)
- Estudio virtual de pistas multi-stem con timestamps.
- Dashboard de métricas y herramientas de moderación global.
