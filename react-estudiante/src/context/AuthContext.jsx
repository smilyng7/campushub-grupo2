import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import db from '../data/db.json';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  const login = useCallback((codigo, password) => {
    const cuenta = db.usuarios.find(
      (item) => item.codigo.toLowerCase() === codigo.trim().toLowerCase()
        && item.password === password,
    );

    if (!cuenta) return false;

    const { id, nombre, correo, codigo: codigoUsuario, rol } = cuenta;
    setUsuario({ id, nombre, correo, codigo: codigoUsuario, rol });
    return true;
  }, []);

  const logout = useCallback(() => setUsuario(null), []);
  const value = useMemo(() => ({ usuario, login, logout }), [usuario, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }

  return context;
}
