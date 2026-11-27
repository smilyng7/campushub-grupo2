<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import FiltrosKiosko from './components/FiltrosKiosko.vue';
import GrillaDisponibilidad from './components/GrillaDisponibilidad.vue';
import { Reserva } from '../../core-js/modelos.js';
import { sedesUnicas } from '../../core-js/estadisticas.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const INTERVALO_MS = 30000;

const FRANJAS = [
  { inicio: '08:00', fin: '10:00', etiqueta: '08:00 - 10:00' },
  { inicio: '10:00', fin: '12:00', etiqueta: '10:00 - 12:00' },
  { inicio: '12:00', fin: '14:00', etiqueta: '12:00 - 14:00' },
  { inicio: '14:00', fin: '16:00', etiqueta: '14:00 - 16:00' },
  { inicio: '16:00', fin: '18:00', etiqueta: '16:00 - 18:00' },
  { inicio: '18:00', fin: '20:00', etiqueta: '18:00 - 20:00' },
];

const laboratorios = ref([]);
const reservas = ref([]);
const cargando = ref(true);
const error = ref('');
const ultimaActualizacion = ref('');
const seleccion = ref(null);

const busqueda = ref('');
const sede = ref('Todas');
const fecha = ref(new Date().toISOString().slice(0, 10));
const soloDisponibles = ref(false);

let timerId = null;

async function cargarDatos() {
  try {
    cargando.value = true;
    error.value = '';

    const [resLabs, resReservas] = await Promise.all([
      fetch(`${API_URL}/laboratorios`),
      fetch(`${API_URL}/reservas`),
    ]);

    if (!resLabs.ok || !resReservas.ok) {
      throw new Error('No se pudo consultar la disponibilidad desde el API.');
    }

    laboratorios.value = await resLabs.json();
    reservas.value = await resReservas.json();
    ultimaActualizacion.value = new Date().toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch (err) {
    error.value = err.message || 'Error de conexión con el servidor.';
  } finally {
    cargando.value = false;
  }
}

onMounted(() => {
  cargarDatos();
  timerId = setInterval(cargarDatos, INTERVALO_MS);
});

onUnmounted(() => {
  if (timerId) clearInterval(timerId);
});

const sedes = computed(() => ['Todas', ...sedesUnicas(laboratorios.value)]);

const laboratoriosFiltrados = computed(() => {
  const texto = busqueda.value.trim().toLowerCase();

  return laboratorios.value.filter((lab) => {
    const coincideTexto =
      !texto ||
      lab.nombre.toLowerCase().includes(texto) ||
      lab.sede.toLowerCase().includes(texto) ||
      (lab.equipos || []).some((eq) => eq.toLowerCase().includes(texto));

    const coincideSede = sede.value === 'Todas' || lab.sede === sede.value;
    const coincideEstado = !soloDisponibles.value || lab.estado === 'disponible';

    return coincideTexto && coincideSede && coincideEstado;
  });
});

// Matriz bidimensional: filas = laboratorios filtrados, columnas = franjas horarias
const matrizDisponibilidad = computed(() =>
  laboratoriosFiltrados.value.map((lab) => ({
    laboratorio: lab,
    celdas: FRANJAS.map((franja) => {
      if (lab.estado === 'mantenimiento') {
        return { franja, estado: 'mantenimiento', reserva: null };
      }

      const bloque = new Reserva({
        laboratorioId: String(lab.id),
        fecha: fecha.value,
        horaInicio: franja.inicio,
        horaFin: franja.fin,
      });

      const reservaActiva = reservas.value.find(
        (r) =>
          r.estado !== 'rechazada' &&
          bloque.seCruzaCon({ ...r, laboratorioId: String(r.laboratorioId) }),
      );

      return {
        franja,
        estado: reservaActiva ? reservaActiva.estado : 'libre',
        reserva: reservaActiva || null,
      };
    }),
  })),
);

function limpiarFiltros() {
  busqueda.value = '';
  sede.value = 'Todas';
  soloDisponibles.value = false;
}

function mostrarDetalleCelda(payload) {
  seleccion.value = payload;
}
</script>

<template>
  <div class="min-vh-100 bg-light py-4">
    <div class="container">
      <header class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <span class="badge bg-primary mb-1">CampusHub Kiosko (Vue 3)</span>
          <h1 class="h3 mb-0">Disponibilidad de Laboratorios</h1>
        </div>
        <div class="text-muted small">
          Auto-actualización cada 30 s
          <span v-if="ultimaActualizacion"> · Última: {{ ultimaActualizacion }}</span>
        </div>
      </header>

      <FiltrosKiosko
        v-model:busqueda="busqueda"
        v-model:sede="sede"
        v-model:fecha="fecha"
        v-model:solo-disponibles="soloDisponibles"
        :sedes="sedes"
        :cargando="cargando"
        @limpiar="limpiarFiltros"
        @refrescar="cargarDatos"
      />

      <div v-if="error" class="alert alert-danger d-flex justify-content-between align-items-center">
        <span>{{ error }}</span>
        <button type="button" class="btn btn-outline-danger btn-sm" @click="cargarDatos">
          Reintentar
        </button>
      </div>

      <div v-else-if="cargando && laboratorios.length === 0" class="text-center py-5">
        <div class="spinner-border text-primary" role="status" />
        <p class="mt-2 text-muted">Cargando grilla de disponibilidad...</p>
      </div>

      <GrillaDisponibilidad
        v-else
        :franjas="FRANJAS"
        :matriz="matrizDisponibilidad"
        @seleccionar-celda="mostrarDetalleCelda"
      />

      <div v-if="seleccion" class="alert alert-secondary mt-3 d-flex justify-content-between align-items-center">
        <div>
          <strong>{{ seleccion.laboratorio.nombre }}</strong>
          ({{ seleccion.celda.franja.etiqueta }}):
          <span v-if="seleccion.celda.reserva">
            Reserva <strong>{{ seleccion.celda.reserva.codigo }}</strong> —
            {{ seleccion.celda.reserva.motivo }} ({{ seleccion.celda.estado }})
          </span>
          <span v-else-if="seleccion.celda.estado === 'mantenimiento'">
            En mantenimiento (no disponible para reservas).
          </span>
          <span v-else>
            Franja libre para reservar el {{ fecha }}.
          </span>
        </div>
        <button type="button" class="btn-close" aria-label="Cerrar" @click="seleccion = null" />
      </div>
    </div>
  </div>
</template>
