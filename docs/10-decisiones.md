# 10 - Registro de Decisiones de Arquitectura (ADRs)

Este documento registra las decisiones arquitectónicas clave (Architecture Decision Records - ADRs) de **BandHub**, documentando su contexto, alternativas evaluadas, justificación técnica y consecuencias.

---

## ADR-001: Adopción de Monolito Modular con Spring Modulith

- **Estado**: Aprobado.
- **Contexto**: Se requiere una plataforma de grado empresarial capaz de escalar y albergar 12 módulos complejos. Iniciar con microservicios introduce sobrecostes de red, complejidad de despliegue, latencia distribuida y dificultad de refactorización temprana.
- **Decisión**: Diseñar el backend como un **Monolito Modular** utilizando Java 21, Spring Boot 3 y **Spring Modulith**.
- **Consecuencias**:
  - *Positivas*: Simplicidad en despliegue (un único artefacto JAR), transacciones ACID dentro del mismo módulo, pruebas integradas rápidas y verificación automatizada de límites entre módulos.
  - *Mitigación*: La estricta separación de esquemas de BD y la comunicación por eventos facilita extraer cualquier módulo a un microservicio en el futuro sin reescribir lógica de negocio.

---

## ADR-002: Segregación de Base de Datos por Esquemas de PostgreSQL

- **Estado**: Aprobado.
- **Contexto**: Un monolito con una única base de datos relacional sin restricciones suele derivar en un "Big Ball of Mud" con JOINs de SQL descontrolados entre tablas de distintos dominios.
- **Decisión**: Implementar un único servidor PostgreSQL pero aislar físicamente las tablas en **esquemas separados por módulo** (`schema_auth`, `schema_users`, `schema_bands`, etc.). Prohibir Foreign Keys y JOINs inter-esquema.
- **Consecuencias**:
  - *Positivas*: Desacoplamiento real de datos. Garantiza la independencia de cada módulo.
  - *Negativas*: Las consultas cruzadas deben realizarse a nivel de aplicación (Servicios de Aplicación o Vistas CQRS proyectadas).

---

## ADR-003: Autenticación con JWT, Refresh Token Rotation en Redis y MFA

- **Estado**: Aprobado.
- **Contexto**: Se requiere autenticación segura, stateless para la API REST, con revocación inmediata de sesiones y soporte para aplicaciones móviles/web.
- **Decisión**: Emplear Access Tokens JWT de corta duración (15 min) en memoria, combinados con Refresh Tokens rotativos guardados en Redis con TTL de 7 días, y MFA TOTP (RFC 6238).
- **Consecuencias**:
  - *Positivas*: Máxima protección frente a robo de tokens (XSS/CSRF). Capacidad de revocación global instantánea en Redis si se detecta reuso o ataque.

---

## ADR-004: Modelo de Identidad de Actor Polimórfico (Cuenta Única Multi-Rol)

- **Estado**: Aprobado.
- **Contexto**: Los músicos en la vida real cumplen múltiples funciones simultáneas (ej. guitarrista en 2 bandas, profesor particular y dueño de un estudio casero). Forzar cuentas separadas arruina la usabilidad.
- **Decisión**: Unificar la cuenta en una única entidad `Account` / `UserProfile` que posee N registros de `ActorRole`.
- **Consecuencias**:
  - *Positivas*: Experiencia de usuario fluida sin cambiar de sesión. Flexibilidad total en el Marketplace y la Agenda.
  - *Negativas*: Requiere un esquema de permisos híbrido RBAC + ABAC para validar acciones según el rol activo o los permisos del contexto.

---

## ADR-005: Almacenamiento de Objetos en MinIO (S3-Compatible)

- **Estado**: Aprobado.
- **Contexto**: BandHub maneja archivos pesados (partituras PDF, audio multipista, imágenes de portafolio, videos). Almacenarlos en la base de datos relacional degrada el rendimiento.
- **Decisión**: Utilizar **MinIO** como servidor de almacenamiento de objetos compatible con la API de Amazon S3 en desarrollo local (vía Docker) y despliegues productivos.
- **Consecuencias**:
  - *Positivas*: Total abstracción del proveedor de almacenamiento. Cero cambios de código para alternar entre MinIO local y AWS S3 en producción.

---

## ADR-006: Frontend Modular con React, TypeScript, Zustand y React Query

- **Estado**: Aprobado.
- **Contexto**: La interfaz de usuario debe ser sumamente dinámica, rápida, responsiva y organizada de forma limpia para soportar los 12 módulos de la plataforma.
- **Decisión**: Adoptar React + Vite + TypeScript. Organizar el código del cliente **por módulos de dominio** (no por carpetas globales de componentes) usando **React Query** para la gestión del estado del servidor y **Zustand** para el estado global del cliente.
- **Consecuencias**:
  - *Positivas*: Código del cliente altamente mantenible, simétrico con la estructura de módulos del backend, con caché de peticiones HTTP optimizada.
