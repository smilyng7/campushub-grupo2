import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import db from '../data/db.json';

export default function Home() {
  const { usuario } = useAuth();
  const esAdmin = usuario?.rol === 'admin';
  const laboratorios = db.laboratorios || [];
  const disponibles = laboratorios.filter((l) => l.estado === 'disponible').length;

  // Hook useEffect: actualiza el título de la pestaña para la página de inicio
  useEffect(() => {
    document.title = 'Inicio | CampusHub';
  }, []);

  return (
    <div className="container py-4">
      {/* Hero Section con llamada a la acción */}
      <div className="p-4 p-md-5 mb-4 rounded-3 bg-body-tertiary border shadow-sm home-hero-card">
        <div className="container-fluid py-2">
          <span className="badge bg-primary mb-2">
            {esAdmin ? 'Panel administrativo' : 'Portal Estudiantil'}
          </span>
          <h1 className="display-6 fw-bold text-body">Bienvenido a CampusHub Labs</h1>
          <p className="col-md-9 fs-5 text-body-secondary">
            Gestiona tus reservas de laboratorios y salas de cómputo en el campus de forma rápida y sencilla.
          </p>
          <div className="d-flex flex-wrap gap-2 pt-2">
            <Link to="/catalogo" className="btn btn-primary btn-lg">
              Explorar Catálogo ({disponibles} disponibles)
            </Link>
            {!esAdmin && (
              <Link to="/nueva-reserva" className="btn btn-outline-primary btn-lg">
                Nueva Reserva
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Tarjetas de Accesos Rápidos */}
      <div className="row g-4 mb-4">
        <div className={esAdmin ? 'col-md-6' : 'col-md-4'}>
          <div className="card h-100 shadow-sm border">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title fw-bold text-body">Catálogo Completo</h5>
              <p className="card-text text-body-secondary flex-grow-1">
                Revisa sedes, capacidades y el equipamiento especializado disponible para cada laboratorio.
              </p>
              <Link to="/catalogo" className="btn btn-outline-primary mt-2">
                Ir al Catálogo →
              </Link>
            </div>
          </div>
        </div>

        {!esAdmin && (
          <div className="col-md-4">
            <div className="card h-100 shadow-sm border">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold text-body">Reservar Espacio</h5>
                <p className="card-text text-body-secondary flex-grow-1">
                  Selecciona fecha, horario y motivo de tu práctica académica sin cruces de horarios.
                </p>
                <Link to="/nueva-reserva" className="btn btn-outline-success mt-2">
                  Solicitar Reserva →
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className={esAdmin ? 'col-md-6' : 'col-md-4'}>
          <div className="card h-100 shadow-sm border">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title fw-bold text-body">
                {esAdmin ? 'Administrar Reservas' : 'Mis Reservas'}
              </h5>
              <p className="card-text text-body-secondary flex-grow-1">
                {esAdmin
                  ? 'Consulta y gestiona el historial completo de reservas.'
                  : 'Consulta el estado de tus solicitudes (pendiente, aprobada o rechazada) y tu cuenta regresiva.'}
              </p>
              <Link to="/mis-reservas" className="btn btn-outline-secondary mt-2">
                {esAdmin ? 'Ver todas las reservas →' : 'Ver Mis Reservas →'}
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
