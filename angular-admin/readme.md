# Panel administrativo (Angular)

Este módulo permite al personal consultar solicitudes y administrar laboratorios. Para el flujo integrado, arranca primero el API y el portal React según la [guía principal](../README.md).

## Desarrollo

```powershell
npm install
npm start
```

Angular CLI inicia el panel en `http://localhost:4200` por defecto. El servicio de reservas usa `http://localhost:3000/reservas`.

## Gestión de reservas

En **Reservas**, el panel consulta las solicitudes del API. Las reservas pendientes ofrecen las acciones **Aprobar** y **Rechazar**, que actualizan su estado con `PATCH /reservas/:id`. La tabla se actualiza al recibir la respuesta del API. React consulta el estado actualizado al pulsar **Actualizar reservas**.

## Validación

```powershell
npm run build
npm test -- --watch=false --include=src/app/components/reservas-lista/reservas-lista.spec.ts
```