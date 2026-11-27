import { useEffect, useState } from 'react';
import { listarUsuarios } from '../services/reservasApi';

export default function useUsuarios() {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const cargar = async () => {
      setCargando(true);
      setError('');
      try {
        const usuarios = await listarUsuarios(controller.signal);
        if (!controller.signal.aborted) setDatos(usuarios);
      } catch (fallo) {
        if (!controller.signal.aborted) setError(fallo.message);
      } finally {
        if (!controller.signal.aborted) setCargando(false);
      }
    };

    cargar();
    return () => controller.abort();
  }, [revision]);

  return { datos, cargando, error, reintentar: () => setRevision(valor => valor + 1) };
}
