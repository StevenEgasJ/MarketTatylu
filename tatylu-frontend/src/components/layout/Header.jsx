import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import './Header.css';

const Header = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getUserName = () => {
    return user?.nombre || user?.name || localStorage.getItem('userName') || 'Usuario';
  };

  const getUserPhoto = () => {
    const photo = user?.photo || localStorage.getItem('userPhoto');
    if (photo && !photo.includes('?text=')) {
      return photo;
    }
    return '/default-avatar.svg';
  };

  return (
    <>
      {/* Header */}
      <header className="bg-custom">
        <div className="container">
          <div className="row align-items-center py-3">
            {/* Logo e Identidad */}
            <div className="col-4 d-flex align-items-center">
              <Link to="/" className="d-flex align-items-center text-decoration-none">
                <img 
                  src="/logo.png" 
                  alt="logo" 
                  className="img-fluid logo" 
                  style={{ maxHeight: '50px' }}
                  onError={(e) => { e.target.src = '/logo.svg'; }}
                />
                <h1 className="ms-3 mb-0 text-custom site-title">Tatylu</h1>
              </Link>
            </div>

            {/* Menú y opciones de usuario */}
            <div className="col-8 d-flex justify-content-end align-items-center">
              <div className="d-flex align-items-center gap-3">
                {/* Toggle de tema */}
                <button
                  onClick={toggleTheme}
                  className="btn btn-link text-decoration-none p-2"
                  title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
                >
                  <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'} fa-lg`}></i>
                </button>

                {/* Carrito */}
                <Link to="/cart" className="position-relative text-decoration-none">
                  <i className="fas fa-shopping-cart fa-lg"></i>
                  {itemCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {itemCount}
                    </span>
                  )}
                </Link>

                {isAuthenticated ? (
                  <>
                    {/* Dropdown de usuario */}
                    <div className="dropdown">
                      <button
                        className="btn btn-link dropdown-toggle d-flex align-items-center text-decoration-none"
                        type="button"
                        id="userDropdown"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <img
                          src={getUserPhoto()}
                          alt="Usuario"
                          className="rounded-circle me-2"
                          style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                          onError={(e) => { e.target.src = '/default-avatar.png'; }}
                        />
                        <span className="d-none d-md-inline">{getUserName()}</span>
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                        <li>
                          <Link className="dropdown-item" to="/profile">
                            <i className="fas fa-user me-2"></i>Mi Perfil
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/compras">
                            <i className="fas fa-shopping-bag me-2"></i>Mis Compras
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/loyalty">
                            <i className="fas fa-star me-2"></i>Programa de Lealtad
                          </Link>
                        </li>
                        {isAdmin() && (
                          <>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                              <Link className="dropdown-item" to="/admin">
                                <i className="fas fa-cog me-2"></i>Panel Admin
                              </Link>
                            </li>
                          </>
                        )}
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                          <button className="dropdown-item" onClick={handleLogout}>
                            <i className="fas fa-sign-out-alt me-2"></i>Cerrar Sesión
                          </button>
                        </li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="btn btn-outline-primary btn-sm">
                      Iniciar Sesión
                    </Link>
                    <Link to="/signup" className="btn btn-primary btn-sm">
                      Registrarse
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/">Inicio</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">Quienes Somos</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/products">Productos</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">Contacto</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
