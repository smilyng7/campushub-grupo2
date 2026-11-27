import { test } from 'node:test';
import assert from 'node:assert/strict';
import { construirDisponibilidad, fechaEnLima } from './disponibilidad.js';
const labs = [{ id: 1, estado: 'disponible' }, { id: 2, estado: 'mantenimiento' }];
const fecha = '2026-11-27';
const reserva = cambios => ({ laboratorioId: '1', fecha, horaInicio: '08:00', horaFin: '10:00', estado: 'aprobada', codigo: 'RES-0001', ...cambios });
test('matriz: 15 franjas de 07:00 a 22:00 por laboratorio, todas independientes', () => {
  const { horarios, matriz } = construirDisponibilidad(labs, [], fecha);
  assert.equal(matriz.length, 2); assert.equal(matriz[0].length, 15);
  assert.deepEqual(horarios[0], { inicio: '07:00', fin: '08:00' });
  assert.equal(horarios.at(-1).fin, '22:00');
  assert.equal(matriz[0][0].estado, 'libre');
  assert.equal(matriz[1][0].mantenimiento, true);
  assert.notEqual(matriz[0][0], matriz[1][0]);
});
test('matriz: aprobada ocupa solo sus franjas; fin contiguo permanece libre', () => {
  const { matriz } = construirDisponibilidad(labs, [reserva({})], fecha);
  assert.deepEqual(matriz[0].slice(0, 4).map(c => c.estado), ['libre', 'ocupada', 'ocupada', 'libre']);
  assert.ok(matriz[1].every(c => c.estado === 'libre'));
});
test('matriz: reconoce reservas parciales y pendientes', () => {
  const { matriz } = construirDisponibilidad(labs, [reserva({ horaInicio: '08:30', horaFin: '09:15', estado: 'pendiente' })], fecha);
  assert.equal(matriz[0][1].estado, 'pendiente'); assert.equal(matriz[0][2].estado, 'pendiente');
});
test('matriz: ignora rechazadas y reservas de otra fecha', () => {
  const { matriz } = construirDisponibilidad(labs, [reserva({ estado: 'rechazada' }), reserva({ fecha: '2026-11-28' })], fecha);
  assert.ok(matriz.flat().every(c => c.estado === 'libre'));
});
test('matriz: aprobada prevalece y mantiene las dos coincidencias sin mutar entradas', () => {
  const datos = [reserva({ estado: 'pendiente' }), reserva({ codigo: 'RES-0002' })];
  const original = JSON.stringify({ labs, datos });
  const { matriz } = construirDisponibilidad(labs, datos, fecha);
  assert.equal(matriz[0][1].estado, 'ocupada'); assert.equal(matriz[0][1].reservas.length, 2);
  assert.equal(JSON.stringify({ labs, datos }), original);
});
test('matriz: rango configurable y extremos 07:00/22:00', () => {
  assert.equal(construirDisponibilidad(labs, [], fecha, 8, 20).horarios.length, 12);
  const { matriz } = construirDisponibilidad(labs, [reserva({ horaInicio: '06:00', horaFin: '07:00' }), reserva({ horaInicio: '22:00', horaFin: '23:00' })], fecha);
  assert.ok(matriz.flat().every(c => c.estado === 'libre'));
  assert.throws(() => construirDisponibilidad(labs, [], fecha, 22, 7), RangeError);
});
test('matriz: catálogo vacío', () => {
  assert.deepEqual(construirDisponibilidad([], [], fecha).matriz, []);
});
test('fecha del kiosko corresponde a Lima aunque UTC ya sea otro día', () => {
  assert.equal(fechaEnLima(new Date('2026-11-28T02:00:00Z')), '2026-11-27');
});
