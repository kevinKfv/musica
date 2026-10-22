# 🎸 BandHub

**BandHub** — El sistema operativo integral para la industria musical.

[![Backend](https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?logo=springboot)](https://spring.io/projects/spring-boot)
[![Frontend](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Docker](https://img.shields.io/badge/Docker%20Compose-5%20servicios-2496ED?logo=docker)](https://docs.docker.com/compose/)

---

## 🧱 Stack

| Capa | Tecnología |
|------|-----------|
| **Frontend** | React 19 + TypeScript + Vite + Tailwind CSS 4 |
| **Backend** | Spring Boot 3, Java 21, Spring Modulith |
| **DB** | PostgreSQL 16 (esquemas por módulo + Flyway) |
| **Cache/Sesiones** | Redis 7 |
| **Almacenamiento** | MinIO (compatible S3) |
| **Proxy (prod)** | Nginx |
| **Infra** | Docker Compose |

---

## 🚀 Inicio Rápido — Docker (Recomendado)

### 1. Clonar y preparar variables de entorno

```bash
git clone <repo-url>
cd musica
cp .env.example .env
# Editá .env si querés cambiar contraseñas (opcional en dev)
```

### 2. Levantar todo el stack

```bash
docker compose up -d --build
```

El primer `--build` puede tardar varios minutos (compila el backend con Gradle).
Las veces siguientes es mucho más rápido (capas cacheadas).

### 3. Acceder a los servicios

| Servicio | URL | Credenciales |
|----------|-----|-------------|
| 🌐 **Frontend** | http://localhost:5173 | — (hot reload activo) |
| ⚙️ **Backend API** | http://localhost:8080/api/v1 | — |
| 📊 **Swagger UI** | http://localhost:8080/swagger-ui.html | — |
| 🗄️ **MinIO Console** | http://localhost:9001 | `bandhub_minio` / `bandhub_minio_dev` |
| 🐘 **PostgreSQL** | localhost:5432 | `bandhub_user` / `bandhub_dev_password` |
| 🔴 **Redis** | localhost:6379 | — |

### 4. Detener el entorno

```bash
docker compose down          # detiene pero mantiene datos
docker compose down -v       # detiene y BORRA volúmenes (reset total)
```

---

## 🔧 Modo Híbrido (servicios en Docker, código local)

Útil para desarrollo activo del backend o frontend sin reconstruir imágenes.

```bash
# 1. Levantá solo los servicios de infraestructura
docker compose up -d postgres redis minio

# 2. Backend (requiere Java 21)
cd backend
./gradlew bootRun

# 3. Frontend (requiere Node.js 20+)
cd frontend
npm install
npm run dev
```

---

## 📁 Estructura del Proyecto

```
bandhub/
├── .env.example          ← Template de variables de entorno
├── .env                  ← Variables locales (no va a git)
├── docker-compose.yml    ← Stack completo (5 servicios)
│
├── backend/              ← Spring Boot 3 (Monolito Modular)
│   ├── src/main/java/com/bandhub/
│   │   ├── auth/         ← Módulo de autenticación JWT
│   │   ├── users/        ← Perfiles multi-rol
│   │   ├── bands/        ← Agrupaciones musicales
│   │   └── ...           ← (12 módulos en total)
│   └── Dockerfile
│
├── frontend/             ← React + Vite SPA
│   ├── src/
│   │   ├── components/layout/AppLayout.tsx  ← Shell con sidebar
│   │   ├── pages/        ← Páginas por módulo
│   │   ├── store/        ← Zustand stores
│   │   └── api/          ← Axios client
│   ├── Dockerfile        ← Dev (Vite hot-reload)
│   └── Dockerfile.prod   ← Prod (build → nginx)
│
├── docker/
│   ├── init-db/          ← Scripts SQL iniciales (schemas)
│   └── nginx/nginx.conf  ← Reverse proxy para producción
│
└── docs/                 ← Documentación técnica
    ├── 01-vision.md
    ├── 04-arquitectura.md
    └── ...
```

---

## 🔒 Seguridad

- **JWT** en memoria React (Zustand), refresh token en cookie `HttpOnly`
- **Zero Trust**: todo endpoint protegido salvo `/auth/**` y `/swagger-ui/**`
- Variables de entorno para todos los secretos (sin hardcoding)
- `.env` excluido de git via `.gitignore`

---

## 📋 Comandos útiles

```bash
# Ver logs de un servicio
docker compose logs -f frontend
docker compose logs -f backend

# Reconstruir solo un servicio
docker compose up -d --build frontend
docker compose up -d --build backend

# Entrar al contenedor de postgres
docker exec -it bandhub-postgres psql -U bandhub_user -d bandhub_db

# Entrar al contenedor de redis
docker exec -it bandhub-redis redis-cli
```
