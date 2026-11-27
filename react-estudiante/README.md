# CampusHub — Portal de estudiantes

El portal React consulta el API compartido de `api-mock`; no utiliza archivos JSON locales como fuente de datos. El administrador Angular y React trabajan contra el mismo `api-mock/db.json`.

## Ejecución local

Inicia cada aplicación en una terminal independiente desde la raíz del repositorio:

```powershell
cd api-mock
npm install
npm start
```

```powershell
cd react-estudiante
npm install
npm run dev
```

```powershell
cd angular-admin
npm install
npm start
```

El API queda disponible en `http://localhost:3000`. Para cambiar la dirección usada por React, define `VITE_API_URL`.

## Integración React ↔ Angular

1. Inicia el API, React y Angular.
2. En React, inicia sesión como estudiante, crea una reserva y abre **Mis reservas**.
3. En Angular, abre **Reservas**, localiza la nueva solicitud y pulsa **Aprobar** o **Rechazar**.
4. Vuelve a React y pulsa **Actualizar reservas**. El historial y el resumen por estado consultan el cambio persistido por el API.

Credenciales demo: `u20231234@utp.edu.pe` / `est123` (estudiante) y `admin1@utp.edu.pe` / `admin123` (administrador). El inicio de sesión simulado valida contra `GET /usuarios?correo=...`; el perfil, sin contraseña, se conserva en `localStorage`.

## Clientes HTTP utilizados

| Cliente | Uso en este proyecto | Comportamiento |
|---|---|---|
| Fetch API | `laboratorioFetch.js`: catálogo, detalle y reservas asociadas al detalle | `async/await`; revisa `response.ok` antes de leer JSON y propaga errores HTTP. |
| Axios | `reservasApi.js`: login y operaciones de reservas (`GET`, `POST`, `PATCH`, `DELETE`) | Instancia con `baseURL`, timeout e interceptor de respuesta que convierte fallos HTTP/red en mensajes legibles. |
| Alova | `resumenAlova.js` y `ResumenReservas.jsx`: resumen por estado | `useRequest`, caché de 30 segundos y actualización manual que fuerza una consulta fresca. |

El hook `useReservas(usuarioId)` centraliza las reservas y expone datos, estados de carga/error, creación y cancelación. Las vistas muestran estados de carga, error y lista vacía al consultar el API.
