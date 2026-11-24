
import { useState, useEffect } from 'react';
import ListaLaboratorios from '../components/ListaLaboratorios';

const API_URL = 'http://localhost:3000';

export default function Catalogo() {
  const [laboratorios, setLaboratorios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [sedeSeleccionada, setSedeSeleccionada] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');

  // FETCH API: obtener laboratorios desde json-server
  useEffect(() => {
    const obtenerLaboratorios = async () => {
      try {
        setCargando(true);
        setError('');

        const response = await fetch(`${API_URL}/laboratorios`);

        if (!response.ok) {
          throw new Error('Error al obtener los laboratorios');
        }

        const datos = await response.json();
        setLaboratorios(datos);

      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    };

    obtenerLaboratorios();
  }, []);

  const sedes = [
    'Todas',
    ...new Set(laboratorios.map((lab) => lab.sede)),
  ];

  const laboratoriosFiltrados = laboratorios.filter((lab) => {
    const coincideSede =
      sedeSeleccionada === 'Todas' ||
      lab.sede === sedeSeleccionada;

    const coincideTexto =
      lab.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      lab.sede.toLowerCase().includes(busqueda.toLowerCase());

    return coincideSede && coincideTexto;
  });

  if (cargando) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-2">Cargando laboratorios desde el API...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">
          {error}
          <button
            className="btn btn-outline-danger btn-sm ms-3"
            onClick={() => window.location.reload()}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="h2 mb-4">
        Catálogo de laboratorios
      </h1>

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

      <p className="text-body-secondary">
        Se encontraron {laboratoriosFiltrados.length} laboratorios.
      </p>

      {laboratoriosFiltrados.length > 0 ? (
        <ListaLaboratorios laboratorios={laboratoriosFiltrados} />
      ) : (
        <div className="alert alert-info">
          No se encontraron laboratorios.
        </div>
      )}
    </div>
  );
}
