# Kiosko Vue — Avance 4

Instalar con `npm ci`, iniciar con `npm run dev`. URL: http://localhost:5174. El API debe estar en el puerto 3000; ver `.env.example` para cambiar VITE_API_URL.

- `App.vue`: filtro por sede mediante v-model y detalle de la celda seleccionada.
- `GrillaDisponibilidad.vue`: filas por laboratorio, columnas por hora; v-for y props.
- `CeldaHorario.vue`: clases de estado y evento seleccionar mediante emit.
- `useDisponibilidad.js`: GET de laboratorios y reservas del día; carga, error, reintento y actualización cada 30 segundos. Aborta consultas y limpia el intervalo al desmontar.
- `core-js/disponibilidad.js`: matriz de 15 franjas de 07:00–08:00 hasta 21:00–22:00. Reutiliza aMinutos del núcleo.

Una reserva parcial ocupa toda la celda visual: consultar el detalle para sus minutos exactos. Aprobada tiene prioridad sobre pendiente; rechazada no bloquea. Laboratorios en mantenimiento aparecen señalados como no disponibles. La fecha se calcula en Lima y se actualiza en cada consulta, también al cambiar de día.

La función devuelve `{ horarios, matriz }`; cada fila corresponde al laboratorio de la misma posición de la lista recibida. Las celdas incluyen laboratorioId, fecha, inicio, fin, estado, mantenimiento y reservas resumidas. No modifica los arreglos originales.

Para cambiar el rango en una exposición, pasar inicio y fin a construirDisponibilidad y ajustar el caption de la tabla. El rango predeterminado es 7–22.

Pruebas: `npm test`. Compilación: `npm run build`. No se incluyen node_modules ni dist en el ZIP.
