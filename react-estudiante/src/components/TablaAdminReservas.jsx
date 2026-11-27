export default function TablaAdminReservas({
  reservas, usuarios, laboratorios, onEdit, onDelete, operando,
}) {
  const usuariosPorId = new Map(usuarios.map((usuario) => [String(usuario.id), usuario]));
  const laboratoriosPorId = new Map(
    laboratorios.map((laboratorio) => [String(laboratorio.id), laboratorio])
  );

  if (reservas.length === 0) {
    return <div className="alert alert-info">No hay reservas registradas.</div>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">Código</th>
            <th scope="col">Estudiante</th>
            <th scope="col">Laboratorio</th>
            <th scope="col">Fecha</th>
            <th scope="col">Horario</th>
            <th scope="col">Motivo</th>
            <th scope="col">Estado</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map((reserva) => (
            <tr key={reserva.id}>
              <td>{reserva.codigo}</td>
              <td>{usuariosPorId.get(String(reserva.usuarioId))?.nombre || `Usuario #${reserva.usuarioId}`}</td>
              <td>{laboratoriosPorId.get(String(reserva.laboratorioId))?.nombre || `Laboratorio #${reserva.laboratorioId}`}</td>
              <td>{reserva.fecha}</td>
              <td>{reserva.horaInicio} - {reserva.horaFin}</td>
              <td>{reserva.motivo}</td>
              <td>
                <span className={`badge ${
                  reserva.estado === 'aprobada'
                    ? 'bg-success'
                    : reserva.estado === 'rechazada'
                      ? 'bg-danger'
                      : 'bg-warning text-dark'
                }`}>
                  {reserva.estado}
                </span>
              </td>
              <td>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => onEdit(reserva)}
                    disabled={operando}
                    aria-label={`Editar ${reserva.codigo}`}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => onDelete(reserva)}
                    disabled={operando}
                    aria-label={`Eliminar ${reserva.codigo}`}
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
