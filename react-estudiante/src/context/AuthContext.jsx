import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { iniciarSesion } from '../services/reservasApi';

const AuthContext = createContext(null);
<<<<<<< HEAD
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
=======
const STORAGE_KEY = 'campushub_usuario';

function leerUsuarioGuardado() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
>>>>>>> evelyn
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(leerUsuarioGuardado);

<<<<<<< HEAD
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
=======
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

>>>>>>> evelyn
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