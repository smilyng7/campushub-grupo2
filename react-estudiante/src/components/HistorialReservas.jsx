import db from '../data/db.json';

export default function HistorialReservas({ misReservas }) {
  return misReservas.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead>
              <tr>
                <th>Código</th>
                <th>Laboratorio</th>
                <th>Fecha</th>
                <th>Horario</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {misReservas.map((reserva) => {
                const laboratorio = db.laboratorios.find(
                  (lab) =>
                    lab.id === reserva.laboratorioId
                );
                return (
                  <tr key={reserva.id}>
                    <td>{reserva.codigo}</td>
                    <td>{laboratorio?.nombre}</td>
                    <td>{reserva.fecha}</td>
                    <td>
                      {reserva.horaInicio} - {reserva.horaFin}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          reserva.estado === 'aprobada'
                            ? 'bg-success'
                            : reserva.estado === 'rechazada'
                              ? 'bg-danger'
                              : 'bg-warning text-dark'
                        }`}
                      >
                        {reserva.estado}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="alert alert-info">
          Todavía no tienes reservas registradas.
        </div>
      );
}
