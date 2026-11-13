
import { useState } from 'react';
import ListaLaboratorios from '../components/ListaLaboratorios';
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

      <ListaLaboratorios laboratorios={laboratoriosFiltrados} />
    </div>
  );
}
