import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { iniciarSesion } from '../services/reservasApi';

const AuthContext = createContext(null);
const CLAVE_USUARIO = 'campushub.usuario';

function leerUsuarioGuardado() {
  const guardado = localStorage.getItem(CLAVE_USUARIO);
  if (!guardado) return null;
  try {
    const usuario = JSON.parse(guardado);
    if (usuario && usuario.id && usuario.nombre && usuario.rol) return usuario;
  } catch {
    localStorage.removeItem(CLAVE_USUARIO);
  }
  localStorage.removeItem(CLAVE_USUARIO);
  return null;
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(leerUsuarioGuardado);

  const login = useCallback(async (correo, password) => {
    const cuenta = await iniciarSesion(correo, password);
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(cuenta));
    setUsuario(cuenta);
    return cuenta;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(CLAVE_USUARIO);
    setUsuario(null);
  }, []);
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