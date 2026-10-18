# 04 - Arquitectura del Sistema (Modular Monolith)

## 1. Visión General de la Arquitectura

BandHub está diseñado como un **Monolito Modular de Alta Fidelidad**. Combina la simplicidad de despliegue, refactorización y consistencia transaccional de un monolito con el desacoplamiento riguroso, la encapsulación de dominio y la preparación para escalabilidad horizontal propios de una arquitectura de microservicios.

```
+-----------------------------------------------------------------------+
|                           CLIENT LAYER                                |
|        React + TypeScript + Vite + Tailwind + Zustand + React Query   |
+-----------------------------------------------------------------------+
                                   | HTTP / REST / WebSockets (WSS)
                                   v
+-----------------------------------------------------------------------+
|                    SPRING BOOT 3 BACKEND APPLICATION                   |
|                                                                       |
|  +------------------+  +------------------+  +---------------------+  |
|  |   module-auth    |  |   module-users   |  |    module-bands     |  |
|  +------------------+  +------------------+  +---------------------+  |
|  | module-agenda    |  |  module-library  |  | module-marketplace  |  |
|  +------------------+  +------------------+  +---------------------+  |
|  |  module-events   |  |  module-academy  |  |     module-chat     |  |
|  +------------------+  +------------------+  +---------------------+  |
|  |  module-social   |  | module-collab    |  |    module-admin     |  |
|  +------------------+  +------------------+  +---------------------+  |
|                                                                       |
|          =================================================            |
|                   SPRING MODULITH EVENT BUS                           |
|          =================================================            |
+-----------------------------------------------------------------------+
        |                  |                    |                  |
        v                  v                    v                  v
+--------------+   +---------------+   +------------------+   +----------+
| PostgreSQL   |   | PostgreSQL    |   | Redis Cache &    |   | MinIO    |
| (schema_auth)|   | (schema_bands)|   | Session Store    |   | Storage  |
+--------------+   +---------------+   +------------------+   +----------+
```

---

## 2. Spring Modulith e Integridad Arquitectónica

Utilizamos **Spring Modulith** sobre Java 21 para garantizar y auditar estructuralmente las reglas de encapsulación de los módulos.

### 2.1. Reglas de Visibilidad de Paquetes
Cada módulo vive en su propio paquete raíz bajo `com.bandhub`:

```
com.bandhub.auth/
com.bandhub.users/
com.bandhub.bands/
com.bandhub.agenda/
com.bandhub.library/
com.bandhub.marketplace/
com.bandhub.events/
com.bandhub.academy/
com.bandhub.chat/
com.bandhub.social/
com.bandhub.collab/
com.bandhub.admin/
```

- **Clases Públicas**: Solo la interfaz del Servicio de Aplicación (`*ApplicationService`) y los DTOs/Eventos de dominio públicos se exponen en el paquete raíz del módulo.
- **Clases Internas (`internal.*`)**: El dominio, entidades JPA, repositorios y controladores REST residen en subpaquetes marcados como internos. Ningún módulo externo puede importar clases internas de otro módulo.

### 2.2. Verificación de Módulos mediante Pruebas
Se implementa una prueba automatizada con Spring Modulith que falla el build en GitHub Actions si existe una dependencia no permitida o un ciclo:

```java
@Test
void verifyModuleStructure() {
    ApplicationModules modules = ApplicationModules.of(BandHubApplication.class);
    modules.verify(); // Falla si hay acoplamiento no permitido entre módulos
}
```

---

## 3. Clean Architecture por Módulo

Dentro de cada paquete modular se implementa la arquitectura limpia dividida en 4 capas estrictas:

```
[ Domain Layer ]  <-- (Sin dependencias externas, POJOs puros)
       ^
       |
[ Application Layer ] <-- (Casos de Uso, DTOs, Eventos)
       ^
       |
[ Infrastructure Layer ] <-- (JPA Entities, MinIO, Redis, Adapters)
       ^
       |
[ Web / REST Adapter Layer ] <-- (Controllers, Request/Response DTOs)
```

1. **Dominio (`domain`)**: Entidades de Dominio, Objetos de Valor (Value Objects), Eventos de Dominio e Interfaces de Repositorio.
2. **Aplicación (`application`)**: Casos de Uso (`UseCase`), DTOs de comando/consulta y Servicios de Aplicación.
3. **Infraestructura (`infrastructure`)**: Implementación del Patrón Repositorio (`JpaRepository`), adaptadores para Redis, MinIO y librerías externas.
4. **Presentación (`web` / `rest`)**: Controladores `@RestController`, validación de entrada `@Valid` y mapeadores de DTO.

---

## 4. CQRS Selectivo (Command Query Responsibility Segregation)

Para optimizar el rendimiento y evitar complejidad innecesaria en operaciones CRUD simples, aplicamos CQRS de forma **selectiva**:

- **Write Path (Comandos)**: Pasa por Clean Architecture estándar -> Controller -> ApplicationService -> Domain Entity -> Repository -> PostgreSQL.
- **Read Path (Consultas Complejas)**: En módulos con búsquedas pesadas (ej: Marketplace, Feed Social, Eventos), las consultas evitan el mapeo de entidades de dominio y consultan Vistas Proyectadas en PostgreSQL o Redis mediante proyecciones optimizadas en DTOs de lectura directa.

---

## 5. Arquitectura Orientada a Eventos Interna (Event-Driven)

Para mantener el desacoplamiento entre módulos, las acciones secundarias no se invocan de forma sincrónica directa.

### Ejemplo de Flujo de Evento:
1. El usuario completa una contratación en `module-marketplace`.
2. `MarketplaceApplicationService` emite `BookingConfirmedEvent`.
3. Spring Modulith guarda el evento en el **Event Publication Log** dentro de la misma transacción de base de datos (Outbox Pattern).
4. `module-agenda` escucha el evento mediante `@ApplicationModuleListener` y genera automáticamente la entrada en el calendario.
5. `module-chat` escucha el evento y abre el grupo de chat de la contratación.

---

## 6. Estrategia de Migración Futura a Microservicios

Si en el futuro un módulo (ej. `module-chat` o `module-events`) requiere escalar de forma independiente a 100x respecto al resto del sistema:

1. **Separación de Persistencia Lista**: Como los esquemas de base de datos son independientes (`schema_chat`, `schema_events`), el esquema se migra a una instancia física independiente de PostgreSQL sin romper queries relacionales.
2. **Reemplazo de Event Bus**: El `ApplicationEventPublisher` de Spring Modulith se reemplaza por un adaptador de Spring Cloud Stream hacia **Apache Kafka** o **RabbitMQ**.
3. **Contrato de API Intacto**: Como la comunicación pública se realiza mediante DTOs e interfaces expuestas, el frontend continúa consumiendo los mismos endpoints REST sin cambios.
