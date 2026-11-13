export default function BadgeEstado({ estado }) {
  const esDisponible = estado === 'disponible';
  return (
    <span className={`badge bg-${esDisponible ? 'success' : 'warning'} text-dark`}>
      {estado.toUpperCase()}
    </span>
  );
}