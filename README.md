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

## Integrantes

- Cruz Quispe Evelyn Crisherat
- España Peña, Alfred Benjamin
- Apolinarez Salvatierra Alex Estefano
- Paucar Quispe Piero Israel
