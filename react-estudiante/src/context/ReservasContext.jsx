
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import db from '../data/db.json';

const ReservasContext = createContext(null);

export function ReservasProvider({ children }) {
  const [reservas, setReservas] = useState(db.reservas);

  const agregarReserva = useCallback((nuevaReserva) => {
    setReservas((actuales) => {
      const maxId = actuales.reduce(
        (mayor, reserva) => Math.max(mayor, Number(reserva.id) || 0),
        0
      );
      const id = Math.max(Date.now(), maxId + 1);
      const maxCodigo = actuales.reduce((mayor, reserva) => {
        const numero = Number(reserva.codigo?.replace(/\D/g, '')) || 0;
        return Math.max(mayor, numero);
      }, 0);
      return [
        ...actuales,
        {
          ...nuevaReserva,
          id,
          codigo: `RES-${String(maxCodigo + 1).padStart(4, '0')}`,
          estado: nuevaReserva.estado ?? 'pendiente',
          creadoEn: new Date().toISOString(),
        },
      ];
    });
  }, []);

  const actualizarReserva = useCallback((id, cambios) => {
    setReservas((actuales) =>
      actuales.map((reserva) =>
        reserva.id === id ? { ...reserva, ...cambios, id } : reserva
      )
    );
  }, []);

  const eliminarReserva = useCallback((id) => {
    setReservas((actuales) =>
      actuales.filter((reserva) => reserva.id !== id)
    );
  }, []);

  const value = useMemo(
    () => ({ reservas, agregarReserva, actualizarReserva, eliminarReserva }),
    [reservas, agregarReserva, actualizarReserva, eliminarReserva]
  );

  return (
    <ReservasContext.Provider value={value}>
      {children}
    </ReservasContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useReservas() {
  const context = useContext(ReservasContext);

  if (!context) {
    throw new Error(
      'useReservas debe utilizarse dentro de ReservasProvider'
    );
  }

  return context;
}
