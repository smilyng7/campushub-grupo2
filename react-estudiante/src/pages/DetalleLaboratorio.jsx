import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  obtenerLaboratorioPorId,
  obtenerReservasPorLaboratorio,
} from '../services/laboratorioFetch';

export default function DetalleLaboratorio() {
  const { usuario } = useAuth();
  const { id } = useParams();

  const [laboratorio, setLaboratorio] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const esAdmin = usuario?.rol === 'admin';

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const cargar = async () => {
      try {
        setCargando(true);
        setError('');

        const [datosLab, datosReservas] = await Promise.all([
          obtenerLaboratorioPorId(id, { signal }),
          obtenerReservasPorLaboratorio(id, { signal }),
        ]);

        setLaboratorio(datosLab);
        setReservas(datosReservas);

      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err.message);
      } finally {
        if (!signal.aborted) setCargando(false);
      }
    };

    cargar();
    return () => controller.abort();
  }, [id]);
    // ----- Estados de pantalla -----
  if (cargando) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-3">Cargando laboratorio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning shadow-sm">
          <h4 className="alert-heading">{error}</h4>
          <p>No se pudo obtener la información solicitada.</p>
          <hr />
          <Link to="/catalogo" className="btn btn-primary">
            Volver al Catálogo
          </Link>
        </div>
      </div>
    );
  }

  if (!laboratorio) return null;

  // ----- Variables locales -----
  const estaDisponible = laboratorio.estado === 'disponible';

  const reservasOcupadas = reservas
    .filter((r) => r.estado !== 'rechazada')
    .sort((a, b) => a.fecha.localeCompare(b.fecha) || a.horaInicio.localeCompare(b.horaInicio));

  // ----- Vista principal -----
  return (
    <div className="container py-4">

      {/* Breadcrumb */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/catalogo">Catálogo</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {laboratorio.nombre}
          </li>
        </ol>
      </nav>

      {/* Tarjeta de detalle */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h3 className="h5 mb-0">{laboratorio.nombre}</h3>
          <span className={`badge ${estaDisponible ? 'bg-success text-dark' : 'bg-warning text-dark'}`}>
            {laboratorio.estado?.toUpperCase()}
          </span>
        </div>

        <div className="card-body">
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <span className="text-muted d-block small">Sede</span>
              <span className="fw-bold">{laboratorio.sede}</span>
            </div>
            <div className="col-md-6">
              <span className="text-muted d-block small">Capacidad</span>
              <span className="fw-bold">{laboratorio.capacidad} estudiantes</span>
            </div>
          </div>

          <h5 className="h6 text-muted mb-2">Equipamiento disponible:</h5>
          <ul className="list-group mb-4">
            {laboratorio.equipos?.length > 0 ? (
              laboratorio.equipos.map((equipo, index) => (
                <li key={`${equipo}-${index}`} className="list-group-item d-flex align-items-center">
                  <span className="me-2 text-primary">✔</span>
                  {equipo}
                </li>
              ))
            ) : (
              <li className="list-group-item text-muted">Sin equipos registrados</li>
            )}
          </ul>

          {/* Botones */}
          <div className="d-flex justify-content-between align-items-center pt-2 flex-wrap gap-2">
            <Link to="/catalogo" className="btn btn-outline-secondary">
              ← Volver al Catálogo
            </Link>

            {estaDisponible && !esAdmin ? (
              <Link
                to={`/nueva-reserva?laboratorioId=${laboratorio.id}`}
                className="btn btn-success"
              >
                Solicitar Reserva
              </Link>
            ) : (
              <button className="btn btn-secondary" disabled>
                {estaDisponible
                  ? 'Solo estudiantes pueden solicitar reservas'
                  : 'En Mantenimiento (No disponible)'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Horarios ocupados */}
      <div className="card shadow-sm border-0">
        <div className="card-header">
          <h4 className="h6 mb-0">
            Reservas activas ({reservasOcupadas.length})
          </h4>
        </div>
        <div className="card-body p-0">
          {reservasOcupadas.length > 0 ? (
            <ul className="list-group list-group-flush">
              {reservasOcupadas.map((r) => (
                <li key={r.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <span>
                    <strong>{r.fecha}</strong>
                    <span className="ms-3 text-muted">
                      {r.horaInicio} – {r.horaFin}
                    </span>
                  </span>
                  <span className={`badge ${r.estado === 'aprobada' ? 'bg-success' : 'bg-warning text-dark'}`}>
                    {r.estado}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted p-3 mb-0">
              No hay reservas activas para este laboratorio.
            </p>
          )}
        </div>
      </div>

    </div>
  );
}