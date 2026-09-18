# AGENTS.md - Contexto y Arquitectura del Proyecto

Sistema multi-pareja (multi-tenant) de invitaciones digitales de boda, confirmación de asistencia (RSVP) y control de acceso/llegadas en tiempo real.

---

## 1. Stack Tecnológico
- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript.
- **Estilos**: Tailwind CSS v4 + Lucide React + Canvas Confetti.
- **Base de Datos**: PostgreSQL Serverless en Neon (`@neondatabase/serverless`).
- **Utilidades**: `qrcode.react` (pases digitales QR), `tsx` (ejecución de scripts TS).

---

## 2. Modelo de Datos y Esquema DB (Neon PostgreSQL)

### Tablas Principales (`scripts/init-db.ts`)
- **`couples`**:
  - `id` (SERIAL PK), `slug` (VARCHAR UNIQUE), `groom_name`, `bride_name`, `event_date` (TIMESTAMPTZ), `reception_time`.
  - Lugares, Direcciones y URLs de Google Maps: `ceremony_place`, `ceremony_address`, `reception_place`, `reception_address`, `ceremony_maps_url`, `reception_maps_url`.
  - Cita bíblica: `bible_verse`, `bible_citation`.
  - Seguridad y fechas: `access_password` (default 'boda2026'), `rsvp_deadline` (TIMESTAMPTZ).
  - `config` (JSONB): Paleta de colores (`theme`), fotos (`cover`, `album`, `end`), contactos, padres, código de vestimenta (`dressCode`), música (`musicUrl`), itinerario (`timeline`), cuentas bancarias (`bankAccounts`), mesas de regalo (`registryLinks`), `adultsOnly`, `monogram`.
- **`invitation_groups`**:
  - `id` (SERIAL PK), `couple_id` (FK -> `couples.id` ON DELETE CASCADE).
  - `uuid` (VARCHAR NOT NULL), `group_name`, `titular_name`, `attendance` (BOOLEAN/NULL), `message` (TEXT).
  - Roles especiales: `is_couple` (BOOLEAN), `is_guard` (BOOLEAN).
  - Restricción: `UNIQUE(couple_id, uuid)`.
- **`guests`**:
  - `id` (SERIAL PK), `group_id` (FK -> `invitation_groups.id` ON DELETE CASCADE).
  - `name` (VARCHAR NOT NULL), `type` (`'principal' | 'acompanante' | 'familiar'`).
  - `attendance` (BOOLEAN/NULL: `true` = asistirá, `false` = no asistirá, `null` = pendiente).
  - `arrived` (BOOLEAN/NULL: `true` = ingresó al evento, `false` = no llegó, `null` = pendiente).
- **`users`**:
  - `id` (SERIAL PK), `couple_id` (FK -> `couples.id` ON DELETE CASCADE).
  - `username` (VARCHAR UNIQUE NOT NULL), `password` (VARCHAR NOT NULL), `name` (VARCHAR NOT NULL), `role` (`'couple' | 'guard' | 'admin'`).
  - `created_at` (TIMESTAMPTZ DEFAULT NOW()).

---

## 3. Capa de Acceso a Datos y Fallback (`lib/db.ts`)

La aplicación implementa un sistema híbrido resiliente:
1. **Primary**: Consultas SQL directas a Neon (`sql` tagged template de `@neondatabase/serverless`).
2. **Fallback**: Si `DATABASE_URL` no está configurada o la DB falla, recurre a `DEFAULT_COUPLES` (en código) y lectura/escritura de archivos JSON en `storage/app/public/${slug}/invitados.json`.

### Métodos Principales:
- `getCoupleBySlug(slug: string)`: Obtiene datos y config de la pareja.
- `getInvitation(coupleSlug: string, uuid: string)`: Retorna pareja, grupo y lista de invitados.
- `updateConfirmation(coupleSlug, uuid, guestName, type, attendance, message)`: Actualiza RSVP por invitado y mensaje grupal.
- `updateArrival(coupleSlug, uuid, guestName, type, arrived)`: Actualiza estado de check-in en puerta.
- `getTableData(coupleSlug)`: Lista de invitados y estadísticas globales de confirmación (`total`, `confirmados`, `rechazados`, `pendientes`).
- `getCheckoutData(coupleSlug)`: Lista de invitados y estadísticas de recepción (`total`, `llegaron`, `no_llegaron`, `pendientes`).
- `getUserByUsername(username)`: Busca usuario en Neon DB o fallback.
- `authenticateUser(username, password, coupleSlug)`: Valida credenciales de login y emite sesión.
- `createInvitationGroup(coupleSlug, data)`: Crea un grupo de invitación y sus integrantes en Neon DB / JSON.
- `updateInvitationGroup(coupleSlug, uuid, data)`: Actualiza datos del grupo e integrantes sincronizados.
- `deleteInvitationGroup(coupleSlug, uuid)`: Elimina un grupo y sus pases asignados.

---

## 4. Estructura de Rutas y Páginas

### Vistas Globales
- `/`: Pantalla principal del sistema que renderiza el Login global cuando no se accede mediante un enlace con UUID.
- `/login`: Pantalla de inicio de sesión global e independiente de la URL para cualquier pareja/usuario.
- `/admin`: Acceso centralizado administrativo que detecta la sesión activa o redirige a `/login`.
- `/[coupleSlug]`: Redirección automática a `/login` si se accede al slug de la pareja sin especificar UUID.

