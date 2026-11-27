<script setup>
import CeldaHorario from './CeldaHorario.vue';
defineProps({ laboratorios: Array, horarios: Array, matriz: Array });
defineEmits(['seleccionar']);
</script>
<template>
  <div class="tabla-scroll" tabindex="0" aria-label="Disponibilidad de laboratorios por hora">
    <table>
      <caption>Horario del día · 07:00 a 22:00 · Lima</caption>
      <thead><tr><th scope="col">Laboratorio</th>
        <th v-for="hora in horarios" :key="hora.inicio" scope="col">{{ hora.inicio }}<small>{{ hora.fin }}</small></th>
      </tr></thead>
      <tbody><tr v-for="(lab, fila) in laboratorios" :key="lab.id">
        <th scope="row">{{ lab.nombre }}<small>{{ lab.sede }} · {{ lab.capacidad }} personas</small></th>
        <td v-for="celda in matriz[fila]" :key="celda.inicio">
          <CeldaHorario :celda="celda" :nombre="lab.nombre" @seleccionar="$emit('seleccionar', $event)" />
        </td>
      </tr></tbody>
    </table>
  </div>
</template>
