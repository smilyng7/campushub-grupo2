import HistorialReservas from '../components/HistorialReservas';
import AdministrarReservas from '../components/AdministrarReservas';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useReservas } from '../context/ReservasContext';
import db from '../data/db.json';
function obtenerFechaReserva(reserva) {
  return new Date(
    `${reserva.fecha}T${reserva.horaInicio}:00`
  );
}
function formatearTiempo(segundos) {
  if (segundos <= 0) return 'La reserva está por comenzar';
  const dias = Math.floor(segundos / 86400);
  const horas = Math.floor((segundos % 86400) / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  const segundosRestantes = segundos % 60;
  return `${dias}d ${horas}h ${minutos}m ${segundosRestantes}s`;
}
export default function PortalPage() {
  const { usuario } = useAuth();
  const { reservas } = useReservas();
  const esAdmin = usuario?.rol === 'admin';
  const [ahora, setAhora] = useState(null);
  // Reservas del usuario que inició sesión
  const misReservas = reservas.filter(
    (reserva) => reserva.usuarioId === usuario?.id
  );
  // Buscar la próxima reserva
  const proximaReserva = !esAdmin && ahora !== null ? misReservas
    .filter((reserva) => {
      return (
        reserva.estado !== 'rechazada' &&
        obtenerFechaReserva(reserva).getTime() > ahora
      );
    })
    .sort(
      (a, b) =>
        obtenerFechaReserva(a) - obtenerFechaReserva(b)
    )[0] : null;
  // HOOK useEffect: contador regresivo
  useEffect(() => {
    if (esAdmin) return undefined;
    const actualizarAhora = () => setAhora(Date.now());
    const inicio = setTimeout(actualizarAhora, 0);
    const intervalo = setInterval(actualizarAhora, 1000);
    return () => {
      clearTimeout(inicio);
      clearInterval(intervalo);
    };
  }, [esAdmin]);
  const tiempoRestante = proximaReserva
    ? formatearTiempo(Math.max(
      0,
      Math.floor((obtenerFechaReserva(proximaReserva).getTime() - ahora) / 1000)
    ))
    : 'No tienes próximas reservas';

  if (esAdmin) {
    return (
      <div className="container py-4">
        <h1 className="h2 mb-4">Administrar reservas</h1>
        <AdministrarReservas />
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="h2 mb-4">
        Mis reservas
      </h1>
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h2 className="h5">
            Próxima reserva
          </h2>
          {proximaReserva ? (
            <>
              <p className="mb-1">
                Laboratorio: {
                  db.laboratorios.find(
                    (lab) =>
                      lab.id === proximaReserva.laboratorioId
                  )?.nombre
                }
              </p>
              <p className="mb-2">
                Fecha: {proximaReserva.fecha} ·
                Hora: {proximaReserva.horaInicio}
              </p>
              <h3 className="h4 text-primary">
                {tiempoRestante}
              </h3>
            </>
          ) : (
            <p className="text-body-secondary mb-0">
              No tienes próximas reservas programadas.
            </p>
          )}
        </div>
      </div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h4 mb-0">
          Historial de reservas
        </h2>
        <Link
          to="/nueva-reserva"
          className="btn btn-primary"
        >
          Nueva reserva
        </Link>
      </div>
      <HistorialReservas misReservas={misReservas} />
    </div>
  );
}
