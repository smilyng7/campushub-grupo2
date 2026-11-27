import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [codigo, setCodigo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!login(codigo, password)) {
      setError('Código o contraseña incorrectos.');
      return;
    }

    const destino = location.state?.from || '/mis-reservas';
    navigate(destino, { replace: true });
  };

  const handleAutocompletarDemo = () => {
    setError('');
    // Alterna entre credencial de administrador y estudiante si ya está lleno
    if (!codigo || codigo.toUpperCase() === 'U20231234') {
      setCodigo('A01');
      setPassword('admin123');
    } else {
      setCodigo('U20231234');
      setPassword('est123');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="row g-0">
          {/* Panel Lateral Izquierdo (Branding & Mensaje de Bienvenida) */}
          <div className="col-lg-5 col-md-5 login-brand-panel">
            <div>
              <span className="login-badge-portal">Portal Estudiantil</span>
              <div className="mt-4 pt-2">
                <h1 className="login-brand-title text-white">
                  Bienvenido a<br />CampusHub Labs
                </h1>
                <p className="login-brand-desc mt-3">
                  Consulta la disponibilidad de equipos en tiempo real y reserva tu espacio de laboratorio sin filas ni cruces de horario.
                </p>
              </div>
            </div>

            <div className="login-brand-footer mt-4 pt-3">
              <div className="text-white-50 small mb-1">Sistema de Gestión Académica</div>
              <div className="text-white fw-bold small">Ingeniería de Sistemas · 2026</div>
            </div>
          </div>

          {/* Panel Lateral Derecho (Formulario de Autenticación) */}
          <div className="col-lg-7 col-md-7 login-form-panel d-flex flex-column justify-content-center">
            <div className="mb-4">
              <h2 className="fw-bold mb-1 text-body" style={{ fontSize: '1.85rem' }}>
                Iniciar sesión
              </h2>
              <p className="text-body-secondary small mb-0">
                Ingresa tus credenciales universitarias para continuar
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {/* Campo: Código de Estudiante */}
              <div className="mb-3">
                <label htmlFor="codigo" className="form-label fw-semibold small text-body mb-1">
                  Código de Laboratorio
                </label>
                <div className="login-input-group">
                  <span className="login-input-icon" role="img" aria-label="código">
                    🎓
                  </span>
                  <input
                    id="codigo"
                    type="text"
                    className="login-input-control"
                    placeholder="Ingresar codigo"
                    value={codigo}
                    onChange={(e) => {
                      setCodigo(e.target.value);
                      if (error) setError('');
                    }}
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Campo: Contraseña */}
              <div className="mb-3">
                <label htmlFor="password" className="form-label fw-semibold small text-body mb-1">
                  Contraseña
                </label>
                <div className="login-input-group">
                  <span className="login-input-icon" role="img" aria-label="contraseña">
                    🔒
                  </span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="login-input-control"
                    placeholder="Ingresar contraseña"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError('');
                    }}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="login-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="23" x2="23" y2="1" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Mensaje de error */}
              {error && (
                <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mb-3 rounded-3" role="alert">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Botón de envío */}
              <button type="submit" className="btn btn-primary w-100 login-submit-btn mt-3">
                Entrar al Portal
              </button>

              {/* Botón rápido para credenciales de demostración */}
              <div className="text-center mt-3 pt-1">
                <button
                  type="button"
                  className="login-demo-btn"
                  onClick={handleAutocompletarDemo}
                >
                  <span style={{ color: '#f59e0b', fontSize: '1rem' }}>⚡</span>
                  <span>Autocompletar credenciales de prueba (Demo)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
