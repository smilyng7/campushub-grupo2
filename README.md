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
| [`angular-admin/`](./angular-admin/) | Panel administrativo para gestionar laboratorios y reservas | [`angular-admin/readme.md`](./angular-admin/readme.md) |
| [`core-js/`](./core-js/) | Modelos, validadores y funciones de dominio reutilizadas | Incluido en la guía de React |
| `vue-kiosko/` | Disponibilidad diaria, filtros y actualización cada 30 s | `vue-kiosko/readme.md` |
| `next-publico/` | Catálogo, detalle SSR y consulta por código | `next-publico/readme.md` |
| `api-express/` | Backend pendiente del avance 5 | No se requiere para los avances 3 y 4 |

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

## Integrantes

- Cruz Quispe Evelyn Crisherat
- España Peña, Alfred Benjamin
- Apolinarez Salvatierra Alex Estefano
- Paucar Quispe Piero Israel


## Avance 4: ejecutar las otras dos interfaces

Con el API iniciado, abrir una terminal en `vue-kiosko`, ejecutar `npm ci` y `npm run dev` (puerto 5174).
En otra terminal, dentro de `next-publico`, ejecutar `npm ci` y `npm run dev` (puerto 3001).
En PowerShell se puede usar `npm.cmd` si la política de scripts bloquea `npm.ps1`.
Usar una versión reciente de Node.js LTS compatible con las dependencias del lockfile.

## Comparación de frameworks basada en este código

| Aspecto | Angular | React | Vue | Next.js |
|---|---|---|---|---|
| Estructura y aprendizaje | Componentes TypeScript, inyección y servicios; requiere entender providers y Observables | JSX y hooks; hay que coordinar efectos, estados y dependencias | SFC con script/template/style; ref y computed separan estado y derivados | Comparte React, pero distingue servidor y cliente; params se espera con await |
| Estado | Signals en ReservasLista; servicio HttpClient | useReservas organiza carga y operaciones; Context conserva sesión | useDisponibilidad conserva datos; computed genera la matriz y el filtro | Las páginas consultan en servidor; solo el buscador utiliza estado en cliente |
| Enrutamiento | app.routes.ts y routerLink | React Router con rutas protegidas | Una pantalla pública, no necesita router | Carpetas App Router con [id] y [codigo] |
| Renderizado | SPA en navegador | SPA en navegador | SPA en navegador | SSR por petición con fetch no-store para datos públicos |
| Actualización | Botón Actualizar reservas y PATCH de estado | Botón de actualización y caché Alova invalidada | Consulta cada 30 segundos; limpia intervalo al desmontar | Una nueva petición a la página consulta datos actuales |
| Ejemplo para explicar | ReservaService.actualizarEstado | Interceptor de reservasApi y useReservas | Props/emit de CeldaHorario y matriz de core-js | HTML de /laboratorios/1 ya contiene el laboratorio |

El equipo debe complementar la columna de aprendizaje con su experiencia al ensayar y explicar estas diferencias con los archivos abiertos.

## Prueba conjunta de los avances 3 y 4

1. Iniciar API, Angular, React, Vue y Next en sus cinco puertos.
2. En React, iniciar sesión como estudiante y crear una reserva para **hoy**, en un laboratorio disponible, entre 07:00 y 22:00, sin cruce.
3. En Angular, pulsar Actualizar reservas y aprobar la solicitud pendiente.
4. En React, pulsar Actualizar reservas: comprobar estado y resumen.
5. En Vue, esperar hasta 30 segundos o pulsar Actualizar ahora: la franja pasa a ocupada. Pulsarla y revisar el código y horas exactas.
6. En Next, consultar el código desde el formulario de inicio. Abrir el detalle del laboratorio y usar Ver código fuente para localizar su nombre y reservas aprobadas de la semana.
7. Probar un código inexistente: se muestra Reserva no encontrada. Cancelar la solicitud en React y actualizar las demás vistas.
8. Detener temporalmente el API y comprobar los mensajes de error y la recuperación al iniciarlo.

Los datos originales incluyen fechas históricas; Vue muestra el día actual y Next solo las aprobadas de la semana. No se cambiaron las reservas originales: crear datos de demostración para el día de la exposición.

## Validación y límites

- core-js: `node --test` (28 casos).
- Vue: `npm test` (4 pruebas de componentes, filtro, selección, recuperación y temporizador) y `npm run build`.
- React: `npm run lint` y `npm run build`.
- Angular: `npm test -- --watch=false` (12 pruebas) y `npm run build`.
- Next: `npm run lint` y `npm run build`. Se verifican rutas existentes y no encontradas por HTTP y contenido SSR.

Las pruebas de componentes utilizan DOM simulado. El ensayo visual completo en las cinco interfaces queda a cargo del equipo antes de sustentar. Angular mantiene una advertencia de tamaño del bundle, que no impide compilar.
La autenticación es simulada y el API es json-server, como corresponde a estos avances. Las reglas y permisos del servidor con JWT corresponden al avance 5. La validación previa a crear en React no evita por sí sola solicitudes simultáneas de dos navegadores; el backend final deberá resolver esa concurrencia.

## Asistencia y participación

Se utilizó asistencia de IA para desarrollar y revisar código, pruebas y documentación. Cada integrante debe comprender y poder explicar su contribución. Hacer commits reales con la cuenta de cada autor y crear las etiquetas avance-3 y avance-4 cuando el equipo confirme la versión final. Esta entrega no crea commits ni publica cambios en GitHub.
