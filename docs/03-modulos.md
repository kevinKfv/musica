# 03 - Especificación de Módulos del Sistema

Cada módulo en BandHub está diseñado bajo los principios de Clean Architecture y DDD. Operan de forma desacoplada y se comunican únicamente mediante **Interfaces de Servicio de Aplicación** o **Eventos de Dominio**.

---

## 1. Módulo de Autenticación (`module-auth`)

- **Responsabilidades**: Identificación, autenticación de usuarios, emisión y validación de tokens JWT, MFA, gestión de sesiones y recuperación de credenciales.
- **Entidades de Dominio**: `Account`, `RefreshToken`, `MfaSecret`, `UserSession`, `PasswordResetToken`.
- **Casos de Uso**:
  - `RegisterUserUseCase`
  - `AuthenticateUserUseCase`
  - `RefreshTokenUseCase`
  - `EnableMfaUseCase` / `VerifyMfaUseCase`
  - `RevokeSessionUseCase`
  - `RequestPasswordResetUseCase` / `ResetPasswordUseCase`
- **Servicios de Aplicación**: `AuthApplicationService`, `TokenProviderService`, `MfaService`.
- **Endpoints REST**:
  - `POST /api/v1/auth/register`
  - `POST /api/v1/auth/login`
  - `POST /api/v1/auth/refresh-token`
  - `POST /api/v1/auth/mfa/enable`
  - `POST /api/v1/auth/mfa/verify`
  - `GET /api/v1/auth/sessions`
  - `DELETE /api/v1/auth/sessions/{sessionId}`
- **Eventos de Dominio Emitidos**: `UserRegisteredEvent`, `UserLoggedInEvent`, `PasswordChangedEvent`, `AccountLockedEvent`.
- **Permisos Exigidos**: Ninguno para endpoints públicos; `AUTHENTICATED` para gestión de sesiones/MFA.
- **Dependencias**: Ninguna (Módulo raíz).

---

## 2. Módulo de Usuarios (`module-users`)

- **Responsabilidades**: Gestión del perfil unificado, activación de roles de actor (Músico, Productor, etc.), portafolio multimedia, instrumentos y géneros.
- **Entidades de Dominio**: `UserProfile`, `ActorRoleProfile`, `InstrumentSkill`, `MusicGenre`, `PortfolioMedia`, `SocialLink`.
- **Casos de Uso**:
  - `CreateUserProfileUseCase`
  - `UpdateUserProfileUseCase`
  - `ActivateActorRoleUseCase`
  - `AddPortfolioMediaUseCase`
  - `SearchMusiciansUseCase`
- **Servicios de Aplicación**: `UserProfileApplicationService`, `PortfolioApplicationService`.
- **Endpoints REST**:
  - `GET /api/v1/users/me`
  - `PUT /api/v1/users/me`
  - `POST /api/v1/users/me/roles`
  - `POST /api/v1/users/me/portfolio`
  - `GET /api/v1/users/{userId}`
- **Eventos de Dominio Emitidos**: `UserProfileCreatedEvent`, `UserProfileUpdatedEvent`, `ActorRoleActivatedEvent`.
- **Permisos Exigidos**: `USER_READ`, `USER_WRITE`.
- **Dependencias**: `module-auth` (escuchador de `UserRegisteredEvent`).

---

## 3. Módulo de Bandas (`module-bands`)

- **Responsabilidades**: Creación de bandas/agrupaciones, gestión de integrantes, invitaciones, roles internos de la banda, organización de ensayos y setlists.
- **Entidades de Dominio**: `Band`, `BandMember`, `BandInvitation`, `Rehearsal`, `Setlist`, `SetlistSong`.
- **Casos de Uso**:
  - `CreateBandUseCase`
  - `InviteMemberToBandUseCase`
  - `RespondBandInvitationUseCase`
  - `CreateSetlistUseCase`
  - `ScheduleRehearsalUseCase`
- **Servicios de Aplicación**: `BandApplicationService`, `SetlistApplicationService`.
- **Endpoints REST**:
  - `POST /api/v1/bands`
  - `GET /api/v1/bands/{bandId}`
  - `POST /api/v1/bands/{bandId}/invitations`
  - `POST /api/v1/bands/{bandId}/setlists`
  - `POST /api/v1/bands/{bandId}/rehearsals`
- **Eventos de Dominio Emitidos**: `BandCreatedEvent`, `MemberJoinedBandEvent`, `RehearsalScheduledEvent`.
- **Permisos Exigidos**: `BAND_CREATE`, `BAND_MANAGE`, `BAND_MEMBER`.
- **Dependencias**: `module-users`.

---

## 4. Módulo de Agenda (`module-agenda`)

- **Responsabilidades**: Calendario consolidado, programación de eventos/ensayos/clases, confirmación RSVP y detección de conflictos de horario.
- **Entidades de Dominio**: `CalendarEntry`, `EventReminder`, `RsvpConfirmation`.
- **Casos de Uso**:
  - `CreateCalendarEntryUseCase`
  - `GetUserCalendarUseCase`
  - `ConfirmRsvpUseCase`
  - `CheckScheduleConflictUseCase`
