import BadgeEstado from './BadgeEstado';
import { Link } from 'react-router-dom';

export default function TarjetaLaboratorio({ lab }) {
    return (
        <div className="card h-100 shadow-sm border-0">
            <div className="card-body">
                <h5 className="card-title text-primary fw-bold">{lab.nombre}</h5>
                <p className="card-text text-muted mb-1"><strong>Sede:</strong> {lab.sede}</p>
                <p className="card-text mb-2"><strong>Capacidad:</strong> {lab.capacidad} personas</p>

                {/* Lista de equipos */}
                <div className="mb-3">
                    {lab.equipos.map((eq, index) => (
                        <span key={index} className="badge bg-body-secondary text-body border me-1 mb-1">{eq}</span>
                    ))}
                </div>

                <BadgeEstado estado={lab.estado} />
            </div>

            <div className="card-footer bg-transparent border-top-0 pb-3">
                <Link to={`/catalogo/${lab.id}`} className="btn btn-outline-primary w-100">
                    Ver Detalle / Reservar
                </Link>
            </div>
        </div>
    );
}