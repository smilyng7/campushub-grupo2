# Portal estudiantil (React)

Este módulo ofrece el catálogo, autenticación simulada, creación de reservas e historial del estudiante. Para iniciar todo el proyecto, sigue la guía de [CampusHub](../README.md); primero debe estar activo el API de [`api-mock`](../api-mock/README.md).

## Desarrollo

```powershell
npm install
npm run dev
```

Vite muestra la URL local al iniciar (por defecto `http://localhost:5173`). Para apuntar a otro servidor, configura `VITE_API_URL`; por defecto los servicios usan `http://localhost:3000`.

Credenciales de prueba:

- Estudiante: `u20231234@utp.edu.pe` / `est123`
- Administrador: `admin1@utp.edu.pe` / `admin123`

El login consulta `GET /usuarios?correo=...` y conserva el perfil, sin contraseña, en `localStorage`. Los datos del catálogo, usuarios y reservas se consultan al API; el archivo `src/data/db.json` no es fuente de datos de la aplicación.

## Clientes HTTP

| Cliente | Uso | Implementación |
|---|---|---|
| Fetch API | Catálogo de laboratorios, detalle y reservas asociadas | `src/services/laboratorioFetch.js` usa `async/await` y comprueba `response.ok`. |
| Axios | Login y CRUD de reservas | `src/services/reservasApi.js` define instancia con `baseURL` e interceptor para traducir errores HTTP/red. Usa `GET`, `POST`, `PATCH` y `DELETE`. |
| Alova | Resumen del estudiante por estado | `src/services/resumenAlova.js` se consume con `useRequest`, caché y actualización manual en `src/components/ResumenReservas.jsx`. |

El hook `src/hooks/useReservas.js` centraliza consulta, creación, cancelación y actualización. Las vistas presentan indicadores de carga, errores y estados vacíos.

## Validación

```powershell
npm run lint
npm run build
```