- **Servicios de Aplicación**: `AgendaApplicationService`, `ConflictDetectionService`.
- **Endpoints REST**:
  - `GET /api/v1/agenda/events`
  - `POST /api/v1/agenda/events`
  - `POST /api/v1/agenda/events/{eventId}/rsvp`
- **Eventos de Dominio Emitidos**: `AgendaEventCreatedEvent`, `ScheduleConflictDetectedEvent`, `RsvpConfirmedEvent`.
- **Permisos Exigidos**: `AGENDA_READ`, `AGENDA_WRITE`.
- **Dependencias**: `module-users`, `module-bands` (vía eventos).

---

## 5. Módulo de Biblioteca (`module-library`)

- **Responsabilidades**: Almacenamiento de partituras (PDF/MusicXML), cifrados, archivos de audio, backing tracks y versionado de recursos musicales.
- **Entidades de Dominio**: `Song`, `SheetMusic`, `AudioTrack`, `ResourceVersion`.
- **Casos de Uso**:
  - `UploadSongResourceUseCase`
  - `CreateSheetMusicUseCase`
  - `GetSongResourceVersionsUseCase`
- **Servicios de Aplicación**: `LibraryApplicationService`, `MediaStorageService`.
- **Endpoints REST**:
  - `POST /api/v1/library/songs`
  - `POST /api/v1/library/songs/{songId}/sheets`
  - `GET /api/v1/library/songs/{songId}`
- **Eventos de Dominio Emitidos**: `ResourceUploadedEvent`, `SheetMusicUpdatedEvent`.
- **Permisos Exigidos**: `LIBRARY_READ`, `LIBRARY_WRITE`.
- **Dependencias**: `module-users`, MinIO Storage Adapter.

---

## 6. Módulo de Marketplace (`module-marketplace`)

- **Responsabilidades**: Publicación de ofertas de servicios (músicos de sesión, productores, salas de ensayo, estudios, profesores), motor de búsqueda avanzada y contratación.
- **Entidades de Dominio**: `ServiceListing`, `BookingRequest`, `ServiceContract`, `ReviewRating`.
- **Casos de Uso**:
  - `PublishServiceListingUseCase`
  - `SearchServicesUseCase`
  - `CreateBookingRequestUseCase`
  - `AcceptBookingRequestUseCase`
  - `SubmitReviewUseCase`
- **Servicios de Aplicación**: `MarketplaceApplicationService`, `ContractApplicationService`.
- **Endpoints REST**:
  - `POST /api/v1/marketplace/services`
  - `GET /api/v1/marketplace/services`
  - `POST /api/v1/marketplace/bookings`
  - `PUT /api/v1/marketplace/bookings/{bookingId}/status`
- **Eventos de Dominio Emitidos**: `ServicePublishedEvent`, `BookingRequestedEvent`, `BookingConfirmedEvent`.
- **Permisos Exigidos**: `MARKETPLACE_READ`, `MARKETPLACE_OFFER`, `MARKETPLACE_HIRE`.
- **Dependencias**: `module-users`, `module-agenda`.

---

## 7. Módulo de Eventos y Ticketing (`module-events`)

- **Responsabilidades**: Creación de conciertos/festivales, emisión de tickets con QR, proceso de check-in en puerta y analíticas de asistencia.
- **Entidades de Dominio**: `Event`, `TicketType`, `TicketIssuance`, `CheckInRecord`.
- **Casos de Uso**:
  - `CreateEventUseCase`
  - `PurchaseTicketUseCase`
  - `ValidateTicketQrUseCase`
  - `GetEventAnalyticsUseCase`
- **Servicios de Aplicación**: `EventApplicationService`, `TicketingApplicationService`.
- **Endpoints REST**:
  - `POST /api/v1/events`
  - `GET /api/v1/events/{eventId}`
  - `POST /api/v1/events/{eventId}/tickets/purchase`
  - `POST /api/v1/events/check-in/scan`
- **Eventos de Dominio Emitidos**: `EventCreatedEvent`, `TicketPurchasedEvent`, `CheckInCompletedEvent`.
- **Permisos Exigidos**: `EVENT_ORGANIZE`, `EVENT_SCANNER`, `USER_AUTHENTICATED`.
- **Dependencias**: `module-users`, `module-agenda`.

---

## 8. Módulo de Academia (`module-academy`)

- **Responsabilidades**: Cursos, asignaturas, lista de alumnos, asignación de ejercicios, control de asistencia y seguimiento pedagógico.
- **Entidades de Dominio**: `Course`, `Enrollment`, `Lesson`, `Assignment`, `Submission`, `AttendanceRecord`.
- **Casos de Uso**:
  - `CreateCourseUseCase`
  - `EnrollStudentUseCase`
  - `SubmitAssignmentUseCase`
  - `RecordAttendanceUseCase`
