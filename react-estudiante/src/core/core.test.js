/**
 * Pruebas del núcleo de CampusHub.
 * Ejecutar desde core-js: npm test
 * Cada prueba prepara datos, ejecuta una función y compara con el resultado esperado.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { esCorreoUTP, esCodigoAlumno, esHora, esFecha, esCapacidadValida, validarUsuario } from './validadores.js';
import { Usuario, Laboratorio, Reserva } from './modelos.js';
import { reservasPorEstado, ocupacionPorLaboratorio, sedesUnicas, rankingLaboratoriosMasReservados, crearGeneradorCodigo } from './estadisticas.js';

// 1. VALIDADORES: datos válidos, inválidos y valores límite.
test('correo: acepta UTP y rechaza otros dominios o datos ausentes', () => {
  assert.equal(esCorreoUTP('alumno@utp.edu.pe'), true);
  assert.equal(esCorreoUTP('alumno@gmail.com'), false);
  assert.equal(esCorreoUTP(undefined), false);
});

test('código: exige U seguida de exactamente ocho dígitos', () => {
  assert.equal(esCodigoAlumno('U20231234'), true);
  assert.equal(esCodigoAlumno('U1234567'), false);
  assert.equal(esCodigoAlumno('U123456789'), false);
  assert.equal(esCodigoAlumno('A20231234'), false);
});

test('hora: acepta límites del día y rechaza horas fuera de rango', () => {
  assert.equal(esHora('00:00'), true);
  assert.equal(esHora('23:59'), true);
  assert.equal(esHora('24:00'), false);
  assert.equal(esHora('12:60'), false);
  assert.equal(esHora('8:30'), false);
});

// esFecha comprueba formato y rangos básicos; no valida el calendario completo.
test('fecha: exige AAAA-MM-DD y rangos básicos de mes y día', () => {
  assert.equal(esFecha('2026-11-20'), true);
  assert.equal(esFecha('20/11/2026'), false);
  assert.equal(esFecha('2026-13-01'), false);
  assert.equal(esFecha('2026-11-00'), false);
});

test('capacidad: acepta 1 y 60; rechaza 0, 61 y decimales', () => {
  assert.equal(esCapacidadValida(1), true);
  assert.equal(esCapacidadValida(60), true);
  assert.equal(esCapacidadValida(0), false);
  assert.equal(esCapacidadValida(61), false);
  assert.equal(esCapacidadValida(2.5), false);
});

test('usuario válido: devuelve esValido y una lista vacía de errores', () => {
  assert.deepEqual(validarUsuario({ correo: 'alumno@utp.edu.pe', codigo: 'U20231234' }),
    { esValido: true, errores: [] });
});

test('usuario inválido: informa los dos errores de validación', () => {
  const resultado = validarUsuario({ correo: 'mal', codigo: '123' });
  assert.equal(resultado.esValido, false);
  assert.equal(resultado.errores.length, 2);
  assert.match(resultado.errores[0], /mal/);
  assert.match(resultado.errores[1], /123/);
});

// 2. MODELOS: comportamiento de las clases.
test('Usuario: distingue roles y verifica contraseñas', () => {
  const admin = new Usuario({ rol: 'admin', password: 'clave-prueba' });
  assert.equal(admin.esAdmin(), true);
  assert.equal(admin.esEstudiante(), false);
  assert.equal(admin.verificarPassword('clave-prueba'), true);
  assert.equal(admin.verificarPassword('incorrecta'), false);
  assert.equal(new Usuario().esEstudiante(), true);
});

test('perfil público: incluye datos del usuario sin contraseña', () => {
  const usuario = new Usuario({ id: 3, nombre: 'Ana', correo: 'ana@utp.edu.pe', codigo: 'U20231234', password: 'clave' });
  assert.deepEqual(usuario.obtenerPerfilPublico(), {
    id: 3, nombre: 'Ana', correo: 'ana@utp.edu.pe', codigo: 'U20231234', rol: 'estudiante',
  });
});

test('Laboratorio: comprueba disponibilidad, capacidad y equipos', () => {
  const lab = new Laboratorio({ capacidad: 30, equipos: ['Proyector', 'PC i7'] });
  assert.equal(lab.estaDisponible(), true);
  assert.equal(lab.esCapacidadValida(), true);
  assert.equal(lab.tieneEquipo('proyector'), true);
  assert.equal(lab.tieneEquipo('Arduino'), false);
  assert.equal(new Laboratorio({ estado: 'mantenimiento' }).enMantenimiento(), true);
});

// Crea una reserva nueva por llamada para que las pruebas sean independientes.
const crearReserva = (cambios = {}) => new Reserva({
  laboratorioId: 1, usuarioId: 3, fecha: '2026-11-20',
  horaInicio: '08:00', horaFin: '10:00', creadoEn: '2026-11-01T12:00:00Z', ...cambios,
});

test('duración: calcula horas enteras y fracciones', () => {
  assert.equal(crearReserva().duracionHoras(), 2);
  assert.equal(crearReserva({ horaFin: '09:30' }).duracionHoras(), 1.5);
});

test('horario: la hora final debe ser posterior a la inicial', () => {
  assert.equal(crearReserva().esHorarioValido(), true);
  assert.equal(crearReserva({ horaFin: '08:00' }).esHorarioValido(), false);
  assert.equal(crearReserva({ horaFin: '07:00' }).esHorarioValido(), false);
});

test('cruce: detecta solapamiento en ambas direcciones y reservas contenidas', () => {
  const a = crearReserva();
  const b = crearReserva({ horaInicio: '09:00', horaFin: '11:00' });
  assert.equal(a.seCruzaCon(b), true);
  assert.equal(b.seCruzaCon(a), true);
  assert.equal(a.seCruzaCon(crearReserva({ horaInicio: '08:30', horaFin: '09:00' })), true);
});

test('cruce: permite reservas contiguas y separadas', () => {
  const a = crearReserva();
  assert.equal(a.seCruzaCon(crearReserva({ horaInicio: '10:00', horaFin: '11:00' })), false);
  assert.equal(a.seCruzaCon(crearReserva({ horaInicio: '12:00', horaFin: '13:00' })), false);
});

test('cruce: permite igual horario en otro laboratorio o fecha', () => {
  const a = crearReserva();
  assert.equal(a.seCruzaCon(crearReserva({ laboratorioId: 2 })), false);
  assert.equal(a.seCruzaCon(crearReserva({ fecha: '2026-11-21' })), false);
});

// 3. ESTADÍSTICAS: resultados conocidos con datos pequeños.
test('reservas por estado: cuenta cada estado y maneja la lista vacía', () => {
  const datos = [{ estado: 'pendiente' }, { estado: 'aprobada' }, { estado: 'pendiente' }, { estado: 'rechazada' }];
  assert.deepEqual(reservasPorEstado(datos), { pendiente: 2, aprobada: 1, rechazada: 1 });
  assert.deepEqual(reservasPorEstado([]), { pendiente: 0, aprobada: 0, rechazada: 0 });
});

test('ocupación: devuelve un Map con el número de reservas por laboratorio', () => {
  const resultado = ocupacionPorLaboratorio([{ laboratorioId: 1 }, { laboratorioId: 2 }, { laboratorioId: 1 }]);
  assert.deepEqual(resultado, new Map([[1, 2], [2, 1]]));
  assert.deepEqual(ocupacionPorLaboratorio([]), new Map());
});

test('sedes únicas: elimina duplicados', () => {
  assert.deepEqual(sedesUnicas([{ sede: 'Lima Centro' }, { sede: 'Lima Sur' }, { sede: 'Lima Centro' }]), ['Lima Centro', 'Lima Sur']);
  assert.deepEqual(sedesUnicas([]), []);
});

test('ranking: ordena por reservas, incluye ceros y conserva los datos originales', () => {
  const labs = [{ id: 1, nombre: 'A' }, { id: 2, nombre: 'B' }, { id: 3, nombre: 'C' }];
  const copia = labs.map(lab => ({ ...lab }));
  const reservas = [{ laboratorioId: 2 }, { laboratorioId: 1 }, { laboratorioId: 2 }];
  const resultado = rankingLaboratoriosMasReservados(labs, reservas);
  assert.deepEqual(resultado.map(lab => [lab.id, lab.totalReservas]), [[2, 2], [1, 1], [3, 0]]);
  assert.deepEqual(labs, copia);
});

test('generador: conserva el contador y mantiene independientes dos closures', () => {
  const generar = crearGeneradorCodigo();
  const otro = crearGeneradorCodigo('LAB', 9);
  assert.equal(generar(), 'RES-0001');
  assert.equal(generar(), 'RES-0002');
  assert.equal(otro(), 'LAB-0009');
  assert.equal(otro(), 'LAB-0010');
  assert.equal(generar(), 'RES-0003');
});
