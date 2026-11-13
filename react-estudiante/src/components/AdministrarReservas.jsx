import { useState } from 'react';
import { Reserva } from '../../../core-js/modelos.js';
import { esFecha, esHora } from '../../../core-js/validadores.js';
import { useReservas } from '../context/ReservasContext';
import db from '../data/db.json';

const formularioVacio = {
  usuarioId: '',
  laboratorioId: '',
  fecha: '',
  horaInicio: '',
  horaFin: '',
  motivo: '',
  estado: 'pendiente',
};

const estados = ['pendiente', 'aprobada', 'rechazada'];

export default function AdministrarReservas() {
  const {
    reservas,
    agregarReserva,
    actualizarReserva,
    eliminarReserva,
  } = useReservas();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [reservaEditando, setReservaEditando] = useState(null);
  const [datos, setDatos] = useState(formularioVacio);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const estudiantes = db.usuarios.filter((usuario) => usuario.rol === 'estudiante');
  const usuariosPorId = new Map(db.usuarios.map((usuario) => [usuario.id, usuario]));
  const laboratoriosPorId = new Map(
    db.laboratorios.map((laboratorio) => [laboratorio.id, laboratorio])
  );

  function iniciarNuevaReserva() {
    setReservaEditando(null);
    setDatos(formularioVacio);
    setError('');
    setMensaje('');
    setMostrarFormulario(true);
  }

  function iniciarEdicion(reserva) {
    setReservaEditando(reserva.id);
    setDatos({
      usuarioId: String(reserva.usuarioId),
      laboratorioId: String(reserva.laboratorioId),
      fecha: reserva.fecha,
      horaInicio: reserva.horaInicio,
      horaFin: reserva.horaFin,
      motivo: reserva.motivo,
      estado: reserva.estado,
    });
    setError('');
    setMensaje('');
    setMostrarFormulario(true);
  }

  function cancelarFormulario() {
    setMostrarFormulario(false);
    setReservaEditando(null);
    setDatos(formularioVacio);
    setError('');
  }

  function cambiarCampo(evento) {
    const { name, value } = evento.target;
    setDatos((actuales) => ({ ...actuales, [name]: value }));
    setError('');
  }

  function guardarReserva(evento) {
    evento.preventDefault();
    const estudiante = estudiantes.find(
      (usuario) => String(usuario.id) === datos.usuarioId
    );
    const laboratorio = db.laboratorios.find(
      (item) => String(item.id) === datos.laboratorioId
    );

    if (!estudiante) {
      setError('Selecciona un estudiante.');
      return;
    }
    if (!laboratorio) {
      setError('Selecciona un laboratorio.');
      return;
    }
    if (!esFecha(datos.fecha)) {
      setError('Ingresa una fecha válida.');
      return;
    }
    if (!esHora(datos.horaInicio) || !esHora(datos.horaFin)) {
      setError('Ingresa un horario válido.');
      return;
    }
    if (!datos.motivo.trim()) {
      setError('Escribe el motivo de la reserva.');
      return;
    }

    const reservaValidada = new Reserva({
      laboratorioId: laboratorio.id,
      fecha: datos.fecha,
      horaInicio: datos.horaInicio,
      horaFin: datos.horaFin,
    });
    if (!reservaValidada.esHorarioValido()) {
      setError('La hora de fin debe ser posterior a la de inicio.');
      return;
    }

    const tieneCruce = datos.estado !== 'rechazada' && reservas.some(
      (existente) =>
        existente.id !== reservaEditando &&
        existente.estado !== 'rechazada' &&
        reservaValidada.seCruzaCon(existente)
    );
    if (tieneCruce) {
      setError('Este laboratorio ya tiene una reserva en ese horario.');
      return;
    }

    const cambios = {
      usuarioId: estudiante.id,
      laboratorioId: laboratorio.id,
      fecha: datos.fecha,
      horaInicio: datos.horaInicio,
      horaFin: datos.horaFin,
      motivo: datos.motivo.trim(),
      estado: datos.estado,
    };

    if (reservaEditando === null) {
      agregarReserva(cambios);
      setMensaje('Reserva creada correctamente.');
    } else {
      actualizarReserva(reservaEditando, cambios);
      setMensaje('Reserva actualizada correctamente.');
    }
    setMostrarFormulario(false);
    setReservaEditando(null);
    setDatos(formularioVacio);
    setError('');
  }

  function confirmarEliminacion(reserva) {
    if (window.confirm(`¿Eliminar la reserva ${reserva.codigo}?`)) {
      eliminarReserva(reserva.id);
      if (reservaEditando === reserva.id) cancelarFormulario();
      setMensaje(`La reserva ${reserva.codigo} fue eliminada.`);
      setError('');
    }
  }

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <p className="text-body-secondary mb-0">
          Historial completo · {reservas.length} reservas
        </p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={iniciarNuevaReserva}
        >
          Crear reserva
        </button>
      </div>

      {mensaje && <p className="alert alert-success" role="status">{mensaje}</p>}

      {mostrarFormulario && (
        <form className="card card-body mb-4" onSubmit={guardarReserva}>
          <h2 className="h5 mb-3">
            {reservaEditando === null ? 'Crear reserva' : 'Editar reserva'}
          </h2>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label" htmlFor="reserva-usuario">Estudiante</label>
              <select
                className="form-select"
                id="reserva-usuario"
                name="usuarioId"
                value={datos.usuarioId}
                onChange={cambiarCampo}
                required
              >
                <option value="">Selecciona un estudiante</option>
                {estudiantes.map((estudiante) => (
                  <option key={estudiante.id} value={estudiante.id}>
                    {estudiante.nombre} · {estudiante.codigo}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="reserva-laboratorio">Laboratorio</label>
              <select
                className="form-select"
                id="reserva-laboratorio"
                name="laboratorioId"
                value={datos.laboratorioId}
                onChange={cambiarCampo}
                required
              >
                <option value="">Selecciona un laboratorio</option>
                {db.laboratorios.map((laboratorio) => (
                  <option key={laboratorio.id} value={laboratorio.id}>
                    {laboratorio.nombre} · {laboratorio.sede}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="reserva-fecha">Fecha</label>
              <input
                className="form-control"
                id="reserva-fecha"
                name="fecha"
                type="date"
                value={datos.fecha}
                onChange={cambiarCampo}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="reserva-hora-inicio">Hora de inicio</label>
              <input
                className="form-control"
                id="reserva-hora-inicio"
                name="horaInicio"
                type="time"
                value={datos.horaInicio}
                onChange={cambiarCampo}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="reserva-hora-fin">Hora de fin</label>
              <input
                className="form-control"
                id="reserva-hora-fin"
                name="horaFin"
                type="time"
                value={datos.horaFin}
                onChange={cambiarCampo}
                required
              />
            </div>
            <div className="col-md-8">
              <label className="form-label" htmlFor="reserva-motivo">Motivo</label>
              <input
                className="form-control"
                id="reserva-motivo"
                name="motivo"
                value={datos.motivo}
                onChange={cambiarCampo}
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="reserva-estado">Estado</label>
              <select
                className="form-select"
                id="reserva-estado"
                name="estado"
                value={datos.estado}
                onChange={cambiarCampo}
              >
                {estados.map((estado) => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </div>
          </div>
          {error && <p className="alert alert-danger mt-3 mb-0" role="alert">{error}</p>}
          <div className="d-flex gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Guardar
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={cancelarFormulario}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {reservas.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead>
              <tr>
                <th scope="col">Código</th>
                <th scope="col">Estudiante</th>
                <th scope="col">Laboratorio</th>
                <th scope="col">Fecha</th>
                <th scope="col">Horario</th>
                <th scope="col">Motivo</th>
                <th scope="col">Estado</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservas.map((reserva) => (
                <tr key={reserva.id}>
                  <td>{reserva.codigo}</td>
                  <td>
                    {usuariosPorId.get(reserva.usuarioId)?.nombre
                      || `Usuario #${reserva.usuarioId}`}
                  </td>
                  <td>
                    {laboratoriosPorId.get(reserva.laboratorioId)?.nombre
                      || `Laboratorio #${reserva.laboratorioId}`}
                  </td>
                  <td>{reserva.fecha}</td>
                  <td>{reserva.horaInicio} - {reserva.horaFin}</td>
                  <td>{reserva.motivo}</td>
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
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => iniciarEdicion(reserva)}
                        aria-label={`Editar ${reserva.codigo}`}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => confirmarEliminacion(reserva)}
                        aria-label={`Eliminar ${reserva.codigo}`}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="alert alert-info">No hay reservas registradas.</div>
      )}
    </>
  );
}
