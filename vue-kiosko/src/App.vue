<script setup>
import { computed, ref } from 'vue';
import GrillaDisponibilidad from './components/GrillaDisponibilidad.vue';
import { useDisponibilidad } from './composables/useDisponibilidad.js';
import { construirDisponibilidad } from '../../core-js/disponibilidad.js';
import { sedesUnicas } from '../../core-js/estadisticas.js';
const { laboratorios, reservas, fecha, cargando, error, ultimaActualizacion, actualizar } = useDisponibilidad();
const sede = ref(''), seleccion = ref(null);
const sedes = computed(() => sedesUnicas(laboratorios.value));
const filtrados = computed(() => laboratorios.value.filter(lab => !sede.value || lab.sede === sede.value));
const grilla = computed(() => construirDisponibilidad(filtrados.value, reservas.value, fecha.value));
const detalle = computed(() => {
  if (!seleccion.value) return null;
  const fila = filtrados.value.findIndex(lab => String(lab.id) === String(seleccion.value.laboratorioId));
  return grilla.value.matriz[fila]?.find(c => c.inicio === seleccion.value.inicio) || null;
});
const nombre = computed(() => filtrados.value.find(lab => String(lab.id) === String(detalle.value?.laboratorioId))?.nombre);
</script>
<template>
  <header><a class="marca" href="/">C <span>CampusHub<small>KIOSKO DE LABORATORIOS</small></span></a>
    <span class="fecha">{{ fecha }} · Lima</span></header>
  <main>
    <div class="encabezado"><div><p class="eyebrow">ESPACIOS PARA APRENDER</p><h1>Disponibilidad de hoy</h1>
      <p>Consulta un horario y selecciona una celda para conocer sus reservas.</p></div>
      <button class="actualizar" :disabled="cargando" @click="actualizar">{{ cargando ? 'Actualizando…' : 'Actualizar ahora' }}</button>
    </div>
    <section class="herramientas" aria-label="Filtros y leyenda">
      <label>Sede <select v-model="sede"><option value="">Todas las sedes</option>
        <option v-for="item in sedes" :key="item" :value="item">{{ item }}</option></select></label>
      <div class="leyenda"><span class="libre">Libre</span><span class="pendiente">Pendiente</span>
        <span class="ocupada">Ocupada</span><span class="mantenimiento">Mantenimiento</span></div>
    </section>
    <p class="sincronizacion">Actualización automática cada 30 segundos<span v-if="ultimaActualizacion"> · Última consulta: {{ ultimaActualizacion }}</span></p>
    <p v-if="cargando" role="status">Consultando disponibilidad…</p>
    <div v-if="error" class="error" role="alert"><strong>{{ error }}</strong>
      <p v-if="ultimaActualizacion">Los datos visibles corresponden a la última consulta correcta.</p>
      <button @click="actualizar" :disabled="cargando">Reintentar</button></div>
    <p v-if="!cargando && !error && !filtrados.length" class="vacio">No hay laboratorios para la sede seleccionada.</p>
    <GrillaDisponibilidad v-if="filtrados.length" :laboratorios="filtrados" :horarios="grilla.horarios"
      :matriz="grilla.matriz" @seleccionar="seleccion = $event" />
    <section v-if="detalle" class="detalle" aria-live="polite">
      <button class="cerrar" @click="seleccion = null" aria-label="Cerrar detalle">Cerrar</button>
      <p class="eyebrow">DETALLE DEL HORARIO</p><h2>{{ nombre }} · {{ detalle.inicio }}–{{ detalle.fin }}</h2>
      <p v-if="detalle.mantenimiento">Laboratorio en mantenimiento: no disponible para nuevas reservas.</p>
      <p v-else-if="detalle.estado === 'libre'">No hay reservas que ocupen esta franja.</p>
      <ul v-if="detalle.reservas.length"><li v-for="(reserva, i) in detalle.reservas" :key="`${reserva.codigo}-${i}`">
        <strong>{{ reserva.codigo }}</strong> · {{ reserva.horaInicio }}–{{ reserva.horaFin }} · {{ reserva.estado }}</li></ul>
      <p class="nota">Una reserva que ocupe parte de la hora marca toda esa celda. Los horarios exactos aparecen aquí.</p>
    </section>
  </main>
  <footer>CampusHub · Consulta pública de disponibilidad</footer>
</template>
