import { ref, onMounted, onUnmounted } from 'vue';
import { fechaEnLima } from '../../../core-js/disponibilidad.js';
const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function useDisponibilidad() {
  const laboratorios = ref([]), reservas = ref([]), fecha = ref(fechaEnLima());
  const cargando = ref(true), error = ref(''), ultimaActualizacion = ref('');
  let intervalo, controller, activo = true;
  async function actualizar() {
    controller?.abort();
    const solicitud = new AbortController();
    controller = solicitud;
    const timeout = setTimeout(() => solicitud.abort(), 10000);
    cargando.value = true;
    error.value = '';
    const dia = fechaEnLima();
    try {
      const consultar = async ruta => {
        const respuesta = await fetch(`${API}${ruta}`, { signal: solicitud.signal });
        if (!respuesta.ok) throw new Error(`El API respondió ${respuesta.status}.`);
        return respuesta.json();
      };
      const [labs, lista] = await Promise.all([
        consultar('/laboratorios'), consultar(`/reservas?fecha=${dia}`),
      ]);
      if (!activo || controller !== solicitud) return;
      laboratorios.value = labs; reservas.value = lista; fecha.value = dia;
      ultimaActualizacion.value = new Date().toLocaleTimeString('es-PE', { timeZone: 'America/Lima' });
    } catch (fallo) {
      if (activo && controller === solicitud) {
        error.value = fallo.name === 'AbortError'
          ? 'El API tardó demasiado en responder. Vuelve a intentar.'
          : `No se pudo actualizar la disponibilidad. ${fallo.message}`;
      }
    } finally {
      clearTimeout(timeout);
      if (activo && controller === solicitud) cargando.value = false;
    }
  }
  onMounted(() => {
    actualizar();
    intervalo = setInterval(actualizar, 30000);
  });
  onUnmounted(() => { activo = false; clearInterval(intervalo); controller?.abort(); });
  return { laboratorios, reservas, fecha, cargando, error, ultimaActualizacion, actualizar };
}
