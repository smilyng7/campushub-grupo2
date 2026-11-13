
import { useState } from 'react';
import { Link } from 'react-router-dom';
import db from '../data/db.json';

export default function Catalogo() {

  // HOOK useState: filtros
  const [sedeSeleccionada, setSedeSeleccionada] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');

  // Obtener las sedes disponibles
  const sedes = [
    'Todas',
    ...new Set(db.laboratorios.map((lab) => lab.sede)),
  ];

  // Filtrar laboratorios por sede y texto
  const laboratoriosFiltrados = db.laboratorios.filter((lab) => {
    const coincideSede =
      sedeSeleccionada === 'Todas' ||
      lab.sede === sedeSeleccionada;

    const coincideTexto =
      lab.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      lab.sede.toLowerCase().includes(busqueda.toLowerCase());

    return coincideSede && coincideTexto;
  });

  return (
    <div className="container py-4">

      <h1 className="h2 mb-4">
        Catálogo de laboratorios
      </h1>

      {/* BUSCADOR */}
      <div className="row g-3 mb-4">

        <div className="col-md-6">
          <label className="form-label">
            Buscar laboratorio
          </label>

          <input
            type="text"
            className="form-control"
            placeholder="Escribe el nombre del laboratorio..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* FILTRO POR SEDE */}
        <div className="col-md-6">
          <label className="form-label">
            Filtrar por sede
          </label>

          <select
            className="form-select"
            value={sedeSeleccionada}
            onChange={(e) => setSedeSeleccionada(e.target.value)}
          >
            {sedes.map((sede) => (
              <option key={sede} value={sede}>
                {sede}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* RESULTADOS */}
      <p className="text-body-secondary">
        Se encontraron {laboratoriosFiltrados.length} laboratorios.
      </p>

      <div className="row g-3">

        {laboratoriosFiltrados.length > 0 ? (

          laboratoriosFiltrados.map((laboratorio) => (

            <div
              className="col-md-6 col-lg-4"
              key={laboratorio.id}
            >
              <article className="card h-100 shadow-sm">

                <div className="card-body">

                  <h2 className="h5 card-title">
                    {laboratorio.nombre}
                  </h2>

                  <p className="card-text text-body-secondary">
                    Sede: {laboratorio.sede}
                  </p>

                  <p>
                    Capacidad: {laboratorio.capacidad} personas
                  </p>

                  <span
                    className={`badge ${
                      laboratorio.estado === 'disponible'
                        ? 'bg-success'
                        : 'bg-warning text-dark'
                    }`}
                  >
                    {laboratorio.estado}
                  </span>

                  <div className="mt-3">
                    <Link
                      to={`/catalogo/${laboratorio.id}`}
                      className="btn btn-outline-primary"
                    >
                      Ver detalles
                    </Link>
                  </div>

                </div>

              </article>
            </div>

          ))

        ) : (

          <div className="col-12">
            <div className="alert alert-info">
              No se encontraron laboratorios con esos filtros.
            </div>
          </div>

        )}

      </div>
    </div>
  );
}
