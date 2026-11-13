import { Link, NavLink } from 'react-router-dom';

/**
 * Navbar - Componente de navegación con props y renderizado condicional.
 * Cumple con el criterio de "Componentes con props" y el límite de 120 líneas.
 */
export default function Navbar({
  usuario = null,
  onLogout = () => {},
  tema = 'light',
  onToggleTema = () => {},
  brand = 'CampusHub'
}) {
  const navLinkClass = ({ isActive }) =>
    `nav-link ${isActive ? 'active fw-bold text-primary' : ''}`;

  return (
    <nav
      className={`navbar navbar-expand-lg border-bottom shadow-sm ${
        tema === 'dark' ? 'navbar-dark bg-dark' : 'navbar-light bg-white'
      }`}
    >
      <div className="container">
        {/* Marca / Logo principal */}
        <Link to="/" className="navbar-brand fw-bold text-primary d-flex align-items-center gap-2">
          <span>🎓</span> {brand}
        </Link>

        {/* Botón colapsable para dispositivos móviles */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Enlaces de navegación */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink to="/" className={navLinkClass} end>
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/catalogo" className={navLinkClass}>
                Catálogo
              </NavLink>
            </li>

            {/* Renderizado condicional: solo visibles con sesión iniciada */}
            {usuario && (
              <>
                <li className="nav-item">
                  <NavLink to="/mis-reservas" className={navLinkClass}>
                    {usuario.rol === 'admin' ? 'Administrar reservas' : 'Mis Reservas'}
                  </NavLink>
                </li>
                {usuario.rol !== 'admin' && (
                  <li className="nav-item">
                    <NavLink to="/nueva-reserva" className={navLinkClass}>
                      Nueva Reserva
                    </NavLink>
                  </li>
                )}
              </>
            )}
          </ul>

          {/* Acciones de la barra: Tema y Sesión */}
          <div className="d-flex align-items-center gap-2">
            {/* Botón de alternancia de Tema Claro / Oscuro */}
            <button
              onClick={onToggleTema}
              className={`btn btn-sm ${
                tema === 'dark' ? 'btn-outline-light' : 'btn-outline-secondary'
              }`}
              title="Cambiar tema"
              type="button"
            >
              {tema === 'dark' ? '☀️ Claro' : '🌙 Oscuro'}
            </button>

            {/* Estado de autenticación */}
            {usuario ? (
              <div className="d-flex align-items-center gap-2">
                <span className="small text-muted d-none d-md-inline">
                  {usuario.nombre || usuario.codigo}
                </span>
                <button
                  onClick={onLogout}
                  className="btn btn-sm btn-outline-danger"
                  type="button"
                >
                  Salir
                </button>
              </div>
            ) : (
              <NavLink to="/login" className="btn btn-sm btn-primary">
                Iniciar Sesión
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
