import { useCallback, useEffect, useRef, useState } from 'react';
import { cancelarReserva, crearReserva, listarReservas } from '../services/reservasApi';
import { invalidarResumen } from '../services/resumenAlova';

export default function useReservas(usuarioId) {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  const [operando, setOperando] = useState(false);
  const solicitud = useRef(null);
  const ocupado = useRef(false);

  const actualizar = useCallback(async (forzarResumen = false) => {
    solicitud.current?.abort();
    const controller = new AbortController();
    solicitud.current = controller;
    setCargando(true);
    setError('');
    try {
      const reservas = await listarReservas(usuarioId, controller.signal);
      if (!controller.signal.aborted) {
        setDatos(reservas);
        if (forzarResumen) setRevision(valor => valor + 1);
      }
    } catch (fallo) {
      if (!controller.signal.aborted) setError(fallo.message);
    } finally {
      if (!controller.signal.aborted) setCargando(false);
    }
  }, [usuarioId]);

  useEffect(() => {
    // Sincroniza la consulta inicial y el indicador de carga con el API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    actualizar();
    return () => solicitud.current?.abort();
  }, [actualizar]);

  async function crear(nueva) {
    if (ocupado.current) throw new Error('Espera a que termine la operación actual.');
    ocupado.current = true;
    setOperando(true);
    try {
      const guardada = await crearReserva({ ...nueva, usuarioId });
      setDatos(actuales => [...actuales, guardada]);
      // La reserva ya está guardada aunque falle una actualización de caché.
      await invalidarResumen(usuarioId).catch(() => {});
      setRevision(valor => valor + 1);
      return guardada;
    } finally {
      ocupado.current = false;
      setOperando(false);
    }
  }

  async function cancelar(id) {
    if (ocupado.current) throw new Error('Espera a que termine la operación actual.');
    if (!datos.some(reserva => String(reserva.id) === String(id))) {
      throw new Error('Esta reserva no pertenece a la lista actual.');
    }
    ocupado.current = true;
    setOperando(true);
    solicitud.current?.abort();
    setCargando(false);
    try {
      await cancelarReserva(id);
      setDatos(actuales => actuales.filter(reserva => String(reserva.id) !== String(id)));
      await invalidarResumen(usuarioId).catch(() => {});
      setRevision(valor => valor + 1);
    } finally {
      ocupado.current = false;
      setOperando(false);
    }
  }

  return { datos, cargando, error, crear, cancelar, actualizar, revision, operando };
}
