import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin, hasManagementAccess } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="logo">
          <span className="logo-icon">🏦</span>
          <span className="logo-text">BancoPro</span>
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Inicio</Link>

          {user ? (
            <>
              {hasManagementAccess && (
                <Link to="/admin" className="nav-link admin-link">
                  ⚙️ {isAdmin ? 'Admin' : 'Gestión'}
                </Link>
              )}
              <span className="nav-user-info">
                {user.firstName} <span className="role-badge">{user.role}</span>
              </span>
              <button id="btn-logout" type="button" onClick={handleLogout} className="btn-logout">Cerrar Sesión</button>
            </>
          ) : (
            <Link to="/login" className="btn-primary login-btn">Iniciar Sesión</Link>
          )}
        </div>
      </div>

      <style>{`
        .navbar {
          height: 80px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid var(--border);
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(10px);
          position: sticky;
          top: 0;
          z-index: 1000;
        }
        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text);
        }
        .logo-icon {
          font-size: 2rem;
        }
        .logo-text {
          background: linear-gradient(to right, var(--primary), var(--secondary));
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .nav-link {
          color: var(--text-muted);
          font-weight: 500;
          transition: color 0.3s ease;
        }
        .nav-link:hover {
          color: var(--primary);
        }
        .admin-link {
          color: var(--accent);
        }
        .admin-link:hover {
          color: var(--secondary);
        }
        .login-btn {
          padding: 0.5rem 1.25rem;
          font-size: 0.9rem;
        }
        .nav-user-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text);
          font-weight: 500;
          font-size: 0.9rem;
        }
        .role-badge {
          background: var(--primary);
          color: white;
          padding: 0.15rem 0.5rem;
          border-radius: 1rem;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .btn-logout {
          background: transparent;
          color: var(--error);
          border: 1px solid var(--error);
          padding: 0.4rem 1rem;
          border-radius: 0.5rem;
          font-size: 0.85rem;
          font-weight: 600;
        }
        .btn-logout:hover {
          background: var(--error);
          color: white;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
