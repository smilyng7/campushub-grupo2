
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { useReservas } from '../context/ReservasContext';
import db from '../data/db.json';

function obtenerFechaReserva(reserva) {
  return new Date(
    `${reserva.fecha}T${reserva.horaInicio}:00`
  );
}

function formatearTiempo(segundos) {
  if (segundos <= 0) return 'La reserva está por comenzar';

  const dias = Math.floor(segundos / 86400);
  const horas = Math.floor((segundos % 86400) / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  const segundosRestantes = segundos % 60;

  return `${dias}d ${horas}h ${minutos}m ${segundosRestantes}s`;
}

export default function PortalPage({ titulo }) {
  const { usuario } = useAuth();
  const { reservas, agregarReserva } = useReservas();

  // HOOK useRef: referencia al formulario
  const formularioRef = useRef(null);
  const primerCampoRef = useRef(null);

  // HOOK useState: datos del formulario
  const [formulario, setFormulario] = useState({
    laboratorioId: '',
    fecha: '',
    horaInicio: '',
    horaFin: '',
    motivo: '',
  });

  const [mensaje, setMensaje] = useState('');

  // HOOK useState: contador regresivo
  const [tiempoRestante, setTiempoRestante] = useState('');

  // Reservas del usuario que inició sesión
  const misReservas = reservas.filter(
    (reserva) => reserva.usuarioId === usuario?.id
  );

  // Buscar la próxima reserva
  const proximaReserva = misReservas
    .filter((reserva) => {
      return (
        reserva.estado !== 'rechazada' &&
        obtenerFechaReserva(reserva).getTime() > Date.now()
      );
    })
    .sort(
      (a, b) =>
        obtenerFechaReserva(a) - obtenerFechaReserva(b)
    )[0];

  // HOOK useEffect: contador regresivo
  useEffect(() => {
    if (!proximaReserva) {
      setTiempoRestante('No tienes próximas reservas');
      return undefined;
    }

    const actualizarContador = () => {
      const diferencia = Math.floor(
        (obtenerFechaReserva(proximaReserva).getTime() -
          Date.now()) / 1000
      );

      setTiempoRestante(
        formatearTiempo(Math.max(0, diferencia))
      );
    };

    actualizarContador();

    const intervalo = setInterval(actualizarContador, 1000);

    // Limpiar intervalo al desmontar o cambiar la reserva
    return () => clearInterval(intervalo);

  }, [proximaReserva?.id]);

  // HOOK useEffect + useRef: foco automático
  useEffect(() => {
    if (titulo === 'Nueva reserva') {
      primerCampoRef.current?.focus();
    }
  }, [titulo]);

  // Actualizar campos del formulario
  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormulario((actual) => ({
      ...actual,
      [name]: value,
    }));
  };

  // Guardar reserva
  const manejarSubmit = (e) => {
    e.preventDefault();
    setMensaje('');

    const inicio = formulario.horaInicio;
    const fin = formulario.horaFin;

    if (fin <= inicio) {
      setMensaje('La hora de fin debe ser posterior a la hora de inicio.');
      return;
    }

    const laboratorio = db.laboratorios.find(
      (lab) => lab.id === Number(formulario.laboratorioId)
    );

    if (!laboratorio) {
      setMensaje('Selecciona un laboratorio válido.');
      return;
    }

    if (laboratorio.estado !== 'disponible') {
      setMensaje('Este laboratorio no está disponible.');
      return;
    }

    // Comprobar cruce de horarios en el mismo laboratorio
    const horarioCruzado = reservas.some((reserva) => {
      if (
        reserva.laboratorioId !== laboratorio.id ||
        reserva.fecha !== formulario.fecha ||
        reserva.estado === 'rechazada'
      ) {
        return false;
      }

      return (
        inicio < reserva.horaFin &&
        fin > reserva.horaInicio
      );
    });

    if (horarioCruzado) {
      setMensaje(
        'El laboratorio ya tiene una reserva en ese horario.'
      );
      return;
    }

    agregarReserva({
      laboratorioId: laboratorio.id,
      usuarioId: usuario.id,
      fecha: formulario.fecha,
      horaInicio: inicio,
      horaFin: fin,
      motivo: formulario.motivo.trim(),
    });

    setMensaje('¡Reserva registrada correctamente!');

    // Limpiar los campos usando useRef
    formularioRef.current?.reset();

    setFormulario({
      laboratorioId: '',
      fecha: '',
      horaInicio: '',
      horaFin: '',
      motivo: '',
    });

    // Devolver el foco al primer campo
    primerCampoRef.current?.focus();
  };

  // ======================================
  // PÁGINA: MIS RESERVAS
  // ======================================
  if (titulo === 'Mis reservas') {
    return (
      <div className="container py-4">

        <h1 className="h2 mb-4">
          Mis reservas
        </h1>

        <div className="card shadow-sm mb-4">
          <div className="card-body">

            <h2 className="h5">
              Próxima reserva
            </h2>

            {proximaReserva ? (
              <>
                <p className="mb-1">
                  Laboratorio: {
                    db.laboratorios.find(
                      (lab) =>
                        lab.id === proximaReserva.laboratorioId
                    )?.nombre
                  }
                </p>

                <p className="mb-2">
                  Fecha: {proximaReserva.fecha} ·
                  Hora: {proximaReserva.horaInicio}
                </p>

                <h3 className="h4 text-primary">
                  {tiempoRestante}
                </h3>
              </>
            ) : (
              <p className="text-body-secondary mb-0">
                No tienes próximas reservas programadas.
              </p>
            )}

          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h4 mb-0">
            Historial de reservas
          </h2>

          <Link
            to="/nueva-reserva"
            className="btn btn-primary"
          >
            Nueva reserva
          </Link>
        </div>

        {misReservas.length > 0 ? (

          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">

              <thead>
                <tr>
                  <th>Código</th>
                  <th>Laboratorio</th>
                  <th>Fecha</th>
                  <th>Horario</th>
                  <th>Estado</th>
                </tr>
              </thead>

              <tbody>
                {misReservas.map((reserva) => {

                  const laboratorio = db.laboratorios.find(
                    (lab) =>
                      lab.id === reserva.laboratorioId
                  );

                  return (
                    <tr key={reserva.id}>
                      <td>{reserva.codigo}</td>
                      <td>{laboratorio?.nombre}</td>
                      <td>{reserva.fecha}</td>
                      <td>
                        {reserva.horaInicio} - {reserva.horaFin}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            reserva.estado === 'aprobada'
                              ? 'bg-success'
                              : reserva.estado === 'rechazada'
                                ? 'bg-danger'
                                : 'bg-warning text-dark'
                          }`}
                        >
                          {reserva.estado}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

            </table>
          </div>

        ) : (

          <div className="alert alert-info">
            Todavía no tienes reservas registradas.
          </div>

        )}

      </div>
    );
  }

  // ======================================
  // PÁGINA: NUEVA RESERVA
  // ======================================
  return (
    <div className="container py-4">

      <h1 className="h2 mb-4">
        Nueva reserva
      </h1>

      <div className="card shadow-sm">
        <div className="card-body">

          <form
            ref={formularioRef}
            onSubmit={manejarSubmit}
          >

            {/* LABORATORIO */}
            <div className="mb-3">

              <label className="form-label">
                Seleccionar laboratorio
              </label>

              <select
                ref={primerCampoRef}
                name="laboratorioId"
                className="form-select"
                value={formulario.laboratorioId}
                onChange={manejarCambio}
                required
              >
                <option value="">
                  Selecciona un laboratorio
                </option>

                {db.laboratorios
                  .filter((lab) => lab.estado === 'disponible')
                  .map((lab) => (
                    <option
                      key={lab.id}
                      value={lab.id}
                    >
                      {lab.nombre} - {lab.sede}
                    </option>
                  ))}
              </select>

            </div>

            {/* FECHA */}
            <div className="mb-3">

              <label className="form-label">
                Fecha de reserva
              </label>

              <input
                type="date"
                name="fecha"
                className="form-control"
                value={formulario.fecha}
                onChange={manejarCambio}
                min={new Date().toLocaleDateString('en-CA')}
                required
              />

            </div>

            {/* HORA INICIO */}
            <div className="mb-3">

              <label className="form-label">
                Hora de inicio
              </label>

              <input
                type="time"
                name="horaInicio"
                className="form-control"
                value={formulario.horaInicio}
                onChange={manejarCambio}
                required
              />

            </div>

            {/* HORA FIN */}
            <div className="mb-3">

              <label className="form-label">
                Hora de finalización
              </label>

              <input
                type="time"
                name="horaFin"
                className="form-control"
                value={formulario.horaFin}
                onChange={manejarCambio}
                required
              />

            </div>

            {/* MOTIVO */}
            <div className="mb-3">

              <label className="form-label">
                Motivo de la reserva
              </label>

              <textarea
                name="motivo"
                className="form-control"
                rows="3"
                placeholder="Describe el motivo de tu reserva"
                value={formulario.motivo}
                onChange={manejarCambio}
                required
              />

            </div>

            {/* MENSAJE */}
            {mensaje && (
              <div
                className={`alert ${
                  mensaje.startsWith('¡')
                    ? 'alert-success'
                    : 'alert-danger'
                }`}
                role="alert"
              >
                {mensaje}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
            >
              Guardar reserva
            </button>

            <Link
              to="/mis-reservas"
              className="btn btn-outline-secondary ms-2"
            >
              Cancelar
            </Link>

          </form>

        </div>
      </div>
    </div>
  );
}
