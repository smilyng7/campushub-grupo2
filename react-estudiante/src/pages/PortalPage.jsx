import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HistorialReservas from '../components/HistorialReservas';
import ResumenReservas from '../components/ResumenReservas';
import AdministrarReservas from '../components/AdministrarReservas';
import { useAuth } from '../context/AuthContext';
import useReservas from '../hooks/useReservas';
import useLaboratorios from '../hooks/useLaboratorios';

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

export default function PortalPage() {
  const { usuario } = useAuth();
  if (usuario.rol === 'admin') {
    return <div className="container py-4">
      <h1 className="h2 mb-4">Administrar reservas</h1><AdministrarReservas />
    </div>;
  }
  return <PortalEstudiante key={usuario.id} usuarioId={usuario.id} />;
}

function PortalEstudiante({ usuarioId }) {
  const { datos, cargando, error, cancelar, actualizar, revision, operando } = useReservas(usuarioId);
  const catalogo = useLaboratorios();
  const [ahora, setAhora] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [errorOperacion, setErrorOperacion] = useState('');
  useEffect(() => {
    const actualizarAhora = () => setAhora(Date.now());
    const inicio = setTimeout(actualizarAhora, 0);
    const intervalo = setInterval(actualizarAhora, 1000);
    return () => { clearTimeout(inicio); clearInterval(intervalo); };
  }, []);
  const proxima = ahora === null ? null : datos
    .filter(reserva => reserva.estado !== 'rechazada' && obtenerFechaReserva(reserva).getTime() > ahora)
    .sort((a, b) => obtenerFechaReserva(a) - obtenerFechaReserva(b))[0];

  async function confirmarCancelacion(reserva) {
    if (!window.confirm(`¿Cancelar la reserva ${reserva.codigo}? Se eliminará del historial.`)) return;
    setMensaje('');
    setErrorOperacion('');
    try {
      await cancelar(reserva.id);
      setMensaje(`Reserva ${reserva.codigo} cancelada.`);
    } catch (fallo) {
      setErrorOperacion(fallo.message);
    }
  }
  function refrescar() {
    setMensaje('');
    setErrorOperacion('');
    actualizar(true);
    catalogo.actualizar();
  }
  return (
    <div className="container py-4">
      <h1 className="h2 mb-4">Mis reservas</h1>
      <ResumenReservas usuarioId={usuarioId} revision={revision} />
      <section className="card card-body mb-4">
        <h2 className="h5">Próxima reserva</h2>
        {cargando ? <p role="status">Consultando próxima reserva...</p> : error ? (
          <p>No se pudo consultar la próxima reserva.</p>
        ) : proxima ? <>
          <p>Laboratorio: {catalogo.datos.find(lab => String(lab.id) === String(proxima.laboratorioId))?.nombre
            || `#${proxima.laboratorioId}`} · {proxima.fecha} · {proxima.horaInicio}</p>
          <p className="h4 text-primary">{formatearTiempo(Math.max(0,
            Math.floor((obtenerFechaReserva(proxima).getTime() - ahora) / 1000)))}</p>
        </> : <p className="mb-0">No tienes próximas reservas programadas.</p>}
      </section>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h2 className="h4 mb-0">Historial de reservas</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary" type="button" onClick={refrescar}
            disabled={cargando || catalogo.cargando || operando}>Actualizar reservas</button>
          <Link className="btn btn-primary" to="/nueva-reserva">Nueva reserva</Link>
        </div>
      </div>
      {mensaje && <p className="alert alert-success" role="status">{mensaje}</p>}
      {errorOperacion && <p className="alert alert-danger" role="alert">{errorOperacion}</p>}
      {catalogo.error && <p className="alert alert-warning" role="alert">
        No se pudieron cargar los nombres de los laboratorios. Pulsa Actualizar reservas para reintentar.
      </p>}
      {catalogo.cargando && <p role="status">Cargando laboratorios...</p>}
      {cargando && <p role="status">Cargando reservas...</p>}
      {error && <p className="alert alert-danger" role="alert">{error}</p>}
      {!cargando && !error && <HistorialReservas misReservas={datos} laboratorios={catalogo.datos}
        onCancelar={confirmarCancelacion} cancelando={operando} />}
    </div>
  );
}
