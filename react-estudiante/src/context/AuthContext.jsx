import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import db from '../data/db.json';

const AuthContext = createContext(null);
const STORAGE_KEY = 'campushub_usuario';

function leerUsuarioGuardado() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(leerUsuarioGuardado);

  const login = useCallback((codigo, password) => {
    const cuenta = db.usuarios.find(
      (item) => item.codigo.toLowerCase() === codigo.trim().toLowerCase()
        && item.password === password,
    );

    if (!cuenta) return false;

    const { id, nombre, correo, codigo: codigoUsuario, rol } = cuenta;
    const sesion = { id, nombre, correo, codigo: codigoUsuario, rol };
    setUsuario(sesion);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sesion));
    return true;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUsuario(null);
  }, []);

  const value = useMemo(() => ({ usuario, login, logout }), [usuario, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }

  return context;
}