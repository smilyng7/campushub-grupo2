import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function NotFound() {
  const location = useLocation();

  // Hook useEffect: actualiza el título de la pestaña para el error 404
  useEffect(() => {
    document.title = '404 - Página no encontrada | CampusHub';
  }, []);

  return (
    <div className="container py-5 text-center">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm border-0 p-4 p-md-5">
            <span className="display-1 fw-bold text-danger">404</span>
            <h1 className="h4 fw-bold mt-2">Página no encontrada</h1>
            <p className="text-muted mb-4">
              La ruta <code className="text-primary">{location.pathname}</code> no existe o ha sido movida.
            </p>
            <div className="d-flex justify-content-center flex-wrap gap-2">
              <Link to="/" className="btn btn-primary">
                Volver al Inicio
              </Link>
              <Link to="/catalogo" className="btn btn-outline-secondary">
                Ir al Catálogo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
