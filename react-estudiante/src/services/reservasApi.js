import axios from 'axios';
import { Reserva } from '../../../core-js/modelos.js';
import { esFecha, esHora } from '../../../core-js/validadores.js';

export const reservasApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 10000,
});

reservasApi.interceptors.response.use(
  respuesta => respuesta,
  error => {
    if (axios.isCancel(error)) return Promise.reject(error);
    const mensajes = {
      400: 'Revisa los datos de la reserva.',
      401: 'Inicia sesión para continuar.',
      403: 'No tienes permiso para realizar esta operación.',
      404: 'La reserva o el laboratorio ya no existe. Actualiza la lista.',
      409: 'El laboratorio ya tiene una reserva en ese horario.',
      500: 'El servidor tuvo un problema. Inténtalo nuevamente.',
    };
    error.message = mensajes[error.response?.status]
      || (error.response ? 'No se pudo completar la operación.'
        : 'No se pudo conectar con el API. Comprueba que esté iniciado.');
    return Promise.reject(error);
  },
);

export async function listarReservas(usuarioId, signal) {
  const { data } = await reservasApi.get('/reservas', { params: { usuarioId }, signal });
  return data;
}

export async function crearReserva(datos) {
  // Consultar todas las reservas permite detectar cruces con otros estudiantes.
  const [{ data: actuales }, { data: laboratorio }] = await Promise.all([
    reservasApi.get('/reservas'),
    reservasApi.get(`/laboratorios/${encodeURIComponent(datos.laboratorioId)}`),
  ]);
  if (laboratorio.estado !== 'disponible') {
    throw new Error('El laboratorio ya no está disponible. Actualiza el formulario.');
  }
  const nueva = new Reserva({ ...datos, laboratorioId: String(laboratorio.id) });
  if (!esFecha(datos.fecha) || !esHora(datos.horaInicio) || !esHora(datos.horaFin)
    || !datos.motivo.trim() || !nueva.esHorarioValido()) {
    throw new Error('Revisa la fecha, el motivo y el horario de la reserva.');
  }
  const hayCruce = actuales.some(otra => otra.estado !== 'rechazada'
    && nueva.seCruzaCon({ ...otra, laboratorioId: String(otra.laboratorioId) }));
  if (hayCruce) throw new Error('Este laboratorio ya tiene una reserva en ese horario.');
  const ultimoCodigo = actuales.reduce((mayor, reserva) => {
    const numero = Number(reserva.codigo?.replace(/^RES-/, '')) || 0;
    return Math.max(mayor, numero);
  }, 0);
  const { data } = await reservasApi.post('/reservas', {
    laboratorioId: laboratorio.id,
    usuarioId: datos.usuarioId,
    fecha: datos.fecha,
    horaInicio: datos.horaInicio,
    horaFin: datos.horaFin,
    motivo: datos.motivo.trim(),
    codigo: `RES-${String(ultimoCodigo + 1).padStart(4, '0')}`,
    estado: 'pendiente',
    creadoEn: new Date().toISOString(),
  });
  return data;
}

export async function cancelarReserva(id) {
  await reservasApi.delete(`/reservas/${encodeURIComponent(id)}`);
}
