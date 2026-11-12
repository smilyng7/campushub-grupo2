import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import db from '../data/db.json';

export default function Catalogo() {
  useEffect(() => {
    document.title = 'Catálogo | CampusHub';
  }, []);

  return (
    <div className="container py-4">
      <h1 className="h2 mb-4">Catálogo de laboratorios</h1>
      <div className="row g-3">
        {db.laboratorios.map((laboratorio) => (
          <div className="col-md-6 col-lg-4" key={laboratorio.id}>
            <article className="card h-100">
              <div className="card-body">
                <h2 className="h5 card-title">{laboratorio.nombre}</h2>
                <p className="card-text text-body-secondary">
                  {laboratorio.sede} · Capacidad: {laboratorio.capacidad}
                </p>
                <Link to={`/catalogo/${laboratorio.id}`} className="btn btn-outline-primary">
                  Ver detalles
                </Link>
              </div>
            </article>
          </div>
        ))}
      </div>
    </div>
  );
}
