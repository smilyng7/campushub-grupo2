import { Link, useSearchParams } from 'react-router-dom';
import FormularioReserva from '../components/FormularioReserva';
import { useAuth } from '../context/AuthContext';
import useReservas from '../hooks/useReservas';
import useLaboratorios from '../hooks/useLaboratorios';

export default function NuevaReserva() {
  const { usuario } = useAuth();
  return <NuevaReservaEstudiante key={usuario.id} usuarioId={usuario.id} />;
}

function NuevaReservaEstudiante({ usuarioId }) {
  const { datos, cargando, error, crear, actualizar } = useReservas(usuarioId);
  const catalogo = useLaboratorios();
  const [parametros] = useSearchParams();
  const disponibles = catalogo.datos.filter(lab => lab.estado === 'disponible');
  const seleccionado = disponibles.find(lab => String(lab.id) === parametros.get('laboratorioId'));
  const esperando = cargando || catalogo.cargando;
  const fallo = error || catalogo.error;
  return (
    <section className="container py-4">
      <h1 className="h2">Nueva reserva</h1>
      {esperando ? <p role="status">Cargando datos para la reserva...</p> : fallo ? (
        <div className="alert alert-danger" role="alert">
          <p>{fallo}</p>
          <button type="button" className="btn btn-outline-danger"
            onClick={() => { actualizar(); catalogo.actualizar(); }}>Reintentar</button>
        </div>
      ) : disponibles.length === 0 ? (
        <p className="alert alert-info">No hay laboratorios disponibles para reservar.</p>
      ) : <FormularioReserva key={seleccionado?.id ?? 'nuevo'}
        laboratorioInicial={seleccionado ? String(seleccionado.id) : ''}
        laboratorios={disponibles} reservas={datos} usuarioId={usuarioId} onGuardar={crear} />}
      <Link to="/mis-reservas">Ver mis reservas</Link>
    </section>
  );
}
