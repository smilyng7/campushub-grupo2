# API de desarrollo (json-server)

Este servicio REST es la fuente compartida de datos para React y Angular durante el desarrollo. Lee y persiste cambios en [`db.json`](./db.json); los portales deben acceder a los datos mediante HTTP, no importar el archivo directamente.

## Iniciar

```powershell
npm install
npm start
```

El API queda disponible en `http://localhost:3000`. El script `npm start` ejecuta json-server y observa `db.json`.

## Recursos principales

| Recurso | Rutas usadas |
|---|---|
| Usuarios | `GET /usuarios`, `GET /usuarios?correo=...` |
| Laboratorios (catálogo) | `GET /laboratorios`, `GET /laboratorios/:id` |
| Reservas (transacciones) | `GET /reservas`, `GET /reservas?usuarioId=...`, `POST /reservas`, `PATCH /reservas/:id`, `DELETE /reservas/:id` |

`PATCH /reservas/:id` permite cambiar el estado de una solicitud, por ejemplo a `aprobada` o `rechazada`. El JSON se actualiza con las operaciones de escritura y es compartido por ambas aplicaciones cuando usan esta instancia local.

## Comprobación rápida

Con el servidor iniciado, abre `http://localhost:3000/laboratorios` o ejecuta:

```powershell
curl.exe http://localhost:3000/reservas
```
