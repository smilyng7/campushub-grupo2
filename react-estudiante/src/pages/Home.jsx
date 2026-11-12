import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import db from '../data/db.json';

export default function Home() {
  const laboratorios = db.laboratorios || [];
  const disponibles = laboratorios.filter((l) => l.estado === 'disponible').length;

  // Hook useEffect: actualiza el título de la pestaña para la página de inicio
  useEffect(() => {
    document.title = 'Inicio | CampusHub';
  }, []);

  return (
    <div className="container py-4">
      {/* Hero Section con llamada a la acción */}
      <div className="p-4 p-md-5 mb-4 rounded-3 bg-light border shadow-sm">
        <div className="container-fluid py-2">
          <span className="badge bg-primary mb-2">Portal Estudiantil</span>
          <h1 className="display-6 fw-bold">Bienvenido a CampusHub Labs</h1>
          <p className="col-md-9 fs-5 text-muted">
            Gestiona tus reservas de laboratorios y salas de cómputo en el campus de forma rápida y sencilla.
          </p>
          <div className="d-flex flex-wrap gap-2 pt-2">
            <Link to="/catalogo" className="btn btn-primary btn-lg">
              Explorar Catálogo ({disponibles} disponibles)
            </Link>
            <Link to="/nueva-reserva" className="btn btn-outline-primary btn-lg">
              Nueva Reserva
            </Link>
          </div>
        </div>
      </div>

      {/* Tarjetas de Accesos Rápidos */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title fw-bold">Catálogo Completo</h5>
              <p className="card-text text-muted flex-grow-1">
                Revisa sedes, capacidades y el equipamiento especializado disponible para cada laboratorio.
              </p>
              <Link to="/catalogo" className="btn btn-outline-primary mt-2">
                Ir al Catálogo →
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title fw-bold">Reservar Espacio</h5>
              <p className="card-text text-muted flex-grow-1">
                Selecciona fecha, horario y motivo de tu práctica académica sin cruces de horarios.
              </p>
              <Link to="/nueva-reserva" className="btn btn-outline-success mt-2">
                Solicitar Reserva →
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title fw-bold">Mis Reservas</h5>
              <p className="card-text text-muted flex-grow-1">
                Consulta el estado de tus solicitudes (pendiente, aprobada o rechazada) y tu cuenta regresiva.
              </p>
              <Link to="/mis-reservas" className="btn btn-outline-secondary mt-2">
                Ver Mis Reservas →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Informativo con Regla de Negocio */}
      <div className="alert alert-info border-0 shadow-sm d-flex align-items-center" role="alert">
        <div className="small">
          <strong>Regla de negocio CampusHub:</strong> Las reservas se validan en tiempo real para evitar
          cruces de horarios en el mismo laboratorio. Asegúrate de verificar la disponibilidad antes de agendar.
        </div>
      </div>
    </div>
  );
}
