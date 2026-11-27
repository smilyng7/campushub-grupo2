
<script setup>
const props = defineProps({
  celda: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['seleccionar']);

function claseCelda(estado) {
  if (estado === 'mantenimiento') {
    return 'celda-mantenimiento';
  }

  if (estado === 'aprobada') {
    return 'celda-ocupada';
  }

  if (estado === 'pendiente') {
    return 'celda-pendiente';
  }

  return 'celda-libre';
}

function textoCelda(celda) {
  if (celda.estado === 'mantenimiento') {
    return 'Mantenimiento';
  }

  if (celda.estado === 'aprobada') {
    return 'Ocupado';
  }

  if (celda.estado === 'pendiente') {
    return 'Pendiente';
  }

  return 'Libre';
}

function seleccionarCelda() {
  emit('seleccionar', props.celda);
}
</script>

<template>
  <td
    :class="claseCelda(celda.estado)"
    class="celda-horario"
    role="button"
    tabindex="0"
    @click="seleccionarCelda"
    @keydown.enter="seleccionarCelda"
    @keydown.space.prevent="seleccionarCelda"
  >
    <span class="small fw-semibold">
      {{ textoCelda(celda) }}
    </span>

    <small v-if="celda.reserva" class="d-block">
      {{ celda.reserva.codigo }}
    </small>
  </td>
</template>

<style scoped>
.celda-horario {
  min-width: 125px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.celda-horario:hover {
  opacity: 0.75;
}

.celda-libre {
  background-color: #d1e7dd !important;
  color: #0f5132;
}

.celda-pendiente {
  background-color: #fff3cd !important;
  color: #664d03;
}

.celda-ocupada {
  background-color: #f8d7da !important;
  color: #842029;
}

.celda-mantenimiento {
  background-color: #e2e3e5 !important;
  color: #41464b;
}
</style>
