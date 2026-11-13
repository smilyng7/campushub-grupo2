/**
 * modelos.js
 * Clases de dominio para CampusHub: Usuario, Laboratorio y Reserva.
 * Incluyen constructores, getters y métodos propios de negocio.
 */

import { esCapacidadValida } from './validadores.js';

// Función auxiliar para convertir cadena "HH:mm" a minutos enteros
export const aMinutos = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

// Clase Usuario
export class Usuario {
  #password;

  constructor({ id, nombre, correo, codigo, rol = 'estudiante', password = '' } = {}) {
    this._id = id;
    this._nombre = nombre;
    this._correo = correo;
    this._codigo = codigo;
    this._rol = rol;
    this.#password = password;
  }

  // Getters
  get id() { return this._id; }
  get nombre() { return this._nombre; }
  get correo() { return this._correo; }
  get codigo() { return this._codigo; }
  get rol() { return this._rol; }

  // Métodos propios
  esAdmin() {
    return this._rol === 'admin';
  }

  esEstudiante() {
    return this._rol === 'estudiante';
  }

  verificarPassword(clave) {
    return this.#password === clave;
  }

  obtenerPerfilPublico() {
    return {
      id: this._id,
      nombre: this._nombre,
      correo: this._correo,
      codigo: this._codigo,
      rol: this._rol,
    };
  }
}

// Clase Laboratorio
export class Laboratorio {
  constructor({ id, nombre, sede, capacidad, equipos = [], estado = 'disponible' } = {}) {
    this._id = id;
    this._nombre = nombre;
    this._sede = sede;
    this._capacidad = Number(capacidad);
    this._equipos = Array.isArray(equipos) ? [...equipos] : [];
    this._estado = estado;
  }

  // Getters
  get id() { return this._id; }
  get nombre() { return this._nombre; }
  get sede() { return this._sede; }
  get capacidad() { return this._capacidad; }
  get equipos() { return [...this._equipos]; }
  get estado() { return this._estado; }

  // Métodos propios
  estaDisponible() {
    return this._estado === 'disponible';
  }

  enMantenimiento() {
    return this._estado === 'mantenimiento';
  }

  tieneEquipo(nombreEquipo) {
    const termino = nombreEquipo.toLowerCase();
    return this._equipos.some((equipo) => equipo.toLowerCase().includes(termino));
  }

  esCapacidadValida() {
    return esCapacidadValida(this._capacidad);
  }
}

// Clase Reserva
export class Reserva {
  constructor({
    id,
    codigo = '',
    laboratorioId,
    usuarioId,
    fecha,
    horaInicio,
    horaFin,
    motivo = '',
    estado = 'pendiente',
    creadoEn = new Date().toISOString(),
  } = {}) {
    this._id = id;
    this._codigo = codigo;
    this._laboratorioId = laboratorioId;
    this._usuarioId = usuarioId;
    this._fecha = fecha;
    this._horaInicio = horaInicio;
    this._horaFin = horaFin;
    this._motivo = motivo;
    this._estado = estado;
    this._creadoEn = creadoEn;
  }

  // Getters
  get id() { return this._id; }
  get codigo() { return this._codigo; }
  get laboratorioId() { return this._laboratorioId; }
  get usuarioId() { return this._usuarioId; }
  get fecha() { return this._fecha; }
  get horaInicio() { return this._horaInicio; }
  get horaFin() { return this._horaFin; }
  get motivo() { return this._motivo; }
  get estado() { return this._estado; }
  get creadoEn() { return this._creadoEn; }

  // Duración en horas (número decimal, ej: 1.5 para 1h 30m)
  duracionHoras() {
    return (aMinutos(this._horaFin) - aMinutos(this._horaInicio)) / 60;
  }

  // Valida que horaFin sea estrictamente posterior a horaInicio
  esHorarioValido() {
    return aMinutos(this._horaFin) > aMinutos(this._horaInicio);
  }

  // Comprueba si se cruza con otra reserva:
  // Mismo laboratorio, misma fecha y los intervalos se solapan
  seCruzaCon(otra) {
    if (!otra) return false;
    return (
      this._laboratorioId === otra.laboratorioId &&
      this._fecha === otra.fecha &&
      aMinutos(this._horaInicio) < aMinutos(otra.horaFin) &&
      aMinutos(otra.horaInicio) < aMinutos(this._horaFin)
    );
  }
}