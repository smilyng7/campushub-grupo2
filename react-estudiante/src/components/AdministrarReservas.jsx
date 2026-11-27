import { useState } from 'react';
import FormularioAdminReserva from './FormularioAdminReserva';
import TablaAdminReservas from './TablaAdminReservas';
import useReservas from '../hooks/useReservas';
import useLaboratorios from '../hooks/useLaboratorios';
import useUsuarios from '../hooks/useUsuarios';
import {
  crearDatosEdicion,
  formularioVacio,
  validarReservaAdmin,
} from './reservasAdmin';

export default function AdministrarReservas() {
  const {
    datos: reservas,
    cargando,
    error: errorReservas,
    crear,
    cancelar,
    actualizar,
    guardarCambios,
    operando,
  } = useReservas();
  const catalogo = useLaboratorios();
  const usuarios = useUsuarios();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [reservaEditando, setReservaEditando] = useState(null);
  const [datos, setDatos] = useState(formularioVacio);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [errorOperacion, setErrorOperacion] = useState('');
  const estudiantes = usuarios.datos.filter((usuario) => usuario.rol === 'estudiante');

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

  async function guardarReserva(evento) {
    evento.preventDefault();
    const resultado = validarReservaAdmin(
      datos, reservaEditando, reservas, estudiantes, catalogo.datos,
    );
    if (resultado.error) {
      setError(resultado.error);
      return;
    }

    try {
      if (reservaEditando === null) {
        await crear(resultado.cambios);
        setMensaje('Reserva creada correctamente.');
      } else {
        await guardarCambios(reservaEditando, resultado.cambios);
        setMensaje('Reserva actualizada correctamente.');
      }
      cancelarFormulario();
    } catch (fallo) {
      setError(fallo.message || 'No se pudo guardar la reserva.');
    }
  }

  async function confirmarEliminacion(reserva) {
    if (!window.confirm(`¿Eliminar la reserva ${reserva.codigo}?`)) return;
    try {
      await cancelar(reserva.id);
      if (reservaEditando === reserva.id) cancelarFormulario();
      setMensaje(`La reserva ${reserva.codigo} fue eliminada.`);
      setErrorOperacion('');
    } catch (fallo) {
      setErrorOperacion(fallo.message || 'No se pudo eliminar la reserva.');
    }
  }

  if (cargando || catalogo.cargando || usuarios.cargando) {
    return <p role="status">Cargando reservas y datos del API...</p>;
  }

  const errorCarga = errorReservas || catalogo.error || usuarios.error;
  if (errorCarga) {
    return <div className="alert alert-danger" role="alert">
      <p>{errorCarga}</p>
      <button type="button" className="btn btn-outline-danger" onClick={() => {
        actualizar();
        catalogo.actualizar();
        usuarios.reintentar();
      }}>Reintentar</button>
    </div>;
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
          disabled={operando}
        >
          Crear reserva
        </button>
      </div>
      {mensaje && <p className="alert alert-success" role="status">{mensaje}</p>}
      {errorOperacion && <p className="alert alert-danger" role="alert">{errorOperacion}</p>}
      {mostrarFormulario && (
        <FormularioAdminReserva
          datos={datos}
          error={error}
          enviando={operando}
          esEdicion={reservaEditando !== null}
          estudiantes={estudiantes}
          laboratorios={catalogo.datos}
          onChange={cambiarCampo}
          onSubmit={guardarReserva}
          onCancel={cancelarFormulario}
        />
      )}
      <TablaAdminReservas
        reservas={reservas}
        usuarios={usuarios.datos}
        laboratorios={catalogo.datos}
        onEdit={iniciarFormulario}
        onDelete={confirmarEliminacion}
        operando={operando}
      />
    </>
  );
}
