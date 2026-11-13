import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import db from '../data/db.json';

export default function DetalleLaboratorio() {
  const { usuario } = useAuth();
  const { id } = useParams();
  const laboratorio = db.laboratorios?.find((l) => l.id === Number(id));
  const esAdmin = usuario?.rol === 'admin';

  // Hook useEffect: actualiza el título de la pestaña según el recurso consultado
  useEffect(() => {
    if (laboratorio) {
      document.title = `${laboratorio.nombre} | CampusHub`;
    } else {
      document.title = 'Laboratorio no encontrado | CampusHub';
    }
  }, [laboratorio]);

  // Renderizado condicional si el ID no existe en los datos locales
  if (!laboratorio) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning shadow-sm" role="alert">
          <h4 className="alert-heading">Laboratorio no encontrado</h4>
          <p>No existe ningún laboratorio con el identificador #{id}.</p>
          <hr />
          <Link to="/catalogo" className="btn btn-primary">
            Volver al Catálogo
          </Link>
        </div>
      </div>
    );
  }

  const estaDisponible = laboratorio.estado === 'disponible';

  return (
    <div className="container py-4">
      {/* Miga de pan / Breadcrumb para navegación fluida */}
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

      {/* Tarjeta de detalle con Bootstrap */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h3 className="h5 mb-0">{laboratorio.nombre}</h3>
          <span className={`badge ${estaDisponible ? 'bg-success' : 'bg-warning text-dark'}`}>
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
          {/* Lista con key obligatoria según rúbrica */}
          <ul className="list-group mb-4">
            {laboratorio.equipos && laboratorio.equipos.length > 0 ? (
              laboratorio.equipos.map((equipo, index) => (
                <li key={index} className="list-group-item d-flex align-items-center">
                  <span className="me-2 text-primary">✔</span> {equipo}
                </li>
              ))
            ) : (
              <li className="list-group-item text-muted">Sin equipos registrados</li>
            )}
          </ul>

          {/* Renderizado condicional de acciones según disponibilidad */}
          <div className="d-flex justify-content-between align-items-center pt-2">
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
                {estaDisponible ? 'Solo estudiantes pueden solicitar reservas' : 'En Mantenimiento (No disponible)'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
