import { useState } from 'react';
import FormularioAdminReserva from './FormularioAdminReserva';
import TablaAdminReservas from './TablaAdminReservas';
import { useReservas } from '../context/ReservasContext';
import db from '../data/db.json';
import {
  crearDatosEdicion,
  formularioVacio,
  validarReservaAdmin,
} from './reservasAdmin';

export default function AdministrarReservas() {
  const { reservas, agregarReserva, actualizarReserva, eliminarReserva } = useReservas();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [reservaEditando, setReservaEditando] = useState(null);
  const [datos, setDatos] = useState(formularioVacio);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const estudiantes = db.usuarios.filter((usuario) => usuario.rol === 'estudiante');

  function iniciarFormulario(reserva = null) {
    setReservaEditando(reserva?.id ?? null);
    setDatos(reserva ? crearDatosEdicion(reserva) : formularioVacio);
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
    const resultado = validarReservaAdmin(datos, reservaEditando, reservas);
    if (resultado.error) {
      setError(resultado.error);
      return;
    }

    if (reservaEditando === null) {
      agregarReserva(resultado.cambios);
      setMensaje('Reserva creada correctamente.');
    } else {
      actualizarReserva(reservaEditando, resultado.cambios);
      setMensaje('Reserva actualizada correctamente.');
    }
    cancelarFormulario();
  }

  function confirmarEliminacion(reserva) {
    if (!window.confirm(`¿Eliminar la reserva ${reserva.codigo}?`)) return;
    eliminarReserva(reserva.id);
    if (reservaEditando === reserva.id) cancelarFormulario();
    setMensaje(`La reserva ${reserva.codigo} fue eliminada.`);
    setError('');
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
          onClick={() => iniciarFormulario()}
        >
          Crear reserva
        </button>
      </div>
      {mensaje && <p className="alert alert-success" role="status">{mensaje}</p>}
      {mostrarFormulario && (
        <FormularioAdminReserva
          datos={datos}
          error={error}
          esEdicion={reservaEditando !== null}
          estudiantes={estudiantes}
          laboratorios={db.laboratorios}
          onChange={cambiarCampo}
          onSubmit={guardarReserva}
          onCancel={cancelarFormulario}
        />
      )}
      <TablaAdminReservas
        reservas={reservas}
        onEdit={iniciarFormulario}
        onDelete={confirmarEliminacion}
      />
    </>
  );
}
