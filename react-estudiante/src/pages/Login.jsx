import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Mantén tu importación actual de AuthContext o dbLocal aquí:
// import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [codigo, setCodigo] = useState('');
  const [password, setPassword] = useState('');
  const [verPassword, setVerPassword] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  // const { login } = useAuth(); // Descomenta y usa tu función actual

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!codigo.trim() || !password.trim()) {
      setError('Por favor, completa tu código de estudiante y contraseña.');
      return;
    }

    setCargando(true);

    // Simulamos una breve respuesta del servidor para el efecto visual
    setTimeout(() => {
      // AQUÍ VA TU LÓGICA ACTUAL DE VALIDACIÓN CON login(codigo, password)
      // Ejemplo:
      // const exito = login(codigo, password);
      // if (exito) {
      //   navigate('/catalogo');
      // } else {
      //   setError('Código o contraseña incorrectos. Intenta nuevamente.');
      //   setCargando(false);
      // }
      setCargando(false);
    }, 600);
  };

  // Función estrella para impresionar en la sustentación
  const rellenarDemo = () => {
    setCodigo('U20241001'); // Reemplaza con un código real de tu db.local.js
    setPassword('123456');  // Reemplaza con su contraseña real
    setError('');
  };

  return (
    <div className="container py-5 d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <div className="card shadow-lg border-0 overflow-hidden w-100" style={{ maxWidth: '880px', borderRadius: '1rem' }}>
        <div className="row g-0">

          {/* Panel Izquierdo: Identidad Visual */}
          <div
            className="col-md-5 d-none d-md-flex flex-column justify-content-between p-4 text-white"
            style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #0a367a 100%)' }}
          >
            <div>
              <span className="badge bg-white text-primary fw-semibold mb-3 px-3 py-2 rounded-pill">
                Portal Estudiantil
              </span>
              <h3 className="fw-bold mb-3">Bienvenido a CampusHub</h3>
              <p className="small text-white-50">
                Consulta la disponibilidad de equipos en tiempo real y reserva tu espacio de laboratorio sin filas ni cruces de horario.
              </p>
            </div>

            <div className="border-top border-white border-opacity-25 pt-3">
              <small className="d-block text-white-50">Sistema de Gestión Académica</small>
              <small className="fw-semibold">Ingeniería de Sistemas • 2026</small>
            </div>
          </div>

          {/* Panel Derecho: Formulario Interactivo */}
          <div className="col-md-7 p-4 p-md-5 bg-body">
            <div className="mb-4">
              <h2 className="fw-bold mb-1">Iniciar sesión</h2>
              <p className="text-body-secondary small">Ingresa tus credenciales universitarias para continuar</p>
            </div>

            {error && (
              <div className="alert alert-danger py-2 px-3 small d-flex align-items-center" role="alert">
                <span className="me-2">⚠️</span>
                <div>{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Campo Código */}
              <div className="mb-3">
                <label className="form-label fw-semibold small">Código de Estudiante</label>
                <div className="input-group">
                  <span className="input-group-text bg-body-tertiary">🎓</span>
                  <input
                    type="text"
                    className="form-control form-control-lg fs-6"
                    placeholder="Ej. U20241001"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                  />
                </div>
              </div>

              {/* Campo Contraseña con botón de mostrar/ocultar */}
              <div className="mb-4">
                <div className="d-flex justify-content-between">
                  <label className="form-label fw-semibold small">Contraseña</label>
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-body-tertiary">🔒</span>
                  <input
                    type={verPassword ? 'text' : 'password'}
                    className="form-control form-control-lg fs-6"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setVerPassword(!verPassword)}
                    title={verPassword ? 'Ocultar' : 'Mostrar'}
                  >
                    {verPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Botón Principal con Spinner */}
              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-semibold shadow-sm"
                disabled={cargando}
              >
                {cargando ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Verificando acceso...
                  </>
                ) : (
                  'Entrar al Portal'
                )}
              </button>
            </form>

            {/* Acceso rápido para pruebas del profesor */}
            <div className="mt-4 pt-3 border-top text-center">
              <button
                type="button"
                onClick={rellenarDemo}
                className="btn btn-link btn-sm text-decoration-none text-body-secondary"
              >
                ⚡ Autocompletar credenciales de prueba (Demo)
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}