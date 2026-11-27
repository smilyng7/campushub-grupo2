import { useCallback, useEffect, useRef, useState } from 'react';
import { obtenerLaboratorios } from '../services/laboratorioFetch';

export default function useLaboratorios() {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const solicitud = useRef(null);
  const actualizar = useCallback(async () => {
    solicitud.current?.abort();
    const controller = new AbortController();
    solicitud.current = controller;
    setCargando(true);
    setError('');
    try {
      const laboratorios = await obtenerLaboratorios({ signal: controller.signal });
      if (!controller.signal.aborted) setDatos(laboratorios);
    } catch (fallo) {
      if (!controller.signal.aborted) setError(fallo.message);
    } finally {
      if (!controller.signal.aborted) setCargando(false);
    }
  }, []);
  useEffect(() => {
    // Sincroniza la consulta inicial y el indicador de carga con el API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    actualizar();
    return () => solicitud.current?.abort();
  }, [actualizar]);
  return { datos, cargando, error, actualizar };
}
