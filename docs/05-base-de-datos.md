# 05 - Modelo de Base de Datos y Estrategia de Persistencia

## 1. Filosofía de Persistencia

BandHub utiliza una única instancia empresarial de **PostgreSQL** para la persistencia relacional principal, complementada con **Redis** para almacenamiento clave-valor (sesiones, caché, pub/sub ligero) y **MinIO** para almacenamiento de objetos pesados (audios, partituras, imágenes).

---

## 2. Segregación de Esquemas por Módulo

Para prevenir el acoplamiento a nivel de base de datos, cada módulo opera dentro de su propio **PostgreSQL Schema**.

- `schema_auth`: Cuentas, credenciales, tokens de refresco, MFA.
- `schema_users`: Perfiles de usuario, roles de actor, portafolio, instrumentos.
- `schema_bands`: Bandas, miembros, invitaciones, ensayos, setlists.
- `schema_agenda`: Entradas de calendario, recordatorios, rsvp.
- `schema_library`: Canciones, partituras, archivos de audio, versiones.
- `schema_marketplace`: Anuncios de servicios, contrataciones, reseñas.
- `schema_events`: Eventos, tickets emitidos, escaneos QR.
- `schema_academy`: Cursos, lecciones, entregas de ejercicios, asistencias.
- `schema_chat`: Conversaciones, mensajes, participantes.
- `schema_social`: Publicaciones, comentarios, reacciones, seguidores.
- `schema_collab`: Proyectos colaborativos, stems de audio, comentarios en línea de tiempo.
- `schema_admin`: Registros de auditoría, reportes de moderación, configuración global.

### Regla No Negociable de Persistencia:
- **Prohibidos las claves foráneas (Foreign Keys) y JOINs entre tablas de distintos esquemas.**
- Las referencias cruzadas se realizan únicamente guardando el `UUID` inmutable de la entidad remota.

---

## 3. Estándares de Modelado de Tablas

Todas las tablas siguen las siguientes convenciones:

1. **Claves Primarias**: `UUID` (v4/v7) de 128 bits para prevenir enumeración secuencial de recursos en APIs.
2. **Campos de Auditoría Estándar**:
   - `created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP`
   - `updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP`
   - `created_by UUID`
   - `updated_by UUID`
3. **Soft Delete**: `deleted AT TIMESTAMP WITH TIME ZONE` (en lugar de `is_deleted BOOLEAN`) para conservar trazabilidad histórica.
4. **Nombres de Tablas y Columnas**: Nombres en `snake_case` plural (`users`, `band_members`, `service_listings`).

---

## 4. Definición de Tablas Principales (Extracto de Migraciones Flyway)

### 4.1. `schema_auth.accounts`
```sql
CREATE SCHEMA IF NOT EXISTS schema_auth;

CREATE TABLE schema_auth.accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    mfa_secret VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_accounts_email ON schema_auth.accounts(email) WHERE deleted_at IS NULL;
```

### 4.2. `schema_users.user_profiles`
```sql
CREATE SCHEMA IF NOT EXISTS schema_users;

CREATE TABLE schema_users.user_profiles (
    id UUID PRIMARY KEY, -- Mismo UUID que account_id
    full_name VARCHAR(150) NOT NULL,
    artistic_name VARCHAR(150),
    bio TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    latitude NUMERIC(9, 6),
    longitude NUMERIC(9, 6),
    avatar_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);
```

### 4.3. `schema_users.actor_roles`
```sql
CREATE TABLE schema_users.actor_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES schema_users.user_profiles(id),
    role_type VARCHAR(50) NOT NULL, -- MUSICIAN, PRODUCER, TEACHER, STUDIO_OWNER, etc.
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, role_type)
);
```

### 4.4. `schema_bands.bands`
```sql
CREATE SCHEMA IF NOT EXISTS schema_bands;

CREATE TABLE schema_bands.bands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    genre VARCHAR(100),
    bio TEXT,
    logo_url VARCHAR(500),
    leader_user_id UUID NOT NULL, -- UUID de schema_users (sin FK física)
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);
```

### 4.5. `schema_marketplace.service_listings`
```sql
CREATE SCHEMA IF NOT EXISTS schema_marketplace;

CREATE TABLE schema_marketplace.service_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_user_id UUID NOT NULL, -- Referencia a schema_users
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL, -- MUSICIAN_SESSION, PRODUCER, REHEARSAL_ROOM, etc.
    hourly_rate NUMERIC(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    city VARCHAR(100),
    rating_avg NUMERIC(3, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_listings_search ON schema_marketplace.service_listings(category, city) WHERE deleted_at IS NULL;
```

---

## 5. Estrategia de Migraciones con Flyway

Las migraciones de base de datos se organizan por versión dentro del backend en carpetas separadas por esquema:

```
backend/src/main/resources/db/migration/
  ├── V1__init_schema_auth.sql
  ├── V2__init_schema_users.sql
  ├── V3__init_schema_bands.sql
  ├── V4__init_schema_agenda.sql
  ├── V5__init_schema_library.sql
  ├── V6__init_schema_marketplace.sql
  ├── V7__init_schema_events.sql
  ├── V8__init_schema_academy.sql
  ├── V9__init_schema_chat.sql
  ├── V10__init_schema_social.sql
  ├── V11__init_schema_collab.sql
  └── V12__init_schema_admin.sql
```
