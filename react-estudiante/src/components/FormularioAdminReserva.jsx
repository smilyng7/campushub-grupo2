import { estadosReserva } from './reservasAdmin';

const campos = [
  { nombre: 'fecha', etiqueta: 'Fecha', tipo: 'date', columna: 'col-md-4' },
  { nombre: 'horaInicio', etiqueta: 'Hora de inicio', tipo: 'time', columna: 'col-md-4' },
  { nombre: 'horaFin', etiqueta: 'Hora de fin', tipo: 'time', columna: 'col-md-4' },
  { nombre: 'motivo', etiqueta: 'Motivo', tipo: 'text', columna: 'col-md-8' },
];

export default function FormularioAdminReserva({
  datos,
  error,
  esEdicion,
  estudiantes,
  laboratorios,
  onChange,
  onSubmit,
  onCancel,
}) {
  return (
    <form className="card card-body mb-4" onSubmit={onSubmit}>
      <h2 className="h5 mb-3">{esEdicion ? 'Editar reserva' : 'Crear reserva'}</h2>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label" htmlFor="reserva-usuario">Estudiante</label>
          <select
            className="form-select"
            id="reserva-usuario"
            name="usuarioId"
            value={datos.usuarioId}
            onChange={onChange}
            required
          >
            <option value="">Selecciona un estudiante</option>
            {estudiantes.map((estudiante) => (
              <option key={estudiante.id} value={estudiante.id}>
                {estudiante.nombre} · {estudiante.codigo}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label" htmlFor="reserva-laboratorio">Laboratorio</label>
          <select
            className="form-select"
            id="reserva-laboratorio"
            name="laboratorioId"
            value={datos.laboratorioId}
            onChange={onChange}
            required
          >
            <option value="">Selecciona un laboratorio</option>
            {laboratorios.map((laboratorio) => (
              <option key={laboratorio.id} value={laboratorio.id}>
                {laboratorio.nombre} · {laboratorio.sede}
              </option>
            ))}
          </select>
        </div>
        {campos.map(({ nombre, etiqueta, tipo, columna }) => (
          <div className={columna} key={nombre}>
            <label className="form-label" htmlFor={`reserva-${nombre}`}>{etiqueta}</label>
            <input
              className="form-control"
              id={`reserva-${nombre}`}
              name={nombre}
              type={tipo}
              value={datos[nombre]}
              onChange={onChange}
              required
            />
          </div>
        ))}
        <div className="col-md-4">
          <label className="form-label" htmlFor="reserva-estado">Estado</label>
          <select
            className="form-select"
            id="reserva-estado"
            name="estado"
            value={datos.estado}
            onChange={onChange}
          >
            {estadosReserva.map((estado) => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>
        </div>
      </div>
      {error && <p className="alert alert-danger mt-3 mb-0" role="alert">{error}</p>}
      <div className="d-flex gap-2 mt-3">
        <button type="submit" className="btn btn-primary">Guardar</button>
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
