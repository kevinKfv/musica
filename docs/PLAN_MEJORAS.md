# 🎸 Plan de Mejoras — BandHub

> Análisis completo del estado actual, arquitectura y propuestas de mejora priorizadas por impacto.
> Documento vivo de seguimiento del proyecto.
> Última actualización: Octubre 2026

---

## 🗺️ Resumen Ejecutivo de Estado

| Área | Estado Actual | Prioridad | Progreso |
|------|--------------|-----------|----------|
| 🎨 **Diseño & UX** | Sistema de diseño moderno, tipografías Syne/Inter, Dark Glassmorphism | 🔴 Alta | ✅ Completado (Sprint 1) |
| 🧭 **Navegación** | Sidebar persistente colapsable con persistencia en localStorage | 🔴 Alta | ✅ Completado (Sprint 1) |
| 🧩 **Componentes UI** | Biblioteca base (`Button`, `Card`, `Toast`, `PageLoader`, `ErrorBoundary`) | 🔴 Alta | ✅ Completado (Sprint 2) |
| 📐 **Layout & Vistas** | `AppLayout` con React Router `<Outlet />`, `ProfilePage`, `MfaPage` | 🔴 Alta | ✅ Completado (Sprint 2) |
| 🔒 **Autenticación** | Login & Register rediseñados, fix proxy/seeder, demo rápida | 🔴 Alta | ✅ Completado (Sprint 2) |
| 🛠️ **Backend & DB** | Migraciones Flyway completas, Swagger/OpenAPI 3, Spring Modulith | 🟡 Media | ✅ Completado (Sprint 3) |
| 🐳 **Infraestructura** | Docker Compose completo (5 servicios: PG, Redis, MinIO, Backend, Frontend) | 🟡 Media | ✅ Completado |
| 🧪 **Testing & Calidad** | Tests unitarios frontend (Vitest), backend (JUnit 5) y CI/CD | 🟠 Media-Alta | ✅ Completado (Sprint 4) |
| 📊 **Observabilidad** | Spring Boot Actuator, Healthchecks, Logging estructurado | 🟢 Baja | 🟡 Parcial (Actuator listo) |

---

## 🎨 BLOQUE 1 — Diseño Visual y UX (Completado)

### 1.1 · Sistema de Diseño Centralizado (`index.css`)
- **Tokens de diseño:** Paleta BandHub `--bh-*` (violetas eléctricos `#7c3aed`, rosa neón `#ec4899`, superficies oscuras `#0a0a0f`, `#12121a`).
- **Tipografía moderna:** Google Fonts `Syne` (títulos display) e `Inter` (interfaz y lectura).
- **Glassmorphism:** Variables y utilidades para efectos de desenfoque (`backdrop-blur-xl`), bordes sutiles y transparencias controladas.
- **Micro-interacciones:** Animaciones suaves para hover en cards (`.hover-scale`), spinners, alertas y toasts (`fadeInUp`).

### 1.2 · Barra de Navegación Persistente (`AppLayout.tsx`)
- Sidebar colapsable (240px a 68px) con animación fluida.
- Topbar con breadcrumb dinámico, campana de notificaciones y avatar clickeable.
- Integración completa con `<Outlet />` de React Router 7.
- Responsive y adaptable para pantallas móviles y escritorios.

### 1.3 · Login y Registro con Glassmorphism
- Formulario flotante con malla de gradientes vivos y logo de la plataforma.
- Diagnóstico inteligente de errores (diferencia caída de backend de error 401).
- Botón rápido "⚡ Cargar demo" (`admin@bandhub.com` / `password123`) para acelerar pruebas.

### 1.4 · Dashboard Principal (`DashboardPage.tsx`)
- Hero section con saludo personalizado y contador de roles/proyectos.
- 4 tarjetas de estadísticas rápidas con métricas de la plataforma.
- 9 tarjetas temáticas de acceso directo a los módulos de BandHub con acentos cromáticos individuales.

---

## 🧱 BLOQUE 2 — Arquitectura Frontend & Componentes (Completado)

