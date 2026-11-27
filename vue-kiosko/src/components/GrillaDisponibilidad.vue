
<script setup>
import CeldaHorario from './CeldaHorario.vue';

defineProps({
  franjas: {
    type: Array,
    required: true,
  },
  matriz: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['seleccionar-celda']);

function seleccionarCelda(laboratorio, celda) {
  emit('seleccionar-celda', {
    laboratorio,
    celda,
  });
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
        <tr
          v-for="fila in matriz"
          :key="fila.laboratorio.id"
        >
          <td class="text-start">
            <div class="fw-bold">
              {{ fila.laboratorio.nombre }}
            </div>

            <small class="text-muted">
              {{ fila.laboratorio.sede }}
              · {{ fila.laboratorio.capacidad }} estudiantes
            </small>
          </td>

          <CeldaHorario
            v-for="celda in fila.celdas"
            :key="celda.franja.etiqueta"
            :celda="celda"
            @seleccionar="
              seleccionarCelda(fila.laboratorio, $event)
            "
          />
        </tr>
      </tbody>
    </table>
  </div>

  <div class="d-flex flex-wrap gap-3 mt-3 small">
    <span><span class="badge bg-success"> </span> Libre</span>
    <span><span class="badge bg-warning"> </span> Pendiente</span>
    <span><span class="badge bg-danger"> </span> Ocupado</span>
    <span><span class="badge bg-secondary"> </span> Mantenimiento</span>
  </div>
</template>
