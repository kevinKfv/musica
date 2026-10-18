# 02 - Requisitos Funcionales y No Funcionales

## 1. Requisitos Funcionales por Módulo (RF)

### RF-01: Autenticación y Seguridad
- **RF-01.1**: El sistema debe permitir el registro e inicio de sesión mediante correo/contraseña y proveedores OAuth2 (Google, Apple, Spotify).
- **RF-01.2**: Soporte obligatorio de autenticación de dos factores (MFA/TOTP) configurable por el usuario.
- **RF-01.3**: Emisión y rotación automática de tokens JWT (Access Token de vida corta: 15 min, Refresh Token de vida media: 7 días almacenado en Redis).
- **RF-01.4**: Gestión de sesiones activas por dispositivo con capacidad de revocación remota.
- **RF-01.5**: Mecanismo seguro de recuperación de contraseña vía correo con tokens unipersonales de un solo uso de 15 minutos de validez.

### RF-02: Gestión de Usuarios y Perfiles Multi-Rol
- **RF-02.1**: Gestión de perfil unificado con avatar, biografía, ubicación geográfica (coordenadas/ciudad), idiomas y redes sociales.
- **RF-02.2**: Activación dinámica de roles/actores profesionales (Músico, Productor, Profesor, Ingeniero, Dueño de Estudio, Manager, Organizador).
- **RF-02.3**: Registro de instrumentos tocados, nivel de experiencia, géneros musicales dominados, equipamiento personal y disponibilidad de agenda/desplazamiento.
- **RF-02.4**: Publicación de portafolio multimedia (integración con pistas de audio, videos, enlaces externos como Spotify/SoundCloud/YouTube).

### RF-03: Bandas y Agrupaciones Musicales
- **RF-03.1**: Creación y administración de perfiles de bandas por un usuario creador/líder.
- **RF-03.2**: Sistema de invitaciones por correo o usuario interno con roles dentro de la banda (Líder, Administrador, Miembro, Músico de Sesión).
- **RF-03.3**: Coordinación interna: gestión de ensayos, lista de canciones (setlists) con tonalidad/tempo/duración y repositorio de archivos compartidos.

### RF-04: Agenda y Calendario Unificado
- **RF-04.1**: Calendario consolidado por usuario que sincroniza eventos de sus distintos roles (ensayos de banda, clases impartidas/tomadas, fechas de eventos, contrataciones del marketplace).
- **RF-04.2**: Confirmación de asistencia (RSVP) para integrantes de bandas o eventos con notificaciones automáticas y recordatorios programables.
- **RF-04.3**: Detección y prevención automática de conflictos de horario al agendar ensayos o servicios.

### RF-05: Biblioteca de Recursos Musicales
- **RF-05.1**: Catálogo digital de canciones, letras, partituras (PDF/Guitar Pro/MusicXML), guías de cifrado y backing tracks.
- **RF-05.2**: Control de versiones de partituras y pistas de audio para ensayos.
- **RF-05.3**: Reproductor de audio embebido con ajuste de tempo, transposición de tono y reproducción por bucles (looping).

### RF-06: Marketplace Profesional
- **RF-06.1**: Motor de búsqueda avanzada de profesionales y servicios (músicos, productores, técnicos, alquiler de salas de ensayo y estudios) filtrado por ubicación, género, tarifa y valoración.
- **RF-06.2**: Publicación de anuncios de servicios con tarifas por hora/proyecto, condiciones y requerimientos técnicos.
- **RF-06.3**: Flujo de contratación: Solicitud -> Cotización/Aceptación -> Reserva de horario -> Confirmación de servicio completado -> Calificación/Reseña.

### RF-07: Eventos y Boletería (Ticketing)
- **RF-07.1**: Creación de eventos (conciertos, festivales, jam sessions) con fecha, ubicación, alineación de artistas (lineup) y descripción.
- **RF-07.2**: Módulo de venta de entradas con tipos de boleto, aforo máximo y código QR único emitido digitalmente.
- **RF-07.3**: Aplicación/Módulo de Check-in para validación rápida de códigos QR en puerta mediante cámara/escáner y métricas de entrada en tiempo real.