### 2.1 · Biblioteca de Componentes UI (`components/ui/`)
- **`Button.tsx`**: Variantes (`primary`, `secondary`, `ghost`, `danger`, `outline`), tamaños (`sm`, `md`, `lg`), estado de spinner integrado.
- **`Card.tsx`**: Composite container (`CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`, `glow`).
- **`PageLoader.tsx`**: Loader con animación de pulsos y spinner concéntrico.
- **`ErrorBoundary.tsx`**: Atrapa errores de renderizado en cualquier ruta y permite recargar o ir al inicio.
- **`Toast.tsx`**: Sistema de notificaciones toast automáticas con `useToast` (`success`, `error`, `warning`, `info`).

### 2.2 · Perfil de Usuario & MFA
- **`ProfilePage.tsx` (`/profile`)**:
  - Pestaña 1: Datos personales, avatar URL, bio musical y ubicación (`PUT /api/v1/users/me`).
  - Pestaña 2: Roles musicales activos y formulario para activar nuevos (`POST /api/v1/users/me/roles`).
  - Pestaña 3: Seguridad, cambio de contraseña y toggle para autenticación MFA.
- **`MfaVerificationPage.tsx` (`/auth/mfa`)**: Pantalla de 6 dígitos auto-avanzables con auto-enfoque y soporte para pegar código.

### 2.3 · Estado Global y Persistencia
- **`useUIStore.ts`**: Manejo con Zustand y persistencia en `localStorage` para el colapso del sidebar y estados visuales.
- **`apiClient.ts`**: Interceptor Axios para inyección de token JWT `Bearer` y reintento automático con refresh token.

---

## 🔧 BLOQUE 3 — Backend Core & Base de Datos (En curso)

### 3.1 · Migraciones Flyway Completas
Flyway administra las versiones del esquema de base de datos PostgreSQL:
- `V1__init_schema_auth.sql`: Esquema `schema_auth` y tabla `accounts`.
- `V2__init_schema_users.sql`: Esquema `schema_users`, tabla `user_profiles` y `user_roles`.
- `V3__init_schema_bands.sql`: Esquema `schema_bands`, tabla `bands` y `band_members`.
- `V4` a `V13`: Agenda, Biblioteca, Marketplace, Eventos, Academia, Chat, Social, Collab, Admin, Places.

### 3.2 · Documentación Interactiva Swagger / OpenAPI 3
- Integrar `springdoc-openapi-starter-webmvc-ui`.
- Acceso a UI de pruebas en `http://localhost:8080/swagger-ui.html`.
- Documentar tags por módulo (`auth`, `users`, `bands`, `marketplace`, `events`, `agenda`, etc.).

### 3.3 · Perfiles y Seeders
- `DataSeeder.java` habilitado para perfiles `local` y `dev` (`@Profile({"local", "dev"})`).
- Carga de usuarios iniciales (`admin@bandhub.com`, `juan@bandhub.com`, `maria@bandhub.com`).

---

## 🐳 BLOQUE 4 — Infraestructura y DevOps

### 4.1 · Stack Docker Compose
- **PostgreSQL 16**: Base de datos relacional multi-esquema con scripts de inicialización.
- **Redis 7**: Caché en memoria y mensajería pub/sub.
- **MinIO**: Almacenamiento de objetos compatible con AWS S3 para audios, avatares y partituras.
- **Backend**: Contenedor Spring Boot 3 con Gradle y healthcheck de Actuator.
- **Frontend**: Servidor Vite con hot-reload para desarrollo y proxy inteligente `/api` y `/ws`.
- **Nginx**: Configuración lista para reverse proxy en producción.

---

## 🎯 Plan de Acción y Roadmap de Sprints

### Sprint 1 — Impacto Visual Inmediato ✅
1. ✅ Crear sistema de diseño en `index.css` (variables CSS, tokens, tipografía)
2. ✅ Crear `AppLayout` con sidebar persistente colapsable
3. ✅ Rediseñar Login y Register con glassmorphism
4. ✅ Rediseñar Dashboard con cards visuales mejoradas y estadísticas
5. ✅ Corregir íconos de módulos

### Sprint 2 — Arquitectura Frontend & Componentes UI ✅
1. ✅ Refactorizar `App.tsx` y separar componentes
2. ✅ Crear biblioteca de componentes base (`Button`, `Card`, `Toast`, `PageLoader`, `ErrorBoundary`)
3. ✅ Implementar `ProfilePage` (`/profile`) con edición y roles musicales
4. ✅ Implementar `MfaVerificationPage` (`/auth/mfa`)
5. ✅ Crear `useUIStore` con Zustand persistente
6. ✅ Resolver causas del error de inicio de sesión (seeder, proxy y diagnóstico)

