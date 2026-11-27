# Kiosko de Disponibilidad (Vue 3)

Aplicación tipo kiosko construida con Vue 3 + Vite para visualizar en tiempo real la disponibilidad horaria de los laboratorios del campus mediante una grilla bidimensional.

## Desarrollo

```powershell
npm install
npm run dev
```

Vite inicia el kiosko en `http://localhost:5174` por defecto y consulta el API compartido en `http://localhost:3000` (configurable con `VITE_API_URL`).

## Características implementadas

- **Reactividad y directivas Vue**: `v-model`, `v-for`, `v-if` / `v-else-if` / `v-else`, `:class`, `@click`, `computed`, `props` y `emit` entre `App.vue`, `FiltrosKiosko.vue` y `GrillaDisponibilidad.vue`.
- **Grilla bidimensional**: Matriz de laboratorios × franjas horarias del día usando `Reserva.seCruzaCon` y `sedesUnicas` de `core-js`.
- **Actualización automática**: Polling cada `30` segundos (`setInterval` en `onMounted` con limpieza en `onUnmounted`).

## Validación

```powershell
npm run build
```
