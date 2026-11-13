
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
    setReservas((actuales) => [
      ...actuales,
      {
        ...nuevaReserva,
        id: Date.now(),
        codigo: `RES-${String(Date.now()).slice(-6)}`,
        estado: 'pendiente',
        creadoEn: new Date().toISOString(),
      },
    ]);
  }, []);

  const value = useMemo(
    () => ({ reservas, agregarReserva }),
    [reservas, agregarReserva]
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
