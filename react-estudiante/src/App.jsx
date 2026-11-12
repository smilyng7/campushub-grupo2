import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Catalogo from './pages/Catalogo';
import DetalleLaboratorio from './pages/DetalleLaboratorio';
import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import PortalPage from './pages/PortalPage';

function RutaProtegida({ children }) {
  const { usuario } = useAuth();
  const location = useLocation();

  return usuario
    ? children
    : <Navigate to="/login" replace state={{ from: location }} />;
}

function Aplicacion() {
  const { usuario, logout } = useAuth();
  const { tema, toggleTema } = useTheme();

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
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/catalogo/:id" element={<DetalleLaboratorio />} />
          <Route
            path="/mis-reservas"
            element={<RutaProtegida><PortalPage titulo="Mis reservas" /></RutaProtegida>}
          />
          <Route
            path="/nueva-reserva"
            element={<RutaProtegida><PortalPage titulo="Nueva reserva" /></RutaProtegida>}
          />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <Aplicacion />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}