### RF-08: Academia y Educación Musical
- **RF-08.1**: Profesores y Academias pueden publicar oferta educativa (clases individuales, cursos en grupo, máster clases).
- **RF-08.2**: Inscripción de alumnos, control de asistencia, asignación de tareas/ejercicios y entrega de archivos de evaluación.
- **RF-08.3**: Registro y seguimiento del estado de pagos de matrículas y mensualidades.

### RF-09: Mensajería y Notificaciones en Tiempo Real
- **RF-09.1**: Chats directos (uno a uno) y chats de grupo (bandas, proyectos, clases) vía WebSocket.
- **RF-09.2**: Envío de archivos adjuntos (audio, PDF, imágenes) y mensajes de voz en chats.
- **RF-09.3**: Sistema central de notificaciones Push (Web/Móvil) e Email sobre invitaciones, mensajes, eventos y cambios de agenda.

### RF-10: Red Social e Interacción
- **RF-10.1**: Publicación en feed de estados, fotos, videos cortos y muestras de audio.
- **RF-10.2**: Interacciones: Me gusta, comentarios encadenados, compartir publicación y guardar en marcadores.
- **RF-10.3**: Sistema de seguimiento (Follow) entre usuarios/bandas y algoritmo de recomendación de contenido relevante.

### RF-11: Colaboración Multipista (Estudio Virtual)
- **RF-11.1**: Creación de proyectos colaborativos de grabación remota.
- **RF-11.2**: Subida de stem de audio por pistas (batería, bajo, guitarras, voz) con etiquetas de versión, bpm y compás.
- **RF-11.3**: Comentarios marcados en puntos temporales específicos (timestamps) de la línea de tiempo de audio.

### RF-12: Administración y Moderación
- **RF-12.1**: Panel de control global para administradores: gestión de usuarios, roles del sistema y suspensión de cuentas.
- **RF-12.2**: Herramientas de moderación de contenido reportado (publicaciones, perfiles, spam, derechos de autor).
- **RF-12.3**: Dashboard de métricas del sistema: usuarios activos, volumen de contrataciones, eventos creados y logs de auditoría.

---

## 2. Requisitos No Funcionales (RNF)

### RNF-01: Rendimiento (Performance)
- **Latencia de API**: El 95% de las peticiones REST de lectura deben responder en menos de 200 ms.
- **Mensajería WebSocket**: Entregas de mensajes en tiempo real con latencia inferior a 50 ms.
- **Optimización Media**: Audio y fotos procesadas y optimizadas antes de almacenamiento en MinIO (compresión WebP para imágenes, transcripción a AAC/MP3 para preescuchas).

### RNF-02: Escalabilidad y Carga
- **Arquitectura de Monolito Modular con Capacidad Stateless**: Capacidad de escalar horizontalmente el backend Spring Boot tras balanceadores de carga sin perder estado (sesiones en Redis).
- **Soporte Concurrente**: Preparado para soportar un mínimo de 10,000 usuarios concurrentes activos y 100,000 peticiones por minuto.

### RNF-03: Disponibilidad y Resiliencia
- **SLA**: Disponibilidad garantizada del 99.9% anual.
- **Graceful Degradation**: Si el servicio de WebSocket o MinIO sufre una interrupción temporal, las funciones core del backend REST deben permanecer operativas.

### RNF-04: Seguridad y Privacidad
- **Cumplimiento OWASP Top 10**: Protección activa contra SQL Injection, XSS, CSRF, Broken Authentication e IDOR.
- **Cifrado de Datos**: Todos los datos en tránsito cifrados mediante TLS 1.3 (HTTPS/WSS). Datos sensibles en reposo (contraseñas con BCrypt `cost=12`, tokens de pago, API Keys) cifrados con AES-256.
- **Cumplimiento RGPD/Privacidad**: Opción de exportación de datos de usuario y eliminación definitiva de cuenta ("derecho al olvido").

### RNF-05: Mantenibilidad y Calidad de Código
- **Cobertura de Pruebas**: Mínimo 80% de cobertura de código en lógica de dominio y casos de uso mediante JUnit 5 y Mockito.
- **Verificación de Módulos**: Pruebas automáticas con Spring Modulith para verificar que no existen dependencias cíclicas ni violaciones de paquetes entre módulos.
