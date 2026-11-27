import { useState, useEffect } from "react";
import ListaLaboratorios from '../components/ListaLaboratorios';
import { obtenerLaboratorios } from "../services/laboratorioFetch";
import { sedesUnicas } from '../../../core-js/estadisticas.js';

export default function Catalogo() {
  const [laboratorios, setLaboratorios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [recargarKey, setRecargarKey] = useState(0);

  const [busqueda, setBusqueda] = useState('');
  const [sedeSeleccionada, setSedeSeleccionada] = useState('Todas');
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('Todos');
  const [capacidadMinima, setCapacidadMinima] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const cargar = async () => {
      try {
        setCargando(true);
        setError('');
        const datos = await obtenerLaboratorios({ signal: controller.signal });
        setLaboratorios(datos);
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err.message || 'No se pudieron cargar los laboratorios.');
      } finally {
        if (!controller.signal.aborted) {
          setCargando(false);
        }
      }
    };

    cargar();
    return () => controller.abort();
  }, [recargarKey]);

  const sedes = ['Todas', ...sedesUnicas(laboratorios)];

  const laboratoriosFiltrados = laboratorios.filter((lab) => {
    const texto = busqueda.trim().toLowerCase();

    const coincideTexto =
      !texto ||
      lab.nombre.toLowerCase().includes(texto) ||
      lab.sede.toLowerCase().includes(texto) ||
      (lab.equipos || []).some((eq) => eq.toLowerCase().includes(texto));

    const coincideSede =
      sedeSeleccionada === 'Todas' || lab.sede === sedeSeleccionada;

    const coincideEstado =
      estadoSeleccionado === 'Todos' || lab.estado === estadoSeleccionado;

    const minCap = Number(capacidadMinima);
    const coincideCapacidad =
      !capacidadMinima || (Number.isFinite(minCap) && lab.capacidad >= minCap);
    return coincideTexto && coincideSede && coincideEstado && coincideCapacidad;
  });
  const hayFiltrosActivos =
    busqueda !== '' ||
    sedeSeleccionada !== 'Todas' ||
    estadoSeleccionado !== 'Todos' ||
    capacidadMinima !== '';
  const limpiarFiltros = () => {
    setBusqueda('');
    setSedeSeleccionada('Todas');
    setEstadoSeleccionado('Todos');
    setCapacidadMinima('');
  };

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
        <div className="alert alert-danger d-flex align-items-center justify-content-between">
          <span>{error}</span>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={() => setRecargarKey((k) => k + 1)}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <h1 className="h2 mb-0">Catálogo de laboratorios</h1>
        {hayFiltrosActivos && (
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={limpiarFiltros}
          >
            Limpiar filtros
          </button>
        )}
      </div>
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <label htmlFor="filtro-busqueda" className="form-label">
            Buscar laboratorio o equipo
          </label>
          <input
            id="filtro-busqueda"
            type="text"
            className="form-control"
            placeholder="Ej. Lab A-301, Arduino, Proyector..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label htmlFor="filtro-sede" className="form-label">
            Sede
          </label>
          <select
            id="filtro-sede"
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
        <div className="col-md-3">
          <label htmlFor="filtro-estado" className="form-label">
            Estado
          </label>
          <select
            id="filtro-estado"
            className="form-select"
            value={estadoSeleccionado}
            onChange={(e) => setEstadoSeleccionado(e.target.value)}
          >
            <option value="Todos">Todos</option>
            <option value="disponible">Disponible</option>
            <option value="mantenimiento">En mantenimiento</option>
          </select>
        </div>
        <div className="col-md-2">
          <label htmlFor="filtro-capacidad" className="form-label">
            Capacidad mín.
          </label>
          <input
            id="filtro-capacidad"
            type="number"
            min="1"
            max="60"
            className="form-control"
            placeholder="Ej. 25"
            value={capacidadMinima}
            onChange={(e) => setCapacidadMinima(e.target.value)}
          />
        </div>
      </div>
      <p className="text-body-secondary">
        Mostrando {laboratoriosFiltrados.length} de {laboratorios.length} laboratorios.
      </p>
      {laboratoriosFiltrados.length > 0 ? (
        <ListaLaboratorios laboratorios={laboratoriosFiltrados} />
      ) : (
        <div className="alert alert-info">
          No se encontraron laboratorios con los filtros actuales.
        </div>
      )}
    </div>
  );
}