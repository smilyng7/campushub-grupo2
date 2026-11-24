
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:3000';

export default function DetalleLaboratorio() {
  const { usuario } = useAuth();
  const { id } = useParams();

  // Estados para Fetch API
  const [laboratorio, setLaboratorio] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const esAdmin = usuario?.rol === 'admin';

  // FETCH API: obtener detalle del laboratorio
  useEffect(() => {
    const obtenerLaboratorio = async () => {
      try {
        setCargando(true);
        setError('');
        setLaboratorio(null);

        const response = await fetch(
          `${API_URL}/laboratorios/${id}`
        );

        // Comprobar respuesta HTTP
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Laboratorio no encontrado');
          }

          throw new Error(
            'Error al obtener el detalle del laboratorio'
          );
        }

        const datos = await response.json();

        setLaboratorio(datos);

      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    };

    obtenerLaboratorio();
  }, [id]);

  // Actualizar título de la pestaña
  useEffect(() => {
    if (cargando) {
      document.title = 'Cargando laboratorio | CampusHub';
    } else if (laboratorio) {
      document.title = `${laboratorio.nombre} | CampusHub`;
    } else {
      document.title = 'Laboratorio no encontrado | CampusHub';
    }
  }, [laboratorio, cargando]);

  // Estado de carga
  if (cargando) {
    return (
      <div className="container py-5 text-center">
        <div
          className="spinner-border text-primary"
          role="status"
        >
          <span className="visually-hidden">Cargando...</span>
        </div>

        <p className="mt-3">
          Consultando laboratorio desde el API...
        </p>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning shadow-sm">
          <h4 className="alert-heading">
            {error}
          </h4>

          <p>
            No se pudo obtener la información solicitada.
          </p>

          <hr />

          <Link
            to="/catalogo"
            className="btn btn-primary"
          >
            Volver al Catálogo
          </Link>
        </div>
      </div>
    );
  }

  // Si no existe el laboratorio
  if (!laboratorio) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning">
          <h4>Laboratorio no encontrado</h4>

          <p>
            No existe ningún laboratorio con el identificador #{id}.
          </p>

          <Link
            to="/catalogo"
            className="btn btn-primary"
          >
            Volver al Catálogo
          </Link>
        </div>
      </div>
    );
  }

  const estaDisponible =
    laboratorio.estado === 'disponible';

  return (
    <div className="container py-4">

      {/* Breadcrumb */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/catalogo">
              Catálogo
            </Link>
          </li>

          <li
            className="breadcrumb-item active"
            aria-current="page"
          >
            {laboratorio.nombre}
          </li>
        </ol>
      </nav>

      {/* Tarjeta de detalle */}
      <div className="card shadow-sm border-0">

        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">

          <h3 className="h5 mb-0">
            {laboratorio.nombre}
          </h3>

          <span
            className={`badge ${
              estaDisponible
                ? 'bg-success'
                : 'bg-warning text-dark'
            }`}
          >
            {laboratorio.estado?.toUpperCase()}
          </span>

        </div>

        <div className="card-body">

          {/* Información general */}
          <div className="row g-3 mb-4">

            <div className="col-md-6">
              <span className="text-muted d-block small">
                Sede
              </span>

              <span className="fw-bold">
                {laboratorio.sede}
              </span>
            </div>

            <div className="col-md-6">
              <span className="text-muted d-block small">
                Capacidad
              </span>

              <span className="fw-bold">
                {laboratorio.capacidad} estudiantes
              </span>
            </div>

          </div>

          {/* Equipamiento */}
          <h5 className="h6 text-muted mb-2">
            Equipamiento disponible:
          </h5>

          <ul className="list-group mb-4">

            {laboratorio.equipos &&
            laboratorio.equipos.length > 0 ? (

              laboratorio.equipos.map((equipo, index) => (
                <li
                  key={`${equipo}-${index}`}
                  className="list-group-item d-flex align-items-center"
                >
                  <span className="me-2 text-primary">
                    ✔
                  </span>

                  {equipo}
                </li>
              ))

            ) : (

              <li className="list-group-item text-muted">
                Sin equipos registrados
              </li>

            )}

          </ul>

          {/* Botones */}
          <div className="d-flex justify-content-between align-items-center pt-2 flex-wrap gap-2">

            <Link
              to="/catalogo"
              className="btn btn-outline-secondary"
            >
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

              <button
                className="btn btn-secondary"
                disabled
              >
                {estaDisponible
                  ? 'Solo estudiantes pueden solicitar reservas'
                  : 'En Mantenimiento (No disponible)'}
              </button>

            )}

          </div>

        </div>
      </div>
    </div>
  );
}
