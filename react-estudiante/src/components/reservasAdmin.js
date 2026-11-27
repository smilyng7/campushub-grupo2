import { Reserva } from '../../../core-js/modelos.js';
import { esFecha, esHora } from '../../../core-js/validadores.js';
import db from '../data/db.json';

export const formularioVacio = {
  usuarioId: '',
  laboratorioId: '',
  fecha: '',
  horaInicio: '',
  horaFin: '',
  motivo: '',
  estado: 'pendiente',
};

export const estadosReserva = ['pendiente', 'aprobada', 'rechazada'];

export function crearDatosEdicion(reserva) {
  return {
    usuarioId: String(reserva.usuarioId),
    laboratorioId: String(reserva.laboratorioId),
    fecha: reserva.fecha,
    horaInicio: reserva.horaInicio,
    horaFin: reserva.horaFin,
    motivo: reserva.motivo,
    estado: reserva.estado,
  };
}

export function validarReservaAdmin(datos, reservaEditando, reservas) {
  const estudiante = db.usuarios.find(
    (usuario) => usuario.rol === 'estudiante' && String(usuario.id) === datos.usuarioId
  );
  const laboratorio = db.laboratorios.find(
    (item) => String(item.id) === datos.laboratorioId
  );

  if (!estudiante) return { error: 'Selecciona un estudiante.' };
  if (!laboratorio) return { error: 'Selecciona un laboratorio.' };
  if (!esFecha(datos.fecha)) return { error: 'Ingresa una fecha válida.' };
  if (!esHora(datos.horaInicio) || !esHora(datos.horaFin)) {
    return { error: 'Ingresa un horario válido.' };
  }
  if (!datos.motivo.trim()) return { error: 'Escribe el motivo de la reserva.' };

  const reservaValidada = new Reserva({
    laboratorioId: laboratorio.id,
    fecha: datos.fecha,
    horaInicio: datos.horaInicio,
    horaFin: datos.horaFin,
  });
  if (!reservaValidada.esHorarioValido()) {
    return { error: 'La hora de fin debe ser posterior a la de inicio.' };
  }

  const tieneCruce = datos.estado !== 'rechazada' && reservas.some(
    (existente) =>
      existente.id !== reservaEditando &&
      existente.estado !== 'rechazada' &&
      reservaValidada.seCruzaCon(existente)
  );
  if (tieneCruce) {
    return { error: 'Este laboratorio ya tiene una reserva en ese horario.' };
  }

  return {
    cambios: {
      usuarioId: estudiante.id,
      laboratorioId: laboratorio.id,
      fecha: datos.fecha,
      horaInicio: datos.horaInicio,
      horaFin: datos.horaFin,
      motivo: datos.motivo.trim(),
      estado: datos.estado,
    },
  };
}
