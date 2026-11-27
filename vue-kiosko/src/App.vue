
<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';

import FiltrosKiosko from './components/FiltrosKiosko.vue';
import GrillaDisponibilidad from './components/GrillaDisponibilidad.vue';

import { Reserva } from '../../core-js/modelos.js';
import { sedesUnicas } from '../../core-js/estadisticas.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const INTERVALO_MS = 30000;

// Horarios desde las 07:00 hasta las 22:00
const FRANJAS = Array.from({ length: 15 }, (_, i) => {
  const horaInicio = 7 + i;
  const horaFin = horaInicio + 1;

  const inicio = `${String(horaInicio).padStart(2, '0')}:00`;
  const fin = `${String(horaFin).padStart(2, '0')}:00`;

  return {
    inicio,
    fin,
    etiqueta: `${inicio} - ${fin}`,
  };
});

// Estados reactivos
const laboratorios = ref([]);
const reservas = ref([]);

const cargando = ref(true);
const error = ref('');
const ultimaActualizacion = ref('');
const seleccion = ref(null);

// Filtros
const busqueda = ref('');
const sede = ref('Todas');

const obtenerFechaActual = () => {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Lima',
  }).format(new Date());
};

const fecha = ref(obtenerFechaActual());
const soloDisponibles = ref(false);

let timerId = null;

// Consultar API REST
async function cargarDatos() {
  try {
    cargando.value = true;
    error.value = '';

    const [resLabs, resReservas] = await Promise.all([
      fetch(`${API_URL}/laboratorios`),
      fetch(`${API_URL}/reservas`),
    ]);

    if (!resLabs.ok) {
      throw new Error(
        `Error al consultar laboratorios: ${resLabs.status}`
      );
    }

    if (!resReservas.ok) {
      throw new Error(
        `Error al consultar reservas: ${resReservas.status}`
      );
    }

    const datosLaboratorios = await resLabs.json();
    const datosReservas = await resReservas.json();

    if (!Array.isArray(datosLaboratorios) ||
        !Array.isArray(datosReservas)) {
      throw new Error('El API devolvió datos con formato incorrecto.');
    }

    laboratorios.value = datosLaboratorios;
    reservas.value = datosReservas;

    ultimaActualizacion.value =
      new Date().toLocaleTimeString('es-PE');

  } catch (err) {
    error.value =
      err.message || 'Error de conexión con el servidor.';
  } finally {
    cargando.value = false;
  }
}

// Ciclo de vida de Vue
onMounted(() => {
  cargarDatos();

  timerId = setInterval(() => {
    cargarDatos();
  }, INTERVALO_MS);
});

// Limpiar intervalo al desmontar
onUnmounted(() => {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
});

// Obtener sedes únicas
const sedes = computed(() => [
  'Todas',
  ...sedesUnicas(laboratorios.value),
]);

// Aplicar filtros
const laboratoriosFiltrados = computed(() => {
  const texto = busqueda.value.trim().toLowerCase();

  return laboratorios.value.filter((lab) => {
    const coincideTexto =
      !texto ||
      lab.nombre.toLowerCase().includes(texto) ||
      lab.sede.toLowerCase().includes(texto) ||
      (lab.equipos || []).some((equipo) =>
        equipo.toLowerCase().includes(texto)
      );

    const coincideSede =
      sede.value === 'Todas' || lab.sede === sede.value;

    const coincideEstado =
      !soloDisponibles.value ||
      lab.estado === 'disponible';

    return coincideTexto && coincideSede && coincideEstado;
  });
});

