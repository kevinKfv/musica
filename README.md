# musica

BandHub - Plataforma de gestión y colaboración para bandas y músicos.

## Arquitectura

- **Backend**: Spring Boot 3, Java 21, Spring Modulith, PostgreSQL (Flyway), Redis, MinIO.
- **Frontend**: React + TypeScript + Vite.
- **Infraestructura**: Docker Compose para servicios auxiliares (PostgreSQL, Redis, MinIO, MailHog).
- **CI/CD**: GitHub Actions workflow.

## Estructura del Proyecto

```
musica/
├── .github/          # Flujos de trabajo de CI/CD
├── backend/          # Backend Modular Monolith en Spring Boot 3
├── docker/           # Configuración de Docker y docker-compose
├── docs/             # Documentación de arquitectura, requisitos y diseño
├── frontend/         # Frontend SPA en React + Vite
└── scripts/          # Scripts de utilidad y desarrollo
```

## Inicio Rápido

1. **Servicios de soporte**:
   ```bash
   cd docker
   docker compose up -d
   ```

2. **Backend**:
   ```bash
   cd backend
   ./gradlew bootRun
   ```

3. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
