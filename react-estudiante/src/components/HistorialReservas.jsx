export default function HistorialReservas({ misReservas, laboratorios, onCancelar, cancelando }) {
  const porId = new Map(laboratorios.map(laboratorio => [String(laboratorio.id), laboratorio]));
  const ordenadas = [...misReservas].sort((a, b) =>
    b.fecha.localeCompare(a.fecha) || b.horaInicio.localeCompare(a.horaInicio));
  if (ordenadas.length === 0) {
    return <div className="alert alert-info">Todavía no tienes reservas registradas.</div>;
  }
  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover align-middle">
        <thead><tr>
          {['Código', 'Laboratorio', 'Fecha', 'Horario', 'Motivo', 'Estado', 'Acciones'].map(titulo =>
            <th key={titulo} scope="col">{titulo}</th>)}
        </tr></thead>
        <tbody>
          {ordenadas.map(reserva => (
            <tr key={reserva.id}>
              <td>{reserva.codigo}</td>
              <td>{porId.get(String(reserva.laboratorioId))?.nombre
                || `Laboratorio #${reserva.laboratorioId}`}</td>
              <td>{reserva.fecha}</td>
              <td>{reserva.horaInicio} – {reserva.horaFin}</td>
              <td>{reserva.motivo}</td>
              <td><span className={`badge ${reserva.estado === 'aprobada'
                ? 'bg-success' : reserva.estado === 'rechazada' ? 'bg-danger' : 'bg-warning text-dark'}`}>
                {reserva.estado}
              </span></td>
              <td><button type="button" className="btn btn-outline-danger btn-sm"
                disabled={cancelando} onClick={() => onCancelar(reserva)}
                aria-label={`Cancelar ${reserva.codigo}`}>
                Cancelar
              </button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
