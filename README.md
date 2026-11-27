# CampusHub — Grupo 2

CampusHub es un sistema para que los estudiantes consulten y reserven laboratorios y equipos del campus, mientras el personal administra las solicitudes y la disponibilidad de los espacios.

## Caso de negocio y modelo

El proyecto organiza el dominio en tres conceptos:

| Concepto | CampusHub | Datos principales |
|---|---|---|
| Catálogo | Recursos que ofrece el campus | Laboratorios, sede, capacidad, equipos y disponibilidad |
| Transacción | Solicitud de uso de un recurso | Reserva, fecha, horario, motivo y estado |
| Usuarios | Personas que usan o administran el sistema | Estudiantes y administradores |

El flujo principal es: un estudiante consulta el catálogo y crea una reserva en React; el personal revisa y aprueba o rechaza la solicitud desde Angular; ambos portales consultan el mismo API, por lo que el cambio queda disponible para el estudiante al actualizar su historial.

## Estructura del repositorio

| Carpeta | Propósito | Guía |
|---|---|---|
| [`api-mock/`](./api-mock/) | API REST compartida y persistencia de desarrollo en `db.json` | [`api-mock/README.md`](./api-mock/README.md) |
| [`react-estudiante/`](./react-estudiante/) | Portal estudiantil: catálogo, login y reservas | [`react-estudiante/README.md`](./react-estudiante/README.md) |
| [`angular-admin/`](./angular-admin/) | Panel administrativo para gestionar laboratorios y reservas | [`angular-admin/README.md`](./angular-admin/README.md) |
| [`core-js/`](./core-js/) | Modelos, validadores y funciones de dominio reutilizadas | Incluido en la guía de React |
| `api-express/`, `next-publico/`, `vue-kiosko/` | Carpetas reservadas para alternativas/prototipos; no forman parte del flujo principal actual | README de cada carpeta |

## Ejecutar el flujo principal

Se requiere Node.js y npm. Instala dependencias la primera vez y ejecuta cada comando en una terminal separada:

**1. API compartida** — escucha en `http://localhost:3000`:

```powershell
cd api-mock
npm install
npm start
```

**2. Portal estudiantil React** — Vite usa `http://localhost:5173` por defecto:

```powershell
cd react-estudiante
npm install
npm run dev
```

**3. Panel administrativo Angular** — Angular CLI usa `http://localhost:4200` por defecto:

```powershell
cd angular-admin
npm install
npm start
```

Abre React, inicia sesión con una cuenta de estudiante y crea una reserva. En Angular, entra a **Reservas** y aprueba o rechaza la solicitud. Regresa a React y pulsa **Actualizar reservas** para consultar el nuevo estado.

Credenciales simuladas para desarrollo:

- Estudiante: `u20231234@utp.edu.pe` / `est123`
- Administrador: `admin1@utp.edu.pe` / `admin123`

## Fuente de datos

`api-mock/db.json` es la base de datos de desarrollo usada por el servidor API. React y Angular consultan el API en el puerto 3000; sus vistas no deben importar el JSON directamente. React puede apuntar a otra dirección configurando `VITE_API_URL`. El inicio de sesión simulado guarda únicamente el perfil autenticado en el `localStorage` del navegador; las reservas se persisten mediante el API.

Para instrucciones del stack y pruebas HTTP de cada módulo, consulta su README enlazado arriba.

## Comparación de frameworks

| Criterio | **React** (`react-estudiante/`) | **Angular** (`angular-admin/`) | **Vue 3** (`vue-kiosko/`) | **Next.js** (`next-publico/`) |
|---|---|---|---|---|
| **Rol en el proyecto** | Portal estudiantil interactivo | Panel administrativo (CRUD y aprobaciones) | Kiosko de disponibilidad (grilla 2D cada 30 s) | Portal público SEO/SSR |
| **Renderizado** | CSR (Vite) | CSR (Angular CLI) | CSR (Vite) | SSR (App Router, `cache: 'no-store'`) |
| **Reactividad / Estado** | Hooks (`useState`, `useEffect`), Context API y `useReservas` | `signal()` y RxJS (`BehaviorSubject`, `timer`) | Composition API (`ref`, `computed`, `onMounted`/`onUnmounted`) | Server Components `async` sin estado en cliente |
| **Comunicación** | `props` y callbacks | Inyección de dependencias (`inject(...)`) | `defineProps` y `defineEmits` | `params` de ruta y composición en servidor |
| **Directivas / UI** | JSX, `.map()` y ternarios | `@if`, `@for`, `@empty`, `[ngClass]` | `v-model`, `v-for`, `v-if`/`v-else`, `:class`, `@click` | JSX en servidor (`Link`, `notFound()`) |
| **Enrutamiento** | `react-router-dom` (`App.jsx`) | `@angular/router` (`app.routes.ts`) | Vista única sin router | Basado en archivos (`[id]`, `[codigo]`, `not-found.jsx`) |
| **Consumo HTTP** | Fetch API, Axios (con interceptor) y Alova (caché) | `HttpClient` con `Observable` | `fetch` nativo con `Promise.all` | `fetch` en servidor con `cache: 'no-store'` |

- **React** se usa en el portal estudiantil por la alta interactividad (filtros, formularios, rutas protegidas) y la combinación de Fetch, Axios y Alova según el caso de uso.
- **Angular** organiza el panel administrativo con TypeScript, servicios inyectables y polling con RxJS para mantener sincronizado el dashboard y aprobar/rechazar reservas.
- **Vue 3** resuelve el kiosko con directivas reactivas (`v-model`, `v-for`) y una matriz bidimensional recalculada con `computed` y actualizada cada 30 segundos.
- **Next.js** renderiza en el servidor el catálogo público, el detalle por laboratorio (`[id]`) y la consulta de reserva (`[codigo]`) con metadatos dinámicos (`generateMetadata`) visibles en el HTML inicial.

## Integrantes

- Cruz Quispe Evelyn Crisherat
- España Peña, Alfred Benjamin
- Apolinarez Salvatierra Alex Estefano
- Paucar Quispe Piero Israel
