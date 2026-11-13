import { Link, useSearchParams } from 'react-router-dom';
import FormularioReserva from '../components/FormularioReserva';
import { useAuth } from '../context/AuthContext';
import { useReservas } from '../context/ReservasContext';
import db from '../data/db.json';

export default function NuevaReserva() {
  const { usuario } = useAuth();
  const { reservas, agregarReserva } = useReservas();
  const [parametros] = useSearchParams();
  const disponibles = db.laboratorios.filter(lab => lab.estado === 'disponible');
  const seleccionado = disponibles.find(lab => String(lab.id) === parametros.get('laboratorioId'));

  return (
    <section className="container py-4">
      <h1 className="h2">Nueva reserva</h1>
      <FormularioReserva
        key={seleccionado?.id ?? 'nuevo'}
        laboratorioInicial={seleccionado ? String(seleccionado.id) : ''}
        laboratorios={disponibles}
        reservas={reservas}
        usuarioId={usuario.id}
        onGuardar={agregarReserva}
      />
      <Link to="/mis-reservas">Ver mis reservas</Link>
    </section>
  );
}