// Construir matriz bidimensional
// Filas: laboratorios
// Columnas: horarios
const matrizDisponibilidad = computed(() => {
  return laboratoriosFiltrados.value.map((lab) => {

    const celdas = FRANJAS.map((franja) => {

      // Si el laboratorio está en mantenimiento
      if (lab.estado === 'mantenimiento') {
        return {
          franja,
          estado: 'mantenimiento',
          reserva: null,
        };
      }

      // Crear bloque horario de una hora
      const bloque = new Reserva({
        laboratorioId: String(lab.id),
        fecha: fecha.value,
        horaInicio: franja.inicio,
        horaFin: franja.fin,
      });

      // Buscar reservas que se cruzan con el horario
      const reservaActiva = reservas.value.find((reserva) => {

        // Ignorar reservas rechazadas
        if (reserva.estado === 'rechazada') {
          return false;
        }

        // Comprobar fecha
        if (reserva.fecha !== fecha.value) {
          return false;
        }

        // Comprobar que pertenezca al mismo laboratorio
        if (
          String(reserva.laboratorioId) !== String(lab.id)
        ) {
          return false;
        }

        // Convertir reserva a objeto compatible con Reserva
        const otraReserva = {
          ...reserva,
          laboratorioId: String(reserva.laboratorioId),
        };

        // Comprobar cruce de horarios
        return bloque.seCruzaCon(otraReserva);
      });

      return {
        franja,
        estado: reservaActiva
          ? reservaActiva.estado
          : 'libre',
        reserva: reservaActiva || null,
      };
    });

    return {
      laboratorio: lab,
      celdas,
    };
  });
});

// Limpiar filtros
function limpiarFiltros() {
  busqueda.value = '';
  sede.value = 'Todas';
  fecha.value = obtenerFechaActual();
  soloDisponibles.value = false;
  seleccion.value = null;
}

// Mostrar detalle de una celda
function mostrarDetalleCelda(payload) {
  seleccion.value = payload;
}
</script>

<template>
  <div class="min-vh-100 bg-light py-4">

    <div class="container">

      <!-- Encabezado -->
      <header
        class="d-flex flex-wrap justify-content-between
        align-items-center gap-2 mb-4"
      >
        <div>
          <span class="badge bg-primary mb-1">
            CampusHub Kiosko - Vue 3
          </span>

          <h1 class="h3 mb-0">
            Disponibilidad de Laboratorios
          </h1>

          <p class="text-muted small mb-0">
            Consulta los horarios disponibles del campus.
          </p>
        </div>

        <div class="text-muted small">
          Actualización automática cada 30 segundos

          <span v-if="ultimaActualizacion">
            · Última: {{ ultimaActualizacion }}
          </span>
        </div>
      </header>

      <!-- Filtros -->
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

      <!-- Error -->
      <div
        v-if="error"
        class="alert alert-danger d-flex
        justify-content-between align-items-center"
      >
        <span>{{ error }}</span>

        <button
          class="btn btn-outline-danger btn-sm"
          @click="cargarDatos"
        >
          Reintentar
        </button>
      </div>

      <!-- Cargando -->
      <div
        v-else-if="cargando && laboratorios.length === 0"
        class="text-center py-5"
      >
        <div class="spinner-border text-primary"></div>

        <p class="mt-2 text-muted">
          Cargando disponibilidad...
        </p>
      </div>

      <!-- Grilla -->
      <GrillaDisponibilidad
        v-else
        :franjas="FRANJAS"
        :matriz="matrizDisponibilidad"
        @seleccionar-celda="mostrarDetalleCelda"
      />

      <!-- Detalle de celda -->
      <div
        v-if="seleccion"
        class="alert alert-secondary mt-3
        d-flex justify-content-between align-items-center"
      >
        <div>
          <strong>
            {{ seleccion.laboratorio.nombre }}
          </strong>

          ({{ seleccion.celda.franja.etiqueta }})

          <span v-if="seleccion.celda.reserva">
            <br />

            Reserva:
            <strong>
              {{ seleccion.celda.reserva.codigo }}
            </strong>

            — {{ seleccion.celda.reserva.motivo }}

            ({{ seleccion.celda.estado }})
          </span>

          <span
            v-else-if="
              seleccion.celda.estado === 'mantenimiento'
            "
          >
            <br />
            Laboratorio en mantenimiento.
          </span>

          <span v-else>
            <br />
            Horario libre para reservar el {{ fecha }}.
          </span>
        </div>

        <button
          type="button"
          class="btn-close"
          aria-label="Cerrar"
          @click="seleccion = null"
        ></button>
      </div>

    </div>
  </div>
</template>
