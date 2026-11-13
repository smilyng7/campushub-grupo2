
import { useEffect } from 'react';

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';

import Navbar from './components/Navbar';

import {
  AuthProvider,
  useAuth,
} from './context/AuthContext';

import {
  ThemeProvider,
  useTheme,
} from './context/ThemeContext';

import {
  ReservasProvider,
} from './context/ReservasContext';

import Catalogo from './pages/Catalogo';
import DetalleLaboratorio from './pages/DetalleLaboratorio';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import PortalPage from './pages/PortalPage';
import NuevaReserva from './pages/NuevaReserva';

// RUTAS PROTEGIDAS
function RutaProtegida({ children }) {
  const { usuario } = useAuth();
  const location = useLocation();

  return usuario ? (
    children
  ) : (
    <Navigate
      to="/login"
      replace
      state={{ from: location }}
    />
  );
}

// APLICACIÓN PRINCIPAL
function Aplicacion() {
  const { usuario, logout } = useAuth();
  const { tema, toggleTema } = useTheme();

  const location = useLocation();

  // HOOK useEffect: título dinámico
  useEffect(() => {
    const titulos = {
      '/': 'Inicio',
      '/catalogo': 'Catálogo de laboratorios',
      '/mis-reservas': 'Mis reservas',
      '/nueva-reserva': 'Nueva reserva',
      '/login': 'Iniciar sesión',
    };

    const ruta = location.pathname;

    const titulo = ruta.startsWith('/catalogo/')
      ? 'Detalle del laboratorio'
      : titulos[ruta] || 'Página no encontrada';

    document.title = `${titulo} | CampusHub`;

  }, [location.pathname]);

  return (
    <div className="min-vh-100 bg-body">

      <Navbar
        usuario={usuario}
        onLogout={logout}
        tema={tema}
        onToggleTema={toggleTema}
      />

      <main>
        <Routes>

          <Route path="/" element={<Home />} />

          <Route
            path="/catalogo"
            element={<Catalogo />}
          />

          <Route
            path="/catalogo/:id"
            element={<DetalleLaboratorio />}
          />

          <Route
            path="/mis-reservas"
            element={
              <RutaProtegida>
                <PortalPage />
              </RutaProtegida>
            }
          />

          <Route
            path="/nueva-reserva"
            element={
              <RutaProtegida>
                <NuevaReserva />
              </RutaProtegida>
            }
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="*"
            element={<NotFound />}
          />

        </Routes>
      </main>
    </div>
  );
}

// APP
export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ReservasProvider>
          <BrowserRouter>
            <Aplicacion />
          </BrowserRouter>
        </ReservasProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