- **Servicios de Aplicación**: `AcademyApplicationService`, `AssignmentApplicationService`.
- **Endpoints REST**:
  - `POST /api/v1/academy/courses`
  - `POST /api/v1/academy/courses/{courseId}/enroll`
  - `POST /api/v1/academy/lessons/{lessonId}/assignments`
  - `POST /api/v1/academy/assignments/{assignmentId}/submit`
- **Eventos de Dominio Emitidos**: `CoursePublishedEvent`, `StudentEnrolledEvent`, `AssignmentSubmittedEvent`.
- **Permisos Exigidos**: `TEACHER_ROLE`, `STUDENT_ROLE`.
- **Dependencias**: `module-users`, `module-library`.

---

## 9. Módulo de Mensajería (`module-chat`)

- **Responsabilidades**: Chat directo y de grupo, envío de archivos/notas de voz, notificaciones WebSocket y estados de lectura.
- **Entidades de Dominio**: `Conversation`, `ChatMessage`, `MessageAttachment`, `ChatParticipant`.
- **Casos de Uso**:
  - `StartConversationUseCase`
  - `SendMessageUseCase`
  - `MarkMessagesAsReadUseCase`
- **Servicios de Aplicación**: `ChatApplicationService`, `WebSocketNotificationService`.
- **Endpoints REST / WS**:
  - `POST /api/v1/chat/conversations`
  - `GET /api/v1/chat/conversations/{conversationId}/messages`
  - `WS /ws/chat` (STOMP Broker)
- **Eventos de Dominio Emitidos**: `MessageSentEvent`, `ConversationCreatedEvent`.
- **Permisos Exigidos**: `CHAT_ACCESS`.
- **Dependencias**: `module-users`.

---

## 10. Módulo de Red Social (`module-social`)

- **Responsabilidades**: Publicaciones en feed (texto, fotos, video, audio), comentarios, me gusta, compartir, y sistema de seguidores.
- **Entidades de Dominio**: `Post`, `PostMedia`, `Comment`, `Reaction`, `FollowRelation`.
- **Casos de Uso**:
  - `CreatePostUseCase`
  - `InteractWithPostUseCase`
  - `FollowUserOrBandUseCase`
  - `GetUserFeedUseCase`
- **Servicios de Aplicación**: `SocialApplicationService`, `FeedProjectionService`.
- **Endpoints REST**:
  - `POST /api/v1/social/posts`
  - `GET /api/v1/social/feed`
  - `POST /api/v1/social/posts/{postId}/reactions`
  - `POST /api/v1/social/follow/{targetId}`
- **Eventos de Dominio Emitidos**: `PostCreatedEvent`, `UserFollowedEvent`, `PostReactedEvent`.
- **Permisos Exigidos**: `SOCIAL_WRITE`, `SOCIAL_READ`.
- **Dependencias**: `module-users`, `module-bands`.

---

## 11. Módulo de Colaboraciones (`module-collaborations`)

- **Responsabilidades**: Proyectos virtuales de grabación multi-pista, subida de stems, versionado, timestamps de feedback y estado de entrega.
- **Entidades de Dominio**: `CollabProject`, `AudioStem`, `StemVersion`, `TimelineComment`.
- **Casos de Uso**:
  - `CreateCollabProjectUseCase`
  - `UploadAudioStemUseCase`
  - `AddTimelineCommentUseCase`
- **Servicios de Aplicación**: `CollaborationApplicationService`, `AudioStemProcessingService`.
- **Endpoints REST**:
  - `POST /api/v1/collaborations/projects`
  - `POST /api/v1/collaborations/projects/{projectId}/stems`
  - `POST /api/v1/collaborations/stems/{stemId}/comments`
- **Eventos de Dominio Emitidos**: `CollabProjectCreatedEvent`, `AudioStemUploadedEvent`.
- **Permisos Exigidos**: `COLLAB_CREATE`, `COLLAB_CONTRIBUTE`.
- **Dependencias**: `module-users`, `module-library`.

---

## 12. Módulo de Administración (`module-admin`)

- **Responsabilidades**: Dashboard ejecutivo, moderación de perfiles/contenido, gestión de roles de plataforma, métricas globales y logs de auditoría.
- **Entidades de Dominio**: `AuditLog`, `ModerationReport`, `SystemConfig`.
- **Casos de Uso**:
  - `ReviewModerationReportUseCase`
  - `UpdateSystemConfigUseCase`
  - `GetPlatformAnalyticsUseCase`
- **Servicios de Aplicación**: `AdminApplicationService`, `AuditLogService`.
- **Endpoints REST**:
  - `GET /api/v1/admin/analytics`
  - `GET /api/v1/admin/reports`
  - `PUT /api/v1/admin/reports/{reportId}/action`
- **Eventos de Dominio Emitidos**: `ContentModeratedEvent`, `SystemConfigUpdatedEvent`.
- **Permisos Exigidos**: `ROLE_ADMIN`, `ROLE_MODERATOR`.
- **Dependencias**: Todos los módulos (solo para lectura de auditoría y moderación).
