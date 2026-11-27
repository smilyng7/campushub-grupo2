<script setup>
import { computed } from 'vue';

const props = defineProps({
  sedes: { type: Array, required: true },
  sede: { type: String, required: true },
  busqueda: { type: String, required: true },
  fecha: { type: String, required: true },
  soloDisponibles: { type: Boolean, required: true },
  cargando: { type: Boolean, default: false },
});

const emit = defineEmits([
  'update:sede',
  'update:busqueda',
  'update:fecha',
  'update:soloDisponibles',
  'limpiar',
  'refrescar',
]);

const busquedaModel = computed({
  get: () => props.busqueda,
  set: (valor) => emit('update:busqueda', valor),
});

const sedeModel = computed({
  get: () => props.sede,
  set: (valor) => emit('update:sede', valor),
});

const fechaModel = computed({
  get: () => props.fecha,
  set: (valor) => emit('update:fecha', valor),
});

const soloDisponiblesModel = computed({
  get: () => props.soloDisponibles,
  set: (valor) => emit('update:soloDisponibles', valor),
});
</script>

<template>
  <section class="card card-body shadow-sm border-0 mb-4">
    <div class="row g-3 align-items-end">
      <div class="col-md-4">
        <label for="kiosko-busqueda" class="form-label fw-semibold small">
          Buscar laboratorio o equipo
        </label>
        <input
          id="kiosko-busqueda"
          v-model="busquedaModel"
          type="text"
          class="form-control"
          placeholder="Ej. Lab A-301, Arduino, Proyector..."
        />
      </div>

      <div class="col-md-3">
        <label for="kiosko-sede" class="form-label fw-semibold small">Sede</label>
        <select id="kiosko-sede" v-model="sedeModel" class="form-select">
          <option v-for="item in sedes" :key="item" :value="item">
            {{ item }}
          </option>
        </select>
      </div>

      <div class="col-md-2">
        <label for="kiosko-fecha" class="form-label fw-semibold small">Fecha</label>
        <input
          id="kiosko-fecha"
          v-model="fechaModel"
          type="date"
          class="form-control"
        />
      </div>

      <div class="col-md-3 d-flex flex-wrap gap-2 justify-content-md-end">
        <button
          type="button"
          class="btn btn-outline-secondary btn-sm"
          @click="emit('limpiar')"
        >
          Limpiar
        </button>
        <button
          type="button"
          class="btn btn-primary btn-sm"
          :disabled="cargando"
          @click="emit('refrescar')"
        >
          {{ cargando ? 'Actualizando...' : 'Actualizar ahora' }}
        </button>
      </div>
    </div>

    <div class="form-check mt-3">
      <input
        id="kiosko-disponibles"
        v-model="soloDisponiblesModel"
        class="form-check-input"
        type="checkbox"
      />
      <label class="form-check-label small" for="kiosko-disponibles">
        Mostrar solo laboratorios disponibles (ocultar en mantenimiento)
      </label>
    </div>
  </section>
</template>
