<script setup>
defineProps({
  franjas: { type: Array, required: true },
  matriz: { type: Array, required: true },
});

const emit = defineEmits(['seleccionar-celda']);

function claseCelda(estado) {
  if (estado === 'mantenimiento') return 'table-secondary text-muted';
  if (estado === 'aprobada') return 'table-danger text-danger-emphasis';
  if (estado === 'pendiente') return 'table-warning text-dark';
  return 'table-success text-success-emphasis';
}

function textoCelda(celda) {
  if (celda.estado === 'mantenimiento') return 'Mantenimiento';
  if (celda.estado === 'aprobada') return `Ocupado (${celda.reserva.codigo})`;
  if (celda.estado === 'pendiente') return `Pendiente (${celda.reserva.codigo})`;
  return 'Libre';
}
</script>

<template>
  <div v-if="matriz.length === 0" class="alert alert-info">
    No hay laboratorios que coincidan con los filtros actuales.
  </div>

  <div v-else class="table-responsive shadow-sm rounded bg-white">
    <table class="table table-bordered align-middle text-center mb-0">
      <thead class="table-dark">
        <tr>
          <th class="text-start">Laboratorio</th>
          <th v-for="franja in franjas" :key="franja.etiqueta">
            {{ franja.etiqueta }}
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="fila in matriz" :key="fila.laboratorio.id">
          <td class="text-start">
            <div class="fw-bold">{{ fila.laboratorio.nombre }}</div>
            <small class="text-muted">
              {{ fila.laboratorio.sede }} · {{ fila.laboratorio.capacidad }} est.
            </small>
          </td>

          <td
            v-for="celda in fila.celdas"
            :key="celda.franja.etiqueta"
            :class="claseCelda(celda.estado)"
            role="button"
            tabindex="0"
            @click="emit('seleccionar-celda', { laboratorio: fila.laboratorio, celda })"
            @keydown.enter="emit('seleccionar-celda', { laboratorio: fila.laboratorio, celda })"
          >
            <span class="small fw-semibold">{{ textoCelda(celda) }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