### Sprint 3 — Backend Core & Documentación ✅
1. ✅ Completar migraciones Flyway V1 (auth), V2 (users), V3 (bands)
2. ✅ Integrar Springdoc OpenAPI 3 (Swagger UI en `/swagger-ui.html` con soporte JWT Bearer)
3. ✅ Configurar dependencias de Flyway y validar arranque con PostgreSQL
4. ✅ Permitir rutas públicas de Swagger y Actuator en `SecurityConfig`

### Sprint 4 — Testing & Calidad ✅
1. ✅ Configurar Vitest + React Testing Library en frontend (`package.json`, `vite.config.ts`, `setup.ts`)
2. ✅ Tests unitarios para stores de Zustand (`useUIStore.test.ts`, `useAuthStore.test.ts`)
3. ✅ Tests unitarios para componentes UI (`Button.test.tsx`, `Card.test.tsx`, `Toast.test.tsx`)
4. ✅ Tests en backend con JUnit 5 + Mockito (`AuthApplicationServiceTest`, verificación de arquitectura modular)
5. ✅ Pipeline automatizado de GitHub Actions para CI/CD (`.github/workflows/ci.yml`)

### Sprint 5 — Armonización Visual Global & Dark Glassmorphism 360° ✅
1. ✅ **Eliminación total de estilos discordantes:** Cero componentes con `bg-white`, `text-gray-800` o fondos claros desfasados.
2. ✅ **Normalización de Layouts sin saltos de scroll:** Reemplazados todos los `min-h-screen`, `h-screen` y paddings dobles para fluir armónicamente dentro de `AppLayout`.
3. ✅ **Armonización de los 9 Módulos Principales:**
   - 📅 **Agenda:** Calendario oscuro con cards glassmorphism, chips temáticos por tipo de evento (`GIG`, `REHEARSAL`, `CLASS`) y modal de creación rediseñado.
   - 📚 **Biblioteca:** Catálogo de partituras y stems en dark mode, chips interactivos de audio y modal de subida de recursos.
   - 🛍️ **Marketplace:** Reemplazo de Slate plano por gradientes BandHub neón, filtros estilizados y vistas de reserva rápida (`ServiceDetails`, `PublishService`).
   - 🎟️ **Eventos & Tickets:** Vistas de eventos (`EventsHome`, `CreateEvent`, `EventDetails`, `EventCheckIn`) con badges de tickets, check-in QR con validación visual.
   - 🎓 **Academia:** Vistas de cursos (`AcademyHome`, `CreateCourse`, `CourseDetails`) y aula virtual (`CourseLearning`) con sidebar colapsable y video player integrado.
   - 🎛️ **Colaboración / DAW:** Proyectos musicales y DAW Virtual Studio con consola de pistas oscura y barras de volumen en tiempo real.
   - 💬 **Chat & Mensajería:** Mensajería directa adaptada a la altura de `AppLayout`, burbujas de mensaje translúcidas y lista de canales integrada.
   - 🌐 **Comunidad / Red Social:** Feed interactivo con sistema de votación, categorías musicales fluorescentes y vista detallada de post (`PostDetailPage`).
   - 🗺️ **Lugares & Salas:** Integración de Leaflet sobre contenedor dark, tarjetas flotantes y formulario de alta de salas (`MapPage`, `PlaceForm`).
   - 🛡️ **Panel Admin:** Métricas de moderación y auditoría con tokens del sistema de diseño.

---

## 🏆 Resumen del Estado Global del Proyecto
- **Frontend:** 100% Modernizado y Armonizado (Design System, AppLayout unificado sin scrollbars dobles, los 9 módulos 100% integrados en Dark Glassmorphism, suite de tests con Vitest).
- **Backend:** 100% Estabilizado (Spring Modulith verificado, Swagger OpenAPI 3 interactivo con JWT, migraciones Flyway V1-V13, perfil dual de seeds `local/dev`, tests unitarios con Mockito).
- **DevOps:** 100% Contenerizado (Docker Compose con 5 servicios integrados: PostgreSQL 16, Redis 7, MinIO S3, Backend Spring Boot, Frontend Vite, proxy Nginx, variables de entorno seguras y CI/CD en GitHub Actions).
