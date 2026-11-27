<script setup>
defineProps({ celda: { type: Object, required: true }, nombre: { type: String, required: true } });
defineEmits(['seleccionar']);
</script>
<template>
  <button type="button" class="celda" :class="[celda.estado, { mantenimiento: celda.mantenimiento }]"
    :aria-label="`${nombre}, ${celda.inicio} a ${celda.fin}: ${celda.mantenimiento ? 'mantenimiento' : celda.estado}`"
    @click="$emit('seleccionar', celda)">
    {{ celda.mantenimiento ? 'Mant.' : celda.estado === 'ocupada' ? 'Ocupada' : celda.estado === 'pendiente' ? 'Pendiente' : 'Libre' }}
  </button>
</template>