### Vistas por Pareja (`app/[coupleSlug]/`)
- `/[coupleSlug]/admin`: Panel de control y vista administrativa para los novios (autenticación, métricas en tiempo real, accesos directos a todos los módulos, generador de links de WhatsApp y muro de felicitaciones).
- `/[coupleSlug]/admin/invitations`: Pantalla CRUD completa para crear, editar, buscar y eliminar invitaciones y pases familiares o individuales.
- `/[coupleSlug]/[uuid]`: Invitación digital principal (cuenta regresiva, música, historia/fotos, ubicación con mapa, itinerario, mesa de regalos, código de vestimenta, acceso a RSVP y pase digital).
- `/[coupleSlug]/[uuid]/confirm`: Formulario interactivo de RSVP para cada miembro del grupo + mensaje de felicitación.
- `/[coupleSlug]/view_pass/[uuid]`: Pase digital de entrada con código QR dinámico.
- `/[coupleSlug]/arrival/[uuid]`: Interfaz de recepción para validar y marcar acceso de los invitados escaneados.
- `/[coupleSlug]/checkout_list`: Dashboard de guardias/recepción para monitoreo de llegadas y check-in manual con filtros.
- `/[coupleSlug]/table`: Dashboard administrativo para novios/organizadores con estadísticas de RSVP y listado general.

### Endpoints API Globales (`app/api/auth/`)
- `POST /api/auth/login`: Autentica cualquier usuario/pareja globalmente y retorna su URL de redirección a `/[coupleSlug]/admin`.
- `GET /api/auth/me`: Retorna la sesión activa global.
- `POST /api/auth/logout`: Cierra la sesión activa global.

### Endpoints API por Pareja (`app/api/[coupleSlug]/`)
- `POST /api/[coupleSlug]/auth/login`: Autentica usuario y emite cookie HTTP-only `auth_session`.
- `POST /api/[coupleSlug]/auth/logout`: Cierra sesión activa eliminando cookie.
- `GET /api/[coupleSlug]/auth/me`: Retorna usuario autenticado y datos de la boda.
- `GET /api/[coupleSlug]/invitations`: Obtiene todas las invitaciones y grupos de la pareja.
- `POST /api/[coupleSlug]/invitations`: Crea una nueva invitación con sus pases/integrantes.
- `GET /api/[coupleSlug]/invitations/[uuid]`: Obtiene el detalle de una invitación individual.
- `PUT /api/[coupleSlug]/invitations/[uuid]`: Actualiza los datos de una invitación y sus integrantes.
- `DELETE /api/[coupleSlug]/invitations/[uuid]`: Elimina la invitación y sus integrantes.
- `GET /api/[coupleSlug]/invitation/[uuid]`: Devuelve datos de invitación (`couple`, `group`, `guests`).
- `POST /api/[coupleSlug]/confirm`: Procesa confirmación de asistencia individual y mensaje.
- `POST /api/[coupleSlug]/arrival/check-password`: Valida contraseña administrativa/guardia (`access_password`).
- `POST /api/[coupleSlug]/arrival/register`: Registra llegada (`arrived: boolean`) de un invitado.
- `GET /api/[coupleSlug]/table`: Obtiene lista y estadísticas de RSVP (requiere header `x-access-password` o validación).
- `GET /api/[coupleSlug]/checkout-list`: Obtiene lista y estadísticas de llegadas.

---

## 5. Roles y Convenciones Clave
- **Multi-Tenant (`[coupleSlug]`)**: Todas las rutas operan bajo el slug de la pareja (ej. `silva-arce`, `garcia-zentella`).
- **UUID de Invitación**: Cada familia/grupo posee un UUID único de acceso directo sin necesidad de login.
- **Flags de Grupo / Roles de Usuario**:
  - `is_couple` / `role: 'couple'`: Marca el grupo/usuario de los novios con acceso al panel `/admin`.
  - `is_guard` / `role: 'guard'`: Identifica personal de puerta con acceso a vistas de recepción y llegadas.
- **Seguridad de Dashboards**: Protegidos mediante sesión de usuario o `access_password` definido en la entidad `Couple`.

---

## 6. Scripts Disponibles
- `npm run dev`: Inicia el servidor de desarrollo Next.js.
- `npm run build`: Compila la aplicación para producción.
- `npm run init-db`: Crea tablas e índices en Neon PostgreSQL (`scripts/init-db.ts`).
- `npm run migrate:places`: Ejecuta la migración DDL para agregar `ceremony_place` y `reception_place` en la tabla `couples` (`scripts/migrate-add-places.ts`).
- `npm run migrate-data`: Migra datos de `DEFAULT_COUPLES` y JSONs locales hacia Neon DB (`scripts/migrate-data.ts`).
- `npm run migrate:users`: Crea la tabla `users` e inicializa los usuarios para las parejas registradas (`scripts/migrate-add-users.ts`).

---

## 7. Variables de Entorno Requeridas
- `DATABASE_URL`: Cadena de conexión Postgres de Neon (ej. `postgresql://user:pass@ep-xyz.neon.tech/neondb?sslmode=require`).
