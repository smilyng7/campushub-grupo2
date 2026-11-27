import { aMinutos } from './modelos.js';

export function fechaEnLima(instante = new Date()) {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(instante);
  const valor = tipo => partes.find(parte => parte.type === tipo).value;
  return `${valor('year')}-${valor('month')}-${valor('day')}`;
}

// Intervalos semiabiertos: 08–09 y 09–10 son contiguos, no se cruzan.
export function construirDisponibilidad(laboratorios, reservas, fecha, inicio = 7, fin = 22) {
  if (!Number.isInteger(inicio) || !Number.isInteger(fin)
    || inicio < 0 || fin > 24 || inicio >= fin) {
    throw new RangeError('El rango debe usar horas enteras entre 0 y 24, con inicio menor que fin.');
  }
  const hora = valor => `${String(valor).padStart(2, '0')}:00`;
  const horarios = Array.from({ length: fin - inicio }, (_, i) => ({
    inicio: hora(inicio + i), fin: hora(inicio + i + 1),
  }));
  const delDia = reservas.filter(reserva => reserva.fecha === fecha
    && ['pendiente', 'aprobada'].includes(reserva.estado));
  const matriz = laboratorios.map(laboratorio => horarios.map(horario => {
    const coincidencias = delDia.filter(reserva =>
      String(reserva.laboratorioId) === String(laboratorio.id)
      && aMinutos(reserva.horaInicio) < aMinutos(horario.fin)
      && aMinutos(horario.inicio) < aMinutos(reserva.horaFin));
    const estado = coincidencias.some(reserva => reserva.estado === 'aprobada')
      ? 'ocupada' : coincidencias.length ? 'pendiente' : 'libre';
    return {
      laboratorioId: laboratorio.id, fecha, ...horario, estado,
      mantenimiento: laboratorio.estado === 'mantenimiento',
      reservas: coincidencias.map(({ codigo, horaInicio, horaFin, estado }) =>
        ({ codigo, horaInicio, horaFin, estado })),
    };
  }));
  return { horarios, matriz };
}
